import { useState, useEffect, useRef } from "react";

const HEALTH_DATA = {
  fitnessAge: { bio: 27.8, chrono: 35, bmi: 24.2, rhr: 38, vo2max: 52.9 },
  weight: [
    ["2026-01-13",73.6],["2026-01-17",73.1],["2026-01-20",73.1],["2026-02-12",73.5],["2026-02-15",73.9],["2026-02-24",74.3],["2026-02-28",75.5],["2026-03-04",73.4],["2026-03-08",72.3],["2026-03-12",73.1],["2026-03-16",73.2],["2026-03-19",73.2],["2026-03-22",74.1],["2026-03-23",73.5],["2026-03-24",72.9],["2026-04-16",75.0],["2026-05-12",75.9],["2026-05-17",76.7],
  ],
  vo2max: [
    ["2026-03-09",52],["2026-03-17",53],["2026-03-21",53],["2026-03-24",53],
    ["2026-04-03",54],["2026-04-05",55],["2026-04-11",55],["2026-04-12",56],
    ["2026-04-18",55],["2026-04-19",55],["2026-04-27",55],["2026-04-28",55],
  ],
  daily: [
    {date:"2026-04-14",hrv:116,rhr:44,spo2:97,resp:12.9,sleep_score:null},
    {date:"2026-04-15",hrv:82,rhr:41,spo2:96,resp:12.0,sleep_score:null},
    {date:"2026-04-16",hrv:100,rhr:42,spo2:97,resp:12.3,sleep_score:null},
    {date:"2026-04-17",hrv:96,rhr:41,spo2:98,resp:11.5,sleep_score:null},
    {date:"2026-04-18",hrv:128,rhr:42,spo2:97,resp:13.0,sleep_score:null},
    {date:"2026-04-19",hrv:120,rhr:41,spo2:98,resp:12.6,sleep_score:null},
    {date:"2026-04-20",hrv:105,rhr:44,spo2:97,resp:13.2,sleep_score:null},
    {date:"2026-04-21",hrv:97,rhr:41,spo2:97,resp:12.2,sleep_score:null},
    {date:"2026-04-22",hrv:101,rhr:40,spo2:99,resp:11.0,sleep_score:null},
    {date:"2026-04-23",hrv:80,rhr:42,spo2:97,resp:11.6,sleep_score:null},
    {date:"2026-04-24",hrv:75,rhr:40,spo2:99,resp:11.6,sleep_score:null},
    {date:"2026-04-25",hrv:96,rhr:46,spo2:99,resp:13.8,sleep_score:null},
    {date:"2026-04-26",hrv:114,rhr:42,spo2:100,resp:12.2,sleep_score:null},
    {date:"2026-04-27",hrv:128,rhr:40,spo2:99,resp:12.0,sleep_score:null},
    {date:"2026-04-28",hrv:135,rhr:40,spo2:99,resp:12.0,sleep_score:null},
    {date:"2026-04-29",hrv:140,rhr:40,spo2:96,resp:13.2,sleep_score:null},
    {date:"2026-04-30",hrv:154,rhr:40,spo2:95,resp:8.8,sleep_score:95},
    {date:"2026-05-01",hrv:167,rhr:41,spo2:98,resp:10.6,sleep_score:76},
    {date:"2026-05-02",hrv:176,rhr:40,spo2:98,resp:12.4,sleep_score:83},
    {date:"2026-05-03",hrv:29,rhr:69,spo2:91,resp:16.0,sleep_score:null},
    {date:"2026-05-04",hrv:71,rhr:44,spo2:95,resp:13.0,sleep_score:88},
    {date:"2026-05-05",hrv:90,rhr:40,spo2:94,resp:11.0,sleep_score:88},
    {date:"2026-05-06",hrv:123,rhr:42,spo2:96,resp:12.0,sleep_score:null},
    {date:"2026-05-07",hrv:118,rhr:44,spo2:96,resp:14.0,sleep_score:95},
    {date:"2026-05-08",hrv:109,rhr:43,spo2:94,resp:12.0,sleep_score:95},
    {date:"2026-05-09",hrv:117,rhr:43,spo2:96,resp:12.0,sleep_score:95},
    {date:"2026-05-10",hrv:89,rhr:49,spo2:95,resp:13.0,sleep_score:null},
    {date:"2026-05-11",hrv:127,rhr:43,spo2:93,resp:12.0,sleep_score:88},
    {date:"2026-05-12",hrv:95,rhr:43,spo2:95,resp:12.0,sleep_score:95},
    {date:"2026-05-13",hrv:80,rhr:43,spo2:98,resp:12.0,sleep_score:88},
    {date:"2026-05-18",hrv:111,rhr:43,spo2:96,resp:12.0,sleep_score:95},
    {date:"2026-05-22",hrv:117,rhr:44,spo2:97,resp:12.0,sleep_score:95},
    {date:"2026-05-29",hrv:125,rhr:43,spo2:98,resp:12.0,sleep_score:88},
    {date:"2026-06-01",hrv:120,rhr:43,spo2:95,resp:13.0,sleep_score:null},
    {date:"2026-06-02",hrv:98,rhr:41,spo2:95,resp:11.0,sleep_score:95},
    {date:"2026-06-03",hrv:113,rhr:44,spo2:94,resp:12.0,sleep_score:null},
    {date:"2026-06-04",hrv:102,rhr:45,spo2:98,resp:13.0,sleep_score:null},
    {date:"2026-06-06",hrv:107,rhr:43,spo2:95,resp:12.0,sleep_score:88},
    {date:"2026-06-08",hrv:121,rhr:41,spo2:95,resp:12.0,sleep_score:95},
    {date:"2026-06-10",hrv:92,rhr:42,spo2:97,resp:13.0,sleep_score:null},
    {date:"2026-06-12",hrv:86,rhr:41,spo2:98,resp:12.0,sleep_score:88},
    {date:"2026-06-13",hrv:55,rhr:38,spo2:95,resp:11.0,sleep_score:null},
    {date:"2026-06-14",hrv:115,rhr:41,spo2:93,resp:12.0,sleep_score:75},
    {date:"2026-06-15",hrv:107,rhr:38,spo2:96,resp:11.0,sleep_score:95},
    {date:"2026-06-17",hrv:74,rhr:38,spo2:95,resp:11.0,sleep_score:88},
    {date:"2026-06-19",hrv:122,rhr:38,spo2:93,resp:11.0,sleep_score:95},
    {date:"2026-06-20",hrv:80,rhr:38,spo2:95,resp:11.0,sleep_score:null},
    {date:"2026-06-22",hrv:95,rhr:37,spo2:97,resp:11.0,sleep_score:95},
    {date:"2026-06-23",hrv:48,rhr:38,spo2:95,resp:11.0,sleep_score:null},
    {date:"2026-06-24",hrv:107,rhr:44,spo2:96,resp:13.0,sleep_score:null},
    {date:"2026-06-25",hrv:104,rhr:39,spo2:97,resp:11.0,sleep_score:95},
    {date:"2026-06-26",hrv:65,rhr:39,spo2:97,resp:11.0,sleep_score:null},
    {date:"2026-06-27",hrv:92,rhr:38,spo2:97,resp:11.0,sleep_score:95},
    {date:"2026-06-28",hrv:102,rhr:38,spo2:95,resp:11.0,sleep_score:95},
    {date:"2026-06-30",hrv:117,rhr:39,spo2:96,resp:11.0,sleep_score:95},
    {date:"2026-07-03",hrv:98,rhr:41,spo2:96,resp:12.0,sleep_score:null},
  ],
  sleep: [
    {date:"2026-04-14",deep:111,rem:94,light:259,awake:0},
    {date:"2026-04-15",deep:194,rem:156,light:187,awake:3},
    {date:"2026-04-16",deep:84,rem:123,light:257,awake:1},
    {date:"2026-04-17",deep:146,rem:108,light:213,awake:2},
    {date:"2026-04-18",deep:100,rem:84,light:222,awake:0},
    {date:"2026-04-19",deep:141,rem:109,light:220,awake:1},
    {date:"2026-04-20",deep:92,rem:75,light:270,awake:26},
    {date:"2026-04-21",deep:155,rem:88,light:215,awake:4},
    {date:"2026-04-22",deep:113,rem:80,light:266,awake:1},
    {date:"2026-04-23",deep:110,rem:84,light:218,awake:7},
    {date:"2026-04-24",deep:177,rem:115,light:262,awake:2},
    {date:"2026-04-25",deep:53,rem:16,light:330,awake:9},
    {date:"2026-04-26",deep:97,rem:104,light:291,awake:3},
    {date:"2026-04-27",deep:127,rem:128,light:201,awake:18},
    {date:"2026-04-28",deep:102,rem:152,light:183,awake:0},
    {date:"2026-04-29",deep:124,rem:117,light:208,awake:17},
    {date:"2026-04-30",deep:84,rem:146,light:203,awake:23},
    {date:"2026-05-01",deep:50,rem:58,light:169,awake:69},
    {date:"2026-05-02",deep:132,rem:105,light:195,awake:58},
    {date:"2026-05-04",deep:132,rem:95,light:231,awake:6},
    {date:"2026-05-05",deep:145,rem:127,light:180,awake:1},
    {date:"2026-05-06",deep:71,rem:75,light:283,awake:0},
    {date:"2026-05-07",deep:109,rem:95,light:284,awake:3},
    {date:"2026-05-08",deep:75,rem:115,light:260,awake:0},
    {date:"2026-05-09",deep:113,rem:110,light:274,awake:23},
    {date:"2026-05-10",deep:94,rem:139,light:283,awake:9},
    {date:"2026-05-11",deep:94,rem:95,light:265,awake:4},
    {date:"2026-05-12",deep:143,rem:117,light:207,awake:0},
    {date:"2026-05-13",deep:142,rem:127,light:220,awake:2},
    {date:"2026-05-22",deep:85,rem:97,light:271,awake:2},
    {date:"2026-05-29",deep:114,rem:84,light:262,awake:2},
    {date:"2026-05-31",deep:127,rem:81,light:305,awake:0},
    {date:"2026-06-01",deep:109,rem:35,light:186,awake:7},
    {date:"2026-06-02",deep:108,rem:116,light:239,awake:0},
    {date:"2026-06-03",deep:113,rem:92,light:237,awake:13},
    {date:"2026-06-04",deep:110,rem:127,light:208,awake:13},
    {date:"2026-06-06",deep:137,rem:102,light:235,awake:3},
    {date:"2026-06-08",deep:120,rem:92,light:230,awake:0},
    {date:"2026-06-10",deep:113,rem:99,light:216,awake:2},
    {date:"2026-06-12",deep:117,rem:101,light:279,awake:11},
    {date:"2026-06-13",deep:188,rem:66,light:197,awake:3},
    {date:"2026-06-14",deep:67,rem:49,light:292,awake:2},
    {date:"2026-06-15",deep:108,rem:153,light:276,awake:0},
    {date:"2026-06-17",deep:137,rem:141,light:236,awake:2},
    {date:"2026-06-19",deep:58,rem:100,light:385,awake:1},
    {date:"2026-06-20",deep:181,rem:79,light:150,awake:3},
    {date:"2026-06-22",deep:157,rem:123,light:245,awake:0},
    {date:"2026-06-23",deep:174,rem:81,light:248,awake:8},
    {date:"2026-06-24",deep:65,rem:10,light:325,awake:0},
    {date:"2026-06-25",deep:130,rem:144,light:247,awake:0},
    {date:"2026-06-26",deep:114,rem:102,light:238,awake:15},
    {date:"2026-06-27",deep:132,rem:87,light:229,awake:8},
    {date:"2026-06-28",deep:121,rem:112,light:197,awake:3},
    {date:"2026-06-30",deep:103,rem:95,light:261,awake:8},
    {date:"2026-07-03",deep:180,rem:89,light:223,awake:12},
  ],
};

// ── Hyrox sessions data ───────────────────────────────────────────────────────
// HYROX_DATA holds every Hyrox session: races, sims, and group sessions.
// Keys are Garmin activity IDs (numeric strings) for auto-fetched sessions,
// or "manual-<date>-<slug>" for entries you added by hand.
//
// update.py auto-fills date, name, type, totalTime, avgHR, maxHR, description,
// photos, and laps[] (with role:"run"|"station"|"warmup"|"cooldown") whenever
// an activity name contains "hyrox", "race simulation", or similar Hyrox markers.
//
// Manual fields (NOT touched by update.py once set):
//   estimateMin    — projected race finish ("70–75"); set to null after racing
//   stationNames   — { lap_index: "Ski Erg", ... } map; assign names to station laps
//                    to enable per-station trend comparison across sessions
//   notes          — your free-text notes about prescribed workout, conditions, etc.
//
// On a clean Hyrox sim, laps map 1:1: [run, station, run, station, ...]
// On a race, expect 17 laps (8 runs + 8 stations + 1 final). On a group session,
// it's whatever the coach prescribed — assign stationNames per-session.
const HYROX_DATA = {
"22890762209": {
    date:"2026-05-15", name:"Hyrox group ", type:"group",
    totalTime:3407, avgHR:120, maxHR:165,
    description:``,
    photos:[],
    laps:[{i:1,t:1325,avgHr:95,maxHr:140,dist:705,role:"run"},{i:2,t:203,avgHr:136,maxHr:154,dist:197,role:"station"},{i:3,t:371,avgHr:146,maxHr:163,dist:275,role:"station"},{i:4,t:116,avgHr:114,maxHr:154,dist:41,role:"station"},{i:5,t:575,avgHr:143,maxHr:165,dist:922,role:"run"},{i:6,t:128,avgHr:111,maxHr:150,dist:34,role:"station"},{i:7,t:554,avgHr:137,maxHr:151,dist:280,role:"station"},{i:8,t:135,avgHr:120,maxHr:148,dist:130,role:"station"}],
  },
"manual-2026-05-16-baseline": {
    date:"2026-05-16", name:"Hyrox weekend track (Baseline)", type:"sim",
    totalTime:3316, avgHR:161, maxHR:171,
    description:`First baseline Hyrox-style session. Small Ball substituted for Ski Erg.`,
    photos:[],
    laps:[
      {i:1,t:241,role:"run"},  {i:2,t:326,avgHr:158,role:"station"},
      {i:3,t:254,role:"run"},  {i:4,t:75, avgHr:159,role:"station"},
      {i:5,t:253,role:"run"},  {i:6,t:83, avgHr:155,role:"station"},
      {i:7,t:256,role:"run"},  {i:8,t:186,avgHr:159,role:"station"},
      {i:9,t:267,role:"run"},  {i:10,t:71, avgHr:162,role:"station"},
      {i:11,t:265,role:"run"}, {i:12,t:286,avgHr:154,role:"station"},
      {i:13,t:270,role:"run"}, {i:14,t:234,avgHr:159,role:"station"},
      {i:15,t:251,role:"run"},
    ],
    // Manual annotations preserved across update.py runs:
    estimateMin: "70–75",
    stationNames: {
      2: "Small Ball ×150",
      4: "Sled Push 50 m",
      6: "Sled Pull 50 m",
      8: "Burpee Broad Jump 80 m",
      10: "Farmer Walk 160 m",
      12: "Lunges 100 m",
      14: "Wall Balls 100 × 6 kg",
    },
    notes:"Sub for Ski Erg; Farmer/Lunges with 24kg; Wall balls 6kg. First baseline.",
  },
"22897588795": {
    date:"2026-05-16", name:"Hyrox weekend track", type:null,
    totalTime:4840, avgHR:144, maxHR:171,
    description:``,
    photos:[],
    laps:[{i:1,t:1516,avgHr:109,maxHr:142,dist:2051,role:"warmup"},{i:2,t:241,avgHr:155,maxHr:165,dist:1001,role:"run"},{i:3,t:326,avgHr:158,maxHr:163,dist:59,role:"station"},{i:4,t:254,avgHr:164,maxHr:170,dist:992,role:"run"},{i:5,t:75,avgHr:159,maxHr:165,dist:51,role:"station"},{i:6,t:252,avgHr:163,maxHr:167,dist:961,role:"run"},{i:7,t:83,avgHr:155,maxHr:162,dist:119,role:"station"},{i:8,t:256,avgHr:163,maxHr:167,dist:1021,role:"run"},{i:9,t:186,avgHr:159,maxHr:167,dist:57,role:"station"},{i:10,t:267,avgHr:165,maxHr:171,dist:1053,role:"run"},{i:11,t:71,avgHr:162,maxHr:171,dist:187,role:"station"},{i:12,t:265,avgHr:164,maxHr:170,dist:1047,role:"run"},{i:13,t:286,avgHr:154,maxHr:164,dist:123,role:"station"},{i:14,t:270,avgHr:161,maxHr:169,dist:947,role:"run"},{i:15,t:234,avgHr:159,maxHr:166,dist:219,role:"station"},{i:16,t:3,avgHr:163,maxHr:166,dist:4,role:"station"},{i:17,t:251,avgHr:165,maxHr:169,dist:955,role:"run"},{i:18,t:5,avgHr:169,maxHr:170,dist:21,role:"station"}],
  },
"22927038722": {
    date:"2026-05-18", name:"Hyrox group", type:"group",
    totalTime:3100, avgHR:138, maxHR:173,
    description:`Warmup
[40 Push ups + 500m run] x2
2min rest
[50 ball slams + 25 BBJ] x2
2min rest
[45m sled push + 450m row] x2
100 WB`,
    photos:[],
    laps:[{i:1,t:879,avgHr:115,maxHr:145,dist:1178,role:"run"},{i:2,t:566,avgHr:135,maxHr:169,dist:1001,role:"run"},{i:3,t:119,avgHr:120,maxHr:169,dist:130,role:"station"},{i:4,t:570,avgHr:156,maxHr:169,dist:162,role:"station"},{i:5,t:123,avgHr:139,maxHr:169,dist:97,role:"station"},{i:6,t:602,avgHr:150,maxHr:167,dist:283,role:"station"},{i:7,t:238,avgHr:165,maxHr:173,dist:191,role:"station"},{i:8,t:1,avgHr:173,maxHr:173,dist:2,role:"station"}],
  },
"22949451743": {
    date:"2026-05-20", name:"Hyrox group", type:"group",
    totalTime:2632, avgHR:141, maxHR:171,
    description:``,
    photos:[],
    laps:[{i:1,t:446,avgHr:123,maxHr:143,dist:465,role:"station"},{i:2,t:81,avgHr:107,maxHr:127,dist:20,role:"station"},{i:3,t:565,avgHr:154,maxHr:169,dist:346,role:"station"},{i:4,t:121,avgHr:121,maxHr:160,dist:58,role:"station"},{i:5,t:563,avgHr:146,maxHr:171,dist:1010,role:"run"},{i:6,t:697,avgHr:149,maxHr:170,dist:296,role:"station"},{i:7,t:22,avgHr:158,maxHr:160,dist:15,role:"station"},{i:8,t:136,avgHr:128,maxHr:152,dist:49,role:"station"}],
  },
"22990829019": {
    date:"2026-05-24", name:"Hyrox sim 800m runs", type:"sim",
    totalTime:3850, avgHR:156, maxHR:170,
    description:``,
    photos:[],
    laps:[{i:1,t:231,avgHr:145,maxHr:156,dist:767,role:"run"},{i:2,t:254,avgHr:148,maxHr:154,dist:72,role:"station"},{i:3,t:214,avgHr:159,maxHr:166,dist:719,role:"run"},{i:4,t:157,avgHr:151,maxHr:164,dist:49,role:"station"},{i:5,t:225,avgHr:158,maxHr:167,dist:738,role:"run"},{i:6,t:236,avgHr:159,maxHr:165,dist:179,role:"station"},{i:7,t:231,avgHr:162,maxHr:168,dist:739,role:"run"},{i:8,t:163,avgHr:162,maxHr:166,dist:20,role:"station"},{i:9,t:124,avgHr:136,maxHr:166,dist:44,role:"station"},{i:10,t:222,avgHr:157,maxHr:169,dist:749,role:"run"},{i:11,t:286,avgHr:155,maxHr:163,dist:152,role:"station"},{i:12,t:250,avgHr:162,maxHr:165,dist:738,role:"run"},{i:13,t:147,avgHr:159,maxHr:165,dist:299,role:"station"},{i:14,t:237,avgHr:161,maxHr:165,dist:734,role:"run"},{i:15,t:337,avgHr:152,maxHr:164,dist:201,role:"station"},{i:16,t:235,avgHr:162,maxHr:170,dist:724,role:"run"},{i:17,t:302,avgHr:160,maxHr:169,dist:319,role:"station"}],
  },
"23064789093": {
    date:"2026-05-30", name:"Hyrox race Riga 1:14:56", type:"race",
    totalTime:4506, avgHR:161, maxHR:177,
    description:``,
    photos:[],
    laps:[{i:1,t:330,avgHr:162,maxHr:170,dist:1234,role:"run"},{i:2,t:322,avgHr:167,maxHr:171,dist:223,role:"station"},{i:3,t:272,avgHr:165,maxHr:169,dist:977,role:"run"},{i:4,t:156,avgHr:166,maxHr:175,dist:153,role:"station"},{i:5,t:302,avgHr:165,maxHr:175,dist:1008,role:"run"},{i:6,t:269,avgHr:170,maxHr:177,dist:231,role:"station"},{i:7,t:276,avgHr:165,maxHr:170,dist:948,role:"run"},{i:8,t:381,avgHr:161,maxHr:170,dist:92,role:"station"},{i:9,t:316,avgHr:156,maxHr:163,dist:991,role:"run"},{i:10,t:294,avgHr:152,maxHr:160,dist:165,role:"station"},{i:11,t:303,avgHr:156,maxHr:162,dist:969,role:"run"},{i:12,t:17,avgHr:153,maxHr:155,dist:25,role:"station"},{i:13,t:134,avgHr:160,maxHr:170,dist:265,role:"station"},{i:14,t:287,avgHr:157,maxHr:161,dist:966,role:"run"},{i:15,t:327,avgHr:158,maxHr:165,dist:299,role:"station"},{i:16,t:266,avgHr:159,maxHr:162,dist:895,role:"run"},{i:17,t:252,avgHr:162,maxHr:174,dist:287,role:"station"},{i:18,t:4,avgHr:172,maxHr:173,dist:19,role:"station"}],
      stationNames: {
    2:"Ski Erg 1000 m", 4:"Sled Push 50 m", 6:"Sled Pull 50 m",
    8:"Burpee Broad Jump 80 m", 10:"Row 1000 m", 12:"Farmers Carry 200 m",
    15:"Sandbag Lunge 100 m", 17:"Wall Balls 100",
  },
    official: {
    finishTime: 4496,                       // 74:56
    roxzone: { time: 318, rank: 355 },      // 5:18
    runs: [
      { time: 327, rank: 296 },   // R1 5:27
      { time: 273, rank: 200 },   // R2 4:33
      { time: 282, rank: 151 },   // R3 4:42
      { time: 277, rank: 142 },   // R4 4:37
      { time: 309, rank: 298 },   // R5 5:09
      { time: 303, rank: 278 },   // R6 5:03
      { time: 289, rank: 227 },   // R7 4:49
      { time: 270, rank: 158 },   // R8 4:30
    ],
    stations: [
      { name: "Ski Erg 1000 m",        time: 279, rank: 535 },  // 4:39
      { name: "Sled Push 50 m",        time: 136, rank: 124 },  // 2:16
      { name: "Sled Pull 50 m",        time: 248, rank: 358 },  // 4:08
      { name: "Burpee Broad Jump 80 m",time: 321, rank: 393 },  // 5:21
      { name: "Row 1000 m",            time: 283, rank: 447 },  // 4:43
      { name: "Farmers Carry 200 m",   time: 88,  rank: 27  },  // 1:28
      { name: "Sandbag Lunge 100 m",   time: 254, rank: 173 },  // 4:14
      { name: "Wall Balls 100",        time: 246, rank: 37  },  // 4:06
    ],
  },
  },
"23140613577": {
    date:"2026-06-05", name:"Hyrox group ", type:"group",
    totalTime:2706, avgHR:137, maxHR:167,
    description:``,
    photos:[],
    laps:[{i:1,t:390,avgHr:117,maxHr:139,dist:381,role:"station"},{i:2,t:580,avgHr:151,maxHr:167,dist:565,role:"run"},{i:3,t:151,avgHr:118,maxHr:163,dist:66,role:"station"},{i:4,t:545,avgHr:148,maxHr:167,dist:1012,role:"run"},{i:5,t:124,avgHr:119,maxHr:167,dist:60,role:"station"},{i:6,t:559,avgHr:132,maxHr:153,dist:312,role:"station"},{i:7,t:88,avgHr:119,maxHr:131,dist:37,role:"station"},{i:8,t:270,avgHr:151,maxHr:164,dist:252,role:"station"}],
  },
"23201427511": {
    date:"2026-06-10", name:"Hyrox group", type:"group",
    totalTime:2736, avgHR:136, maxHR:168,
    description:``,
    photos:[],
    laps:[{i:1,t:698,avgHr:110,maxHr:140,dist:585,role:"run"},{i:2,t:567,avgHr:152,maxHr:168,dist:1055,role:"run"},{i:3,t:683,avgHr:140,maxHr:165,dist:269,role:"station"},{i:4,t:703,avgHr:146,maxHr:165,dist:331,role:"station"},{i:5,t:85,avgHr:128,maxHr:160,dist:101,role:"station"}],
  },
"23259452744": {
    date:"2026-06-15", name:"Hyrox group", type:"group",
    totalTime:2801, avgHR:135, maxHR:167,
    description:``,
    photos:[],
    laps:[{i:1,t:471,avgHr:111,maxHr:137,dist:522,role:"run"},{i:2,t:572,avgHr:125,maxHr:165,dist:936,role:"run"},{i:3,t:263,avgHr:128,maxHr:164,dist:136,role:"station"},{i:4,t:282,avgHr:146,maxHr:155,dist:202,role:"station"},{i:5,t:145,avgHr:146,maxHr:158,dist:53,role:"station"},{i:6,t:146,avgHr:120,maxHr:158,dist:57,role:"station"},{i:7,t:266,avgHr:156,maxHr:167,dist:127,role:"station"},{i:8,t:127,avgHr:151,maxHr:159,dist:49,role:"station"},{i:9,t:165,avgHr:155,maxHr:165,dist:57,role:"station"},{i:10,t:364,avgHr:147,maxHr:167,dist:282,role:"station"}],
  },
"23284660742": {
    date:"2026-06-17", name:"Hyrox group ", type:"group",
    totalTime:2536, avgHR:118, maxHR:159,
    description:``,
    photos:[],
    laps:[{i:1,t:584,avgHr:100,maxHr:122,dist:498,role:"station"},{i:2,t:565,avgHr:112,maxHr:154,dist:852,role:"run"},{i:3,t:120,avgHr:100,maxHr:151,dist:39,role:"station"},{i:4,t:548,avgHr:134,maxHr:157,dist:256,role:"station"},{i:5,t:146,avgHr:111,maxHr:155,dist:66,role:"station"},{i:6,t:573,avgHr:133,maxHr:159,dist:164,role:"station"}],
  },
"23307246989": {
    date:"2026-06-19", name:"Hyrox group ", type:"group",
    totalTime:2766, avgHR:132, maxHR:169,
    description:``,
    photos:[],
    laps:[{i:1,t:701,avgHr:104,maxHr:132,dist:637,role:"run"},{i:2,t:558,avgHr:150,maxHr:165,dist:339,role:"station"},{i:3,t:129,avgHr:107,maxHr:157,dist:25,role:"station"},{i:4,t:539,avgHr:154,maxHr:169,dist:1178,role:"run"},{i:5,t:422,avgHr:126,maxHr:167,dist:241,role:"station"},{i:6,t:287,avgHr:134,maxHr:157,dist:124,role:"station"},{i:7,t:130,avgHr:152,maxHr:161,dist:31,role:"station"}],
  },
};

// ── Canonical Hyrox station catalog (for plan generation + station matching) ──
// Use these exact names when assigning stationNames so trend matching works.
const HYROX_STATIONS = [
  "Ski Erg 1000 m",
  "Sled Push 50 m",
  "Sled Pull 50 m",
  "Burpee Broad Jump 80 m",
  "Rowing 1000 m",
  "Farmer Walk 200 m",
  "Lunges 100 m",
  "Wall Balls 100",
];


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
"Tennis V2","2026-06-28 08:14:05","false","Sparring 🎾Povilas ","1,45","1104","02:48:12","104","160","2,1","28","--","115:44","--","--","--","--","--","--","30,89","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:22:09","02:52:56","--","--"
"Strength Training","2026-06-27 18:29:43","false","Strength","0,00","39","00:08:43","80","115","0,1","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:08:43","00:08:43","--","--"
"Cycling","2026-06-27 18:12:12","false","Indoor Cycling","0,00","114","00:10:01","126","136","1,4","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:10:01","00:10:01","--","--"
"Indoor Rowing","2026-06-27 17:13:45","false","Indoor Rowing","0,00","353","00:54:12","124","165","2,2","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","13","--","--","--","--","--","00:54:12","00:54:12","--","--"
"Tennis V2","2026-06-27 08:08:27","false","Povilas🎾training","1,12","862","02:07:50","105","147","2,0","29","--","114:09","--","--","--","--","--","--","30,38","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:17:54","02:07:50","--","--"
"Tennis V2","2026-06-26 12:57:51","false","Tennis training","0,32","475","01:02:55","108","154","2,1","18","--","198:24","--","--","--","--","--","--","27,78","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:05:35","01:02:55","--","--"
"Tennis V2","2026-06-25 10:07:00","false","Tennis training","0,18","560","01:12:23","107","155","2,1","11","--","406:30","--","--","--","--","--","--","22,31","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:03:20","01:12:23","--","--"
"Tennis V2","2026-06-24 16:46:31","false","Tennis training ","4,54","516","01:36:49","97","141","0,7","74","--","21:20","--","--","--","--","--","--","63,25","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","01:05:08","01:36:49","--","--"
"Running","2026-06-23 11:58:41","false","Threshold 3x blocks ","6,67","433","00:28:57","143","161","3,0","181","--","4:20","--","--","--","46","22","--","127,12","5,7","7,5","258","--","--","--","--","--","--","--","--","--","No","--","2","--","--","--","--","--","00:28:56","00:51:28","--","--"
"Treadmill Running","2026-06-19 17:51:52","false","30min Z2 under fatigue ","5,82","385","00:30:10","134","140","2,4","178","--","5:11","--","--","--","--","--","--","111,87","6,4","7,4","263","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:30:10","00:30:10","--","--"
"Indoor Running","2026-06-19 17:00:03","false","Hyrox group ","2,57","521","00:46:06","132","169","3,1","71","--","17:54","--","--","--","--","--","--","69,95","12,2","8,6","415","--","--","--","--","--","--","--","--","--","No","--","7","--","--","--","--","--","00:29:16","00:49:27","--","--"
"Tennis V2","2026-07-02 13:16:57","false","Tennis","0,23","188","00:42:10","93","130","0,4","18","--","181:09","--","--","--","--","--","--","31,21","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:03:39","00:42:10","--","--"
"Running","2026-07-02 09:00:13","false","Palanga Running","5,47","368","00:35:41","104","136","1,7","170","--","6:31","--","--","--","14","7","--","90,60","7,9","7,2","287","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:35:39","00:41:15","--","--"
"Tennis V2","2026-07-01 08:16:22","false","Tennis","5,22","413","02:05:38","101","151","0,5","66","--","24:03","--","--","--","--","--","--","62,56","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","01:13:19","02:05:38","--","--"
"Tennis V2","2026-06-30 12:45:30","false","Tennis","0,98","735","01:39:25","124","176","2,2","30","--","101:37","--","--","--","--","--","--","32,69","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:15:29","01:39:25","--","--"
"Tennis V2","2026-06-30 11:05:44","false","Tennis","0,30","690","01:05:33","125","203","3,0","18","--","216:27","--","--","--","--","--","--","25,17","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:05:25","01:05:33","--","--"
"Cycling","2026-06-29 10:57:45","false","Palanga Cycling","2,37","38","00:09:34","76","90","0,1","--","--","4:02","--","--","--","3","4","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:09:27","00:09:54","--","--"
"Strength Training","2026-06-29 09:19:55","false","Upper body strength ","0,00","339","00:38:34","111","157","2,1","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:38:34","00:38:34","--","--"
"Cycling","2026-06-29 08:43:17","false","Palanga Cycling","7,09","125","00:24:05","91","106","0,3","--","--","3:23","--","--","--","22","11","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:23:56","00:24:43","--","--"
"Strength Training","2026-06-22 09:00:28","false","Strength","0,00","104","00:30:45","75","111","0,1","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:30:45","01:06:09","--","--"
"Cycling","2026-06-21 18:14:04","false","Vilnius Cycling","7,59","112","00:33:22","76","101","0,1","--","--","4:23","--","--","--","34","38","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:30:33","01:41:52","--","--"
"Tennis V2","2026-06-21 14:02:41","false","Tennis","0,86","997","01:46:54","123","160","2,8","28","--","124:22","--","--","--","--","--","--","28,42","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:12:42","01:46:54","--","--"
"Running","2026-06-21 10:01:43","false","Recovery w/ Andrius","7,51","514","00:48:12","109","125","2,2","168","--","6:25","--","--","--","44","45","--","93,03","8,1","7,7","288","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:48:10","00:48:16","--","--"
"Cycling","2026-06-18 21:33:53","false","Vilnius Cycling","2,63","48","00:10:29","83","99","0,1","--","--","3:59","--","--","--","24","22","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:10:09","00:30:39","--","--"
"Cycling","2026-06-18 17:44:41","false","Vilnius Cycling","1,41","32","00:06:43","84","114","0,1","--","--","4:46","--","--","--","8","13","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:04:22","00:06:43","--","--"
"Tennis V2","2026-06-18 16:05:37","false","Artūras Bartkus🎾 6/3 6/2","0,72","634","01:30:20","106","150","1,9","26","--","124:22","--","--","--","--","--","--","30,58","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:11:05","01:30:20","--","--"
"Cycling","2026-06-18 15:55:15","false","Vilnius Cycling","1,69","44","00:04:48","112","128","0,3","--","--","2:51","--","--","--","10","23","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:04:33","00:05:08","--","--"
"Tennis V2","2026-06-18 12:30:52","false","Tennis training ","0,31","408","01:27:12","89","134","0,6","16","--","282:29","--","--","--","--","--","--","21,44","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:05:11","01:27:12","--","--"
"Other","2026-06-17 18:55:16","false","Sauna","0,00","66","00:15:37","87","230","0,2","1","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:15:37","00:15:37","--","--"
"Indoor Running","2026-06-17 18:01:17","false","Hyrox group ","1,87","414","00:42:16","118","159","2,3","63","--","22:33","--","--","--","--","--","--","70,00","13,0","9,2","504","--","--","--","--","--","--","--","--","--","No","--","6","--","--","--","--","--","00:23:43","00:46:43","--","--"
"Strength Training","2026-06-17 09:17:29","false","Strength","0,00","121","00:36:23","78","129","0,1","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:36:23","00:36:23","--","--"
"Tennis V2","2026-06-16 10:21:55","false","Tennis","0,30","420","01:51:12","80","124","0,2","12","--","370:22","--","--","--","--","--","--","22,68","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:05:00","01:51:12","--","--"
"Indoor Running","2026-06-15 18:59:55","false","Hyrox group","2,42","569","00:46:41","135","167","3,1","68","--","19:17","--","--","--","--","--","--","68,54","10,6","8,0","445","--","--","--","--","--","--","--","--","--","No","--","10","--","--","--","--","--","00:30:35","00:50:55","--","--"
"Running","2026-06-15 10:03:22","false","Vilnius - Changing Tempo 6x1500","13,17","934","01:07:09","142","168","3,8","168","--","5:05","--","--","--","36","39","--","114,06","6,4","7,4","256","--","--","--","--","--","--","--","--","--","No","--","26","--","--","--","--","--","01:07:01","01:07:09","--","--"
"Tennis V2","2026-06-14 19:00:44","false","Tennis","0,85","508","01:14:33","107","146","1,6","33","--","88:11","--","--","--","--","--","--","34,59","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:11:56","01:14:33","--","--"
"Cycling","2026-06-14 14:28:23","false","Vilnius Cycling","8,88","139","00:38:33","77","105","0,1","--","--","4:20","--","--","--","77","73","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:37:14","01:04:38","--","--"
"Running","2026-06-14 09:41:12","false","Recovery 30min","5,46","367","00:30:00","122","132","2,2","175","--","5:29","--","--","--","20","16","--","104,07","6,9","7,4","273","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:30:00","00:30:00","--","--"
"Cycling","2026-06-13 22:06:26","false","Vilnius Cycling","7,33","179","00:26:00","101","120","0,6","--","--","3:32","--","--","--","50","41","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:24:37","00:26:49","--","--"
"Cycling","2026-06-13 19:44:45","false","Vilnius Cycling","5,27","138","00:18:21","104","128","0,7","--","--","3:29","--","--","--","34","43","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:17:53","00:48:52","--","--"
"Other","2026-06-13 13:52:30","false","Sauna","0,00","79","00:14:56","89","143","0,2","15","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:14:56","00:14:56","--","--"
"Trail Running","2026-06-13 11:32:50","false","Marijampolis Trail Running","10,12","1110","01:30:36","139","170","3,5","106","--","8:57","--","--","--","212","204","--","100,01","8,8","8,5","278","--","--","--","--","--","--","--","--","--","No","--","11","--","--","--","--","--","01:11:28","01:30:36","--","--"
"Cycling","2026-06-12 17:18:10","false","Vilnius Cycling","3,08","66","00:12:10","88","113","0,2","--","--","3:57","--","--","--","11","35","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:09:29","00:27:19","--","--"
"Cycling","2026-06-12 10:41:34","false","Vilnius Cycling","3,29","110","00:14:16","103","125","0,6","--","--","4:20","--","--","--","55","14","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:13:51","00:15:26","--","--"
"Other","2026-06-11 20:08:56","false","Sauna","0,00","76","00:14:09","95","230","0,3","4","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:14:09","00:14:09","--","--"
"Tennis V2","2026-06-11 18:02:52","false","Šarūnas Babkauskas 6/7(3) 2/6","3,99","836","01:43:23","119","156","2,4","63","--","25:55","--","--","--","--","--","--","61,54","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:53:47","01:43:23","--","--"
"Cycling","2026-06-11 08:40:24","false","Vilnius Cycling","6,81","165","00:26:02","96","126","0,6","--","--","3:49","--","--","--","65","58","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:24:25","06:37:35","--","--"
"Other","2026-06-10 19:10:33","false","Sauna","0,00","76","00:18:05","82","230","0,2","2","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:18:05","00:18:05","--","--"
"Indoor Running","2026-06-10 18:01:00","false","Indoor Running","2,34","569","00:45:35","136","168","3,1","67","--","19:28","--","--","--","--","--","--","77,35","11,8","11,8","497","--","--","--","--","--","--","--","--","--","No","--","5","--","--","--","--","--","00:28:59","00:48:39","--","--"
"Cycling","2026-06-10 12:42:23","false","Vilnius Cycling","6,57","175","00:21:54","105","127","0,7","--","--","3:20","--","--","--","58","59","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:21:18","04:43:01","--","--"
"Running","2026-06-10 08:35:56","false","Vilnius - 5. 10x400m Speed","7,74","604","00:40:35","148","175","3,5","162","--","5:14","--","--","--","24","24","--","115,31","7,2","8,0","229","--","--","--","--","--","--","--","--","--","No","--","22","--","--","--","--","--","00:40:21","00:40:35","--","--"
"Cycling","2026-06-07 18:19:25","false","Vilnius Cycling","7,83","163","00:22:20","101","122","0,6","--","--","2:51","--","--","--","42","57","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:22:08","00:22:48","--","--"
"Strength Training","2026-06-07 17:05:09","false","Strength","0,00","113","00:08:49","128","158","1,6","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:08:49","00:08:49","--","--"
"Cycling","2026-06-07 12:10:55","false","Vilnius Cycling","7,80","195","00:29:29","96","130","0,9","--","--","3:47","--","--","--","70","38","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:29:14","03:03:01","--","--"
"Other","2026-06-07 10:10:09","false","Sauna","0,00","294","01:33:55","73","127","0,2","1","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","3","--","--","--","--","--","01:33:55","01:33:55","--","--"
"Running","2026-06-07 08:11:48","false","Vilnius Running","11,08","781","01:00:18","125","143","3,0","174","--","5:26","--","--","--","44","42","--","104,98","8,1","8,6","255","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","01:00:18","01:00:30","--","--"
"Cycling","2026-06-07 07:47:57","false","Vilnius Cycling","4,50","114","00:11:40","113","127","0,9","--","--","2:35","--","--","--","28","24","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:11:36","00:12:59","--","--"
"Cycling","2026-06-06 17:56:36","false","Vilnius Cycling","10,96","154","00:48:35","74","97","0,1","--","--","4:26","--","--","--","73","76","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:46:47","00:50:07","--","--"
"Tennis V2","2026-06-09 10:43:22","false","Tennis","0,27","375","01:05:52","94","137","0,7","13","--","238:05","--","--","--","--","--","--","32,38","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:03:45","01:05:52","--","--"
"Indoor Running","2026-06-08 19:08:10","false","Indoor Running","2,10","525","00:37:45","144","175","3,3","69","--","17:57","--","--","--","--","--","--","67,94","9,9","9,7","441","--","--","--","--","--","--","--","--","--","No","--","4","--","--","--","--","--","00:24:59","00:42:23","--","--"
"Tennis V2","2026-06-08 09:32:39","false","Tennis","1,04","974","02:00:17","113","168","2,5","26","--","114:56","--","--","--","--","--","--","32,86","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:13:35","02:00:17","--","--"
"Other","2026-06-05 18:19:23","false","Sauna","0,00","97","00:22:19","82","110","0,2","0","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:22:19","00:22:19","--","--"
"Indoor Running","2026-06-05 17:03:27","false","Indoor Running","2,68","558","00:45:05","137","167","3,0","75","--","16:48","--","--","--","--","--","--","70,27","10,9","7,1","398","--","--","--","--","--","--","--","--","--","No","--","8","--","--","--","--","--","00:30:27","00:48:53","--","--"
"Cycling","2026-06-05 10:53:21","false","Vilnius Cycling","5,02","147","00:18:47","103","128","0,8","--","--","3:44","--","--","--","50","53","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:17:44","00:53:11","--","--"
"Running","2026-06-05 09:04:08","false","Z2 50min","9,31","670","00:51:16","131","147","2,9","177","--","5:30","--","--","--","40","41","--","102,60","6,9","7,2","274","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:51:16","00:51:51","--","--"
"Running","2026-06-03 17:28:58","false","Amsterdam Running","11,04","839","00:54:48","147","162","3,8","175","--","4:57","--","--","--","55","60","--","116,21","7,3","8,4","235","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:53:29","00:56:39","--","--"
"Strength Training","2026-06-02 21:04:12","false","Strength","0,00","256","00:50:14","89","130","0,5","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:50:14","00:50:14","--","--"
"Indoor Cardio","2026-06-01 19:31:14","false","Cardio","0,00","641","01:14:16","115","168","2,3","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","9","--","--","--","--","--","01:14:16","01:14:16","--","--"
"Running","2026-05-31 17:39:45","false","Recovery 30min","5,54","397","00:33:56","121","134","2,1","173","--","6:07","--","--","--","21","20","--","94,17","7,2","6,9","289","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:33:56","00:33:56","--","--"
"Yoga","2026-05-30 11:36:06","false","Yoga","0,00","19","00:02:01","110","119","0,1","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:02:01","00:02:01","--","--"
"Indoor Running","2026-05-30 10:10:06","false","Hyrox race Riga 1:14:56","9,75","1223","01:15:06","161","177","4,9","123","--","7:42","--","--","--","--","--","--","105,60","8,5","8,1","327","--","--","--","--","--","--","--","--","--","No","--","18","--","--","--","--","--","01:03:14","01:15:06","--","--"
"Yoga","2026-05-30 09:40:07","false","Yoga","0,00","215","00:19:25","124","161","2,0","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:19:25","00:19:25","--","--"
"Cycling","2026-05-29 08:30:39","false","Vilnius Cycling","5,74","152","00:24:47","93","125","0,5","--","--","4:19","--","--","--","50","49","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:20:58","01:12:13","--","--"
"Strength Training","2026-05-28 17:26:30","false","Strength","0,00","128","00:19:21","96","134","0,6","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:19:21","00:19:21","--","--"
"Cycling","2026-05-28 08:45:39","false","Vilnius Cycling","6,62","195","00:23:08","106","128","0,9","--","--","3:29","--","--","--","79","77","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:20:51","06:09:56","--","--"
"Running","2026-05-26 18:52:09","false","Z2 20min + 3x30s strides","5,00","354","00:25:27","136","164","2,7","176","--","5:05","--","--","--","25","19","--","110,80","6,3","7,2","275","--","--","--","--","--","--","--","--","--","No","--","9","--","--","--","--","--","00:25:25","00:25:27","--","--"
"Cycling","2026-05-26 12:48:20","false","Vilnius Cycling","7,06","189","00:24:11","105","129","0,8","--","--","3:25","--","--","--","80","82","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:23:37","05:24:26","--","--"
"Tennis V2","2026-05-25 19:09:38","false","Tennis","0,49","421","00:52:46","112","155","1,8","28","--","107:31","--","--","--","--","--","--","33,85","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:06:49","00:52:46","--","--"
"Cycling","2026-05-24 10:16:41","false","Indoor Cycling","7,70","175","00:20:02","111","121","0,9","--","--","2:36","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:20:02","00:20:02","--","--"
"Indoor Running","2026-05-24 09:04:33","false","Hyrox sim 800m runs","8,24","993","01:04:10","156","170","4,3","117","--","7:47","--","--","--","--","--","--","88,51","10,6","8,3","342","--","--","--","--","--","--","--","--","--","No","--","17","--","--","--","--","--","00:52:35","01:04:10","--","--"
"Cycling","2026-05-23 20:29:49","false","Vilnius Cycling","3,65","116","00:15:20","102","127","0,6","--","--","4:12","--","--","--","55","52","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:13:35","00:38:40","--","--"
"Inline Skating","2026-05-23 15:33:58","false","Vilnius Inline Skating","9,62","304","00:46:08","99","163","0,7","--","--","4:47","--","--","--","51","49","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:42:02","01:00:42","--","--"
"Running","2026-05-22 20:08:20","false","Z2 45min","8,75","603","00:44:15","136","148","3,1","177","--","5:03","--","--","--","36","38","--","111,46","6,0","6,9","274","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:44:15","00:44:15","--","--"
"Cycling","2026-05-22 17:35:41","false","Vilnius Cycling","6,14","161","00:20:23","105","129","0,7","--","--","3:19","--","--","--","65","68","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:18:41","00:37:36","--","--"
"Tennis V2","2026-05-21 19:29:45","false","Tennis","0,80","595","01:22:10","112","157","2,1","27","--","103:31","--","--","--","--","--","--","35,25","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:10:21","01:22:10","--","--"
"Cycling","2026-05-21 08:47:05","false","Vilnius Cycling","6,85","194","00:23:31","106","134","1,2","--","--","3:25","--","--","--","60","61","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:21:23","09:26:16","--","--"
"Indoor Running","2026-05-20 18:02:07","false","Hyrox group","2,26","547","00:43:51","141","171","3,1","66","--","19:24","--","--","--","--","--","--","75,50","12,4","8,8","444","--","--","--","--","--","--","--","--","--","No","--","8","--","--","--","--","--","00:26:34","00:47:53","--","--"
"Cycling","2026-05-20 11:09:09","false","Vilnius Cycling","5,90","152","00:19:37","104","135","1,3","--","--","3:19","--","--","--","68","61","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:19:01","06:03:54","--","--"
"Tennis V2","2026-05-20 09:30:18","false","Tennis","0,92","798","01:29:41","121","163","2,5","29","--","97:27","--","--","--","--","--","--","35,41","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:12:46","01:29:41","--","--"
"Cycling","2026-05-20 09:04:22","false","Vilnius Cycling","5,50","154","00:17:01","113","135","1,3","--","--","3:05","--","--","--","46","52","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:16:14","00:18:17","--","--"
"Other","2026-05-19 19:39:30","false","Sauna","0,00","103","00:16:00","96","121","0,4","6","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:16:00","00:16:00","--","--"
"Tennis V2","2026-05-19 18:31:45","false","Tennis","0,50","444","01:00:00","109","145","1,9","26","--","119:54","--","--","--","--","--","--","31,75","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:06:39","01:00:00","--","--"
"Other","2026-05-18 20:15:53","false","Sauna","0,00","69","00:15:07","83","101","0,1","0","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:15:07","00:15:07","--","--"
"Indoor Running","2026-05-18 18:56:00","false","Indoor Running","3,04","642","00:51:40","138","173","3,4","73","--","16:58","--","--","--","--","--","--","81,90","11,8","9,9","478","--","--","--","--","--","--","--","--","--","No","--","8","--","--","--","--","--","00:32:39","00:52:53","--","--"
"Other","2026-05-17 19:11:39","false","Sauna","0,00","200","00:57:09","77","195","0,4","3","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","3","--","--","--","--","--","00:57:09","00:57:09","--","--"
"Cycling","2026-05-17 15:26:27","false","Vilnius Cycling","32,33","753","01:15:42","109","132","2,5","--","--","2:20","--","--","--","267","267","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","01:14:44","01:17:14","--","--"
"Indoor Running","2026-05-15 16:54:59","false","Hyrox group ","2,58","536","00:56:46","120","165","2,8","65","--","21:57","--","--","--","--","--","--","69,99","11,2","7,2","431","--","--","--","--","--","--","--","--","--","No","--","8","--","--","--","--","--","00:32:07","00:56:46","--","--"
"Tennis V2","2026-05-15 08:57:57","false","Tennis","0,40","313","01:01:48","92","144","0,6","17","--","155:45","--","--","--","--","--","--","36,89","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:05:23","01:01:48","--","--"
"Cycling","2026-05-14 08:44:28","false","Vilnius Cycling","19,78","354","01:23:42","81","127","0,9","--","--","4:13","--","--","--","127","118","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","01:17:32","09:12:46","--","--"
"Tennis V2","2026-05-13 19:08:23","false","Tennis","0,60","588","01:11:19","117","155","2,2","25","--","119:02","--","--","--","--","--","--","34,12","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:08:26","01:11:19","--","--"
"Cycling","2026-05-13 10:08:32","false","Vilnius Cycling","7,08","193","00:24:29","106","135","1,2","--","--","3:27","--","--","--","55","51","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:22:35","07:17:03","--","--"
"Inline Skating","2026-05-17 11:59:45","false","Vilnius Inline Skating","4,59","140","00:20:12","102","186","0,6","--","--","4:24","--","--","--","17","16","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:20:12","00:20:12","--","--"
"Cycling","2026-05-16 11:57:57","false","Vilnius Cycling","1,87","62","00:09:54","96","184","0,2","--","--","5:17","--","--","--","3","28","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:05:03","00:09:54","--","--"
"Indoor Running","2026-05-16 10:00:30","false","Hyrox weekend track","10,87","1061","01:20:39","144","171","4,5","119","--","7:25","--","--","--","--","--","--","108,84","6,8","7,6","316","--","--","--","--","--","--","--","--","--","No","--","18","--","--","--","--","--","01:00:57","01:20:54","--","--"
"Cycling","2026-05-16 09:48:13","false","Vilnius Cycling","1,55","63","00:06:28","112","134","0,7","--","--","4:09","--","--","--","36","4","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:06:23","00:07:52","--","--"
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

const TODAY = "2026-07-03";
// LAST_RUN: when update.py last attempted a sync (any outcome). LAST_DATA: when fresh Garmin data was last ingested. Both ISO UTC, written by update.py.
const LAST_RUN  = "2026-07-03T12:08:00Z";
const LAST_DATA = "2026-07-03T12:04:00Z";

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

function fmtMMSS(s) {
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
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
  { week:4, label:"May 18–24", theme:"Peak Load — Last Hard Week", days:[
    { date:"2026-05-18", dow:"MON", label:"May 18", sessions:[{type:"rest",text:"Rest / 20min easy walk · HRV 111ms ✓"},{type:"hyrox",text:"Hyrox group · evening",cal:true}] },
    { date:"2026-05-19", dow:"TUE", label:"May 19", sessions:[{type:"tennis",text:"Tennis sparring · 1h · evening · light intensity",cal:true}] },
    { date:"2026-05-20", dow:"WED", label:"May 20", sessions:[{type:"tennis",text:"Tennis match 🎾 · 1.5h · morning",cal:true},{type:"hyrox",text:"Hyrox group · evening",cal:true}] },
    { date:"2026-05-21", dow:"THU", label:"May 21", sessions:[{type:"plan",text:"Z2 run · 50min · HR 125–142 · aerobic top-up. Skip if HRV <85ms"}] },
    { date:"2026-05-22", dow:"FRI", label:"May 22", sessions:[{type:"plan",text:"Strength 40min · sled push, wall ball form, lunges · 60-70% load · neuro priming"}] },
    { date:"2026-05-23", dow:"SAT", label:"May 23", sessions:[{type:"tennis",text:"Tennis match 🎾 · 1.5h · afternoon",cal:true}] },
    { date:"2026-05-24", dow:"SUN", label:"May 24", sessions:[{type:"hyrox",text:"🏁 HYROX SIM · full or half · key prep session"}] },
  ]},
  { week:5, label:"May 25–30", theme:"🏁 Race Week — Taper", days:[
    { date:"2026-05-25", dow:"MON", label:"May 25", sessions:[{type:"rest",text:"Rest or 30min easy walk"}] },
    { date:"2026-05-26", dow:"TUE", label:"May 26", sessions:[{type:"plan",text:"25min Z2 run + 4×30s strides · sharpening only"}] },
    { date:"2026-05-27", dow:"WED", label:"May 27", sessions:[{type:"rest",text:"Rest"}] },
    { date:"2026-05-28", dow:"THU", label:"May 28", sessions:[{type:"plan",text:"Activation: 20min jog + 3×100m wall ball + 2×sled at race pace · NO fatigue"}] },
    { date:"2026-05-29", dow:"FRI", label:"May 29", sessions:[{type:"rest",text:"Travel to Riga 🚗 · easy walk only"}] },
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

function Sparkline({ data, color = "#7c3aed", height = 110 }) {
  if (!data || data.length < 2) return null;
  // Normalize entries to {date, val}
  const entries = data.map(d => {
    if (Array.isArray(d)) return { date: d[0], val: d[1] };
    if (d.bf !== undefined) return { date: d.date, val: d.bf };
    return { date: d.date, val: d.val };
  }).filter(e => e.val != null && !isNaN(e.val));

  if (entries.length < 2) return null;
  const vals = entries.map(e => e.val);
  const min = Math.min(...vals), max = Math.max(...vals), range = max - min || 1;

  // Wider viewBox so sparkline renders bigger on desktop while staying responsive
  const w = 800, h = height;
  const padL = 4, padR = 24, padT = 8, padB = 14;
  const innerW = w - padL - padR, innerH = h - padT - padB;
  const xAt = i => padL + (i / (entries.length - 1)) * innerW;
  const yAt = v => padT + innerH - ((v - min) / range) * innerH;

  // Smooth path
  const pts = entries.map((e, i) => [xAt(i), yAt(e.val)]);
  let path = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i-1], [x2, y2] = pts[i];
    const midX = (x1 + x2) / 2;
    path += ` Q ${midX.toFixed(1)},${y1.toFixed(1)} ${midX.toFixed(1)},${((y1+y2)/2).toFixed(1)} T ${x2.toFixed(1)},${y2.toFixed(1)}`;
  }

  const lastIdx = entries.length - 1;
  const labelIdx = entries.length <= 3
    ? entries.map((_, i) => i)
    : [0, Math.floor(entries.length / 2), lastIdx];

  const fmtDate = (s) => {
    const parts = s.split("-");
    return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(parts[1])-1]} ${parseInt(parts[2])}`;
  };

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width:"100%", height:"auto", display:"block", maxHeight: height*1.5 }} preserveAspectRatio="xMidYMid meet">
      <line x1={padL} x2={w-padR} y1={padT} y2={padT} stroke="#e2e8f0" strokeDasharray="2,3" />
      <line x1={padL} x2={w-padR} y1={padT+innerH} y2={padT+innerH} stroke="#e2e8f0" strokeDasharray="2,3" />
      <text x={w-padR+2} y={padT+3} fill="#94a3b8" fontSize="8" textAnchor="start">{max}</text>
      <text x={w-padR+2} y={padT+innerH+3} fill="#94a3b8" fontSize="8" textAnchor="start">{min}</text>

      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={xAt(lastIdx).toFixed(1)} cy={yAt(entries[lastIdx].val).toFixed(1)} r="2.5" fill={color} stroke="#fff" strokeWidth="1.5" />

      {labelIdx.map(i => (
        <text key={i} x={xAt(i).toFixed(1)} y={h-2} fill="#94a3b8" fontSize="9"
          textAnchor={i === 0 ? "start" : i === lastIdx ? "end" : "middle"}>
          {fmtDate(entries[i].date)}
        </text>
      ))}
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

function HyroxView() {
  // Convert HYROX_DATA map to a date-sorted array for picker UX
  const sessions = Object.entries(HYROX_DATA)
    .map(([id, s]) => ({ id, ...s }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const [tab, setTab] = useState("session");        // 'session' | 'trends' | 'notes'
  const [selIdx, setSelIdx] = useState(Math.max(0, sessions.length - 1));

  if (!sessions.length) return (
    <div style={{ padding:"40px 14px", textAlign:"center", color:"#94a3b8", fontSize:13 }}>
      No Hyrox sessions yet. They'll auto-appear here when you do an activity named with "hyrox" or "race simulation".
    </div>
  );

  const s = sessions[selIdx];

  // ── Derived: runs / stations / warmup / cooldown from classified laps ────────
  // Lap structure: { i, t, avgHr?, maxHr?, dist?, role }
  // role is auto-set by update.py; baseline session has manual roles.
  const allLaps    = s.laps || [];
  const runLaps    = allLaps.filter(l => l.role === "run");
  const stationLaps= allLaps.filter(l => l.role === "station");
  const warmupLaps = allLaps.filter(l => l.role === "warmup" || l.role === "cooldown");

  const runTimes   = runLaps.map(l => l.t);
  const stationT   = stationLaps.map(l => l.t);
  const totalRun   = runTimes.reduce((a,b)=>a+b, 0);
  const totalStat  = stationT.reduce((a,b)=>a+b, 0);
  const avgRunPace = runTimes.length ? totalRun / runTimes.length : 0;
  const fastestRun = runTimes.length ? Math.min(...runTimes) : 0;
  const slowestRun = runTimes.length ? Math.max(...runTimes) : 0;
  const maxRunSec  = slowestRun || 1;
  const minRunSec  = fastestRun || 0;
  const runRange   = (maxRunSec - minRunSec) || 1;
  const maxStTime  = stationT.length ? Math.max(...stationT) : 1;

  // Station display name: stationNames[lap.i] if set, else "Station N" (numbered in order)
  const stationDisplay = (lap, idx) => (s.stationNames && s.stationNames[lap.i]) || `Station ${idx + 1}`;

  // ── Official-results override ────────────────────────────────────────────────
  // If s.official is present (e.g. uploaded from a Hyrox/ROXFIT result), it is the
  // source of truth for TIMES and RANKS. Garmin laps still supply HR (avg/max),
  // since official results carry no heart-rate data. Structure:
  //   official: {
  //     finishTime: 4496,                        // seconds (optional; overrides s.totalTime)
  //     roxzone: { time: 318, rank: 355 },       // optional
  //     runs:     [{ time: 327, rank: 296 }, ...],        // in race order, R1..Rn
  //     stations: [{ name:"Ski Erg 1000 m", time: 279, rank: 535 }, ...],  // in race order
  //   }
  // Matching to Garmin laps for HR: runs match by order (i-th official run ↔ i-th run lap);
  // stations match by name (official.stations[k].name ↔ stationNames[lap.i]), falling back
  // to order if names don't line up. Missing HR just renders blank — never blocks the time.
  const official = s.official || null;
  const hasOfficial = !!official;

  // Build HR lookup from Garmin laps
  const runHrByOrder = runLaps.map(l => ({ avgHr: l.avgHr, maxHr: l.maxHr }));
  const stationHrByName = {};
  stationLaps.forEach((l, idx) => {
    const nm = (s.stationNames && s.stationNames[l.i]) || null;
    if (nm) stationHrByName[nm] = { avgHr: l.avgHr, maxHr: l.maxHr };
  });
  const stationHrByOrder = stationLaps.map(l => ({ avgHr: l.avgHr, maxHr: l.maxHr }));

  // Merged views: official time/rank + Garmin HR. Fall back to raw laps when no official.
  const mergedRuns = hasOfficial && official.runs
    ? official.runs.map((r, i) => ({
        i: i + 1, t: r.time, rank: r.rank ?? null,
        avgHr: (runHrByOrder[i] || {}).avgHr ?? null,
        maxHr: (runHrByOrder[i] || {}).maxHr ?? null,
      }))
    : runLaps.map((l, i) => ({ i: i + 1, t: l.t, rank: null, avgHr: l.avgHr ?? null, maxHr: l.maxHr ?? null }));

  const mergedStations = hasOfficial && official.stations
    ? official.stations.map((st, i) => {
        const hr = stationHrByName[st.name] || stationHrByOrder[i] || {};
        return { i: i + 1, name: st.name, t: st.time, rank: st.rank ?? null,
                 avgHr: hr.avgHr ?? null, maxHr: hr.maxHr ?? null };
      })
    : stationLaps.map((l, i) => ({ i: i + 1, name: stationDisplay(l, i), t: l.t, rank: null,
                                   avgHr: l.avgHr ?? null, maxHr: l.maxHr ?? null, dist: l.dist }));

  // Recompute totals from merged (official) data when present
  const mRunTimes  = mergedRuns.map(r => r.t);
  const mStatTimes = mergedStations.map(st => st.t);
  const mTotalRun  = mRunTimes.reduce((a,b)=>a+b, 0);
  const mTotalStat = mStatTimes.reduce((a,b)=>a+b, 0);
  const mAvgRun    = mRunTimes.length ? mTotalRun / mRunTimes.length : 0;
  const mFastRun   = mRunTimes.length ? Math.min(...mRunTimes) : 0;
  const mSlowRun   = mRunTimes.length ? Math.max(...mRunTimes) : 0;
  const mMaxStTime = mStatTimes.length ? Math.max(...mStatTimes) : 1;
  const mMaxRunSec = mSlowRun || 1;
  const mRunRange  = (mSlowRun - mFastRun) || 1;
  const displayTotal = hasOfficial && official.finishTime ? official.finishTime : s.totalTime;
  const hrColorFor = (hr) => hr ? (hr > 167 ? "#dc2626" : hr > 146 ? "#ea580c" : hr > 132 ? "#d97706" : "#16a34a") : "#94a3b8";

  // ── Notes (manual, persisted to localStorage per session) ───────────────────
  const noteKey = `hyrox-notes-${s.id}`;
  const [noteText, setNoteText] = useState(() => {
    if (typeof window === "undefined") return s.notes || "";
    return window.localStorage.getItem(noteKey) || s.notes || "";
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(noteKey, noteText);
  }, [noteText, noteKey]);

  const Stat = ({ label, value, sub, color, bg, border }) => (
    <div style={{ padding:"10px 12px", background: bg || "#f8fafc", border:`1.5px solid ${border || "#e2e8f0"}`, borderRadius:10, flex:1, minWidth:0 }}>
      <div style={{ fontSize:9, fontWeight:700, color:"#94a3b8", letterSpacing:1, textTransform:"uppercase" }}>{label}</div>
      <div style={{ fontSize:18, fontWeight:900, color: color || "#1e293b", lineHeight:1.1, marginTop:3 }}>{value}</div>
      {sub && <div style={{ fontSize:10, color:"#64748b", marginTop:2 }}>{sub}</div>}
    </div>
  );

  // ── Tab navigation ───────────────────────────────────────────────────────────
  const TabBtn = ({ id, label }) => (
    <button onClick={() => setTab(id)} style={{
      padding:"7px 14px", borderRadius:7, fontSize:11, fontWeight:700,
      cursor:"pointer", border:"1.5px solid",
      borderColor: tab === id ? "#7c3aed" : "#e2e8f0",
      background:  tab === id ? "#ede9fe" : "#fff",
      color:       tab === id ? "#4c1d95" : "#64748b",
      fontFamily:"inherit",
    }}>{label}</button>
  );

  return (
    <div style={{ padding:"14px 14px 60px" }}>

      {/* Tab switcher */}
      <div style={{ display:"flex", gap:6, marginBottom:14 }}>
        <TabBtn id="session" label="Session" />
        <TabBtn id="trends" label="Trends" />
        <TabBtn id="notes"  label="Notes" />
      </div>

      {/* Session picker (always visible — switching sessions while on Trends still useful) */}
      {sessions.length > 1 && (
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14, overflowX:"auto" }}>
          {sessions.map((sess, i) => (
            <button key={sess.id} onClick={() => setSelIdx(i)} style={{
              padding:"4px 12px", borderRadius:6, fontSize:11, fontWeight:700,
              cursor:"pointer", border:"1.5px solid",
              borderColor: i === selIdx ? "#7c3aed" : "#e2e8f0",
              background:  i === selIdx ? "#ede9fe" : "#f8fafc",
              color:       i === selIdx ? "#4c1d95" : "#94a3b8",
              fontFamily:"inherit", whiteSpace:"nowrap",
            }}>
              {sess.date} · {sess.type || "?"}
            </button>
          ))}
        </div>
      )}

      {/* ── SESSION TAB ───────────────────────────────────────────────────── */}
      {tab === "session" && (
        <>
          {/* official-source badge */}
          {hasOfficial && (
            <div style={{ marginBottom:12, padding:"7px 12px", background:"#ecfdf5", border:"1.5px solid #6ee7b7", borderRadius:8, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:13 }}>🏁</span>
              <span style={{ fontSize:11, fontWeight:700, color:"#065f46" }}>Official results</span>
              <span style={{ fontSize:10, color:"#047857" }}>— times &amp; ranks from official data; HR from Garmin</span>
            </div>
          )}

          {/* top stats */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
            <Stat label="Total time"  value={fmtMMSS(displayTotal)} sub={s.date} color="#1e293b" />
            <Stat label={`Running ×${mergedRuns.length}`} value={fmtMMSS(mTotalRun)} sub={mAvgRun ? `avg ${fmtMMSS(mAvgRun)}` : "—"} color="#c2410c" bg="#fff7ed" border="#fdba74" />
            <Stat label="Stations"    value={fmtMMSS(mTotalStat)} sub={`${mergedStations.length} stations`} color="#6d28d9" bg="#faf5ff" border="#c4b5fd" />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:18 }}>
            <Stat label="Avg HR"     value={s.avgHR ? `${s.avgHR} bpm` : "—"} sub={s.maxHR ? `max ${s.maxHR}` : "whole session"} color="#dc2626" bg="#fef2f2" border="#fca5a5" />
            <Stat label="Run range"  value={mergedRuns.length ? `${fmtMMSS(mFastRun)}–${fmtMMSS(mSlowRun)}` : "—"} sub="fastest → slowest" color="#0369a1" bg="#e0f2fe" border="#7dd3fc" />
          </div>

          {/* Description from Garmin Connect */}
          {s.description && (
            <div style={{ marginBottom:14, padding:"10px 12px", background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:8 }}>
              <div style={{ fontSize:9, fontWeight:700, color:"#94a3b8", letterSpacing:2, marginBottom:4 }}>DESCRIPTION</div>
              <div style={{ fontSize:12, color:"#334155", whiteSpace:"pre-wrap" }}>{s.description}</div>
            </div>
          )}

          {/* Photos from Garmin Connect */}
          {s.photos && s.photos.length > 0 && (
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:9, fontWeight:700, color:"#94a3b8", letterSpacing:2, marginBottom:6 }}>PHOTOS ({s.photos.length})</div>
              <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4 }}>
                {s.photos.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ flexShrink:0 }}>
                    <img src={url} alt={`session photo ${i+1}`} style={{ height:120, borderRadius:8, border:"1px solid #e2e8f0" }} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* run splits */}
          {mergedRuns.length > 0 && (
            <>
              <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:8 }}>RUN SPLITS — {mergedRuns.length} laps{hasOfficial ? " · official" : ""}</div>
              <div style={{ background:"#fff7ed", border:"1px solid #fdba74", borderRadius:10, padding:"14px", marginBottom:16 }}>
                {mergedRuns.map((run, i) => {
                  const t = run.t;
                  const barW = Math.round(((mMaxRunSec - t) / mRunRange) * 60 + 35);
                  const isF = t === mFastRun, isS = t === mSlowRun && mFastRun !== mSlowRun;
                  const hr = run.avgHr;
                  const maxHr = run.maxHr;
                  const hrColor = hrColorFor(hr);
                  return (
                    <div key={run.i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                      <div style={{ fontSize:10, color:"#94a3b8", minWidth:22, textAlign:"right" }}>R{i+1}</div>
                      <div style={{ flex:1, background:"#f1f5f9", borderRadius:4, height:20, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${barW}%`, background: isF ? "#16a34a99" : isS ? "#dc262699" : "#c2410c66", borderRadius:4 }} />
                      </div>
                      <div style={{ fontSize:11, fontWeight:700, color: isF ? "#15803d" : isS ? "#dc2626" : "#c2410c", minWidth:40, textAlign:"right", fontVariantNumeric:"tabular-nums" }}>
                        {fmtMMSS(t)}
                      </div>
                      {hr && (
                        <div style={{ fontSize:10, color: hrColor, minWidth:48, textAlign:"right", fontVariantNumeric:"tabular-nums" }}>
                          ♥ {hr}{maxHr ? <span style={{color:"#94a3b8"}}> /{maxHr}</span> : null}
                        </div>
                      )}
                      {run.rank != null && (
                        <div style={{ fontSize:9, color:"#94a3b8", minWidth:34, textAlign:"right", fontVariantNumeric:"tabular-nums" }}>#{run.rank}</div>
                      )}
                    </div>
                  );
                })}
                <div style={{ marginTop:8, padding:"6px 10px", background:"#fff", border:"1px solid #fed7aa", borderRadius:6, fontSize:10, color:"#9a3412", display:"flex", gap:16, flexWrap:"wrap" }}>
                  {mAvgRun > 0 && <span>avg <strong>{fmtMMSS(mAvgRun)}</strong></span>}
                  {mFastRun !== mSlowRun && <span>drift <strong>+{fmtMMSS(mSlowRun - mFastRun)}</strong> fast→slow</span>}
                  <span>total running <strong>{fmtMMSS(mTotalRun)}</strong></span>
                </div>
              </div>
            </>
          )}

          {/* station breakdown */}
          {mergedStations.length > 0 && (
            <>
              <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:8 }}>STATION BREAKDOWN{hasOfficial ? " · official" : ""}</div>
              <div style={{ background:"#faf5ff", border:"1px solid #ede9fe", borderRadius:10, padding:"14px", marginBottom:16 }}>
                {mergedStations.map((st, i) => {
                  const barW = Math.round((st.t / mMaxStTime) * 85 + 10);
                  const named = hasOfficial ? true : !!(s.stationNames && s.stationNames[stationLaps[i] && stationLaps[i].i]);
                  return (
                    <div key={i} style={{ marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                        <span style={{ fontSize:11, fontWeight:600, color: named ? "#4c1d95" : "#94a3b8", fontStyle: named ? "normal" : "italic" }}>{st.name}</span>
                        <span style={{ fontSize:12, fontWeight:800, color:"#6d28d9", fontVariantNumeric:"tabular-nums" }}>{fmtMMSS(st.t)}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ flex:1, background:"#f1f5f9", borderRadius:4, height:14, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${barW}%`, background:"#7c3aed88", borderRadius:4 }} />
                        </div>
                        <div style={{ fontSize:10, color:"#94a3b8", minWidth:74, textAlign:"right" }}>
                          {st.avgHr ? `♥ ${st.avgHr}` : ""}
                          {st.rank != null ? `${st.avgHr ? " · " : ""}#${st.rank}` : (st.dist ? ` · ${st.dist}m` : "")}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {!hasOfficial && !s.stationNames && (
                  <div style={{ marginTop:8, padding:"8px 10px", background:"#fef3c7", border:"1px solid #fde68a", borderRadius:6, fontSize:10, color:"#92400e" }}>
                    💡 Add station names in HYROX_DATA.{s.id}.stationNames to enable cross-session trends.
                  </div>
                )}
                {hasOfficial && official.roxzone && (
                  <div style={{ marginTop:8, padding:"8px 10px", background:"#eef2ff", border:"1px solid #c7d2fe", borderRadius:6, fontSize:10, color:"#3730a3", display:"flex", justifyContent:"space-between" }}>
                    <span>Roxzone (transitions)</span>
                    <span style={{ fontWeight:700, fontVariantNumeric:"tabular-nums" }}>{fmtMMSS(official.roxzone.time)}{official.roxzone.rank != null ? ` · #${official.roxzone.rank}` : ""}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* warmup/cooldown */}
          {warmupLaps.length > 0 && (
            <div style={{ marginBottom:14, fontSize:10, color:"#94a3b8", textAlign:"center" }}>
              Ignoring {warmupLaps.length} warmup/cooldown lap{warmupLaps.length>1?"s":""} ({warmupLaps.map(l => fmtMMSS(l.t)).join(", ")}) — anomalous distance, likely treadmill drift.
            </div>
          )}

          {/* projected finish */}
          {s.estimateMin && (
            <div style={{ background:"linear-gradient(135deg,#4c1d95,#6d28d9)", borderRadius:12, padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:14 }}>
              <div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.65)", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" }}>Projected finish</div>
                <div style={{ fontSize:32, fontWeight:900, color:"#ffffff", lineHeight:1.1, marginTop:2 }}>~{s.estimateMin} min</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)" }}>based on this session</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", marginTop:4 }}>Set estimateMin: null after racing</div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── TRENDS TAB ────────────────────────────────────────────────────── */}
      {tab === "trends" && (() => {
        // Helper: official-aware accessors so trends use official times when present.
        const sessRuns = (sess) => {
          const laps = (sess.laps || []).filter(l => l.role === "run");
          if (sess.official && sess.official.runs)
            return sess.official.runs.map((r, i) => ({ t: r.time, avgHr: (laps[i]||{}).avgHr || null }));
          return laps.map(l => ({ t: l.t, avgHr: l.avgHr || null }));
        };
        const sessStations = (sess) => {
          const laps = (sess.laps || []).filter(l => l.role === "station");
          if (sess.official && sess.official.stations) {
            const hrByName = {};
            laps.forEach(l => { const n = sess.stationNames && sess.stationNames[l.i]; if (n) hrByName[n] = l.avgHr || null; });
            return sess.official.stations.map((st, i) => ({ name: st.name, t: st.time, hr: hrByName[st.name] ?? ((laps[i]||{}).avgHr || null) }));
          }
          return laps.map(l => ({ name: sess.stationNames && sess.stationNames[l.i], t: l.t, hr: l.avgHr || null }));
        };
        const sessTotal = (sess) => (sess.official && sess.official.finishTime) ? sess.official.finishTime : sess.totalTime;

        // Aggregate across all sessions: per-station and per-run trends
        const tot = sessions.map(sess => ({
          date: sess.date,
          id: sess.id,
          totalTime: sessTotal(sess),
          runTime: sessRuns(sess).reduce((a,b)=>a+b.t, 0),
          stationTime: sessStations(sess).reduce((a,b)=>a+b.t, 0),
          avgHR: sess.avgHR,
        }));
        // Per-station time series: { stationName: [{date, time, hr, id}] }
        const byStation = {};
        sessions.forEach(sess => {
          sessStations(sess).forEach(st => {
            if (!st.name) return;
            (byStation[st.name] = byStation[st.name] || []).push({
              date: sess.date, time: st.t, hr: st.hr, id: sess.id,
            });
          });
        });
        // Per-run-index time series (R1 across all sessions, R2 across all, etc.)
        const runIndexSeries = {};
        sessions.forEach(sess => {
          sessRuns(sess).forEach((r, i) => {
            const k = `R${i+1}`;
            (runIndexSeries[k] = runIndexSeries[k] || []).push({
              date: sess.date, time: r.t, hr: r.avgHr || null,
            });
          });
        });

        const stationNames = Object.keys(byStation).filter(n => byStation[n].length >= 1);

        return (
          <>
            {/* Total time trend */}
            <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:8 }}>TOTAL TIME — ACROSS SESSIONS</div>
            <div style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"14px", marginBottom:16 }}>
              {tot.length >= 2 ? (
                <Sparkline data={tot.map(t => [t.date, t.totalTime])} color="#7c3aed" height={60} />
              ) : (
                <div style={{ fontSize:11, color:"#94a3b8", textAlign:"center", padding:"20px 0" }}>
                  Need at least 2 sessions to show a trend. ({tot.length} so far)
                </div>
              )}
              <div style={{ marginTop:10, display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:8 }}>
                {tot.map(t => (
                  <div key={t.id} style={{ padding:"8px 10px", background:"#fff", border:"1px solid #e2e8f0", borderRadius:6, fontSize:11 }}>
                    <div style={{ color:"#64748b", fontSize:10 }}>{t.date}</div>
                    <div style={{ fontWeight:800, color:"#1e293b" }}>{fmtMMSS(t.totalTime)}</div>
                    <div style={{ color:"#94a3b8", fontSize:10 }}>
                      run {fmtMMSS(t.runTime)} · stn {fmtMMSS(t.stationTime)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Per-station trends */}
            <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:8 }}>STATION TIMES — TREND</div>
            {stationNames.length === 0 ? (
              <div style={{ background:"#fef3c7", border:"1px solid #fde68a", borderRadius:8, padding:"12px 14px", marginBottom:16, fontSize:11, color:"#92400e" }}>
                No stations are named across sessions yet. Add <code>stationNames</code> in HYROX_DATA entries to enable per-station trend lines.
              </div>
            ) : (
              <div style={{ marginBottom:16 }}>
                {stationNames.map(name => {
                  const series = byStation[name];
                  const times = series.map(s => s.time);
                  const best = Math.min(...times);
                  const worst = Math.max(...times);
                  const latest = series[series.length - 1];
                  const first = series[0];
                  const delta = latest.time - first.time;
                  const trend = series.length < 2 ? "—" : delta < -5 ? "↓ faster" : delta > 5 ? "↑ slower" : "≈ same";
                  const trendColor = series.length < 2 ? "#94a3b8" : delta < -5 ? "#16a34a" : delta > 5 ? "#dc2626" : "#64748b";
                  return (
                    <div key={name} style={{ marginBottom:12, background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"10px 12px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:6 }}>
                        <div style={{ fontSize:12, fontWeight:700, color:"#4c1d95" }}>{name}</div>
                        <div style={{ fontSize:11, fontWeight:700, color: trendColor }}>{trend} ({series.length} sess.)</div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        {series.map((p, i) => {
                          const barH = Math.round(((p.time - best) / (worst - best || 1)) * 30 + 6);
                          const isLatest = i === series.length - 1;
                          return (
                            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                              <div style={{ fontSize:10, fontWeight:700, color: isLatest ? "#6d28d9" : "#94a3b8", fontVariantNumeric:"tabular-nums" }}>{fmtMMSS(p.time)}</div>
                              <div style={{ width:"100%", marginTop:3, height:40, display:"flex", alignItems:"flex-end" }}>
                                <div style={{ width:"100%", height:`${barH}px`, background: isLatest ? "#7c3aed" : "#c4b5fd", borderRadius:"3px 3px 0 0" }} />
                              </div>
                              <div style={{ fontSize:9, color:"#94a3b8", marginTop:3 }}>{p.date.slice(5)}</div>
                              {p.hr && <div style={{ fontSize:9, color:"#dc2626" }}>♥{p.hr}</div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Per-run-index trends */}
            <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:8 }}>RUN TIMES BY POSITION — TREND</div>
            <div style={{ marginBottom:16 }}>
              {Object.entries(runIndexSeries).filter(([_,arr]) => arr.length >= 2).map(([k, series]) => {
                const times = series.map(s => s.time);
                const best = Math.min(...times), worst = Math.max(...times);
                const latest = series[series.length-1].time, first = series[0].time;
                const delta = latest - first;
                const trend = delta < -3 ? "↓ faster" : delta > 3 ? "↑ slower" : "≈ same";
                const trendColor = delta < -3 ? "#16a34a" : delta > 3 ? "#dc2626" : "#64748b";
                return (
                  <div key={k} style={{ marginBottom:8, background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"8px 12px", display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"#c2410c", minWidth:30 }}>{k}</div>
                    <div style={{ flex:1, display:"flex", alignItems:"center", gap:4 }}>
                      {series.map((p, i) => (
                        <div key={i} style={{ flex:1, fontSize:10, color: i === series.length-1 ? "#c2410c" : "#94a3b8", fontWeight: i === series.length-1 ? 700 : 400, textAlign:"center" }}>
                          {fmtMMSS(p.time)}
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize:10, fontWeight:700, color: trendColor, minWidth:60, textAlign:"right" }}>{trend}</div>
                  </div>
                );
              })}
              {Object.values(runIndexSeries).every(arr => arr.length < 2) && (
                <div style={{ fontSize:11, color:"#94a3b8", textAlign:"center", padding:"10px" }}>
                  Need ≥2 sessions with runs to show a trend.
                </div>
              )}
            </div>
          </>
        );
      })()}

      {/* ── NOTES TAB ─────────────────────────────────────────────────────── */}
      {tab === "notes" && (
        <>
          <div style={{ marginBottom:8, fontSize:10, color:"#64748b" }}>
            <strong>{s.date}</strong> · {s.name}
          </div>
          <div style={{ marginBottom:6, fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2 }}>PRESCRIBED WORKOUT (notes)</div>
          <textarea
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="Type the prescribed workout here (e.g. from the coach's whiteboard photo). Saved locally in this browser only."
            style={{
              width:"100%", minHeight:200, padding:"10px 12px",
              border:"1.5px solid #e2e8f0", borderRadius:8,
              fontSize:13, fontFamily:"inherit", color:"#334155",
              resize:"vertical", boxSizing:"border-box",
            }}
          />
          <div style={{ marginTop:8, display:"flex", gap:8, alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ fontSize:10, color:"#94a3b8" }}>
              Saved locally in this browser only · {noteText.length} chars
            </div>
            <button
              onClick={() => { if (typeof navigator !== "undefined" && navigator.clipboard) navigator.clipboard.writeText(noteText); }}
              style={{ padding:"6px 12px", borderRadius:6, fontSize:11, fontWeight:700, cursor:"pointer", border:"1.5px solid #c4b5fd", background:"#ede9fe", color:"#4c1d95", fontFamily:"inherit" }}
            >📋 Copy</button>
          </div>

          {s.description && (
            <>
              <div style={{ marginTop:18, marginBottom:6, fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2 }}>GARMIN DESCRIPTION (read-only)</div>
              <div style={{ padding:"10px 12px", background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:8, fontSize:12, color:"#475569", whiteSpace:"pre-wrap" }}>
                {s.description}
              </div>
            </>
          )}

          {s.photos && s.photos.length > 0 && (
            <>
              <div style={{ marginTop:18, marginBottom:6, fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2 }}>PHOTOS ({s.photos.length})</div>
              <div style={{ display:"flex", gap:8, overflowX:"auto" }}>
                {s.photos.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ flexShrink:0 }}>
                    <img src={url} alt={`photo ${i+1}`} style={{ height:150, borderRadius:8, border:"1px solid #e2e8f0" }} />
                  </a>
                ))}
              </div>
            </>
          )}
        </>
      )}

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
        <Sparkline data={HEALTH_DATA.weight} color="#0369a1" height={64} />
        
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
        {bfEntries.length > 1 && <Sparkline data={bfEntries} color="#15803d" height={64} />}
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
        <Sparkline data={HEALTH_DATA.vo2max} color="#c2410c" height={64} />
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
  const hrvBaseline = 99; // updated 2026-07-02

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

  const TABS = [["today","TODAY"],["schedule","SCHEDULE"],["hyrox","🏃 HYROX"],["health","HEALTH"],["history","HISTORY"],["load","LOAD"],["insights","INSIGHTS"]];

  return (
    <div style={{ minHeight:"100vh", background:"#ffffff", fontFamily:"'Inter',system-ui,sans-serif", color:"#1e293b", fontSize:13 }}>

      {/* HEADER */}
      <div style={{ padding:"16px 14px 12px", borderBottom:"2px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:3, color:"#94a3b8", marginBottom:3 }}>HYROX RIGA · MAY 30 · -1 DAYS</div>
          <div style={{ fontSize:20, fontWeight:800, color:"#1e1b4b", letterSpacing:-0.5 }}>Training Coach</div>
          {(() => {
            const now = new Date();
            const lastRun  = new Date(LAST_RUN);
            const lastData = new Date(LAST_DATA);
            const fmtClock = d => d.toLocaleTimeString(undefined, { hour:"2-digit", minute:"2-digit" });
            const fmtDay = d => {
              const today = new Date(); today.setHours(0,0,0,0);
              const yest = new Date(today); yest.setDate(yest.getDate()-1);
              const dd = new Date(d); dd.setHours(0,0,0,0);
              if (dd.getTime() === today.getTime()) return "today";
              if (dd.getTime() === yest.getTime()) return "yesterday";
              return d.toLocaleDateString(undefined, { weekday:"short", month:"short", day:"numeric" });
            };
            const ago = d => {
              const m = Math.floor((now - d) / 60000);
              if (m < 1) return "just now";
              if (m < 60) return `${m} min ago`;
              const h = Math.floor(m / 60);
              if (h < 24) return `${h}h ${m % 60}m ago`;
              return `${Math.floor(h / 24)}d ago`;
            };
            const runMin  = (now - lastRun)  / 60000;
            const dataMin = (now - lastData) / 60000;
            // Tokens die ~27h after last refresh. If LAST_DATA is older than ~28h → likely expired.
            const tokensLikelyDead = dataMin > 28 * 60;
            // Workflow runs hourly. If LAST_RUN is older than ~90 min → scheduler missed runs.
            const schedulerStuck = runMin > 90;
            let color, msg;
            if (tokensLikelyDead) {
              color = "#dc2626";
              msg = `⚠ Last data: ${fmtDay(lastData)} ${fmtClock(lastData)} (${ago(lastData)}). Tokens likely expired — tap 🔑 Renew.`;
            } else if (schedulerStuck) {
              color = "#d97706";
              msg = `⚠ Last run: ${fmtClock(lastRun)} (${ago(lastRun)}). Scheduler may be stuck — tap ⟳ Refresh.`;
            } else {
              color = "#64748b";
              msg = `Synced ${fmtClock(lastRun)} (${ago(lastRun)}) · data through ${fmtDay(lastData)}`;
            }
            return <div style={{ fontSize:11, color, marginTop:2, fontWeight: (tokensLikelyDead || schedulerStuck) ? 700 : 400 }}>{msg}</div>;
          })()}
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }} id="auth-controls">
          {/* ⟳ Refresh button — calls Worker which has the PAT */}
          <button id="refresh-btn" onClick={async () => {
            const WORKER = "https://auth.simas.fit";
            const btn = document.getElementById("refresh-btn");
            btn.textContent = "Refreshing…"; btn.disabled = true;
            try {
              const res = await fetch(`${WORKER}/refresh`, {
                method:"POST",
                headers:{ "Content-Type":"application/json" },
                body: JSON.stringify({ mode: "activities" })
              });
              const data = await res.json();
              if (data.status === "triggered") {
                btn.textContent = "✓ Running…";
                setTimeout(() => { btn.textContent = "⟳ Refresh"; btn.disabled = false; }, 8000);
              } else {
                btn.textContent = `✗ ${data.error || "Error"}`; btn.disabled = false;
              }
            } catch(e) { btn.textContent = "✗ " + e.message; btn.disabled = false; }
          }} style={{ background:"#7c3aed", border:"none", borderRadius:8, padding:"8px 14px", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer" }}>
            ⟳ Refresh
          </button>

          {/* 🔑 Renew Credentials button + MFA flow */}
          <button id="renew-btn" onClick={async () => {
            const WORKER = "https://auth.simas.fit";
            const btn = document.getElementById("renew-btn");
            const mfaArea = document.getElementById("mfa-area");

            btn.textContent = "Connecting…"; btn.disabled = true;
            try {
              const res = await fetch(`${WORKER}/auth/start`, { method:"POST" });
              const data = await res.json();
              if (data.status === "mfa_required") {
                mfaArea.style.display = "flex";
                mfaArea.dataset.session = data.session;
                document.getElementById("mfa-input").focus();
                btn.textContent = "Check your email →";
              } else if (data.error) {
                btn.textContent = `✗ ${data.error}`;
                btn.disabled = false;
              }
            } catch(e) {
              btn.textContent = "✗ Worker unreachable"; btn.disabled = false;
            }
          }} style={{ background:"#0f172a", border:"1px solid #334155", borderRadius:8, padding:"8px 14px", color:"#94a3b8", fontSize:11, fontWeight:700, cursor:"pointer" }}>
            🔑 Renew
          </button>
        </div>

        {/* MFA input area — hidden until needed */}
        <div id="mfa-area" style={{ display:"none", alignItems:"center", gap:8, marginTop:8, width:"100%", flexWrap:"wrap" }}>
          <span style={{ fontSize:11, color:"#94a3b8" }}>Enter the code from your email:</span>
          <input id="mfa-input" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={8}
            placeholder="123456"
            style={{ width:90, padding:"6px 10px", borderRadius:7, border:"1.5px solid #7c3aed",
                     fontSize:14, fontWeight:700, letterSpacing:3, textAlign:"center", outline:"none" }}
            onKeyDown={async (e) => {
              if (e.key === "Enter") document.getElementById("mfa-submit").click();
            }}
          />
          <button id="mfa-submit" onClick={async () => {
            const WORKER = "https://auth.simas.fit";
            const code = document.getElementById("mfa-input").value.trim();
            const btn  = document.getElementById("mfa-submit");
            if (!code) return;
            btn.textContent = "Verifying…"; btn.disabled = true;
            try {
              const session = document.getElementById("mfa-area").dataset.session;
              const res  = await fetch(`${WORKER}/auth/verify`, {
                method:"POST", headers:{ "Content-Type":"application/json" },
                body: JSON.stringify({ code, session })
              });
              const data = await res.json();
              if (data.status === "success") {
                document.getElementById("mfa-area").style.display = "none";
                document.getElementById("renew-btn").textContent = "✓ Done — updating…";
                setTimeout(() => {
                  document.getElementById("renew-btn").textContent = "🔑 Renew";
                  document.getElementById("renew-btn").disabled = false;
                }, 60000);
              } else {
                btn.textContent = "✗ " + (data.error || "Failed");
                btn.disabled = false;
              }
            } catch(e) { btn.textContent = "✗ Error"; btn.disabled = false; }
          }} style={{ background:"#7c3aed", border:"none", borderRadius:7, padding:"6px 14px", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer" }}>
            Submit
          </button>
          <button onClick={() => {
            document.getElementById("mfa-area").style.display = "none";
            document.getElementById("renew-btn").textContent = "🔑 Renew";
            document.getElementById("renew-btn").disabled = false;
          }} style={{ background:"none", border:"none", color:"#94a3b8", fontSize:11, cursor:"pointer" }}>
            Cancel
          </button>
        </div>
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
              const data = atlHistory.filter(d => d.atl > 0).slice(-42);
              const hrvByDate = {};
              HEALTH_DATA.daily.forEach(d => { if (d.hrv > 0) hrvByDate[d.date] = d.hrv; });
              const points = data.map(d => ({ date: d.date, atl: d.atl, hrv: hrvByDate[d.date] || null }));
              const maxAtl = Math.max(...points.map(p => p.atl), 1);
              const validHrv = points.filter(p => p.hrv).map(p => p.hrv);
              const minHrv = Math.min(...validHrv, 100);
              const maxHrv = Math.max(...validHrv, 150);

              const W = 800, H = 200;
              const padL = 6, padR = 24, padT = 12, padB = 22;
              const innerW = W - padL - padR, innerH = H - padT - padB;
              const xAt = i => padL + (i / (points.length - 1)) * innerW;
              const yAtl = v => padT + innerH - (v / maxAtl) * innerH;
              const yHrv = v => padT + innerH - ((v - minHrv) / (maxHrv - minHrv || 1)) * innerH;

              const smooth = (pts) => {
                if (pts.length < 2) return "";
                let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
                for (let i = 1; i < pts.length; i++) {
                  const [x1,y1] = pts[i-1], [x2,y2] = pts[i];
                  const mx = (x1+x2)/2;
                  d += ` Q ${mx.toFixed(1)},${y1.toFixed(1)} ${mx.toFixed(1)},${((y1+y2)/2).toFixed(1)} T ${x2.toFixed(1)},${y2.toFixed(1)}`;
                }
                return d;
              };

              const atlPath = smooth(points.map((p,i) => [xAt(i), yAtl(p.atl)]));
              const hrvPts = points.map((p,i) => p.hrv ? [xAt(i), yHrv(p.hrv)] : null).filter(Boolean);
              const hrvPath = smooth(hrvPts);

              // Pick 4 date labels evenly
              const labelIdx = [0, Math.floor(points.length/3), Math.floor(2*points.length/3), points.length-1];
              const fmt = (s) => { const p = s.split("-"); return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+p[1]-1]} ${+p[2]}`; };

              return (
                <div>
                  <div style={{ display:"flex", gap:16, marginBottom:8, fontSize:10 }}>
                    <span style={{ color:"#dc2626", fontWeight:600 }}>━ ATL (fatigue)</span>
                    <span style={{ color:"#7c3aed", fontWeight:600 }}>━ HRV (recovery)</span>
                    <span style={{ color:"#94a3b8", marginLeft:"auto" }}>HRV falls when ATL spikes → recovery needed</span>
                  </div>
                  <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block", maxHeight: 280 }} preserveAspectRatio="xMidYMid meet">
                    <line x1={padL} x2={W-padR} y1={padT} y2={padT} stroke="#e2e8f0" strokeDasharray="2,3" />
                    <line x1={padL} x2={W-padR} y1={padT+innerH/2} y2={padT+innerH/2} stroke="#f1f5f9" strokeDasharray="2,3" />
                    <line x1={padL} x2={W-padR} y1={padT+innerH} y2={padT+innerH} stroke="#e2e8f0" strokeDasharray="2,3" />

                    {/* Right axis: HRV range */}
                    <text x={W-padR+2} y={padT+4} fill="#7c3aed" fontSize="9" textAnchor="start">{Math.round(maxHrv)}</text>
                    <text x={W-padR+2} y={padT+innerH+3} fill="#7c3aed" fontSize="9" textAnchor="start">{Math.round(minHrv)}</text>
                    {/* Left axis: ATL range */}
                    <text x={padL} y={padT-2} fill="#dc2626" fontSize="9" textAnchor="start">{Math.round(maxAtl)}</text>

                    <path d={atlPath} fill="none" stroke="#dc2626" strokeWidth="2" strokeLinejoin="round" opacity="0.85" />
                    <path d={hrvPath} fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinejoin="round" opacity="0.9" />

                    {labelIdx.map(i => (
                      <text key={i} x={xAt(i).toFixed(1)} y={H-4} fill="#94a3b8" fontSize="10"
                        textAnchor={i===0?"start":i===points.length-1?"end":"middle"}>
                        {fmt(points[i].date)}
                      </text>
                    ))}
                  </svg>
                </div>
              );
            })()}
          </div>

          {/* Readiness history sparkline */}
          <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:2, marginBottom:10 }}>READINESS HISTORY (30 DAYS)</div>
          <div style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"14px", marginBottom:16 }}>
            {(() => {
              const daily30 = HEALTH_DATA.daily.filter(d => d.hrv > 0).slice(-30);
              const scores = daily30.map(d => {
                const atlD = atlHistory.find(a => a.date === d.date);
                const tsbD = atlD ? (atlD.ctl - atlD.atl) : 0;
                return { date: d.date, val: readiness(tsbD, 99, d.hrv, 88) };
              });
              if (scores.length < 2) return <div style={{ color:"#94a3b8", fontSize:11 }}>Not enough data yet</div>;

              const W = 800, H = 180;
              const padL = 6, padR = 24, padT = 14, padB = 22;
              const innerW = W - padL - padR, innerH = H - padT - padB;
              const min = 1, max = 10;
              const xAt = i => padL + (i / (scores.length - 1)) * innerW;
              const yAt = v => padT + innerH - ((v - min) / (max - min)) * innerH;

              const pts = scores.map((s,i) => [xAt(i), yAt(s.val)]);
              let path = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
              for (let i = 1; i < pts.length; i++) {
                const [x1,y1] = pts[i-1], [x2,y2] = pts[i];
                const mx = (x1+x2)/2;
                path += ` Q ${mx.toFixed(1)},${y1.toFixed(1)} ${mx.toFixed(1)},${((y1+y2)/2).toFixed(1)} T ${x2.toFixed(1)},${y2.toFixed(1)}`;
              }

              const avg = (scores.reduce((s,o)=>s+o.val,0)/scores.length).toFixed(1);
              const trend = scores[scores.length-1].val > scores[0].val ? "↑" : "↓";
              const fmt = (s) => { const p = s.split("-"); return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+p[1]-1]} ${+p[2]}`; };
              const labelIdx = [0, Math.floor(scores.length/3), Math.floor(2*scores.length/3), scores.length-1];

              return (
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:"#1e293b" }}>Avg: {avg}/10 {trend}</span>
                    <span style={{ fontSize:11, color:"#94a3b8" }}>Last {scores.length} days</span>
                  </div>
                  <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block", maxHeight: 260 }} preserveAspectRatio="xMidYMid meet">
                    {[3, 5, 7].map(v => (
                      <line key={v} x1={padL} x2={W-padR} y1={yAt(v)} y2={yAt(v)} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2,3" />
                    ))}
                    <text x={W-padR+2} y={yAt(10)+3} fill="#94a3b8" fontSize="9" textAnchor="start">10</text>
                    <text x={W-padR+2} y={yAt(5)+3} fill="#94a3b8" fontSize="9" textAnchor="start">5</text>
                    <text x={W-padR+2} y={yAt(1)+3} fill="#94a3b8" fontSize="9" textAnchor="start">1</text>

                    <path d={path} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

                    {scores.map((s,i) => {
                      const c = s.val >= 7 ? "#16a34a" : s.val >= 4 ? "#d97706" : "#dc2626";
                      return <circle key={i} cx={xAt(i).toFixed(1)} cy={yAt(s.val).toFixed(1)} r="3.5" fill={c} stroke="#fff" strokeWidth="1.5" />;
                    })}

                    {labelIdx.map(i => (
                      <text key={i} x={xAt(i).toFixed(1)} y={H-4} fill="#94a3b8" fontSize="10"
                        textAnchor={i===0?"start":i===scores.length-1?"end":"middle"}>
                        {fmt(scores[i].date)}
                      </text>
                    ))}
                  </svg>
                  <div style={{ display:"flex", gap:14, marginTop:8, fontSize:11 }}>
                    <span style={{ color:"#16a34a" }}>● 7–10 push hard</span>
                    <span style={{ color:"#d97706" }}>● 4–6 train smart</span>
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
      {view === "hyrox" && <HyroxView />}

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
          <div style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"14px", marginBottom:16 }}>
          {(() => {
            const race = new Date("2026-05-30");
            // Compute weeks-from-race for each entry by parsing label like "May 11–17"
            // weeklyTrimp is ordered oldest→newest. The LAST entry is the current/most-recent week.
            const getTarget = (weeksOut) => {
              if (weeksOut <= 0) return [0, 0, "rest"];                  // post-race
              if (weeksOut === 1) return [100, 200, "Race week — taper"];
              if (weeksOut === 2) return [250, 350, "Final hard week"];
              if (weeksOut === 3) return [400, 520, "Peak load"];
              return [400, 500, "Build phase"];
            };

            // Parse start date of each label, e.g. "May 11–17" → Date for May 11 of this year
            const parseStart = (label) => {
              const yr = new Date(TODAY).getFullYear();
              const [monStr, dayStr] = label.split(" ");
              const monIdx = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(monStr);
              return new Date(yr, monIdx, parseInt(dayStr));
            };

            return weeklyTrimp.map((w, i) => {
              const startD = parseStart(w.label);
              const weekEnd = new Date(startD); weekEnd.setDate(startD.getDate() + 6);
              const weeksOut = Math.ceil((race - weekEnd) / (7*86400000));
              const [lo, hi, phase] = getTarget(weeksOut);
              const isPast = weekEnd < new Date(TODAY);
              const isCurrent = startD <= new Date(TODAY) && weekEnd >= new Date(TODAY);

              const pct = hi > 0 ? Math.min(100, (w.trimp / hi) * 100) : 0;
              const status = w.trimp === 0 ? "empty"
                : (w.trimp >= lo && w.trimp <= hi) ? "green"
                : w.trimp > hi ? "amber" : "red";
              const sc = { green:"#16a34a", amber:"#d97706", red:"#dc2626", empty:"#cbd5e1" }[status];
              const loPct = hi > 0 ? (lo/hi)*100 : 0;

              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, opacity: isPast && !isCurrent ? 0.55 : 1 }}>
                  <div style={{ minWidth:90 }}>
                    <div style={{ fontSize:11, fontWeight: isCurrent ? 800 : 600, color: isCurrent ? "#7c3aed" : "#1e293b" }}>
                      {w.label}{isCurrent && " ←"}
                    </div>
                    <div style={{ fontSize:9, color:"#94a3b8" }}>{phase}</div>
                  </div>
                  <div style={{ flex:1, background:"#f1f5f9", borderRadius:5, height:22, position:"relative", overflow:"hidden", border:"1px solid #e2e8f0" }}>
                    {/* target zone band */}
                    {hi > 0 && (
                      <div style={{ position:"absolute", left:`${loPct}%`, width:`${100-loPct}%`, top:0, height:"100%", background:"#16a34a14" }} />
                    )}
                    {/* actual bar */}
                    <div style={{ height:"100%", width:`${pct}%`, background:sc, borderRadius:5, transition:"width 0.4s", opacity:0.85 }} />
                    {/* target markers */}
                    {hi > 0 && (
                      <>
                        <div style={{ position:"absolute", left:`${loPct}%`, top:0, width:2, height:"100%", background:"#16a34a" }} />
                        <div style={{ position:"absolute", left:`100%`, top:0, width:2, height:"100%", background:"#d97706", transform:"translateX(-2px)" }} />
                      </>
                    )}
                  </div>
                  <div style={{ fontSize:12, fontWeight:800, color:sc, minWidth:42, textAlign:"right" }}>
                    {w.trimp > 0 ? w.trimp : "—"}
                  </div>
                  <div style={{ fontSize:9, color:"#94a3b8", minWidth:58 }}>
                    {hi > 0 ? `${lo}–${hi}` : "rest"}
                  </div>
                </div>
              );
            });
          })()}
          <div style={{ display:"flex", gap:14, marginTop:10, fontSize:10, color:"#94a3b8", flexWrap:"wrap" }}>
            <span><span style={{ display:"inline-block", width:10, height:10, background:"#16a34a", borderRadius:2, verticalAlign:"middle" }} /> In target zone</span>
            <span><span style={{ display:"inline-block", width:10, height:10, background:"#d97706", borderRadius:2, verticalAlign:"middle" }} /> Over target</span>
            <span><span style={{ display:"inline-block", width:10, height:10, background:"#dc2626", borderRadius:2, verticalAlign:"middle" }} /> Under target</span>
            <span style={{ marginLeft:"auto" }}>Green band = target zone</span>
          </div>
          </div>

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
