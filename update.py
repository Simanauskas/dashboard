#!/usr/bin/env python3
"""
update.py
─────────
Runs inside GitHub Actions. Pulls yesterday's Garmin data via API,
patches src/App.jsx, and exits. The workflow then commits and pushes,
triggering the deploy workflow to rebuild GitHub Pages.

Garth tokens are pre-written to ~/.garth/ by the workflow step.
"""

from __future__ import annotations
import csv
import datetime
import io
import re
import struct
import sys
import zipfile
from collections import defaultdict
from pathlib import Path

DASHBOARD = Path("src/App.jsx")
TZ_OFFSET = 3   # Lithuania UTC+3

# ── FIT parser ────────────────────────────────────────────────────────────────

FIT_EPOCH = datetime.datetime(1989, 12, 31)

def _parse_fit(data):
    hs = data[0]
    ds = struct.unpack('<I', data[4:8])[0]
    pos, end = hs, hs + ds
    defs, recs = {}, []
    while pos < end:
        if pos >= len(data): break
        rh = data[pos]; pos += 1
        if rh & 0x80:
            lm = (rh >> 5) & 0x03
            if lm in defs:
                r = _read_rec(data, pos, defs[lm]); r['__gm'] = defs[lm]['gm']
                recs.append(r); pos += defs[lm]['size']
            continue
        is_def = bool(rh & 0x40); has_dev = bool(rh & 0x20); lm = rh & 0x0F
        if is_def:
            pos += 1; arch = data[pos]; pos += 1
            gm = struct.unpack('<H' if arch==0 else '>H', data[pos:pos+2])[0]; pos += 2
            nf = data[pos]; pos += 1; fields = []; total = 0
            for _ in range(nf):
                fields.append({'num': data[pos], 'size': data[pos+1], 'offset': total})
                total += data[pos+1]; pos += 3
            if has_dev:
                nd = data[pos]; pos += 1
                for _ in range(nd): pos += 3
            defs[lm] = {'gm': gm, 'arch': arch, 'fields': fields, 'size': total}
        else:
            if lm not in defs: break
            r = _read_rec(data, pos, defs[lm]); r['__gm'] = defs[lm]['gm']
            recs.append(r); pos += defs[lm]['size']
    by_gm = defaultdict(list)
    for r in recs:
        gm = r.pop('__gm'); by_gm[gm].append(r)
    return by_gm

def _read_rec(data, pos, defn):
    e = '>' if defn.get('arch',0)==1 else '<'; rec = {}
    for f in defn['fields']:
        o = pos + f['offset']; s = f['size']
        try:
            if s==1: v=data[o];                                      v=None if v==0xFF       else v
            elif s==2: v=struct.unpack(e+'H',data[o:o+2])[0];       v=None if v==0xFFFF     else v
            elif s==4: v=struct.unpack(e+'I',data[o:o+4])[0];       v=None if v==0xFFFFFFFF else v
            else: v=data[o:o+s]
        except: v=None
        rec[f['num']] = v
    return rec

# ── Garmin API ────────────────────────────────────────────────────────────────

def get_client():
    """
    Auth via garth tokens + garminconnect 0.2.8.
    garminconnect 0.2.8 uses garth internally — we just need to call
    Garmin() with dummy credentials then replace the garth session,
    OR use garth.resume() before Garmin() so garth auto-patches it.
    The key: garth must be resumed BEFORE Garmin() is instantiated.
    """
    import garth
    from garminconnect import Garmin

    # Resume garth tokens
    garth.resume(str(Path.home() / ".garth"))

    # Force refresh the OAuth2 access token immediately — it expires every ~27h
    # so we can't rely on it being valid. The refresh token lasts 30 days.
    try:
        garth.client.refresh_oauth2()
        print(f"Token refreshed OK (garth {garth.__version__})")
    except Exception as e:
        pass  # token_refresh.py handles validation; we just use whatever tokens are loaded

    # Instantiate client after refresh so it picks up the new access token
    client = Garmin()
    client.garth = garth

    return client

def fetch_wellness(client, date_str):
    """HRV, sleep, RHR, SpO2, resp via JSON APIs."""
    result = {}

    # Sleep score — separate endpoint from sleep data
    try:
        ss_data = client.connectapi(f"/wellness-service/wellness/dailyStress/{date_str}")
        # sleep score is at /sleep-service/sleep/{date} not dailySleepData
    except:
        pass
    try:
        score_data = client.connectapi(f"/sleep-service/sleep/{date_str}")
        ss = score_data.get('dailySleepDTO', {}).get('sleepScore') or              score_data.get('sleepScore') or              score_data.get('overallSleepScore')
        if ss and isinstance(ss, (int, float)) and 0 < ss <= 100:
            result['sleep_score'] = round(ss)
            print(f"SleepScore from /sleep/{date_str}: {round(ss)}")
    except Exception:
        pass  # SleepScore endpoint often 404s for older dates — silently fall back to feedback mapping

    # HRV
    try:
        data = client.connectapi(f"/hrv-service/hrv/{date_str}")
        s = data.get('hrvSummary', {})
        if s.get('lastNightAvg'): result['hrv']        = round(s['lastNightAvg'])
        if s.get('weeklyAvg'):    result['hrv_weekly'] = round(s['weeklyAvg'])
        print(f"HRV: {result.get('hrv')}ms (weekly {result.get('hrv_weekly')}ms)")
    except Exception as e:
        print(f"HRV failed: {e}")

    # Sleep
    try:
        data = client.connectapi("/sleep-service/sleep/dailySleepData",
                                  params={"date": date_str, "nonSleepBufferMinutes": 60})
        dto = data.get('dailySleepDTO', {})
        def mins(k): return round((dto.get(k) or 0) / 60)
        result['sleep'] = {
            'deep':  mins('deepSleepSeconds'),
            'rem':   mins('remSleepSeconds'),
            'light': mins('lightSleepSeconds'),
            'awake': mins('awakeSleepSeconds'),
        }
        spo2 = dto.get('averageSpO2Value')
        resp = dto.get('averageRespirationValue')
        rhr  = dto.get('avgHeartRate')
        if spo2 and 85 <= spo2 <= 100: result['spo2'] = round(spo2)
        if resp and resp > 0:          result['resp'] = round(resp, 1)
        if rhr  and 30 <= rhr <= 70:   result['rhr']  = round(rhr)
        # Sleep score — the overall score is at top level, not inside sleepScores dict
        # sleepScores dict contains sub-scores (duration, stress, rem etc) with qualifierKeys
        # The numeric overall score is in dailySleepDTO.sleepScore or data.overallSleepScore
        ss = None
        # Try top-level fields first (most reliable)
        for field in ('sleepScore', 'overallSleepScore', 'sleepQualityScore', 'score'):
            v = dto.get(field)
            if v and isinstance(v, (int, float)) and 0 < v <= 100:
                ss = round(v); break
        # Also try parent data object
        if ss is None:
            for field in ('sleepScore', 'overallSleepScore', 'score'):
                v = data.get(field)
                if v and isinstance(v, (int, float)) and 0 < v <= 100:
                    ss = round(v); break
        if ss:
            result['sleep_score'] = ss
        # Fallback: map sleepScoreFeedback qualifier to approximate score
        # Garmin doesn't expose the numeric score via API — only the feedback key
        if 'sleep_score' not in result:
            feedback = dto.get('sleepScoreFeedback', '')
            score_map = {
                'POSITIVE_HIGHLY_RECOVERING': 95,   # near-perfect night
                'POSITIVE_OPTIMAL_STRUCTURE': 88,
                'POSITIVE_GOOD_SLEEP': 82,
                'POSITIVE_RECOVERING': 75,
                'NEUTRAL_BALANCED': 68,
                'NEGATIVE_POOR_SLEEP': 52,
                'NEGATIVE_FRAGMENTED': 45,
                'NEGATIVE_VERY_POOR_SLEEP': 38,
            }
            approx = score_map.get(feedback)
            if approx:
                result['sleep_score'] = approx
        s = result['sleep']
        total = sum(s.values())
        print(f"Sleep: deep={s['deep']} rem={s['rem']} light={s['light']} awake={s['awake']} = {total//60}h{total%60}m")
        fb = dto.get('sleepScoreFeedback','')
        print(f"SpO2={result.get('spo2')}  resp={result.get('resp')}  RHR={result.get('rhr')}  SleepScore={result.get('sleep_score')} (feedback={fb})")
    except Exception as e:
        print(f"Sleep failed: {e}")
        result.setdefault('sleep', {'deep':0,'rem':0,'light':0,'awake':0})

    # Weight (most recent on or before this date, within last 30 days)
    try:
        d = datetime.date.fromisoformat(date_str)
        from_d = (d - datetime.timedelta(days=30)).isoformat()
        wi = client.get_weigh_ins(from_d, date_str)
        # Structure: { 'dailyWeightSummaries': [{summaryDate, allWeightMetrics: [{weight: grams, ...}]}] }
        latest = None
        for day in (wi.get('dailyWeightSummaries') or []):
            for entry in (day.get('allWeightMetrics') or []):
                w_kg = entry.get('weight', 0) / 1000.0 if entry.get('weight') else None
                if w_kg and w_kg > 30:  # sanity
                    cand = (day.get('summaryDate'), round(w_kg, 1))
                    if not latest or cand[0] > latest[0]:
                        latest = cand
        if latest:
            result['weight'] = latest
            print(f"Weight: {latest[1]}kg on {latest[0]}")
    except Exception as e:
        pass  # no weight log for this period

    return result

def fetch_activities(client, date_str):
    """Return properly quoted CSV rows for the given date."""
    import time as _time
    acts = None
    for attempt in range(3):
        try:
            result = client.get_activities(0, 30)
            if result:  # non-empty list
                acts = result
                break
            print(f"  Empty activities response (attempt {attempt+1}/3)")
        except ValueError as e:
            # JSON decode error — API returned empty/HTML body, retry
            print(f"  Activities JSON error attempt {attempt+1}: {e}")
        except Exception as e:
            print(f"  Activities attempt {attempt+1} failed: {e}")
        if attempt < 2:
            _time.sleep(5)
    if not acts:
        print("Activities: no data after 3 attempts — skipping"); return [], {}, {}

    dates_seen = set((a.get('startTimeLocal') or '')[:10] for a in acts if a.get('startTimeLocal'))

    TYPE_MAP = {
        'running':'Running','treadmill_running':'Treadmill Running',
        'indoor_running':'Indoor Running','cycling':'Cycling',
        'indoor_cycling':'Cycling','tennis':'Tennis','padel':'Tennis',
        'strength_training':'Strength Training','inline_skating':'Inline Skating',
        'other':'Other',
    }
    def _dur(s):
        if not s: return '--'
        h,r=divmod(int(s),3600); m,sec=divmod(r,60)
        return f"{h:02d}:{m:02d}:{sec:02d}"
    def _km(m):
        return f"{m/1000:.2f}".replace('.',',') if m else '0,00'
    def _f(v, dec=None):
        if v is None: return '--'
        if dec is not None and isinstance(v, float):
            return f"{v:.{dec}f}".replace('.',',')
        if isinstance(v, float):
            return str(round(v))  # 111.0->"111" not "111.0" (parseNum strips dots!)
        return str(v)
    def _pace(mps):
        if not mps or mps<=0: return '--'
        spk=1000/mps; return f"{int(spk//60)}:{int(spk%60):02d}"

    rows = []
    for a in acts:
        if (a.get('startTimeLocal') or '')[:10] != date_str: continue
        type_key = a.get('activityType',{}).get('typeKey','other')
        row = [
            TYPE_MAP.get(type_key, type_key.replace('_',' ').title()),
            a.get('startTimeLocal',''), 'false', a.get('activityName','Activity'),
            _km(a.get('distance')), _f(a.get('calories')),
            _dur(a.get('duration') or a.get('elapsedDuration')),
            _f(a.get('averageHR')), _f(a.get('maxHR')),
            _f(a.get('aerobicTrainingEffect'),1),
            _f(a.get('averageRunningCadenceInStepsPerMinute')), '--',
            _pace(a.get('averageSpeed')), '--', '--', '--',
            _f(a.get('elevationGain')), _f(a.get('elevationLoss')),
            '--',
            _f(a.get('avgStrideLength'),2) if a.get('avgStrideLength') else '--',
            _f(a.get('avgVerticalRatio'),1) if a.get('avgVerticalRatio') else '--',
            _f(a.get('avgVerticalOscillation'),1) if a.get('avgVerticalOscillation') else '--',
            _f(a.get('avgGroundContactTime')) if a.get('avgGroundContactTime') else '--',
            '--','--','--','--','--','--','--','--',
            _f(a.get('bodyBatteryDrained')), 'No', '--', _f(a.get('lapCount')),
            '--','--','--','--','--',
            _dur(a.get('movingDuration') or a.get('duration')),
            _dur(a.get('elapsedDuration') or a.get('duration')),
            '--','--',
        ]
        buf = io.StringIO()
        csv.writer(buf, quoting=csv.QUOTE_ALL).writerow(row)
        rows.append(buf.getvalue().strip())

    print(f"Activities: {len(rows)}")
    # Also return activity_ids keyed by startTime[:10] for lap fetching keyed by startTime[:10] for lap fetching
    activity_ids = {
        (a.get("startTimeLocal") or "")[:10]: a["activityId"]
        for a in (acts or [])
        if (a.get("startTimeLocal") or "")[:10] == date_str
    }
    # Per-activity summary (used to build HYROX_DATA entries downstream).
    # Indexed by activity_id, not date — multiple activities per day are safe.
    activity_summaries = {
        str(a["activityId"]): {
            "activity_id":  str(a["activityId"]),
            "date":         (a.get("startTimeLocal") or "")[:10],
            "name":         a.get("activityName", "Activity"),
            "total_time":   round(a.get("duration") or a.get("elapsedDuration") or 0),
            "avg_hr":       round(a["averageHR"]) if a.get("averageHR") else None,
            "max_hr":       round(a["maxHR"]) if a.get("maxHR") else None,
            "distance_m":   round(a["distance"]) if a.get("distance") else 0,
            "calories":     a.get("calories"),
        }
        for a in (acts or [])
        if (a.get("startTimeLocal") or "")[:10] == date_str
    }
    return rows, activity_ids, activity_summaries

# ── Patch App.jsx ─────────────────────────────────────────────────────────────

def _classify_laps(laps):
    """
    Tag each lap with role: 'run' | 'station' | 'warmup' | 'cooldown'.

    Strategy:
    - Treadmill calibration is unreliable, so we look at lap DISTANCE in meters as
      a noisy signal but pair it with relative magnitude.
    - Laps >500m → 'run' (Hyrox runs are nominally 1000m; even badly-calibrated
      treadmills won't drift below 500m for a real 1km run)
    - Other laps → 'station' (typically ~50-300m if any, often 0)
    - First/last lap may be warmup/cooldown if its distance is >1.5× the median
      run distance OR its time is markedly different from the other long laps.

    Returns the same list with a 'role' key added to each lap dict.
    """
    if not laps:
        return laps
    classified = [dict(l) for l in laps]  # copy
    # First pass: long vs short by distance
    for lap in classified:
        d = lap.get("distance_m") or 0
        lap["role"] = "run" if d > 500 else "station"

    # Detect warmup/cooldown: first and last laps that are anomalously long
    runs = [l for l in classified if l["role"] == "run"]
    if len(runs) >= 3:
        run_dists = sorted(l["distance_m"] for l in runs)
        median = run_dists[len(run_dists) // 2]
        threshold = median * 1.5

        # Only check first lap
        if classified[0]["role"] == "run" and classified[0]["distance_m"] > threshold:
            classified[0]["role"] = "warmup"
        # Only check last lap
        if classified[-1]["role"] == "run" and classified[-1]["distance_m"] > threshold:
            classified[-1]["role"] = "cooldown"

    return classified


def _is_hyrox_activity(activity_name):
    """Return True if the activity name suggests Hyrox content worth deep-fetching.
    Conservative: matches 'hyrox', 'sim', 'race'. We deliberately MISS plain 'circle'
    or 'group' if no hyrox keyword — avoids burning API calls on every workout.
    Hyrox group sessions ARE matched because they contain 'hyrox'."""
    if not activity_name:
        return False
    t = activity_name.lower()
    return "hyrox" in t or "race simulation" in t


def fetch_hyrox_session_data(client, activity_id, activity_name):
    """
    Fetch laps + description + photo URLs for a Hyrox-tagged activity.
    Returns a dict with keys:
      activity_id, name, type, laps, description, photo_urls
    or None on any error / non-Hyrox activity.

    type: 'race' | 'sim' | 'group' | None
      derived from activity name
    """
    if not activity_id or not _is_hyrox_activity(activity_name):
        return None

    name_lower = activity_name.lower()
    if "race" in name_lower and "sim" not in name_lower:
        session_type = "race"
    elif "sim" in name_lower:
        session_type = "sim"
    elif "group" in name_lower:
        session_type = "group"
    else:
        session_type = None

    # 1. Laps
    laps = []
    try:
        data = client.connectapi(f"/activity-service/activity/{activity_id}/splits")
        laps_raw = data.get("lapDTOs") or data.get("laps") or []
        for i, lap in enumerate(laps_raw):
            elapsed  = lap.get("duration") or lap.get("elapsedDuration") or 0
            moving   = lap.get("movingDuration") or elapsed
            avg_hr   = lap.get("averageHR") or lap.get("averageHeartRate")
            max_hr   = lap.get("maxHR") or lap.get("maxHeartRate")
            dist_m   = lap.get("distance") or 0
            laps.append({
                "lap_index":   i + 1,
                "elapsed_sec": round(elapsed),
                "moving_sec":  round(moving),
                "avg_hr":      round(avg_hr)  if avg_hr  else None,
                "max_hr":      round(max_hr)  if max_hr  else None,
                "distance_m":  round(dist_m),
            })
        laps = _classify_laps(laps)
        print(f"  Hyrox session {activity_id}: {len(laps)} laps "
              f"({sum(1 for l in laps if l['role']=='run')} runs, "
              f"{sum(1 for l in laps if l['role']=='station')} stations)")
    except Exception as e:
        print(f"  fetch_hyrox laps failed for {activity_id}: {e}")
        return None

    # 2. Description (text field user enters in Garmin Connect)
    description = ""
    try:
        details = client.connectapi(f"/activity-service/activity/{activity_id}")
        # Description lives under summaryDTO or top-level depending on API version
        description = (
            details.get("description")
            or (details.get("summaryDTO") or {}).get("description")
            or ""
        ).strip()
        if description:
            print(f"  Description: {description[:80]}...")
    except Exception as e:
        print(f"  fetch description failed for {activity_id}: {e}")

    # 3. Photo URLs (Garmin Connect "metadata" photos attached to activity)
    photo_urls = []
    try:
        imgs = client.connectapi(f"/activity-service/activity/{activity_id}/images")
        # Response shape: list of {url, thumbnail, ...} or {activityImages: [...]}
        img_list = imgs if isinstance(imgs, list) else imgs.get("activityImages", [])
        for img in img_list:
            url = img.get("url") or img.get("imageUrl") or img.get("originalUrl")
            if url:
                photo_urls.append(url)
        if photo_urls:
            print(f"  Photos: {len(photo_urls)}")
    except Exception as e:
        # 404 is normal — most activities have no photos
        pass

    return {
        "activity_id":  str(activity_id),
        "name":         activity_name,
        "type":         session_type,
        "laps":         laps,
        "description":  description,
        "photo_urls":   photo_urls,
    }


def find_activity_id_for_date(client, date_str, title_hint=None):
    """
    Return the Garmin activity ID for an Indoor Running / Hyrox activity on date_str.
    If title_hint is provided, prefer activities whose name contains that string.
    Falls back to the first Indoor Running activity on that date.
    Returns None if nothing matches.
    """
    try:
        acts = client.get_activities(0, 30)
        candidates = [
            a for a in acts
            if (a.get("startTimeLocal") or "")[:10] == date_str
            and a.get("activityType", {}).get("typeKey", "") in
                ("indoor_running", "running", "treadmill_running", "other")
        ]
        if not candidates:
            return None
        if title_hint:
            for a in candidates:
                if title_hint.lower() in (a.get("activityName") or "").lower():
                    return a["activityId"]
        # Fall back to first candidate (most recent)
        return candidates[0]["activityId"]
    except Exception as e:
        print(f"  find_activity_id_for_date failed: {e}")
        return None


def patch(date_str, wellness, csv_rows, advance_today=True, hyrox_sessions=None):
    hyrox_sessions = hyrox_sessions or {}
    code     = DASHBOARD.read_text(encoding='utf-8')
    today    = datetime.date.fromisoformat(date_str)
    tomorrow = today + datetime.timedelta(days=1)
    race     = datetime.date(2026, 5, 30)
    days_to  = (race - tomorrow).days

    hrv_ms   = wellness.get('hrv') or 0
    weekly   = wellness.get('hrv_weekly') or 0
    stages   = wellness.get('sleep') or {}
    rhr_val  = wellness.get('rhr') or 40
    spo2_val = wellness.get('spo2') or 98
    resp_val = wellness.get('resp') or 12.0
    # Only patch daily/sleep when we have REAL data — not just defaults
    has_real_hrv   = bool(wellness.get('hrv'))   # > 0 and not None
    has_real_sleep = bool(stages.get('deep') or stages.get('rem') or stages.get('light'))
    has_wellness   = has_real_hrv or has_real_sleep

    # 1. TODAY — only advance when processing yesterday's data, not today's activities
    if advance_today:
        code = re.sub(r'const TODAY = "[^"]+";',
                      f'const TODAY = "{tomorrow.isoformat()}";', code)

    # 2. Daily HRV row — replace if exists, otherwise insert (sorted)
    # Only patch if we have real HRV data — avoids writing hrv:0 placeholder
    if has_real_hrv:
        ss_str = str(wellness.get("sleep_score", "null"))
        new_daily = f'    {{date:"{date_str}",hrv:{hrv_ms},rhr:{rhr_val},spo2:{spo2_val},resp:{resp_val},sleep_score:{ss_str}}},'

        # Try replace first (any whitespace tolerated by [^}]+)
        replaced = False
        def repl(m):
            nonlocal replaced
            replaced = True
            return new_daily.strip()
        code = re.sub(
            rf'    \{{date:"{date_str}",hrv:[^}}]*\}},',
            repl, code, count=1
        )

        if not replaced:
            # Insert before closing daily array bracket
            code = re.sub(
                r'(    \{date:"[\d-]+",hrv:\d+[^}]+\},)(\n  \],)',
                lambda m: m.group(1) + '\n' + new_daily + m.group(2),
                code, count=1
            )

    # 3. Sleep row — only patch if real sleep data (avoids writing all-zeros)
    if has_real_sleep:
        d,rm,li,aw = (stages.get(k,0) for k in ('deep','rem','light','awake'))
        new_sleep_line = f'    {{date:"{date_str}",deep:{d},rem:{rm},light:{li},awake:{aw}}},'

        replaced_sleep = False
        def repl_sleep(m):
            nonlocal replaced_sleep
            replaced_sleep = True
            return new_sleep_line.strip()
        # tolerate any whitespace between fields (existing entries have spaces like "rem:94, light:259")
        code = re.sub(
            rf'    \{{date:"{date_str}",deep:\s*\d+,\s*rem:\s*\d+,\s*light:\s*\d+,\s*awake:\s*\d+\}},',
            repl_sleep, code, count=1
        )

        if not replaced_sleep:
            code = re.sub(
                r'(    \{date:"[\d-]+",deep:\d+[^}]+\},)(\n  \],)',
                lambda m: m.group(1) + '\n' + new_sleep_line + m.group(2),
                code, count=1
            )

    # 3b. Sort + dedupe daily and sleep arrays (handles out-of-order backfill + duplicates)
    for label in ['daily', 'sleep']:
        # Match `{label}: [ ... \n  ],` — anchored to line-end bracket so we don't accidentally
        # close on an inner ] (like a nested array)
        m_arr = re.search(rf'({label}:\s*\[)(.*?)(\n  \],)', code, re.DOTALL)
        if m_arr:
            block = m_arr.group(2)
            entries = re.findall(r'    \{date:"[\d-]+"[^}]+\},', block)
            if len(entries) > 1:
                # Dedupe by date — keep LAST occurrence (most recently patched)
                by_date = {}
                for e in entries:
                    d = re.search(r'date:"([\d-]+)"', e).group(1)
                    by_date[d] = e
                entries_sorted = [by_date[d] for d in sorted(by_date.keys())]
                new_block = '\n' + '\n'.join(entries_sorted) + '\n  '
                code = code.replace(m_arr.group(0), f'{label}: [{new_block}],', 1)

    # Sort + dedupe weight array (same approach but tuple-style entries)
    m_w = re.search(r'(weight:\s*\[)(.*?)(\n  \],)', code, re.DOTALL)
    if m_w:
        w_block = m_w.group(2)
        w_entries = re.findall(r'\["[\d-]+",[\d.]+\]', w_block)
        if w_entries:
            by_date = {}
            for e in w_entries:
                d = re.search(r'\["([\d-]+)"', e).group(1)
                by_date[d] = e
            sorted_entries = [by_date[d] for d in sorted(by_date.keys())]
            new_w_block = '\n    ' + ','.join(sorted_entries) + ',\n  '
            code = code.replace(m_w.group(0), f'weight: [{new_w_block}],', 1)

    # 3c. Weight entry — simple: replace if date exists, else add to end (sort step dedupes/sorts)
    w = wellness.get('weight')
    if w:
        w_date, w_kg = w
        new_entry = f'["{w_date}",{w_kg}]'
        if re.search(rf'\["{w_date}",[\d.]+\]', code):
            # Replace existing entry for this date
            code = re.sub(rf'\["{w_date}",[\d.]+\]', new_entry, code, count=1)
        else:
            # Append before the array close — match \n  ], end-of-weight-array
            code = re.sub(
                r'(weight:\s*\[(?:[^\]]|\][^,])*?)(\n  \],)',
                rf'\g<1>,\n    {new_entry}\g<2>',
                code, count=1
            )

    # 4. CSV activity rows — deduplicate by startTime (field 1, first 19 chars)
    if csv_rows:
        import csv as _csv
        # Extract all startTimes already in the dashboard
        existing_times = set()
        for line in code.split('\n'):
            try:
                fields = list(_csv.reader([line]))[0]
                if len(fields) > 1 and re.match(r'\d{4}-\d{2}-\d{2}', fields[1]):
                    existing_times.add(fields[1][:19])
            except: pass

        idx = code.find('Min Elevation,Max Elevation\n')
        if idx >= 0:
            ins = idx + len('Min Elevation,Max Elevation\n')
            to_add = []
            for l in csv_rows:
                if not l.strip(): continue
                try:
                    fields = list(_csv.reader([l]))[0]
                    start = fields[1][:19] if len(fields) > 1 else ''
                    if start and start not in existing_times:
                        to_add.append(l)
                        existing_times.add(start)
                except: pass
            if to_add:
                code = code[:ins] + '\n'.join(to_add) + '\n' + code[ins:]


    # 4b. Lap data — store raw laps per activity date for dashboard analysis
    # Format: LAPS_DATA["YYYY-MM-DD"] = [{elapsed_sec, moving_sec, avg_hr, max_hr, distance_m}, ...]
    # 4b. Hyrox session data — keyed by Garmin activity_id (not date), so multiple
    # sessions per day don't collide. Each entry holds laps + description + photos
    # + summary stats. Manual fields (notes, station names) are preserved across
    # updates by NOT touching keys that already exist with a manual edit signature.
    if hyrox_sessions:
        # Serialize one session to a compact JS object literal
        def _hyrox_session_js(sess):
            def _lap_obj(l):
                parts = [f'i:{l["lap_index"]}', f't:{l["elapsed_sec"]}']
                if l.get("avg_hr"):     parts.append(f'avgHr:{l["avg_hr"]}')
                if l.get("max_hr"):     parts.append(f'maxHr:{l["max_hr"]}')
                if l.get("distance_m"): parts.append(f'dist:{l["distance_m"]}')
                parts.append(f'role:"{l.get("role", "station")}"')
                return '{' + ','.join(parts) + '}'

            laps_js = '[' + ','.join(_lap_obj(l) for l in sess["laps"]) + ']'
            photos_js = '[' + ','.join(f'"{u}"' for u in sess.get("photo_urls", [])) + ']'
            # Escape description for safe inclusion as JS template literal:
            # only need to escape backticks and ${ (template-literal interpolation)
            desc = (sess.get("description") or "").replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

            type_js = f'"{sess["type"]}"' if sess.get("type") else 'null'
            avg_hr  = sess.get("avg_hr") or "null"
            max_hr  = sess.get("max_hr") or "null"

            return (
                f'  "{sess["activity_id"]}": {{\n'
                f'    date:"{sess["date"]}", name:"{sess["name"].replace(chr(34), chr(92)+chr(34))}", type:{type_js},\n'
                f'    totalTime:{sess.get("total_time", 0)}, avgHR:{avg_hr}, maxHR:{max_hr},\n'
                f'    description:`{desc}`,\n'
                f'    photos:{photos_js},\n'
                f'    laps:{laps_js},\n'
                f'  }}'
            )

        # Strategy: parse the existing HYROX_DATA block as a whole, extract any
        # existing entries we want to keep, merge with new ones, then write back.
        # This is the only way to guarantee no duplicate keys (the old regex-
        # insert approach was creating duplicates on every run).
        m_block = re.search(
            r'(const HYROX_DATA = \{\n)(.*?)(\n\};)',
            code, re.DOTALL
        )
        if m_block:
            existing_block = m_block.group(2)
            # Extract existing entries keyed by activity_id. Match the outer "id": { ... }
            # by balancing braces — easier with a positional scan than a regex.
            existing = {}
            i = 0
            while i < len(existing_block):
                m_key = re.search(r'"([^"]+)":\s*\{', existing_block[i:])
                if not m_key:
                    break
                key = m_key.group(1)
                start = i + m_key.start()
                brace_open = i + m_key.end() - 1   # position of {
                # Find matching }
                depth = 1
                j = brace_open + 1
                while j < len(existing_block) and depth > 0:
                    if existing_block[j] == '{': depth += 1
                    elif existing_block[j] == '}': depth -= 1
                    j += 1
                if depth != 0:
                    print(f"  ⚠ HYROX_DATA parse error near key {key} — skipping merge")
                    existing = {}
                    break
                # Include trailing comma if present
                end = j
                if end < len(existing_block) and existing_block[end] == ',':
                    end += 1
                existing[key] = existing_block[start:end].rstrip(',').strip()
                i = end

            # Overwrite auto-fetched fields, but preserve manual fields
            # (estimateMin, stationNames, notes) from the prior version of each entry
            for act_id, sess in hyrox_sessions.items():
                prior = existing.get(act_id, "")
                # Extract manual fields from prior entry text (regex into the JS literal)
                preserved_lines = []
                # estimateMin: matches `estimateMin: "70–75"` or `estimateMin: null` or `estimateMin: 75`
                m_em = re.search(r'estimateMin:\s*([^,\n}]+)', prior)
                if m_em:
                    preserved_lines.append(f'    estimateMin: {m_em.group(1).strip()},')
                # stationNames: balanced-brace extraction
                m_sn_start = re.search(r'stationNames:\s*\{', prior)
                if m_sn_start:
                    sn_open = m_sn_start.end() - 1
                    depth = 1
                    k = sn_open + 1
                    while k < len(prior) and depth > 0:
                        if prior[k] == '{': depth += 1
                        elif prior[k] == '}': depth -= 1
                        k += 1
                    if depth == 0:
                        sn_body = prior[sn_open:k]  # includes braces
                        preserved_lines.append(f'    stationNames: {sn_body},')
                # notes: backtick or quoted string (notes:`...`, or notes:"...")
                m_nt = re.search(r'notes:\s*(`[^`]*`|"[^"]*")', prior)
                if m_nt:
                    preserved_lines.append(f'    notes: {m_nt.group(1)},')
                # official: balanced-brace extraction (nested object with arrays of objects).
                # Source of truth for official race times/ranks; merged with Garmin HR in the view.
                m_of_start = re.search(r'official:\s*\{', prior)
                if m_of_start:
                    of_open = m_of_start.end() - 1
                    depth = 1
                    k = of_open + 1
                    while k < len(prior) and depth > 0:
                        if prior[k] == '{': depth += 1
                        elif prior[k] == '}': depth -= 1
                        k += 1
                    if depth == 0:
                        of_body = prior[of_open:k]  # includes braces
                        preserved_lines.append(f'    official: {of_body},')

                # Build the new entry. _hyrox_session_js produces something like:
                #   "id": {
                #     date:"...", ...
                #     laps:[...],
                #   }
                # We inject preserved_lines just before the closing brace.
                new_entry = _hyrox_session_js(sess).strip().rstrip(',')
                if preserved_lines:
                    # Insert preserved lines before the last "  }" of the entry
                    last_brace = new_entry.rfind('}')
                    if last_brace != -1:
                        new_entry = (new_entry[:last_brace]
                                     + '\n'.join(preserved_lines) + '\n  '
                                     + new_entry[last_brace:])
                existing[act_id] = new_entry

            # Reassemble: sort by date inside each entry (best-effort) then write
            def _entry_date(entry_str):
                m = re.search(r'date:"(\d{4}-\d{2}-\d{2})"', entry_str)
                return m.group(1) if m else "0000-00-00"

            sorted_entries = sorted(existing.values(), key=_entry_date)
            new_block_inner = ',\n'.join(sorted_entries)
            new_block = m_block.group(1) + new_block_inner + ',' + m_block.group(3)
            code = code[:m_block.start()] + new_block + code[m_block.end():]
            print(f"  ✓ HYROX_DATA: {len(existing)} entries ({len(hyrox_sessions)} updated this run)")
        else:
            print("  ⚠ HYROX_DATA block not found in App.jsx — skipping Hyrox patch. "
                  "Add `const HYROX_DATA = {\\n};` to App.jsx to enable.")

    # 5. Countdown (only update on full morning run)
    if advance_today:
        code = re.sub(r'HYROX RIGA · MAY 30 · \d+ DAYS',
                      f'HYROX RIGA · MAY 30 · {days_to} DAYS', code)

    # 6. Header subtitle (only update on full morning run)
    if advance_today:
        code = re.sub(
            r'(Mon|Tue|Wed|Thu|Fri|Sat|Sun) \w+ \d+ · updated with \w+ \d+ Garmin data',
            f'{tomorrow.strftime("%a %b %-d")} · updated with {today.strftime("%b %-d")} Garmin data',
            code
        )

    # 7. HRV baseline (full mode only)
    if has_wellness and weekly:
        code = re.sub(r'const hrvBaseline = \d+;[^\n]*',
                      f'const hrvBaseline = {weekly}; // updated {date_str}', code)

    DASHBOARD.write_text(code, encoding='utf-8')
    print(f"✓ Patched {DASHBOARD}")

def stamp_run(got_fresh_data: bool):
    """Write LAST_RUN (always) and LAST_DATA (only when fresh Garmin data was ingested)
    so the dashboard can tell the user when the workflow last attempted a sync and
    whether tokens are likely still valid. Both stamps are UTC ISO with minutes."""
    code = DASHBOARD.read_text(encoding='utf-8')
    now_utc = datetime.datetime.utcnow().replace(microsecond=0, second=0).isoformat() + "Z"
    code = re.sub(r'const LAST_RUN  = "[^"]+";',
                  f'const LAST_RUN  = "{now_utc}";', code)
    if got_fresh_data:
        code = re.sub(r'const LAST_DATA = "[^"]+";',
                      f'const LAST_DATA = "{now_utc}";', code)
    DASHBOARD.write_text(code, encoding='utf-8')
    print(f"✓ Stamped LAST_RUN={now_utc} fresh_data={got_fresh_data}")

# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--mode',   default='full', choices=['full','activities','backfill'])
    p.add_argument('--days',   type=int, default=14, help='For backfill mode: how many days back to fetch')
    p.add_argument('--date',   default=None)
    args = p.parse_args()

    target = args.date or (datetime.date.today() - datetime.timedelta(days=1)).isoformat()
    print(f"Mode: {args.mode}  |  Target: {target}")

    client = get_client()

    today = datetime.date.today().isoformat()
    yesterday = (datetime.date.today() - datetime.timedelta(days=1)).isoformat()

    got_fresh_data = False

    try:
        if args.mode == 'full':
            # Full update: fetch wellness + activities for yesterday AND today
            for date_str in [yesterday, today]:
                wellness = fetch_wellness(client, date_str)
                has_wellness = bool(wellness.get('hrv') or wellness.get('sleep'))
                print(f"  {'✓' if has_wellness else '✗'} Wellness data for {date_str}")
                csv_rows, activity_ids, activity_summaries = fetch_activities(client, date_str)
                if has_wellness or csv_rows:
                    got_fresh_data = True
                # Fetch Hyrox session detail (laps + description + photos) per activity
                hyrox_sessions = {}
                for act_id, summary in activity_summaries.items():
                    detail = fetch_hyrox_session_data(client, act_id, summary["name"])
                    if detail:
                        hyrox_sessions[act_id] = {**summary, **detail}
                advance = (date_str == yesterday)
                patch(date_str, wellness, csv_rows, advance_today=advance,
                      hyrox_sessions=hyrox_sessions)

        elif args.mode == 'backfill':
            # Backfill: fetch wellness + activities for last N days
            # Useful after auth was broken to fill in gaps
            today_d = datetime.date.today()
            print(f"Backfilling {args.days} days...")
            for i in range(args.days, 0, -1):
                date_str = (today_d - datetime.timedelta(days=i)).isoformat()
                print(f"  Fetching {date_str}...")
                try:
                    wellness = fetch_wellness(client, date_str)
                    csv_rows, activity_ids, activity_summaries = fetch_activities(client, date_str)
                    if wellness.get('hrv') or wellness.get('sleep') or csv_rows:
                        got_fresh_data = True
                    hyrox_sessions = {}
                    for act_id, summary in activity_summaries.items():
                        detail = fetch_hyrox_session_data(client, act_id, summary["name"])
                        if detail:
                            hyrox_sessions[act_id] = {**summary, **detail}
                    # Only advance today pointer on the most recent date
                    advance = (i == 1)
                    patch(date_str, wellness, csv_rows, advance_today=advance,
                          hyrox_sessions=hyrox_sessions)
                except Exception as e:
                    print(f"    ⚠ Skipped {date_str}: {e}")

        else:
            # Activities-only: fetch today's new workouts
            csv_rows, activity_ids, activity_summaries = fetch_activities(client, today)
            if csv_rows:
                got_fresh_data = True
            hyrox_sessions = {}
            for act_id, summary in activity_summaries.items():
                detail = fetch_hyrox_session_data(client, act_id, summary["name"])
                if detail:
                    hyrox_sessions[act_id] = {**summary, **detail}
            patch(today, {}, csv_rows, advance_today=False,
                  hyrox_sessions=hyrox_sessions)
    finally:
        # Always stamp LAST_RUN (so the dashboard can show 'scheduler is alive')
        # even on partial failures, and stamp LAST_DATA only when we actually
        # pulled fresh Garmin data (so the dashboard knows tokens are still valid).
        stamp_run(got_fresh_data)

    print("Done.")
