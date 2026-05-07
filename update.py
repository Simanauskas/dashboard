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
    """Auth via garth tokens + garminconnect 0.2.8."""
    import garth
    from garminconnect import Garmin
    garth.resume(str(Path.home() / ".garth"))
    client = Garmin()
    client.garth = garth
    print(f"Auth OK (garth {garth.__version__})")
    return client

def fetch_wellness(client, date_str):
    """HRV, sleep, RHR, SpO2, resp via JSON APIs."""
    result = {}

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
        s = result['sleep']
        total = sum(s.values())
        print(f"Sleep: deep={s['deep']} rem={s['rem']} light={s['light']} awake={s['awake']} = {total//60}h{total%60}m")
        print(f"SpO2={result.get('spo2')}  resp={result.get('resp')}  RHR={result.get('rhr')}")
    except Exception as e:
        print(f"Sleep failed: {e}")
        result.setdefault('sleep', {'deep':0,'rem':0,'light':0,'awake':0})

    return result

def fetch_activities(client, date_str):
    """Return properly quoted CSV rows for the given date."""
    try:
        acts = client.get_activities(0, 30)
    except Exception as e:
        print(f"Activities failed: {e}"); return []
    
    # Debug: print what dates Garmin returns so we can verify filtering
    dates_seen = set()
    for a in acts:
        d = (a.get('startTimeLocal') or '')[:10]
        if d: dates_seen.add(d)
    print(f"  Garmin returned activities for dates: {sorted(dates_seen)}")
    print(f"  Filtering for: {date_str}")

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
            '--','--','--','--','--','--','--','--','--','--','--',
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
    return rows

# ── Patch App.jsx ─────────────────────────────────────────────────────────────

def patch(date_str, wellness, csv_rows):
    code     = DASHBOARD.read_text(encoding='utf-8')
    today    = datetime.date.fromisoformat(date_str)
    tomorrow = today + datetime.timedelta(days=1)
    race     = datetime.date(2026, 5, 30)
    days_to  = (race - tomorrow).days

    hrv_ms   = wellness.get('hrv', 0)
    weekly   = wellness.get('hrv_weekly', 0)
    stages   = wellness.get('sleep', {})
    rhr_val  = wellness.get('rhr', 40)
    spo2_val = wellness.get('spo2', 98)
    resp_val = wellness.get('resp', 12.0)
    has_wellness = bool(wellness)   # False in activities-only mode

    # 1. TODAY
    code = re.sub(r'const TODAY = "[^"]+";',
                  f'const TODAY = "{tomorrow.isoformat()}";', code)

    # 2. Daily HRV row (full mode only)
    if has_wellness and f'date:"{date_str}",hrv:' not in code:
        new_daily = f'    {{date:"{date_str}",hrv:{hrv_ms},rhr:{rhr_val},spo2:{spo2_val},resp:{resp_val}}},'
        code = re.sub(
            r'(    \{date:"[\d-]+",hrv:\d+[^}]+\},)(\n  \],)',
            lambda m: m.group(1) + '\n' + new_daily + m.group(2),
            code, count=1
        )

    # 3. Sleep row (full mode only)
    if has_wellness and f'date:"{date_str}",deep:' not in code:
        d,rm,li,aw = (stages.get(k,0) for k in ('deep','rem','light','awake'))
        new_sleep = f'    {{date:"{date_str}",deep:{d},rem:{rm},light:{li},awake:{aw}}},'
        code = re.sub(
            r'(    \{date:"[\d-]+",deep:\d+[^}]+\},)(\n  \],)',
            lambda m: m.group(1) + '\n' + new_sleep + m.group(2),
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

    # 5. Countdown
    code = re.sub(r'HYROX RIGA · MAY 30 · \d+ DAYS',
                  f'HYROX RIGA · MAY 30 · {days_to} DAYS', code)

    # 6. Header subtitle
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

# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--mode',   default='full', choices=['full','activities'])
    p.add_argument('--date',   default=None)
    args = p.parse_args()

    target = args.date or (datetime.date.today() - datetime.timedelta(days=1)).isoformat()
    print(f"Mode: {args.mode}  |  Target: {target}")

    client = get_client()

    today = datetime.date.today().isoformat()

    if args.mode == 'full':
        # Full update: HRV + sleep + RHR for yesterday + activities for both days
        wellness = fetch_wellness(client, target)
        csv_rows_yesterday = fetch_activities(client, target)
        csv_rows_today     = fetch_activities(client, today)
        patch(target, wellness, csv_rows_yesterday)
        if csv_rows_today:
            patch(today, {}, csv_rows_today)
    else:
        # Activities-only: fetch today's new workouts
        csv_rows = fetch_activities(client, today)
        patch(today, {}, csv_rows)

    print("Done.")
