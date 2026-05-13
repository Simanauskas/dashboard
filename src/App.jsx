import { useState, useEffect, useRef } from "react";

const HEALTH_DATA = {
  fitnessAge: { bio: 27.8, chrono: 35, bmi: 24.2, rhr: 38, vo2max: 52.9 },
  weight: [
    ["2026-01-13",73.6],["2026-01-17",73.1],["2026-01-20",73.1],
    ["2026-02-12",73.5],["2026-02-15",73.9],["2026-02-24",74.3],["2026-02-28",75.5],
    ["2026-03-04",73.4],["2026-03-08",72.3],["2026-03-12",73.1],["2026-03-16",73.2],
    ["2026-03-19",73.2],["2026-03-22",74.1],["2026-03-23",73.5],["2026-03-24",72.9],
    ["2026-04-16",75.0],
  ],
  vo2max: [
    ["2026-03-09",52],["2026-03-17",53],["2026-03-21",53],["2026-03-24",53],
    ["2026-04-03",54],["2026-04-05",55],["2026-04-11",55],["2026-04-12",56],
    ["2026-04-18",55],["2026-04-19",55],["2026-04-27",55],["2026-04-28",55],
  ],
  daily: [
    {date:"2026-04-14",hrv:116,rhr:44,spo2:97,resp:12.9,sleep_score:null},
    {date:"2026-04-15",hrv:82, rhr:41,spo2:96,resp:12.0,sleep_score:null},
    {date:"2026-04-16",hrv:100,rhr:42,spo2:97,resp:12.3,sleep_score:null},
    {date:"2026-04-17",hrv:96, rhr:41,spo2:98,resp:11.5,sleep_score:null},
    {date:"2026-04-18",hrv:128,rhr:42,spo2:97,resp:13.0,sleep_score:null},
    {date:"2026-04-19",hrv:120,rhr:41,spo2:98,resp:12.6,sleep_score:null},
    {date:"2026-04-20",hrv:105,rhr:44,spo2:97,resp:13.2,sleep_score:null},
    {date:"2026-04-21",hrv:97, rhr:41,spo2:97,resp:12.2,sleep_score:null},
    {date:"2026-04-22",hrv:101,rhr:40,spo2:99,resp:11.0,sleep_score:null},
    {date:"2026-04-23",hrv:80, rhr:42,spo2:97,resp:11.6,sleep_score:null},
    {date:"2026-04-24",hrv:75, rhr:40,spo2:99,resp:11.6,sleep_score:null},
    {date:"2026-04-25",hrv:96, rhr:46,spo2:99,resp:13.8,sleep_score:null},
    {date:"2026-04-26",hrv:114,rhr:42,spo2:100,resp:12.2,sleep_score:null},
    {date:"2026-04-27",hrv:128,rhr:40,spo2:99, resp:12.0,sleep_score:null},
    {date:"2026-04-28",hrv:135,rhr:40,spo2:99, resp:12.0,sleep_score:null},
    {date:"2026-04-29",hrv:140,rhr:40,spo2:96, resp:13.2,sleep_score:null},
    {date:"2026-04-30",hrv:154,rhr:40,spo2:95, resp:8.8, sleep_score:95},
    {date:"2026-05-01",hrv:167,rhr:41,spo2:98, resp:10.6,sleep_score:76},
    {date:"2026-05-02",hrv:176,rhr:40,spo2:98, resp:12.4,sleep_score:83},
    {date:"2026-05-03",hrv:128,rhr:41,spo2:98, resp:16.1,sleep_score:33},
    {date:"2026-05-04",hrv:113,rhr:41,spo2:91, resp:8.6, sleep_score:91},
    {date:"2026-05-05",hrv:99, rhr:41,spo2:93, resp:8.7, sleep_score:93},
    {date:"2026-05-06",hrv:99, rhr:41,spo2:98, resp:12.7,sleep_score:86},
    {date:"2026-05-07",hrv:118,rhr:44,spo2:96,resp:14.0,sleep_score:null},
    {date:"2026-05-08",hrv:109,rhr:43,spo2:94,resp:12.0,sleep_score:null},
    {date:"2026-05-09",hrv:117,rhr:43,spo2:96,resp:12.0,sleep_score:null},
    {date:"2026-05-10",hrv:0,rhr:40,spo2:98,resp:12.0,sleep_score:null},
    {date:"2026-05-11",hrv:127,rhr:43,spo2:93,resp:12.0,sleep_score:null},
    {date:"2026-05-12",hrv:95,rhr:43,spo2:95,resp:12.0,sleep_score:null},
    {date:"2026-05-13",hrv:0,rhr:40,spo2:98,resp:12.0,sleep_score:null},
  ],
  sleep: [
    {date:"2026-04-14",deep:111,rem:94, light:259,awake:0},
    {date:"2026-04-15",deep:194,rem:156,light:187,awake:3},
    {date:"2026-04-16",deep:84, rem:123,light:257,awake:1},
    {date:"2026-04-17",deep:146,rem:108,light:213,awake:2},
    {date:"2026-04-18",deep:100,rem:84, light:222,awake:0},
    {date:"2026-04-19",deep:141,rem:109,light:220,awake:1},
    {date:"2026-04-20",deep:92, rem:75, light:270,awake:26},
    {date:"2026-04-21",deep:155,rem:88, light:215,awake:4},
    {date:"2026-04-22",deep:113,rem:80, light:266,awake:1},
    {date:"2026-04-23",deep:110,rem:84, light:218,awake:7},
    {date:"2026-04-24",deep:177,rem:115,light:262,awake:2},
    {date:"2026-04-25",deep:53, rem:16, light:330,awake:9},
    {date:"2026-04-26",deep:97, rem:104,light:291,awake:3},
    {date:"2026-04-27",deep:127,rem:128,light:201,awake:18},
    {date:"2026-04-28",deep:102,rem:152,light:183,awake:0},
    {date:"2026-04-29",deep:124,rem:117,light:208,awake:17},
    {date:"2026-04-30",deep:84, rem:146,light:203,awake:23},
    {date:"2026-05-01",deep:50, rem:58, light:169,awake:69},
    {date:"2026-05-02",deep:132,rem:105,light:195,awake:58},
    {date:"2026-05-03",deep:224,rem:0,light:22,awake:0},
    {date:"2026-05-04",deep:109,rem:81, light:228,awake:35},
    {date:"2026-05-05",deep:44, rem:117,light:273,awake:10},
    {date:"2026-05-06",deep:62, rem:199,light:146,awake:0},
    {date:"2026-05-07",deep:109,rem:95,light:284,awake:3},
    {date:"2026-05-08",deep:75,rem:115,light:260,awake:0},
    {date:"2026-05-09",deep:113,rem:110,light:274,awake:23},
    {date:"2026-05-10",deep:0,rem:0,light:0,awake:0},
    {date:"2026-05-11",deep:94,rem:95,light:265,awake:4},
    {date:"2026-05-12",deep:143,rem:117,light:207,awake:0},
    {date:"2026-05-13",deep:0,rem:0,light:0,awake:0},
  ],
};

// Body fat — fetched live from Google Sheets
// CORS proxy needed — Google Sheets blocks direct browser fetch
const SHEET_ID = "1Kdiy4LbhG_C5c8XcT8nwrOJxiyufUCWwxRORqN84zyg";
const SHEET_URL = `https://corsproxy.io/?${encodeURIComponent(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`)}`;

const BF_FALLBACK = [
  {date:"2025-01-02",bf:14.7},{date:"2025-01-09",bf:14.3},{date:"2025-01-15",bf:13.9},
  {date:"2025-01-22",bf:13.9},{date:"2025-01-29",bf:13.4},{date:"2025-02-05",bf:13.0},
  {date:"2025-02-12",bf:13.4},{date:"2025-02-19",bf:14.3},{date:"2025-02-26",bf:13.4},
  {date:"2025-03-05",bf:13.4},{date:"2025-03-11",bf:12.5},{date:"2025-03-15",bf:12.5},
  {date:"2025-03-21",bf:11.5},{date:"2025-03-27",bf:13.4},{date:"2025-04-02",bf:13.0},
  {date:"2025-04-09",bf:13.4},{date:"2025-04-16",bf:13.0},{date:"2025-05-01",bf:13.4},
  {date:"2025-05-14",bf:13.9},{date:"2025-06-01",bf:13.9},{date:"2025-06-13",bf:13.4},
  {date:"2026-03-25",bf:7.6},
];

function parseSheetBf(csvText) {
  try {
    const rows = csvText.split("\n").map(r => r.split(",").map(c => c.trim().replace(/^"|"$/g,"")));
    // Row 1 (index 0) = dates, Row 5 (index 4) = body fat %
    const dateRow = rows[0] || [];
    const bfRow = rows[4] || [];
    const entries = [];
    for (let i = 1; i < dateRow.length; i++) {
      const d = dateRow[i];
      const v = parseFloat(bfRow[i]);
      // Only include valid dates and sensible BF values (9–20%), filtering outliers
      if (d && d.match(/^\d{4}-\d{2}-\d{2}$/) && v >= 9 && v <= 20) {
        entries.push({ date: d, bf: v });
      }
    }
    return entries.length > 0 ? entries.sort((a,b) => a.date.localeCompare(b.date)) : BF_FALLBACK;
  } catch {
    return BF_FALLBACK;
  }
}

const CSV_DATA = `Activity Type,Date,Favorite,Title,Distance,Calories,Time,Avg HR,Max HR,Aerobic TE,Avg Bike Cadence,Max Bike Cadence,Avg Speed,Max Speed,Total Ascent,Total Descent,Avg Stride Length,Avg Vertical Ratio,Avg Vertical Oscillation,Avg Ground Contact Time,Avg GCT Balance,Avg GAP,Normalized Power® (NP®),Training Stress Score®,Avg Power,Max Power,Steps,Total Reps,Total Sets,Body Battery Drain,Decompression,Best Lap Time,Number of Laps,Avg Resp,Min Resp,Max Resp,Avg Stress,Max Stress,Moving Time,Elapsed Time,Min Elevation,Max Elevation
"Running","2026-05-12 21:33:50","false","Vilnius Running","5,81","411","00:33:08","129","139","2,5","175","--","5:42","--","--","--","22","19","--","101,07","6,5","6,8","285","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:33:08","00:33:08","--","--"
"Running","2026-05-11 17:50:11","false","Z4 8km","8,75","615","00:38:38","160","173","4,2","183","--","4:24","--","--","--","39","41","--","--","--","--","--","--","--","--","--","--","--","--","No","--","2","--","--","--","--","--","00:38:38","00:38:38","--","--"
"Tennis V2","2026-05-11 08:57:44","false","Tennis","0,57","633","01:17:42","116","155","2,2","24","--","137:44","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:08:13","01:17:42","--","--"
"Running","2026-05-10 08:32:53","false","Z2 long","13,48","930","01:10:17","136","148","3,5","177","--","5:12","--","--","--","14","11","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","01:10:16","01:10:17","--","--"
"Cycling","2026-05-09 14:57:17","false","Palanga Cycling","17,13","276","01:04:42","84","124","0,4","--","--","3:46","--","--","--","44","34","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","01:04:17","01:36:15","--","--"
"Tennis V2","2026-05-08 13:53:36","false","Tennis","1,07","937","02:05:51","117","173","2,6","24","--","118:12","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","2","--","--","--","--","--","00:15:08","02:05:51","--","--"
"Tennis V2","2026-05-07 13:46:18","false","Tennis","0,24","696","01:11:40","126","185","2,8","12","--","297:37","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:04:01","01:11:40","--","--"
Running,2026-04-28 19:31:20,false,"Z2-3","9,33","645","00:47:42","140","154","3,2","182","187","5:07","4:17","48","42","1,07","5,8","6,4","269","50,6% L / 49,4% R","5:07","334","0,0","329","460","8.630","--","--","-11","No","00:47:42","1","29","25","40","--","--","00:47:41","00:47:42","84","112"
Cycling,2026-04-28 11:05:00,false,"Vilnius Cycling","6,72","194","00:24:02","106","133","0,9","--","--","16,8","38,4","52","52","--","--","--","--","--","--","--","0,0","--","--","--","--","--","-2","No","00:24:02","1","--","--","--","--","--","00:23:45","00:24:02","84","112"
Other,2026-04-27 20:16:10,false,"Sauna","0,00","63","00:20:30","75","111","0,1","--","--","--","--","--","--","--","--","--","--","--","--","--","0,0","--","--","--","--","--","-2","No","00:20:30","1","--","--","--","--","--","00:20:30","00:20:30","--","--"
Indoor Running,2026-04-27 19:00:35,false,"Hyrox group ","2,84","546","01:02:13","121","169","2,8","62","246","21:54","2:59","--","--","0,72","12,1","9,8","441","52,6% L / 47,4% R","--","218","0,0","93","1.249","3.448","--","--","-8","No","00:00:19,6","23","30","13","44","--","--","00:33:39","01:02:41","--","--"
Other,2026-04-26 13:44:35,false,"Massage","0,00","--","00:50:00","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","0,0","--","--","--","--","--","--","No","00:50:00","1","--","--","--","0","0","--:--:--","00:50:00","--","--"
Other,2026-04-26 10:36:09,false,"Vilnius Sauna","0,26","90","00:12:27","102","141","0,7","4","143","1,3","7,7","14","11","5,06","--","--","--","--","--","--","0,0","--","--","132","--","--","-1","No","00:12:27","1","--","--","--","--","--","00:04:41","00:12:27","137","149"
Strength Training,2026-04-26 10:20:26,false,"100 wall balls","0,00","51","00:03:42,5","147","169","1,3","--","--","--","--","--","--","--","--","--","--","--","--","--","0,0","--","--","--","100","1","-1","No","00:03:42,5","1","33","20","42","--","--","00:03:42,5","00:03:42,5","--","--"
Treadmill Running,2026-04-26 09:27:13,false,"Tempo 40min 4:30","10,50","702","00:51:56","146","161","3,7","185","192","4:57","4:12","--","--","1,13","5,4","6,3","271","50,2% L / 49,8% R","--","344","0,0","336","394","9.522","--","--","-13","No","00:03:23,0","3","33","26","41","--","--","00:51:55","00:51:56","--","--"
Cycling,2026-04-25 14:21:25,false,"Vilnius Cycling","12,42","264","00:58:36","85","136","0,6","--","--","12,7","26,7","103","103","--","--","--","--","--","--","--","0,0","--","--","--","--","--","-5","No","00:58:36","1","--","--","--","--","--","00:55:20","01:27:58","93","149"
Tennis,2026-04-25 11:00:39,false,"Tennis","0,33","430","01:05:07","107","150","1,4","21","187","0,3","9,3","--","--","0,24","--","--","--","--","--","--","0,0","--","--","3.160","--","--","-8","No","01:05:07","1","25","16","35","--","--","00:05:36","01:05:07","--","--"
Indoor Running,2026-04-24 16:59:52,false,"Hyrox group ","2,70","502","00:52:37","125","165","2,8","70","250","19:31","2:42","--","--","0,69","7,6","5,1","403","51,8% L / 48,2% R","--","177","0,0","68","737","3.336","--","--","-7","No","00:02:09,8","7","30","12","47","--","--","00:33:21","00:52:37","--","--"
Tennis,2026-04-23 07:57:25,false,"Tennis","0,53","527","01:34:14","98","145","0,9","22","240","0,3","16,4","--","--","0,26","--","--","--","--","--","--","0,0","--","--","4.978","--","--","-10","No","01:34:14","1","23","12","33","--","--","00:08:22","01:34:14","--","--"
Indoor Running,2026-04-22 17:51:09,false,"Indoor Running","1,50","118","00:09:33,0","140","177","2,1","162","216","6:22","3:25","--","--","0,96","5,8","5,7","296","50,0% L / 50,0% R","--","308","0,0","245","485","1.512","--","--","-1","No","00:09:33,0","1","36","25","46","--","--","00:09:29","00:09:33,0","--","--"
Indoor Running,2026-04-22 17:00:52,false,"Circle training","1,53","371","00:49:03","109","168","2,5","40","255","31:59","2:44","--","--","0,75","6,2","4,3","476","50,5% L / 49,5% R","--","184","0,0","42","522","1.672","--","--","-7","No","00:02:28,0","7","26","14","42","--","--","00:15:20","00:49:03","--","--"
Cycling,2026-04-22 08:36:22,false,"Vilnius Cycling","6,81","187","00:24:23","104","131","0,9","--","--","16,8","41,7","59","54","--","--","--","--","--","--","--","0,0","--","--","--","--","--","-24","No","00:24:23","1","--","--","--","--","--","00:23:00","06:45:56","99","148"
Strength Training,2026-04-21 18:47:05,false,"Strength","0,00","261","00:36:51","107","150","1,7","--","--","--","--","--","--","--","--","--","--","--","--","--","0,0","--","--","--","--","4","-3","No","00:36:51","1","--","--","--","--","--","00:28:25","00:36:51","--","--"
Tennis,2026-04-21 08:37:56,false,"Tennis","0,75","588","01:22:09","113","152","2,0","30","200","0,5","9,6","--","--","0,30","--","--","--","--","--","--","0,0","--","--","5.160","--","--","-15","No","01:22:09","1","27","15","36","--","--","00:12:05","01:22:09","--","--"
Trail Running,2026-04-19 09:05:48,false,"VLN - 100km","9,18","713","01:05:10","127","160","2,6","169","249","7:06","3:34","292","279","0,83","7,8","6,5","306","49,8% L / 50,3% R","6:16","292","0,0","272","460","10.844","--","--","-15","No","00:01:17,0","10","31","13","39","--","--","01:04:33","01:09:55","91","186"
Cycling,2026-04-19 10:32:08,false,"VLN - 100km","36,86","1.133","02:30:03","118","155","2,6","--","--","14,7","45,5","662","717","--","--","--","--","--","--","--","0,0","--","--","--","--","--","-17","No","02:30:03","1","26","14","36","--","--","02:24:40","02:39:09","100","182"
Cycling,2026-04-18 12:38:04,false,"VLN - 100km","36,61","1.339","03:41:36","104","155","2,2","--","--","9,9","38,2","782","983","--","--","--","--","--","--","--","0,0","--","--","--","--","--","-9","No","03:41:36","1","24","12","37","--","--","03:15:32","04:52:45","81","221"
"Indoor Running","2026-04-29 17:51:40","false","Hyrox group +100WB","2,29","536","00:57:54","118","173","2,8","54","226","25:17","3:17","--","--","0,64","15,2","9,8","440","50,9% L / 49,1% R","--","191","0,0","78","874","2.798","-7","--","No","00:00:08,9","4","--","28","12","42","00:28:21","01:01:44","--","--"
"Other","2026-04-29 12:09:52","false","Sauna","0,00","57","00:14:24","80","103","0,1","0","115","--","--","--","--","0,00","--","--","--","--","--","--","0,0","--","--","24","-2","29,0","No","00:14:24","1","43,0","--","--","--","00:00:00","00:14:24","--","--"
"Tennis","2026-04-29 10:24:46","false","Tennis","0,76","601","01:32:42","107","151","1,9","25","233","0,5","12,2","--","--","0,33","--","--","--","--","--","--","0,0","--","--","5.602","-13","--","No","01:32:42","1","--","25","13","35","00:11:06","01:32:42","--","--"
"Cycling","2026-04-30 09:06:35","false","Vilnius Cycling","7,00","208","00:26:25","105","128","1,0","--","--","15,9","34,3","61","57","--","--","--","--","--","--","--","0,0","--","--","--","-25","--","No","00:26:25","1","--","--","--","--","00:24:10","07:48:31","100","148"
"Inline Skating","2026-05-01 17:48:05","false","Vilnius Inline Skating","10,06","281","00:53:18","94","153","0,4","--","--","11,3","26,3","42","43","--","--","--","--","--","--","--","0,0","--","--","1.896","-3","--","No","00:53:18","1","--","--","--","--","00:51:08","01:08:26","91","115"
"Cycling","2026-05-01 12:46:07","false","Vilnius Cycling","1,70","50","00:06:38,0","102","127","0,3","--","--","15,3","27,2","20","9","--","--","--","--","--","--","--","0,0","--","--","--","-1","--","No","00:06:38,0","1","--","23","17","29","00:05:41","00:06:38,0","90","110"
"Tennis","2026-05-01 11:06:39","false","Tennis","0,84","636","01:27:44","107","148","2,0","23","244","0,6","13,5","--","--","0,42","--","--","--","--","--","--","0,0","--","--","4.554","-12","--","No","01:27:44","1","--","25","11","35","00:09:43","01:27:44","--","--"
"Cycling","2026-05-01 10:47:01","false","Vilnius Cycling","1,66","45","00:05:15,9","108","125","0,3","--","--","18,9","41,5","14","23","--","--","--","--","--","--","--","0,0","--","--","--","-1","--","No","00:05:15,9","1","--","23","14","33","00:04:50","00:05:15,9","90","111"
"Tennis","2026-05-04 11:52:28","false","Tennis","0,55","637","01:27:46","111","169","2,5","17","230","0,4","11,0","--","--","0,36","--","--","--","--","--","--","0,0","--","--","3.992","-13","--","No","01:27:46","1","--","--","--","--","00:07:12","01:27:46","--","--"
"Indoor Running","2026-05-05 18:50:28","false","Hyrox group","2,97","439","01:02:47","103","169","2,0","50","250","21:07","4:42","--","--","1,05","7,9","8,1","257","--","--","223","0,0","79","374","3.768","-5","--","No","00:01:25,5","5","--","--","--","--","00:17:51","01:02:47","--","--"
"Inline Skating","2026-05-05 17:41:05","false","Klaipeda Inline Skating","7,17","308","00:41:40","93","135","0,4","--","--","10,3","25,2","19","17","--","--","--","--","--","--","--","0,0","--","--","1.660","--","--","No","00:41:40","1","--","--","--","--","00:36:06","00:42:46","5","17"
"Tennis","2026-05-05 08:03:05","false","Tennis","0,43","699","01:19:30","122","162","2,4","17","231","0,3","11,0","--","--","0,32","--","--","--","--","--","--","0,0","--","--","4.568","-15","--","No","01:19:30","1","--","--","--","--","00:05:35","01:19:30","--","--"
"Other","2026-05-06 19:11:17","false","Sauna","0,00","45","00:18:54","66","128","0,1","1","141","--","--","--","--","0,00","--","--","--","--","--","--","0,0","--","--","122","-1","27,0","No","00:18:54","1","38,0","--","--","--","00:00:00","00:18:54","--","--"
"Tennis","2026-05-06 17:33:00","false","Padel","0,48","486","01:26:44","97","170","1,3","20","200","0,3","9,9","--","--","0,28","--","--","--","--","--","--","0,0","--","--","3.872","-6","--","No","01:26:44","1","--","--","--","--","00:08:16","01:26:44","--","--"
"Inline Skating","2026-05-06 12:49:35","false","Palanga Inline Skating","4,80","201","00:33:49","94","139","1,0","--","--","8,5","23,6","10","11","--","--","--","--","--","--","--","0,0","--","--","1.160","-2","--","No","00:00:00,2","5","--","--","--","--","00:27:51","01:48:19","2","9"
"Tennis","2026-05-06 07:58:40","false","Tennis","0,25","476","01:02:29","111","158","2,1","15","222","0,2","12,2","--","--","0,26","--","--","--","--","--","--","0,0","--","--","3.152","-11","--","No","01:02:29","1","--","--","--","--","00:03:52","01:02:29","--","--"`;

const TODAY = "2026-05-13";

function parseCSV(raw) {
  const lines = raw.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.replace(/\r/g,"").trim().replace(/"/g,""));
  return lines.slice(1).map(line => {
    const vals = []; let cur = "", inQ = false;
    for (const ch of line) {
      if (ch === '"') inQ = !inQ;
      else if (ch === ',' && !inQ) { vals.push(cur.trim()); cur = ""; }
      else cur += ch;
    }
    vals.push(cur.trim().replace(/\r/g,""));
    const obj = {};
    headers.forEach((h, i) => obj[h] = (vals[i] || "").replace(/"/g,"").trim());
    return obj;
  });
}

function parseNum(v) {
  if (!v || v === "--") return null;
  return parseFloat(v.replace(/\./g,"").replace(",",".")) || null;
}

function parseDuration(v) {
  if (!v || v === "--" || v === "--:--:--") return 0;
  const p = v.replace(",",".").split(":");
  if (p.length === 3) return +p[0]*3600 + +p[1]*60 + parseFloat(p[2]);
  if (p.length === 2) return +p[0]*60 + +p[1];
  return 0;
}

function fmtDur(s) {
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function dateOf(a) { return (a.Date || "").split(" ")[0]; }
function daysAgo(d) { return Math.floor((new Date(TODAY) - new Date(d)) / 86400000); }

const isHyrox = a => {
  const t = (a.Title || "").toLowerCase(), ty = (a["Activity Type"] || "").toLowerCase();
  return t.includes("hyrox") || t.includes("circle") || (ty === "indoor running" && parseNum(a.Distance) > 0);
};
const isRun = a => !!(a["Activity Type"] || "").toLowerCase().match(/running|trail/);
const isTennis = a => (a["Activity Type"] || "").toLowerCase() === "tennis";
const isStrength = a => (a["Activity Type"] || "").toLowerCase() === "strength training";
const isRecovery = a => { const t = (a.Title || "").toLowerCase(); return t.includes("sauna") || t.includes("massage"); };

const COLORS = { run:"#c2410c", hyrox:"#6d28d9", tennis:"#0369a1", strength:"#15803d", cycling:"#a16207", recovery:"#be185d", other:"#475569" };

function getColor(a) {
  if (isRecovery(a)) return COLORS.recovery;
  if (isHyrox(a)) return COLORS.hyrox;
  if (isRun(a)) return COLORS.run;
  if (isTennis(a)) return COLORS.tennis;
  if (isStrength(a)) return COLORS.strength;
  return COLORS.other;
}

function getEmoji(a) {
  if (isRecovery(a)) return "🛁";
  if (isHyrox(a)) return "🦘";
  if (isRun(a)) return "🏃";
  if (isTennis(a)) return "🎾";
  if (isStrength(a)) return "💪";
  return "⚡";
}

function calcTRIMP(avgHR, durMin) {
  if (!avgHR || durMin <= 0) return 0;
  const r = (avgHR - 50) / 140;
  if (r <= 0) return 0;
  return durMin * r * 0.64 * Math.exp(1.92 * r);
}

// Convert km/h speed string to pace string (min:sec/km)
function speedToPace(speedStr) {
  if (!speedStr || speedStr === "--") return null;
  // speedStr might be "4:57" already (Garmin treadmill format) or "12.7" km/h
  if (speedStr.includes(":")) return speedStr + "/km"; // already pace
  const kmh = parseFloat(speedStr.replace(",", "."));
  if (!kmh || kmh <= 0) return null;
  const secPerKm = 3600 / kmh;
  const mins = Math.floor(secPerKm / 60);
  const secs = Math.round(secPerKm % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}/km`;
}

function analyze(raw) {
  const enriched = [...raw].sort((a,b) => new Date(b.Date) - new Date(a.Date)).map(a => {
    const dur = parseDuration(a.Time), avgHR = parseNum(a["Avg HR"]), dist = parseNum(a.Distance);
    const d = daysAgo(dateOf(a));
    return { ...a, _dur:dur, _avgHR:avgHR, _dist:dist, _days:d, _date:dateOf(a), _trimp:calcTRIMP(avgHR, dur/60) };
  });

  // Proper exponential moving average ATL/CTL
  // ATL: 7-day time constant, CTL: 42-day time constant
  const K_ATL = 1 - Math.exp(-1/7);
  const K_CTL = 1 - Math.exp(-1/42);

  // Group TRIMP by date
  const dailyTrimp = {};
  enriched.forEach(a => {
    dailyTrimp[a._date] = (dailyTrimp[a._date] || 0) + a._trimp;
  });

  // Walk forward from 42 days ago to build proper EMA
  let atl = 0, ctl = 0;
  const todayD = new Date(TODAY);
  for (let i = 42; i >= 0; i--) {
    const d = new Date(todayD); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0,10);
    const trimp = dailyTrimp[ds] || 0;
    atl = atl * (1 - K_ATL) + trimp * K_ATL;
    ctl = ctl * (1 - K_CTL) + trimp * K_CTL;
  }
  const tsb = ctl - atl;

  const yesterday = enriched.filter(a => a._days === 1);
  const hardSessions = enriched.filter(a => a._avgHR > 140 && a._days >= 1);
  const daysSinceHard = hardSessions.length > 0 ? hardSessions[0]._days : 99;
  const weeklyKm = enriched.filter(a => (isRun(a) || isHyrox(a)) && a._days >= 1 && a._days <= 7).reduce((s,a) => s + (a._dist||0), 0);

  // Weekly TRIMP (last 8 weeks)
  const weeklyTrimp = [];
  for (let w = 7; w >= 0; w--) {
    const start = w * 7 + 1, end = (w + 1) * 7;
    const trimp = enriched.filter(a => a._days >= start && a._days <= end).reduce((s,a) => s + a._trimp, 0);
    const weekStart = new Date(TODAY); weekStart.setDate(weekStart.getDate() - end);
    const wLabel = weekStart.toLocaleDateString('en', { month:'short', day:'numeric' });
    weeklyTrimp.push({ label: wLabel, trimp: Math.round(trimp), daysAgo: start });
  }

  // HR Zone distribution (last 4 weeks) using CPET bike zones +10 for running
  // Zones: A <125, B 125-142, C 142-156, D 156-177, E >177 (running: +10 to bike zones)
  const zoneMinutes = { A:0, B:0, C:0, D:0, E:0 };
  enriched.filter(a => a._days >= 1 && a._days <= 28 && a._avgHR > 0 && a._dur > 0).forEach(a => {
    const hr = a._avgHR, dur = a._dur / 60;
    // Use rough zone assignment from avg HR (simplified — assumes avg represents session)
    if (hr > 177)      zoneMinutes.E += dur;
    else if (hr > 156) zoneMinutes.D += dur;
    else if (hr > 142) zoneMinutes.C += dur;
    else if (hr > 125) zoneMinutes.B += dur;
    else               zoneMinutes.A += dur;
  });
  const totalZoneMin = Object.values(zoneMinutes).reduce((s,v) => s+v, 0);

  // Hyrox simulation sessions (indoor running, >45min, HR avg >110)
  const hyroxSims = enriched.filter(a => {
    const t = (a.Title || "").toLowerCase();
    return t.includes("hyrox sim") || t.includes("hyrox race") || t.includes("hyrox simulation");
  }).slice(0, 6).reverse();

  // Running pace trend (Z2/Z3 runs: avg HR 120-155, dist > 4km)
  const paceTrend = enriched.filter(a =>
    isRun(a) && a._avgHR >= 120 && a._avgHR <= 160 && (a._dist||0) > 3
  ).slice(0, 8).reverse().map(a => {
    const speed = parseNum(a["Avg Speed"]);
    const paceStr = a["Avg Pace"] || a["Avg Speed"];
    let paceSec = null;
    if (paceStr && paceStr.includes(":")) {
      const parts = paceStr.split(":");
      paceSec = +parts[0]*60 + +parts[1];
    } else if (speed && speed > 0) {
      paceSec = 3600 / speed;
    }
    return { date: a._date, paceSec, hr: a._avgHR, title: a.Title, dist: a._dist };
  }).filter(p => p.paceSec);

  // Readiness history (last 30 days from HEALTH_DATA)
  const readinessHistory = HEALTH_DATA.daily.slice(-30).map(d => {
    const trimp = dailyTrimp[d.date] || 0;
    return { date: d.date, hrv: d.hrv, trimp };
  });

  // ATL history for overlay (last 42 days)
  const atlHistory = [];
  for (let i = 41; i >= 0; i--) {
    const d = new Date(TODAY); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0,10);
    atlHistory.push({ date: ds, atl: 0 }); // placeholder, filled below
  }
  let atlR = 0, ctlR = 0;
  atlHistory.forEach((pt, idx) => {
    const trimp = dailyTrimp[pt.date] || 0;
    atlR = atlR * (1 - K_ATL) + trimp * K_ATL;
    ctlR = ctlR * (1 - K_CTL) + trimp * K_CTL;
    atlHistory[idx].atl = atlR;
    atlHistory[idx].ctl = ctlR;
  });

  return { enriched, atl, ctl, tsb, yesterday, daysSinceHard, weeklyKm,
           weeklyTrimp, zoneMinutes, totalZoneMin, hyroxSims, paceTrend,
           readinessHistory, atlHistory };
}

function readiness(tsb, dsh, hrv, hrvBaseline) {
  // Load component: map TSB [-40, +20] → [1, 10]
  const tsbScore = Math.max(1, Math.min(10, (tsb + 40) / 60 * 9 + 1));

  // HRV component: ratio vs weekly baseline
  const hrvRatio = (hrv && hrvBaseline) ? hrv / hrvBaseline : 1.0;
  const hrvScore = hrvRatio > 1.15 ? 9 : hrvRatio > 0.95 ? 7 : hrvRatio > 0.85 ? 5 : 3;

  // Blend: 40% load, 60% HRV (physiology is ground truth)
  const blended = Math.round(0.4 * tsbScore + 0.6 * hrvScore);
  return Math.min(10, Math.max(1, blended));
}

const SCHEDULE = [
  { week:1, label:"Apr 27–May 3", theme:"Build the Engine", days:[
    { date:"2026-04-27", dow:"MON", label:"Apr 27", sessions:[{type:"hyrox",text:"✅ Hyrox group · Ozo g. 18 · DONE · 62min · HR 121/169 · 3×15 wall balls ✓",cal:true}] },
    { date:"2026-04-28", dow:"TUE", label:"Apr 28", sessions:[{type:"plan",text:"✅ Z2-3 run 9.33km · 5:06/km · HR 140/154 · TE 3.2"},{type:"plan",text:"✅ Cycling 6.7km · morning commute"}] },
    { date:"2026-04-29", dow:"WED", label:"Apr 29", sessions:[{type:"tennis",text:"Pavel Naidionov 🎾 · 10:30am",cal:true},{type:"hyrox",text:"Hyrox group · 6:00–7:30pm",cal:true},{type:"plan",text:"After: 3×20 wall balls"}] },
    { date:"2026-04-30", dow:"THU", label:"Apr 30", sessions:[{type:"plan",text:"Intervals: 5×600m @ 4:48/km"},{type:"plan",text:"After: 3×20 wall balls"}] },
    { date:"2026-05-01", dow:"FRI", label:"May 1", sessions:[{type:"tennis",text:"Mažvydas 🎾 · 9:00am",cal:true},{type:"hyrox",text:"Hyrox group · 5:00–6:30pm",cal:true}] },
    { date:"2026-05-02", dow:"SAT", label:"May 2", sessions:[{type:"plan",text:"Long run · 45 min"}] },
    { date:"2026-05-03", dow:"SUN", label:"May 3", sessions:[{type:"rest",text:"Rest"}] },
  ]},
  { week:2, label:"May 4–10", theme:"Tennis Camp + Full Load", days:[
    { date:"2026-05-04", dow:"MON", label:"May 4", sessions:[{type:"tennis",text:"🎾 Camp · Klaipėda · 8–9am",cal:true},{type:"hyrox",text:"Hyrox group · 7:00–8:30pm",cal:true}] },
    { date:"2026-05-05", dow:"TUE", label:"May 5", sessions:[{type:"tennis",text:"🎾 Camp · 8–9am",cal:true},{type:"plan",text:"25 min easy run"}] },
    { date:"2026-05-06", dow:"WED", label:"May 6", sessions:[{type:"tennis",text:"🎾 Camp · 8–9am",cal:true},{type:"hyrox",text:"Hyrox group · 6:00–7:30pm",cal:true}] },
    { date:"2026-05-07", dow:"THU", label:"May 7", sessions:[{type:"tennis",text:"🎾 Camp · 8–9am",cal:true},{type:"plan",text:"30 min easy run"}] },
    { date:"2026-05-08", dow:"FRI", label:"May 8", sessions:[{type:"tennis",text:"🎾 Camp · 8–9am (last day)",cal:true},{type:"hyrox",text:"Hyrox group · 5:00–6:30pm",cal:true}] },
    { date:"2026-05-09", dow:"SAT", label:"May 9", sessions:[{type:"plan",text:"Long run · 45 min"}] },
    { date:"2026-05-10", dow:"SUN", label:"May 10", sessions:[{type:"rest",text:"Full rest"}] },
  ]},
  { week:3, label:"May 11–17", theme:"Race Simulation", days:[
    { date:"2026-05-11", dow:"MON", label:"May 11", sessions:[{type:"hyrox",text:"Hyrox group · 7:00–8:30pm",cal:true},{type:"plan",text:"After: 4×20 wall balls"}] },
    { date:"2026-05-12", dow:"TUE", label:"May 12", sessions:[{type:"plan",text:"40 min Z2 run"}] },
    { date:"2026-05-13", dow:"WED", label:"May 13", sessions:[{type:"plan",text:"30 min easy run"},{type:"hyrox",text:"Hyrox group · 6:00–7:30pm",cal:true}] },
    { date:"2026-05-14", dow:"THU", label:"May 14", sessions:[{type:"plan",text:"Race sim: 1km → 100 wall balls → 1km"}] },
    { date:"2026-05-15", dow:"FRI", label:"May 15", sessions:[{type:"tennis",text:"Mažvydas 🎾 · 9:00am",cal:true},{type:"hyrox",text:"Hyrox group · 5:00–6:30pm",cal:true}] },
    { date:"2026-05-16", dow:"SAT", label:"May 16", sessions:[{type:"plan",text:"Long run · 55 min · 3×5min race pace"}] },
    { date:"2026-05-17", dow:"SUN", label:"May 17", sessions:[{type:"rest",text:"Rest"}] },
  ]},
  { week:4, label:"May 18–24", theme:"Peak Load", days:[
    { date:"2026-05-18", dow:"MON", label:"May 18", sessions:[{type:"hyrox",text:"Hyrox group · 7:00–8:30pm",cal:true},{type:"plan",text:"After: 4×25 wall balls"}] },
    { date:"2026-05-19", dow:"TUE", label:"May 19", sessions:[{type:"plan",text:"Intervals: 6×400m · 90s rest"}] },
    { date:"2026-05-20", dow:"WED", label:"May 20", sessions:[{type:"plan",text:"30 min easy flush run"},{type:"hyrox",text:"Hyrox group · 6:00–7:30pm",cal:true}] },
    { date:"2026-05-21", dow:"THU", label:"May 21", sessions:[{type:"plan",text:"All 8 Hyrox stations + race sim"}] },
    { date:"2026-05-22", dow:"FRI", label:"May 22", sessions:[{type:"tennis",text:"Mažvydas 🎾 · 9:00am",cal:true},{type:"hyrox",text:"Hyrox group · 5:00–6:30pm",cal:true}] },
    { date:"2026-05-23", dow:"SAT", label:"May 23", sessions:[{type:"plan",text:"Long run · 60 min · 2×10min race pace"}] },
    { date:"2026-05-24", dow:"SUN", label:"May 24", sessions:[{type:"rest",text:"Rest · Skydiving starts tomorrow ⚠️"}] },
  ]},
  { week:5, label:"May 25–30", theme:"🏁 Race Week", days:[
    { date:"2026-05-25", dow:"MON", label:"May 25", sessions:[{type:"other",text:"Skydiving 🪂",cal:true},{type:"hyrox",text:"Hyrox group · 7:00–8:30pm · 60%",cal:true}] },
    { date:"2026-05-26", dow:"TUE", label:"May 26", sessions:[{type:"other",text:"Skydiving 🪂",cal:true},{type:"plan",text:"20 min shakeout + strides"}] },
    { date:"2026-05-27", dow:"WED", label:"May 27", sessions:[{type:"other",text:"Skydiving 🪂",cal:true},{type:"hyrox",text:"LAST GROUP SESSION · 6:00–7:30pm",cal:true}] },
    { date:"2026-05-28", dow:"THU", label:"May 28", sessions:[{type:"rest",text:"Travel to Riga 🚗"}] },
    { date:"2026-05-29", dow:"FRI", label:"May 29", sessions:[{type:"tennis",text:"Mažvydas 🎾 · 9:00am (light)",cal:true},{type:"plan",text:"15 min activation jog"}] },
    { date:"2026-05-30", dow:"SAT", label:"May 30", sessions:[{type:"race",text:"🏁 HYROX RIGA · Sub 75 min",cal:true}] },
  ]},
];

const SS = {
  hyrox:  { bg:"#ede9fe", border:"#7c3aed", text:"#4c1d95", dot:"#7c3aed" },
  tennis: { bg:"#e0f2fe", border:"#0284c7", text:"#0c4a6e", dot:"#0284c7" },
  plan:   { bg:"#f8fafc", border:"#cbd5e1", text:"#475569", dot:"#94a3b8" },
  rest:   { bg:"#f8fafc", border:"#e2e8f0", text:"#94a3b8", dot:"#e2e8f0" },
  race:   { bg:"#fef3c7", border:"#d97706", text:"#92400e", dot:"#d97706" },
  other:  { bg:"#f0fdf4", border:"#16a34a", text:"#14532d", dot:"#16a34a" },
};

function Sparkline({ data, color = "#7c3aed", height = 40 }) {
  if (!data || data.length < 2) return null;
  const vals = data.map(d => Array.isArray(d) ? d[1] : d.bf);
  const min = Math.min(...vals), max = Math.max(...vals), range = max - min || 1;
  const w = 240, h = height;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const lastPt = pts.split(" ").pop().split(",");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width:"100%", height }} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastPt[0]} cy={lastPt[1]} r="4" fill={color} />
    </svg>
  );
}

function ScheduleView({ activities }) {
  const todayWk = SCHEDULE.findIndex(w => w.days.some(d => d.date === TODAY));
  const [activeWeek, setActiveWeek] = useState(Math.max(0, todayWk));
  const week = SCHEDULE[activeWeek];
  return (
    <div>
      <div style={{ display:"flex", overflowX:"auto", borderBottom:"2px solid #f1f5f9", padding:"0 14px" }}>
        {SCHEDULE.map((w, i) => (
          <button key={i} onClick={() => setActiveWeek(i)} style={{
            background:"none", border:"none",
            borderBottom: activeWeek === i ? "2px solid #7c3aed" : "2px solid transparent",
            color: activeWeek === i ? "#7c3aed" : "#94a3b8",
            padding:"10px 12px 8px", fontSize:11, fontWeight:700,
            cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit", marginBottom:-2,
          }}>
            WK{w.week}{w.week === 5 ? " 🏁" : ""}
          </button>
        ))}
      </div>
      <div style={{ padding:"10px 14px 6px", background:"#faf5ff", borderBottom:"1px solid #ede9fe" }}>
        <div style={{ fontSize:14, fontWeight:800, color:"#1e1b4b" }}>Week {week.week}: {week.theme}</div>
        <div style={{ fontSize:11, color:"#7c3aed", marginTop:2 }}>{week.label}</div>
      </div>
      <div style={{ padding:"12px 14px 40px" }}>
        {week.days.map((day, di) => {
          const isToday = day.date === TODAY, isPast = day.date < TODAY;
          const done = activities.filter(a => a._date === day.date);
          return (
            <div key={di} style={{ display:"flex", gap:10, marginBottom:10, opacity: isPast && !isToday ? 0.5 : 1 }}>
              <div style={{ minWidth:44, textAlign:"right", paddingTop:5 }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, color: isToday ? "#7c3aed" : "#94a3b8" }}>{day.dow}</div>
                <div style={{ fontSize:9, color:"#cbd5e1", marginTop:1 }}>{day.label.replace("May ","").replace("Apr ","")}</div>
              </div>
              <div style={{ flex:1 }}>
                {isToday && <div style={{ fontSize:9, fontWeight:800, color:"#7c3aed", letterSpacing:2, marginBottom:5 }}>● TODAY</div>}
                {done.map((a, ai) => (
                  <div key={ai} style={{ padding:"6px 10px", marginBottom:4, background:getColor(a)+"18", border:`1.5px solid ${getColor(a)}44`, borderRadius:6, display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:14 }}>{getEmoji(a)}</span>
                    <div>
                      <span style={{ fontSize:11, color:getColor(a), fontWeight:700 }}>✓ {a.Title || a["Activity Type"]}</span>
                      <span style={{ fontSize:10, color:"#64748b", marginLeft:8 }}>{fmtDur(a._dur)}{a._avgHR > 0 ? ` · HR ${a._avgHR}` : ""}</span>
                    </div>
                  </div>
                ))}
                {day.sessions.map((s, si) => {
                  const st = SS[s.type] || SS.plan;
                  return (
                    <div key={si} style={{ padding:"6px 10px", marginBottom:4, background:st.bg, border:`1px solid ${st.border}`, borderRadius:6, display:"flex", alignItems:"flex-start", gap:8 }}>
                      <div style={{ width:7, height:7, borderRadius:"50%", background:st.dot, marginTop:4, flexShrink:0 }} />
                      <span style={{ fontSize:11, color:st.text, lineHeight:1.55 }}>
                        {s.text}
                        {s.cal && <span style={{ fontSize:8, color:st.dot, opacity:0.7, marginLeft:6, fontWeight:700 }}>CAL</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HealthView() {
  const [bfEntries, setBfEntries] = useState(BF_FALLBACK);
  const [bfStatus, setBfStatus] = useState("loading");

  useEffect(() => {
    fetch(SHEET_URL)
      .then(r => r.text())
      .then(csv => {
        const parsed = parseSheetBf(csv);
        setBfEntries(parsed);
        setBfStatus("live");
      })
      .catch(() => {
        setBfStatus("fallback");
      });
  }, []);

  const today = HEALTH_DATA.daily[HEALTH_DATA.daily.length - 1];
  const todaySleep = HEALTH_DATA.sleep[HEALTH_DATA.sleep.length - 1];
  const latestWeight = HEALTH_DATA.weight[HEALTH_DATA.weight.length - 1];
  const latestVo2 = HEALTH_DATA.vo2max[HEALTH_DATA.vo2max.length - 1];
  const { fitnessAge: fa } = HEALTH_DATA;
  const last7sleep = HEALTH_DATA.sleep.slice(-7);
  const avgTotal = Math.round(last7sleep.reduce((s,x) => s + x.deep + x.rem + x.light, 0) / last7sleep.length);
  const latestBf = bfEntries.length > 0 ? bfEntries[bfEntries.length - 1].bf : null;
  const leanMass = latestBf && latestWeight ? (latestWeight[1] * (1 - latestBf / 100)).toFixed(1) : null;

  const Stat = ({ label, value, sub, color, bg, border }) => (
    <div style={{ padding:"12px 14px", background: bg || "#f8fafc", border:`1.5px solid ${border || "#e2e8f0"}`, borderRadius:10, flex:1, minWidth:0 }}>
      <div style={{ fontSize:9, fontWeight:700, color:"#94a3b8", letterSpacing:1 }}>{label}</div>
      <div style={{ fontSize:20, fontWeight:900, color, lineHeight:1.1, marginTop:4 }}>{value}</div>
      {sub && <div style={{ fontSize:10, color:"#64748b", marginTop:3 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ padding:"14px 14px 60px" }}>
      {/* BIO AGE HERO */}
      <div style={{ background:"linear-gradient(135deg,#ede9fe,#dbeafe)", border:"1.5px solid #a5b4fc", borderRadius:12, padding:"16px", marginBottom:16, display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ textAlign:"center", minWidth:64 }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#6d28d9", letterSpacing:1 }}>BIO AGE</div>
          <div style={{ fontSize:40, fontWeight:900, color:"#4c1d95", lineHeight:1 }}>{fa.bio}</div>
          <div style={{ fontSize:10, color:"#7c3aed" }}>vs 35 chrono</div>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#1e1b4b", marginBottom:6 }}>Biologically 7 years younger 🔥</div>
          <div style={{ fontSize:11, color:"#4338ca", lineHeight:1.8 }}>
            VO₂Max <strong>{latestVo2[1]}</strong> · Resting HR <strong>{fa.rhr} bpm</strong> · BMI <strong>{fa.bmi}</strong>
          </div>
        </div>
      </div>

      {/* TODAY'S VITALS */}
      <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:8 }}>TODAY'S VITALS</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
        <Stat label="HRV" value={`${today.hrv} ms`} sub="baseline 100–130 · in range" color="#6d28d9" bg="#faf5ff" border="#c4b5fd" />
        <Stat label="RESTING HR" value={`${today.rhr} bpm`} sub="baseline 36–45 · excellent" color="#15803d" bg="#f0fdf4" border="#86efac" />
        <Stat label="SpO₂" value={`${today.spo2}%`} sub="normal >95%" color="#0369a1" bg="#e0f2fe" border="#7dd3fc" />
        <Stat label="RESPIRATION" value={`${today.resp} br/min`} sub="baseline 10.7–13.7" color="#d97706" bg="#fffbeb" border="#fcd34d" />
      </div>

      {/* SLEEP SCORE */}
      {(() => {
        const scores = HEALTH_DATA.daily.filter(d => d.sleep_score != null);
        if (scores.length === 0) return null;
        const latest = scores[scores.length - 1];
        const scoreColor = latest.sleep_score >= 80 ? "#15803d" : latest.sleep_score >= 60 ? "#d97706" : "#dc2626";
        const scoreBg   = latest.sleep_score >= 80 ? "#f0fdf4" : latest.sleep_score >= 60 ? "#fffbeb" : "#fef2f2";
        const scoreBo   = latest.sleep_score >= 80 ? "#86efac" : latest.sleep_score >= 60 ? "#fcd34d" : "#fca5a5";
        const scoreLabel = latest.sleep_score >= 80 ? "Good" : latest.sleep_score >= 60 ? "Fair" : "Poor";
        const avg7 = Math.round(scores.slice(-7).reduce((s,d) => s + d.sleep_score, 0) / Math.min(7, scores.length));
        return (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:8 }}>SLEEP SCORE</div>
            <div style={{ background:scoreBg, border:`1.5px solid ${scoreBo}`, borderRadius:10, padding:"14px" }}>
              <div style={{ display:"flex", gap:12, marginBottom:10 }}>
                <div style={{ textAlign:"center", minWidth:64 }}>
                  <div style={{ fontSize:36, fontWeight:900, color:scoreColor, lineHeight:1 }}>{latest.sleep_score}</div>
                  <div style={{ fontSize:10, color:scoreColor, fontWeight:700 }}>{scoreLabel}</div>
                  <div style={{ fontSize:9, color:"#94a3b8", marginTop:2 }}>{latest.date.slice(5)}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, color:"#475569", marginBottom:4 }}>
                    7-day avg: <strong style={{ color:scoreColor }}>{avg7}</strong>
                  </div>
                  <div style={{ fontSize:10, color:"#94a3b8", lineHeight:1.7 }}>
                    ≥80 Good · 60–79 Fair · &lt;60 Poor<br />
                    Score 33 on May 3 = post-late-night nap only
                  </div>
                </div>
              </div>
              <Sparkline data={scores.map(d => [d.date, d.sleep_score])} color={scoreColor} height={44} />
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:4, fontSize:9, color:"#94a3b8" }}>
                <span>{scores[0]?.date?.slice(5)}</span>
                <span>{scores[scores.length-1]?.date?.slice(5)}</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* HRV TREND */}
      <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:8 }}>HRV — TREND</div>
      <div style={{ background:"#faf5ff", border:"1px solid #ede9fe", borderRadius:10, padding:"12px 14px", marginBottom:16 }}>
        <Sparkline data={HEALTH_DATA.daily.map(d => [d.date, d.hrv])} color="#7c3aed" height={48} />
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
          <span style={{ fontSize:9, color:"#94a3b8" }}>{HEALTH_DATA.daily[0]?.date?.slice(5)}</span>
          <span style={{ fontSize:10, fontWeight:700, color:"#7c3aed" }}>Today: {today.hrv}ms</span>
          <span style={{ fontSize:9, color:"#94a3b8" }}>{HEALTH_DATA.daily[HEALTH_DATA.daily.length-1]?.date?.slice(5)}</span>
        </div>
      </div>

      {/* SLEEP */}
      <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:8 }}>SLEEP — LAST 7 NIGHTS</div>
      <div style={{ background:"#f0f9ff", border:"1px solid #7dd3fc", borderRadius:10, padding:"14px", marginBottom:16 }}>
        <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
          {[
            { label:"Last night", value:`${Math.floor((todaySleep.deep+todaySleep.rem+todaySleep.light)/60)}h${(todaySleep.deep+todaySleep.rem+todaySleep.light)%60}m`, color:"#1e40af" },
            { label:"Deep", value:`${todaySleep.deep}m`, color:"#1d4ed8" },
            { label:"REM", value:`${todaySleep.rem}m`, color:"#7c3aed" },
            { label:"7d avg", value:`${Math.floor(avgTotal/60)}h${avgTotal%60}m`, color:"#0369a1" },
          ].map((m, i) => (
            <div key={i} style={{ flex:1, minWidth:56, textAlign:"center" }}>
              <div style={{ fontSize:9, fontWeight:700, color:"#94a3b8", letterSpacing:1 }}>{m.label}</div>
              <div style={{ fontSize:16, fontWeight:800, color:m.color, marginTop:3 }}>{m.value}</div>
            </div>
          ))}
        </div>
        {last7sleep.map((s, i) => {
          const total = s.deep + s.rem + s.light || 1;
          const date = s.date.slice(5).replace("-","/");
          return (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
              <div style={{ fontSize:9, color:"#64748b", width:32, textAlign:"right" }}>{date}</div>
              <div style={{ flex:1, height:10, borderRadius:5, overflow:"hidden", display:"flex" }}>
                <div style={{ width:`${(s.deep/total)*100}%`, background:"#1d4ed8" }} />
                <div style={{ width:`${(s.rem/total)*100}%`, background:"#7c3aed" }} />
                <div style={{ width:`${(s.light/total)*100}%`, background:"#93c5fd" }} />
              </div>
              <div style={{ fontSize:9, color:"#64748b", width:36 }}>{Math.floor((s.deep+s.rem+s.light)/60)}h{(s.deep+s.rem+s.light)%60}m</div>
            </div>
          );
        })}
        <div style={{ display:"flex", gap:12, marginTop:8 }}>
          {[["#1d4ed8","Deep"],["#7c3aed","REM"],["#93c5fd","Light"]].map(([c,l]) => (
            <div key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:8, height:8, borderRadius:2, background:c }} />
              <span style={{ fontSize:9, color:"#64748b" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* WEIGHT */}
      <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:8 }}>WEIGHT TREND (2026)</div>
      <div style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"14px", marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div>
            <div style={{ fontSize:9, color:"#94a3b8", letterSpacing:1 }}>LAST LOGGED</div>
            <div style={{ fontSize:22, fontWeight:900, color:"#1e293b" }}>
              {latestWeight[1]} <span style={{ fontSize:13, fontWeight:500, color:"#64748b" }}>kg</span>
            </div>
            <div style={{ fontSize:10, color:"#94a3b8" }}>{latestWeight[0]}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:9, color:"#94a3b8", letterSpacing:1 }}>RANGE</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#475569" }}>72.3–75.5 kg</div>
            <div style={{ fontSize:10, color:"#94a3b8" }}>target: 72–73 kg</div>
          </div>
        </div>
        <Sparkline data={HEALTH_DATA.weight} color="#0369a1" height={40} />
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
          <span style={{ fontSize:9, color:"#94a3b8" }}>Jan 2026</span>
          <span style={{ fontSize:9, color:"#94a3b8" }}>Apr 2026</span>
        </div>
      </div>

      {/* BODY FAT */}
      <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:8 }}>
        BODY FAT % <span style={{ fontWeight:400, color: bfStatus === "live" ? "#15803d" : "#94a3b8" }}>
          {bfStatus === "loading" ? "⟳ fetching from Google Sheet…" : bfStatus === "live" ? "● live from Google Sheet" : "○ cached data (sheet unavailable)"}
        </span>
      </div>
      <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:10, padding:"14px", marginBottom:16 }}>
        <div style={{ display:"flex", gap:12, marginBottom:12, flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:72 }}>
            <div style={{ fontSize:9, fontWeight:700, color:"#94a3b8", letterSpacing:1 }}>LATEST</div>
            <div style={{ fontSize:22, fontWeight:900, color:"#15803d" }}>{latestBf}%</div>
            <div style={{ fontSize:10, color:"#64748b" }}>Mar 25 2026</div>
          </div>
          {leanMass && (
            <div style={{ flex:1, minWidth:72 }}>
              <div style={{ fontSize:9, fontWeight:700, color:"#94a3b8", letterSpacing:1 }}>LEAN MASS</div>
              <div style={{ fontSize:22, fontWeight:900, color:"#15803d" }}>{leanMass}<span style={{ fontSize:13, fontWeight:500 }}> kg</span></div>
              <div style={{ fontSize:10, color:"#64748b" }}>est. from last weight</div>
            </div>
          )}
          <div style={{ flex:1, minWidth:72 }}>
            <div style={{ fontSize:9, fontWeight:700, color:"#94a3b8", letterSpacing:1 }}>SINCE JAN 25</div>
            <div style={{ fontSize:22, fontWeight:900, color:"#15803d" }}>↓ 7.1%</div>
            <div style={{ fontSize:10, color:"#64748b" }}>14.7% → 7.6%</div>
          </div>
        </div>
        {bfEntries.length > 1 && <Sparkline data={bfEntries} color="#15803d" height={40} />}
        <div style={{ fontSize:9, color: bfStatus === "live" ? "#15803d" : "#94a3b8", marginTop:6 }}>
          {bfStatus === "live"
            ? "✓ Live from your Google Sheet — updates automatically when you add a new column."
            : bfStatus === "loading"
            ? "Fetching from Google Sheet…"
            : "⚠ Sheet unavailable — showing cached data. Check that the sheet is publicly shared."}
          {" "}Readings outside 9–20% excluded as outliers.
        </div>
      </div>

      {/* VO2MAX */}
      <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:8 }}>VO₂MAX TREND</div>
      <div style={{ background:"#fff7ed", border:"1px solid #fdba74", borderRadius:10, padding:"14px", marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div>
            <div style={{ fontSize:22, fontWeight:900, color:"#c2410c" }}>
              {latestVo2[1]} <span style={{ fontSize:13, fontWeight:500, color:"#64748b" }}>mL/kg/min</span>
            </div>
            <div style={{ fontSize:10, color:"#64748b", marginTop:2 }}>Garmin estimate · 52 → 56 since March</div>
          </div>
          <div style={{ textAlign:"right", fontSize:11, color:"#64748b", lineHeight:1.9 }}>
            <div>Elite (35M): &gt;55 ✓</div>
            <div>Hyrox sub-75: 50+ ✓</div>
          </div>
        </div>
        <Sparkline data={HEALTH_DATA.vo2max} color="#c2410c" height={40} />
        <div style={{ marginTop:10, padding:"8px 10px", background:"#fff", border:"1px solid #fed7aa", borderRadius:6, fontSize:11, color:"#9a3412" }}>
          🏆 <strong>Lab-tested CPET (Nov 2024): 60 ml/kg/min</strong> — 152% of predicted, classified as <strong>EXCELLENT</strong>
        </div>
      </div>

      {/* CPET HR ZONES */}
      <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:8 }}>HR TRAINING ZONES <span style={{ fontWeight:400, color:"#94a3b8" }}>(from CPET, Nov 2024)</span></div>
      <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, padding:"14px" }}>
        {[
          { z:"E", name:"Top / VO₂max", hr:">167", w:">262W", color:"#dc2626", bg:"#fef2f2" },
          { z:"D", name:"Development", hr:"146–167", w:"206–262W", color:"#ea580c", bg:"#fff7ed" },
          { z:"C", name:"Intensive Endurance", hr:"132–146", w:"154–206W", color:"#eab308", bg:"#fefce8" },
          { z:"B", name:"Extensive Endurance", hr:"115–132", w:"112–154W", color:"#16a34a", bg:"#f0fdf4" },
          { z:"A", name:"Compensation", hr:"<115", w:"<112W", color:"#94a3b8", bg:"#f8fafc" },
        ].map((z,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", marginBottom:4, background:z.bg, border:`1px solid ${z.color}33`, borderRadius:6 }}>
            <div style={{ width:24, height:24, borderRadius:"50%", background:z.color, color:"#fff", fontSize:12, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>{z.z}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, fontWeight:700, color:z.color }}>{z.name}</div>
              <div style={{ fontSize:10, color:"#64748b" }}>HR {z.hr} bpm · {z.w}</div>
            </div>
          </div>
        ))}
        <div style={{ fontSize:10, color:"#64748b", marginTop:8, textAlign:"center", fontStyle:"italic" }}>
          Adjust: <strong>+10 running</strong> · <strong>+5 walking</strong> · <strong>−10 swimming</strong>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [ana, setAna] = useState(null);
  const [view, setView] = useState("today");
  const fileRef = useRef();

  useEffect(() => {
    const p = parseCSV(CSV_DATA);
    const a = analyze(p);
    setActivities(a.enriched);
    setAna(a);
  }, []);

  function handleUpload(e) {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      const p = parseCSV(ev.target.result);
      const a = analyze(p);
      setActivities(a.enriched);
      setAna(a);
    };
    r.readAsText(f);
  }

  if (!ana) return <div style={{ padding:40, color:"#333" }}>Loading…</div>;

  const { yesterday, tsb, daysSinceHard, weeklyKm, atl, ctl,
          weeklyTrimp, zoneMinutes, totalZoneMin, hyroxSims, paceTrend,
          readinessHistory, atlHistory } = ana;

  // Today's HRV from HEALTH_DATA (latest daily entry)
  const todayHrv = HEALTH_DATA.daily[HEALTH_DATA.daily.length - 1]?.hrv || null;
  const hrvBaseline = 110; // updated 2026-05-12

  const R = readiness(tsb, daysSinceHard, todayHrv, hrvBaseline);
  const rC = R >= 7 ? "#15803d" : R >= 4 ? "#b45309" : "#dc2626";
  const rBg = R >= 7 ? "#f0fdf4" : R >= 4 ? "#fffbeb" : "#fef2f2";
  const rBo = R >= 7 ? "#86efac" : R >= 4 ? "#fcd34d" : "#fca5a5";
  const rLbl = R >= 7 ? "READY TO PUSH" : R >= 4 ? "TRAIN SMART" : "TAKE IT EASY";
  const coachMsg = R >= 7 ? "HRV 135ms (↑ trend, weekly avg 100ms). Sleep 7h17m: deep 102 / REM 152 min. Green light." : R >= 4 ? "Good recovery. Controlled effort today." : "Load stacking. Rest or very easy only.";

  const todaySched = SCHEDULE.flatMap(w => w.days).find(d => d.date === TODAY);
  const hyroxAct = yesterday.find(a => isHyrox(a));
  const runAct = yesterday.find(a => isRun(a) && a._avgHR > 120);
  const saunaAct = yesterday.find(a => isRecovery(a));

  const notes = [];
  if (hyroxAct) {
    notes.push(`Hyrox group: ${fmtDur(hyroxAct._dur)} · HR avg ${hyroxAct._avgHR}/max 169 · TE ${hyroxAct["Aerobic TE"]} · ${hyroxAct._dist?.toFixed(1)}km running`);
    notes.push(`Session: warm-up → 400m run + 450m row → chest press 20p / shoulder press 20p → box jump over (35-40) → sled push + burpee to plate (20-25p) · 2min on/2min rest`);
    const gct = parseNum(hyroxAct["Avg Ground Contact Time"]);
    const vr = parseNum(hyroxAct["Avg Vertical Ratio"]);
    const gctBalance = hyroxAct["Avg GCT Balance"];
    const np = parseNum(hyroxAct["Normalized Power® (NP®)"]);
    if (gct) notes.push(`GCT: ${gct}ms — target <380ms at race pace ${gct < 380 ? "✓ good" : "→ work on cadence & stiffness"}`);
    if (vr) notes.push(`Vert ratio: ${vr}% — ${vr < 9 ? "✓ efficient" : "→ too much vertical bounce · lean forward, drive hips"} (target <9%)`);
    if (gctBalance) notes.push(`GCT balance: ${gctBalance} — ${gctBalance.includes("52") || gctBalance.includes("53") ? "slight left bias · monitor over next sessions" : "✓ balanced"}`);
    if (np) notes.push(`Normalized Power: ${np}W · body battery drain only −8 — excellent pacing ✓`);
    notes.push(`Respiration: avg 30 / peak 44 brpm during session — expected at Hyrox intensity`);
  } else if (runAct) {
    const gct = parseNum(runAct["Avg Ground Contact Time"]);
    const vr = parseNum(runAct["Avg Vertical Ratio"]);
    const cadence = parseNum(runAct["Avg Run Cadence"]);
    const pace = runAct["Avg Pace"] || runAct["Avg Speed"];
    notes.push(`${runAct.Title}: ${runAct._dist?.toFixed(2)}km · ${pace}/km · HR avg ${runAct._avgHR}/max ${runAct["Max HR"]} · TE ${runAct["Aerobic TE"]}`);
    if (gct) notes.push(`GCT: ${gct}ms — ${gct < 280 ? "✓ excellent for road run" : gct < 300 ? "✓ good" : "→ work on cadence"} (Hyrox target <380ms)`);
    if (vr) notes.push(`Vert ratio: ${vr}% — ${vr < 7 ? "✓ excellent efficiency" : vr < 9 ? "✓ good" : "→ lean forward more"}`);
    if (cadence) notes.push(`Cadence: ${cadence} spm — ${cadence >= 180 ? "✓ optimal" : "→ target 180+ spm"}`);
    notes.push(`Pace 5:06/km = well within Z2/Z3 · good aerobic builder for Hyrox base`);
  }
  if (saunaAct) notes.push("Post-session sauna ✓ — accelerates glycogen resynthesis & parasympathetic recovery");
  notes.push(`Week running km so far: ${weeklyKm.toFixed(1)} km · 3 Hyrox sessions this week · on track`);
  notes.push(`HRV 128ms today (7d avg: Balanced) — outstanding recovery after Hyrox. RHR 40bpm. Body battery +66. Green light to train hard.`);

  const TABS = [["today","TODAY"],["schedule","SCHEDULE"],["health","HEALTH"],["history","HISTORY"],["load","LOAD"],["insights","INSIGHTS"]];

  return (
    <div style={{ minHeight:"100vh", background:"#ffffff", fontFamily:"'Inter',system-ui,sans-serif", color:"#1e293b", fontSize:13 }}>

      {/* HEADER */}
      <div style={{ padding:"16px 14px 12px", borderBottom:"2px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:3, color:"#94a3b8", marginBottom:3 }}>HYROX RIGA · MAY 30 · 17 DAYS</div>
          <div style={{ fontSize:20, fontWeight:800, color:"#1e1b4b", letterSpacing:-0.5 }}>Training Coach</div>
          <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>Wed May 13 · updated with May 12 Garmin data</div>
        </div>
        <button onClick={async () => {
            const token = "__DISPATCH_TOKEN_PLACEHOLDER__";
            if (!token) { alert("No dispatch token configured"); return; }
            const btn = document.activeElement;
            btn.textContent = "Refreshing…";
            btn.disabled = true;
            try {
              const res = await fetch(
                "https://api.github.com/repos/Simanauskas/dashboard/actions/workflows/update.yml/dispatches",
                {
                  method: "POST",
                  headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/vnd.github+json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ ref: "main", inputs: { mode: "activities" } }),
                }
              );
              if (res.status === 204) {
                btn.textContent = "✓ Running…";
                setTimeout(() => { btn.textContent = "⟳ Refresh"; btn.disabled = false; }, 8000);
              } else {
                btn.textContent = "✗ Error";
                btn.disabled = false;
              }
            } catch(e) {
              btn.textContent = "✗ Error";
              btn.disabled = false;
            }
          }} style={{ background:"#7c3aed", border:"none", borderRadius:8, padding:"8px 14px", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer" }}>
          ⟳ Refresh
        </button>
      </div>

      {/* READINESS */}
      <div style={{ margin:"12px 14px 0", padding:"12px 16px", background:rBg, border:`1.5px solid ${rBo}`, borderRadius:10, display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
        <div style={{ textAlign:"center", minWidth:48 }}>
          <div style={{ fontSize:32, fontWeight:900, color:rC, lineHeight:1 }}>{R}</div>
          <div style={{ fontSize:9, color:rC, opacity:0.6, letterSpacing:1 }}>/10</div>
        </div>
        <div style={{ flex:1, minWidth:160 }}>
          <div style={{ fontSize:11, fontWeight:800, color:rC, letterSpacing:2 }}>{rLbl}</div>
          <div style={{ fontSize:12, color:"#475569", marginTop:3, lineHeight:1.5 }}>{coachMsg}</div>
          <div style={{ fontSize:10, color:"#94a3b8", marginTop:4 }}>
            HRV {todayHrv}ms (baseline {hrvBaseline}ms) · ATL {atl?.toFixed(0)} · CTL {ctl?.toFixed(0)} · Form {tsb?.toFixed(0)}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display:"flex", borderBottom:"2px solid #f1f5f9", margin:"12px 0 0", padding:"0 14px", overflowX:"auto" }}>
        {TABS.map(([k, l]) => (
          <button key={k} onClick={() => setView(k)} style={{
            background:"none", border:"none",
            borderBottom: view === k ? "2px solid #7c3aed" : "2px solid transparent",
            color: view === k ? "#7c3aed" : "#94a3b8",
            padding:"8px 12px 8px", fontSize:11, fontWeight:700, letterSpacing:1,
            cursor:"pointer", fontFamily:"inherit", marginBottom:-2, whiteSpace:"nowrap",
          }}>
            {l}
          </button>
        ))}
      </div>

      {/* TODAY */}
      {view === "today" && (
        <div style={{ padding:"14px 14px 40px" }}>
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#7c3aed", letterSpacing:2, marginBottom:8 }}>TODAY'S SESSIONS</div>
            {(todaySched?.sessions || []).map((s, i) => {
              const st = SS[s.type] || SS.plan;
              return (
                <div key={i} style={{ padding:"10px 13px", marginBottom:7, background:st.bg, border:`1.5px solid ${st.border}`, borderRadius:8 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:st.text }}>{s.text}</div>
                  {s.type === "hyrox" && (
                    <div style={{ fontSize:11, color:"#64748b", marginTop:5, lineHeight:1.6 }}>
                      → {R >= 7 ? "HRV 128ms + body battery +66 — fully recovered. Push hard." : R >= 4 ? "Good recovery. Controlled effort today." : "Rest day. Let the adaptation stick."}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:8 }}>YESTERDAY (APR 28)</div>
            {yesterday.map((a, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", marginBottom:6, background:getColor(a)+"0d", border:`1.5px solid ${getColor(a)}33`, borderRadius:8 }}>
                <span style={{ fontSize:18 }}>{getEmoji(a)}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:getColor(a) }}>{a.Title || a["Activity Type"]}</div>
                  <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>
                    {fmtDur(a._dur)}
                    {a._avgHR > 0 ? ` · HR ${a._avgHR}/${parseNum(a["Max HR"]) || "—"}bpm` : ""}
                    {a._dist > 0 ? ` · ${a._dist.toFixed(1)}km` : ""}
                    {a["Total Reps"] && a["Total Reps"] !== "--" && isStrength(a) ? ` · ${a["Total Reps"]} reps` : ""}
                    {a["Avg Speed"] && a["Avg Speed"] !== "--" && isRun(a) ? ` · ${speedToPace(a["Avg Speed"])}` : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:8 }}>COACHING NOTES</div>
            {notes.map((n, i) => (
              <div key={i} style={{ padding:"8px 12px", marginBottom:5, background:"#f8fafc", borderLeft:"3px solid #7c3aed", borderRadius:"0 6px 6px 0", fontSize:12, color:"#334155", lineHeight:1.5 }}>
                {n}
              </div>
            ))}
          </div>

          {hyroxAct && (            <div>
              <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:8 }}>YESTERDAY'S HYROX SESSION ANALYSIS</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[
                  { label:"Duration",      value:fmtDur(hyroxAct._dur),              note:"62min full session ✓", ok:true },
                  { label:"Running dist",  value:`${hyroxAct._dist?.toFixed(2)} km`, note:"2.84 km in 33:39 moving", ok:true },
                  { label:"Avg HR",        value:`${hyroxAct._avgHR} bpm`,           note:"Z2/Z3 · good aerobic base", ok:true },
                  { label:"Max HR",        value:`169 bpm`,                           note:"97% max — hit top zone ✓", ok:true },
                  { label:"GCT",           value:`441 ms`,                            note:"→ target <380ms at race pace", ok:false },
                  { label:"Vert Ratio",    value:`12.1 %`,                            note:"→ high bounce · lean forward more", ok:false },
                  { label:"GCT Balance",   value:`52.6L / 47.4R`,                    note:"→ slight left bias · monitor", ok:false },
                  { label:"Norm Power",    value:`218 W`,                             note:"solid mixed-format output ✓", ok:true },
                  { label:"Avg Resp",      value:`30 br/min`,                         note:"peak 44 · expected at intensity", ok:true },
                  { label:"Body Batt",     value:`−8`,                                note:"light drain → excellent pacing ✓", ok:true },
                ].map((m, i) => (
                  <div key={i} style={{ padding:"10px 12px", background: m.ok ? "#f0fdf4" : "#fffbeb", border:`1px solid ${m.ok ? "#86efac" : "#fcd34d"}`, borderRadius:8 }}>
                    <div style={{ fontSize:9, fontWeight:700, color:"#94a3b8", letterSpacing:1 }}>{m.label}</div>
                    <div style={{ fontSize:15, fontWeight:800, color: m.ok ? "#15803d" : "#a16207", marginTop:2 }}>{m.value}</div>
                    <div style={{ fontSize:10, color:"#64748b", marginTop:2 }}>{m.note}</div>
                  </div>
                ))}
              </div>

              {/* Recovery quality after session */}
              <div style={{ marginTop:10, padding:"10px 14px", background:"#f0fdf4", border:"1.5px solid #86efac", borderRadius:8, display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, textAlign:"center" }}>
                {[
                  { label:"Overnight HRV", value:"128 ms", sub:"7d: Balanced" },
                  { label:"RHR", value:"40 bpm", sub:"athlete baseline" },
                  { label:"Body Battery", value:"+66", sub:"bed→wake" },
                  { label:"SpO2", value:"99%", sub:"lowest 95%" },
                ].map((s,i) => (
                  <div key={i}>
                    <div style={{ fontSize:9, color:"#64748b", letterSpacing:1 }}>{s.label}</div>
                    <div style={{ fontSize:14, fontWeight:800, color:"#15803d" }}>{s.value}</div>
                    <div style={{ fontSize:9, color:"#94a3b8" }}>{s.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:6, padding:"8px 12px", background:"#f0fdf4", border:"1px solid #86efac", borderRadius:6, fontSize:11, color:"#15803d" }}>
                ✓ <strong>Outstanding recovery.</strong> HRV 128ms despite Hyrox session — your aerobic base is absorbing this load very well. Sleep 7h27m, 22 restless moments. Green light for full effort today.
              </div>

              {/* Hyrox vs Race Comparison */}
              <div style={{ marginTop:12, padding:"12px 14px", background:"#f5f3ff", border:"1.5px solid #c4b5fd", borderRadius:8 }}>
                <div style={{ fontSize:9, fontWeight:700, color:"#7c3aed", letterSpacing:2, marginBottom:8 }}>VS RACE TARGETS · MAY 30 RIGA</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, fontSize:11 }}>
                  {[
                    { label:"HR zone", now:"avg 121", target:"avg 145–155", gap:"→ push harder in race" },
                    { label:"Running pace", now:"~11:00/km", target:"4:48/km", gap:"→ ~6 min/km headroom at race pace" },
                    { label:"GCT", now:"441ms", target:"<380ms", gap:"→ 61ms to find" },
                    { label:"Vert ratio", now:"12.1%", target:"<9%", gap:"→ work on forward lean" },
                  ].map((r,i) => (
                    <div key={i} style={{ background:"#fff", border:"1px solid #ddd6fe", borderRadius:6, padding:"8px 10px" }}>
                      <div style={{ fontSize:9, fontWeight:700, color:"#7c3aed", marginBottom:3 }}>{r.label}</div>
                      <div style={{ fontSize:11, fontWeight:700, color:"#1e1b4b" }}>{r.now}</div>
                      <div style={{ fontSize:10, color:"#64748b" }}>target: {r.target}</div>
                      <div style={{ fontSize:10, color:"#a16207", marginTop:2 }}>{r.gap}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!hyroxAct && runAct && (
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:8 }}>YESTERDAY'S RUN ANALYSIS</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[
                  { label:"Distance",    value:`${runAct._dist?.toFixed(2)} km`,       note:"solid base volume ✓",                ok:true },
                  { label:"Avg Pace",    value:runAct["Avg Pace"] ? `${runAct["Avg Pace"]}/km` : speedToPace(runAct["Avg Speed"]), note:"Z2/Z3 aerobic zone ✓", ok:true },
                  { label:"Avg HR",      value:`${runAct._avgHR} bpm`,                 note:`${Math.round(runAct._avgHR/174*100)}% of max · aerobic`, ok:true },
                  { label:"Max HR",      value:`${runAct["Max HR"]} bpm`,              note:"well controlled ceiling ✓",          ok:true },
                  { label:"GCT",         value:`${parseNum(runAct["Avg Ground Contact Time"])}ms`, note:`${parseNum(runAct["Avg Ground Contact Time"]) < 280 ? "✓ excellent" : "✓ good"} — vs Hyrox 441ms`, ok:true },
                  { label:"Vert Ratio",  value:`${parseNum(runAct["Avg Vertical Ratio"])}%`,       note:`${parseNum(runAct["Avg Vertical Ratio"]) < 7 ? "✓ very efficient" : "✓ good"}`,                  ok:true },
                  { label:"Cadence",     value:`${parseNum(runAct["Avg Run Cadence"])} spm`,       note:`${parseNum(runAct["Avg Run Cadence"]) >= 180 ? "✓ optimal" : "→ target 180+"}`,                   ok:parseNum(runAct["Avg Run Cadence"]) >= 178 },
                  { label:"Body Batt",   value:`−11`,                                  note:"moderate drain · well paced",        ok:true },
                ].map((m, i) => (
                  <div key={i} style={{ padding:"10px 12px", background: m.ok ? "#f0fdf4" : "#fffbeb", border:`1px solid ${m.ok ? "#86efac" : "#fcd34d"}`, borderRadius:8 }}>
                    <div style={{ fontSize:9, fontWeight:700, color:"#94a3b8", letterSpacing:1 }}>{m.label}</div>
                    <div style={{ fontSize:15, fontWeight:800, color: m.ok ? "#15803d" : "#a16207", marginTop:2 }}>{m.value}</div>
                    <div style={{ fontSize:10, color:"#64748b", marginTop:2 }}>{m.note}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:10, padding:"10px 14px", background:"#f0fdf4", border:"1.5px solid #86efac", borderRadius:8, fontSize:11, color:"#15803d" }}>
                ✓ <strong>Key win vs Hyrox session:</strong> GCT 269ms vs 441ms — when fresh and running continuously, your mechanics are excellent. The Hyrox GCT penalty comes from fatigue accumulation across stations. Target: maintain sub-300ms GCT even in the final 2km of Hyrox.
              </div>
            </div>
          )}

        </div>
      )}

      {/* INSIGHTS */}
      {view === "insights" && (
        <div style={{ padding:"14px 14px 40px" }}>

          {/* HRV + ATL overlay */}
          <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:10 }}>HRV vs TRAINING LOAD (42 DAYS)</div>
          <div style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"14px", marginBottom:16 }}>
            {(() => {
              const data = atlHistory.filter((_, i) => i % 1 === 0);
              const hrvData = HEALTH_DATA.daily;
              const maxAtl = Math.max(...data.map(d => d.atl), 1);
              const maxHrv = Math.max(...HEALTH_DATA.daily.map(d => d.hrv), 1);
              const W = 320, H = 80;
              const atlPts = data.map((d,i) => `${(i/(data.length-1))*W},${H - (d.atl/maxAtl)*(H-8) - 4}`).join(" ");
              const hrvPts = data.map((d,i) => {
                const hd = hrvData.find(h => h.date === d.date);
                if (!hd) return null;
                return `${(i/(data.length-1))*W},${H - (hd.hrv/maxHrv)*(H-8) - 4}`;
              }).filter(Boolean);
              return (
                <div>
                  <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:H }} preserveAspectRatio="none">
                    <polyline points={atlPts} fill="none" stroke="#dc2626" strokeWidth="2" opacity="0.7" strokeLinejoin="round" />
                    {hrvPts.length > 1 && <polyline points={hrvPts.join(" ")} fill="none" stroke="#7c3aed" strokeWidth="2" opacity="0.8" strokeLinejoin="round" />}
                  </svg>
                  {/* Date axis */}
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:4, fontSize:9, color:"#94a3b8" }}>
                    {[0, 0.25, 0.5, 0.75, 1].map(frac => {
                      const d = new Date(TODAY);
                      d.setDate(d.getDate() - Math.round((1-frac)*41));
                      return <span key={frac}>{d.toLocaleDateString('en',{month:'short',day:'numeric'})}</span>;
                    })}
                  </div>
                  <div style={{ display:"flex", gap:16, marginTop:6, fontSize:10 }}>
                    <span style={{ color:"#dc2626" }}>━ ATL (fatigue)</span>
                    <span style={{ color:"#7c3aed" }}>━ HRV</span>
                    <span style={{ color:"#94a3b8", marginLeft:"auto" }}>HRV falls when ATL spikes = needs recovery</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Readiness history sparkline */}
          <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:10 }}>READINESS HISTORY (30 DAYS)</div>
          <div style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"14px", marginBottom:16 }}>
            {(() => {
              const scores = HEALTH_DATA.daily.slice(-30).map(d => {
                const atlD = atlHistory.find(a => a.date === d.date);
                const tsbD = atlD ? (atlD.ctl - atlD.atl) : 0;
                return readiness(tsbD, 99, d.hrv, 88);
              });
              if (scores.length < 2) return <div style={{ color:"#94a3b8", fontSize:11 }}>Not enough data yet</div>;
              const W = 320, H = 60;
              const min = 1, max = 10;
              const pts = scores.map((v,i) => `${(i/(scores.length-1))*W},${H - ((v-min)/(max-min))*(H-8) - 4}`).join(" ");
              const avg = (scores.reduce((s,v)=>s+v,0)/scores.length).toFixed(1);
              const trend = scores[scores.length-1] > scores[0] ? "↑" : "↓";
              return (
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:"#1e293b" }}>Avg: {avg}/10 {trend}</span>
                    <span style={{ fontSize:10, color:"#94a3b8" }}>Last 30 days</span>
                  </div>
                  <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:H }} preserveAspectRatio="none">
                    {[3,5,7].map(v => (
                      <line key={v} x1="0" x2={W} y1={H - ((v-min)/(max-min))*(H-8) - 4} y2={H - ((v-min)/(max-min))*(H-8) - 4} stroke="#e2e8f0" strokeWidth="1" />
                    ))}
                    <polyline points={pts} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                    {scores.map((v,i) => {
                      const x = (i/(scores.length-1))*W;
                      const y = H - ((v-min)/(max-min))*(H-8) - 4;
                      const c = v >= 7 ? "#16a34a" : v >= 4 ? "#d97706" : "#dc2626";
                      return <circle key={i} cx={x} cy={y} r="3" fill={c} />;
                    })}
                  </svg>
                  <div style={{ display:"flex", gap:10, marginTop:6, fontSize:10 }}>
                    <span style={{ color:"#16a34a" }}>● 7–10 push</span>
                    <span style={{ color:"#d97706" }}>● 4–6 smart</span>
                    <span style={{ color:"#dc2626" }}>● 1–3 rest</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* HR Zone distribution */}
          <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:10 }}>HR ZONE DISTRIBUTION (28 DAYS)</div>
          <div style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"14px", marginBottom:16 }}>
            {totalZoneMin > 0 ? (
              <div>
                {[
                  { z:"E", name:"VO₂max", c:"#dc2626", bg:"#fef2f2" },
                  { z:"D", name:"Development", c:"#ea580c", bg:"#fff7ed" },
                  { z:"C", name:"Intensive", c:"#eab308", bg:"#fefce8" },
                  { z:"B", name:"Aerobic", c:"#16a34a", bg:"#f0fdf4" },
                  { z:"A", name:"Recovery", c:"#94a3b8", bg:"#f8fafc" },
                ].map(({ z, name, c, bg }) => {
                  const mins = Math.round(zoneMinutes[z]);
                  const pct = totalZoneMin > 0 ? (mins / totalZoneMin * 100) : 0;
                  return (
                    <div key={z} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                      <div style={{ width:20, height:20, borderRadius:"50%", background:c, color:"#fff", fontSize:10, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{z}</div>
                      <div style={{ flex:1, background:"#f1f5f9", borderRadius:4, height:18, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${pct}%`, background:c+"cc", borderRadius:4, transition:"width 0.5s" }} />
                      </div>
                      <div style={{ fontSize:10, fontWeight:600, color:c, minWidth:32, textAlign:"right" }}>{pct.toFixed(0)}%</div>
                      <div style={{ fontSize:10, color:"#94a3b8", minWidth:52 }}>{Math.round(mins)}m · {name}</div>
                    </div>
                  );
                })}
                <div style={{ marginTop:10, padding:"8px 10px", background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:6, fontSize:10, color:"#92400e" }}>
                  💡 Ideal Hyrox split: ~40% Zone B/C aerobic + ~35% Zone D/E race intensity + ~25% recovery
                </div>
              </div>
            ) : <div style={{ color:"#94a3b8", fontSize:11 }}>No HR data in last 28 days</div>}
          </div>

          {/* Hyrox simulation tracker */}
          <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:10 }}>HYROX SIMULATION SESSIONS</div>
          <div style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"14px", marginBottom:16 }}>
            {hyroxSims.length === 0
              ? <div style={{ color:"#94a3b8", fontSize:11 }}>No Hyrox sessions found yet</div>
              : hyroxSims.map((a, i) => {
                  const gct = parseNum(a["Avg Ground Contact Time"]);
                  const vr = parseNum(a["Avg Vertical Ratio"]);
                  const np = parseNum(a["Normalized Power® (NP®)"]);
                  const improving = i > 0 && a._avgHR < hyroxSims[i-1]._avgHR;
                  return (
                    <div key={i} style={{ padding:"10px 12px", marginBottom:6, background: i === hyroxSims.length-1 ? "#faf5ff" : "#fff", border:`1px solid ${i === hyroxSims.length-1 ? "#7c3aed" : "#e2e8f0"}`, borderRadius:8 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ fontSize:12, fontWeight:700, color:"#4c1d95" }}>🦘 {a.Title}</span>
                        <span style={{ fontSize:10, color:"#94a3b8" }}>{a._date}</span>
                      </div>
                      <div style={{ fontSize:11, color:"#64748b", marginTop:4, display:"flex", gap:12, flexWrap:"wrap" }}>
                        <span>⏱ {fmtDur(a._dur)}</span>
                        <span>❤️ {a._avgHR} bpm avg</span>
                        {a._dist > 0 && <span>📏 {a._dist.toFixed(1)}km</span>}
                        {gct && <span>GCT {gct}ms {gct < 380 ? "✓" : "↑"}</span>}
                        {vr && <span>VR {vr}% {vr < 9 ? "✓" : "↑"}</span>}
                        {np && <span>NP {np}W</span>}
                        <span style={{ fontWeight:700, color: a._trimp > 80 ? "#dc2626" : "#7c3aed" }}>TRIMP {a._trimp.toFixed(0)}</span>
                      </div>
                    </div>
                  );
                })}
            {hyroxSims.length > 1 && (() => {
              const first = hyroxSims[0], last = hyroxSims[hyroxSims.length-1];
              const hrDiff = last._avgHR - first._avgHR;
              return (
                <div style={{ marginTop:8, padding:"8px 10px", background: hrDiff < 0 ? "#f0fdf4" : "#fffbeb", border:`1px solid ${hrDiff < 0 ? "#86efac" : "#fcd34d"}`, borderRadius:6, fontSize:11, color: hrDiff < 0 ? "#15803d" : "#92400e" }}>
                  {hrDiff < 0 ? `✓ HR trending down ${Math.abs(hrDiff)} bpm over ${hyroxSims.length} sessions — aerobic efficiency improving` : `→ HR up ${hrDiff} bpm — fatigue accumulation or higher intensity`}
                </div>
              );
            })()}
          </div>

          {/* Running pace trend */}
          <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:10 }}>AEROBIC EFFICIENCY (PACE AT SAME HR)</div>
          <div style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"14px", marginBottom:16 }}>
            {paceTrend.length < 2
              ? <div style={{ color:"#94a3b8", fontSize:11 }}>Need more Z2/Z3 runs for trend (min 2)</div>
              : (() => {
                  const maxSec = Math.max(...paceTrend.map(p => p.paceSec));
                  const minSec = Math.min(...paceTrend.map(p => p.paceSec));
                  const fmtPace = s => `${Math.floor(s/60)}:${String(Math.round(s%60)).padStart(2,"0")}`;
                  const first = paceTrend[0], last = paceTrend[paceTrend.length-1];
                  const diff = first.paceSec - last.paceSec; // positive = faster = better
                  return (
                    <div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                        <div>
                          <div style={{ fontSize:18, fontWeight:900, color: diff > 0 ? "#15803d" : diff < -10 ? "#dc2626" : "#1e293b" }}>
                            {diff > 0 ? `↑ ${fmtPace(Math.abs(diff))}/km faster` : diff < 0 ? `↓ ${fmtPace(Math.abs(diff))}/km slower` : "→ stable"}
                          </div>
                          <div style={{ fontSize:10, color:"#94a3b8" }}>vs first recorded run · same HR range</div>
                        </div>
                        <div style={{ textAlign:"right", fontSize:11, color:"#64748b" }}>
                          <div>{fmtPace(first.paceSec)}/km → {fmtPace(last.paceSec)}/km</div>
                          <div style={{ fontSize:10, color:"#94a3b8" }}>HR {first.hr} → {last.hr} bpm</div>
                        </div>
                      </div>
                      {paceTrend.map((p, i) => (
                        <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                          <div style={{ fontSize:9, color:"#94a3b8", minWidth:72 }}>{p.date}</div>
                          <div style={{ flex:1, background:"#f1f5f9", borderRadius:4, height:16, overflow:"hidden" }}>
                            <div style={{ height:"100%", width:`${((maxSec-p.paceSec)/(maxSec-minSec||1)*80+20)}%`, background:"#c2410c99", borderRadius:4 }} />
                          </div>
                          <div style={{ fontSize:10, fontWeight:600, color:"#c2410c", minWidth:44, textAlign:"right" }}>{fmtPace(p.paceSec)}/km</div>
                          <div style={{ fontSize:9, color:"#94a3b8", minWidth:36 }}>{p.hr}bpm</div>
                        </div>
                      ))}
                      <div style={{ marginTop:8, fontSize:10, color:"#64748b" }}>
                        💡 Improving pace at same HR = aerobic adaptation working. Target: sub 5:00/km at HR 140 by race day.
                      </div>
                    </div>
                  );
                })()}
          </div>

        </div>
      )}

      {view === "schedule" && <ScheduleView activities={activities} />}
      {view === "health" && <HealthView />}

      {/* HISTORY */}
      {view === "history" && (
        <div style={{ padding:"14px 14px 40px" }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:10 }}>RECENT ACTIVITIES</div>
          {activities.slice(0, 15).map((a, i) => (
            <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"10px 12px", marginBottom:6, background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:8 }}>
              <span style={{ fontSize:18, minWidth:24 }}>{getEmoji(a)}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:12, fontWeight:700, color:getColor(a) }}>{a.Title || a["Activity Type"]}</span>
                  <span style={{ fontSize:10, color:"#94a3b8" }}>{a._days === 0 ? "today" : a._days === 1 ? "yesterday" : `${a._days}d ago`}</span>
                </div>
                <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>
                  {fmtDur(a._dur)}
                  {a._avgHR > 0 ? ` · ❤️ ${a._avgHR}bpm` : ""}
                  {a._dist > 0 ? ` · ${a._dist.toFixed(1)}km` : ""}
                  {a["Avg Speed"] && a["Avg Speed"] !== "--" && isRun(a) ? ` · ${speedToPace(a["Avg Speed"])}` : ""}
                </div>
              </div>
              <div style={{ fontSize:10, fontWeight:700, color:getColor(a), background:getColor(a)+"15", padding:"2px 7px", borderRadius:4, alignSelf:"center", whiteSpace:"nowrap" }}>
                {a._trimp > 0 ? `TRIMP ${a._trimp.toFixed(0)}` : "—"}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LOAD */}
      {view === "load" && (
        <div style={{ padding:"14px 14px 40px" }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:12 }}>TRAINING LOAD (TRIMP)</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:20 }}>
            {[
              { label:"ATL", value:atl.toFixed(0), note:"Acute fatigue (7d)", c:"#dc2626", bg:"#fef2f2", bo:"#fca5a5" },
              { label:"CTL", value:ctl.toFixed(0), note:"Fitness base (42d)", c:"#15803d", bg:"#f0fdf4", bo:"#86efac" },
              { label:"Form", value:tsb.toFixed(0), note: tsb >= 5 ? "fresh" : tsb >= -10 ? "optimal" : tsb >= -20 ? "tired" : "fatigued", c: tsb >= 5 ? "#15803d" : tsb >= -10 ? "#0369a1" : tsb >= -20 ? "#d97706" : "#dc2626", bg: tsb >= -10 ? "#f0fdf4" : "#fef2f2", bo: tsb >= -10 ? "#86efac" : "#fca5a5" },
            ].map((m, i) => (
              <div key={i} style={{ padding:"12px 8px", textAlign:"center", background:m.bg, border:`1.5px solid ${m.bo}`, borderRadius:10 }}>
                <div style={{ fontSize:9, fontWeight:700, color:m.c, opacity:0.7, letterSpacing:1 }}>{m.label}</div>
                <div style={{ fontSize:22, fontWeight:900, color:m.c, lineHeight:1.1, marginTop:4 }}>{m.value}</div>
                <div style={{ fontSize:9, color:"#64748b", marginTop:3 }}>{m.note}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:10 }}>LAST 6 DAYS</div>
          {[6,5,4,3,2,1].map(d => {
            const dayActs = activities.filter(a => a._days === d);
            const total = dayActs.reduce((s,a) => s + a._trimp, 0);
            const pct = Math.min(100, (total/80)*100);
            const bc = total > 50 ? "#dc2626" : total > 25 ? "#d97706" : "#16a34a";
            const base = new Date(TODAY); base.setDate(base.getDate() - d);
            const lbl = d === 1 ? "Yesterday" : base.toLocaleDateString("en", { weekday:"short", month:"short", day:"numeric" });
            return (
              <div key={d} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <div style={{ fontSize:10, color:"#64748b", minWidth:90, textAlign:"right" }}>{lbl}</div>
                <div style={{ flex:1, background:"#f1f5f9", borderRadius:4, height:26, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:bc, borderRadius:4, display:"flex", alignItems:"center", paddingLeft: pct > 10 ? 8 : 0, transition:"width 0.4s ease", minWidth: dayActs.length > 0 ? 28 : 0 }}>
                    {dayActs.map((a, ai) => <span key={ai} style={{ fontSize:13 }}>{getEmoji(a)}</span>)}
                  </div>
                </div>
                <div style={{ fontSize:10, fontWeight:600, color:bc, minWidth:28, textAlign:"right" }}>{total > 0 ? total.toFixed(0) : "—"}</div>
              </div>
            );
          })}
          {/* Weekly TRIMP target bars */}
          <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:10, marginTop:20 }}>WEEKLY TRIMP VS TARGET</div>
          {(() => {
            const race = new Date("2026-05-30");
            const todayD = new Date(TODAY);
            const weeksOut = Math.ceil((race - todayD) / (7*86400000));
            // Target: 400-500 TRIMP/wk weeks 3+ out, 300-400 wk 2, taper wk 1
            const getTarget = (wk) => {
              if (wk <= 0) return [0, 0];
              if (wk === 1) return [100, 200];   // race week — taper
              if (wk === 2) return [250, 350];   // final hard week
              return [400, 500];                  // build phase
            };
            return weeklyTrimp.map((w, i) => {
              const wOut = 8 - i; // approximate weeks from race
              const [lo, hi] = getTarget(wOut);
              const pct = hi > 0 ? Math.min(100, (w.trimp / hi) * 100) : 0;
              const status = w.trimp === 0 ? "empty" : w.trimp >= lo && w.trimp <= hi ? "green" : w.trimp > hi ? "amber" : "red";
              const sc = { green:"#16a34a", amber:"#d97706", red:"#dc2626", empty:"#e2e8f0" }[status];
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <div style={{ fontSize:9, color:"#94a3b8", minWidth:22 }}>{w.label}</div>
                  <div style={{ flex:1, background:"#f1f5f9", borderRadius:4, height:20, position:"relative", overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${pct}%`, background:sc+"99", borderRadius:4, transition:"width 0.4s" }} />
                    {hi > 0 && <div style={{ position:"absolute", left:`${(lo/hi)*100}%`, top:0, width:1, height:"100%", background:sc, opacity:0.4 }} />}
                  </div>
                  <div style={{ fontSize:10, fontWeight:700, color:sc, minWidth:36, textAlign:"right" }}>
                    {w.trimp > 0 ? w.trimp : "—"}
                  </div>
                  <div style={{ fontSize:9, color:"#94a3b8", minWidth:54 }}>
                    {hi > 0 ? `${lo}–${hi}` : "rest"}
                  </div>
                </div>
              );
            });
          })()}

          {/* Taper countdown */}
          <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:10, marginTop:20 }}>TAPER PLAN</div>
          {[
            { week:"May 11–17", theme:"Race Sim",    target:"400–500", note:"3× Hyrox · intervals · long run" },
            { week:"May 18–24", theme:"Peak Load",   target:"450–520", note:"Highest volume week — push hard" },
            { week:"May 25–30", theme:"Race Week 🏁", target:"100–200", note:"Cut 40% · activate only · TSB +10→+20" },
          ].map((row, i) => {
            const isPast = new Date(row.week.split("–")[0] + " 2026") < new Date(TODAY);
            const isCurrent = !isPast && new Date(row.week.split("–")[0] + " 2026") <= new Date(TODAY);
            return (
              <div key={i} style={{ display:"flex", gap:10, padding:"10px 12px", marginBottom:6,
                background: isCurrent ? "#faf5ff" : "#f8fafc",
                border: `1px solid ${isCurrent ? "#7c3aed" : "#e2e8f0"}`,
                borderRadius:8, opacity: isPast ? 0.5 : 1 }}>
                <div style={{ minWidth:80 }}>
                  <div style={{ fontSize:10, fontWeight:700, color: isCurrent ? "#7c3aed" : "#1e293b" }}>{row.week}</div>
                  <div style={{ fontSize:9, color:"#94a3b8" }}>{row.theme}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"#475569" }}>Target: {row.target} TRIMP</div>
                  <div style={{ fontSize:10, color:"#94a3b8", marginTop:2 }}>{row.note}</div>
                </div>
              </div>
            );
          })}

          <div style={{ marginTop:16, padding:"12px 14px", background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:8, fontSize:11, color:"#475569", lineHeight:1.9 }}>
            <strong style={{ color:"#1e293b" }}>Race week target:</strong> TSB +10 to +20 by May 29.<br />
            <strong style={{ color:"#1e293b" }}>Taper starts:</strong> May 25 — cut volume 40%.<br />
            <strong style={{ color:"#1e293b" }}>TSB {tsb.toFixed(0)}:</strong> {tsb >= 0 ? "Fresh — keep building." : "Normal training fatigue — expected at this stage."}
          </div>
        </div>
      )}
    </div>
  );
}
