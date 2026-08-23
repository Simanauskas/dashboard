import { useState, useEffect, useRef } from "react";

const HEALTH_DATA = {
  fitnessAge: { bio: 27.8, chrono: 35, bmi: 24.2, rhr: 38, vo2max: 52.9 },
  weight: [
    ["2026-01-13",73.6],["2026-01-17",73.1],["2026-01-20",73.1],["2026-02-12",73.5],["2026-02-15",73.9],["2026-02-24",74.3],["2026-02-28",75.5],["2026-03-04",73.4],
    ["2026-03-08",72.3],["2026-03-12",73.1],["2026-03-16",73.2],["2026-03-19",73.2],["2026-03-22",74.1],["2026-03-23",73.5],["2026-03-24",72.9],["2026-04-16",75.0],
    ["2026-05-12",75.9],["2026-05-17",76.7],["2026-08-04",75.5],["2026-08-13",75.2],["2026-08-14",74.9],
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
    {date:"2026-05-14",hrv:110,rhr:47,spo2:96,resp:13.0,sleep_score:88},
    {date:"2026-05-15",hrv:123,rhr:41,spo2:96,resp:12.0,sleep_score:75},
    {date:"2026-05-16",hrv:92,rhr:49,spo2:96,resp:14.0,sleep_score:null},
    {date:"2026-05-17",hrv:115,rhr:44,spo2:98,resp:12.0,sleep_score:95},
    {date:"2026-05-19",hrv:121,rhr:43,spo2:97,resp:12.0,sleep_score:95},
    {date:"2026-05-20",hrv:93,rhr:42,spo2:97,resp:11.0,sleep_score:88},
    {date:"2026-05-21",hrv:124,rhr:42,spo2:96,resp:12.0,sleep_score:95},
    {date:"2026-05-23",hrv:98,rhr:40,spo2:94,resp:10.0,sleep_score:95},
    {date:"2026-05-24",hrv:114,rhr:43,spo2:94,resp:12.0,sleep_score:95},
    {date:"2026-05-25",hrv:105,rhr:42,spo2:94,resp:12.0,sleep_score:88},
    {date:"2026-05-26",hrv:109,rhr:44,spo2:94,resp:13.0,sleep_score:95},
    {date:"2026-05-27",hrv:102,rhr:45,spo2:95,resp:13.0,sleep_score:null},
    {date:"2026-05-28",hrv:128,rhr:41,spo2:94,resp:11.0,sleep_score:95},
    {date:"2026-05-30",hrv:100,rhr:43,spo2:96,resp:12.0,sleep_score:88},
    {date:"2026-05-31",hrv:124,rhr:40,spo2:93,resp:12.0,sleep_score:95},
    {date:"2026-06-05",hrv:126,rhr:41,spo2:98,resp:11.0,sleep_score:88},
    {date:"2026-06-07",hrv:116,rhr:41,spo2:94,resp:12.0,sleep_score:95},
    {date:"2026-06-09",hrv:98,rhr:39,spo2:96,resp:11.0,sleep_score:95},
    {date:"2026-06-11",hrv:106,rhr:39,spo2:97,resp:11.0,sleep_score:95},
    {date:"2026-06-16",hrv:128,rhr:40,spo2:97,resp:12.0,sleep_score:95},
    {date:"2026-06-18",hrv:52,rhr:41,spo2:94,resp:11.0,sleep_score:null},
    {date:"2026-06-21",hrv:80,rhr:40,spo2:95,resp:12.0,sleep_score:null},
    {date:"2026-06-23",hrv:48,rhr:38,spo2:95,resp:11.0,sleep_score:null},
    {date:"2026-06-24",hrv:107,rhr:44,spo2:96,resp:13.0,sleep_score:null},
    {date:"2026-06-25",hrv:104,rhr:39,spo2:97,resp:11.0,sleep_score:95},
    {date:"2026-06-26",hrv:65,rhr:39,spo2:97,resp:11.0,sleep_score:null},
    {date:"2026-06-27",hrv:92,rhr:38,spo2:97,resp:11.0,sleep_score:95},
    {date:"2026-06-28",hrv:102,rhr:38,spo2:95,resp:11.0,sleep_score:95},
    {date:"2026-06-30",hrv:117,rhr:39,spo2:96,resp:11.0,sleep_score:95},
    {date:"2026-07-08",hrv:118,rhr:41,spo2:96,resp:12.0,sleep_score:95},
    {date:"2026-07-12",hrv:115,rhr:45,spo2:98,resp:13.0,sleep_score:null},
    {date:"2026-07-16",hrv:72,rhr:41,spo2:98,resp:12.0,sleep_score:null},
    {date:"2026-07-17",hrv:46,rhr:42,spo2:96,resp:12.0,sleep_score:null},
    {date:"2026-07-19",hrv:100,rhr:40,spo2:94,resp:12.0,sleep_score:95},
    {date:"2026-07-20",hrv:103,rhr:40,spo2:97,resp:11.0,sleep_score:95},
    {date:"2026-07-21",hrv:48,rhr:38,spo2:96,resp:11.0,sleep_score:null},
    {date:"2026-07-23",hrv:106,rhr:40,spo2:99,resp:11.0,sleep_score:95},
    {date:"2026-07-24",hrv:111,rhr:43,spo2:99,resp:12.0,sleep_score:88},
    {date:"2026-07-27",hrv:117,rhr:40,spo2:97,resp:11.0,sleep_score:95},
    {date:"2026-07-30",hrv:99,rhr:44,spo2:94,resp:12.0,sleep_score:88},
    {date:"2026-08-01",hrv:116,rhr:42,spo2:95,resp:12.0,sleep_score:95},
    {date:"2026-08-03",hrv:85,rhr:39,spo2:96,resp:11.0,sleep_score:88},
    {date:"2026-08-04",hrv:121,rhr:39,spo2:96,resp:11.0,sleep_score:75},
    {date:"2026-08-07",hrv:85,rhr:42,spo2:94,resp:11.0,sleep_score:null},
    {date:"2026-08-08",hrv:56,rhr:55,spo2:97,resp:15.0,sleep_score:null},
    {date:"2026-08-09",hrv:57,rhr:57,spo2:98,resp:15.0,sleep_score:null},
    {date:"2026-08-10",hrv:109,rhr:44,spo2:98,resp:13.0,sleep_score:95},
    {date:"2026-08-11",hrv:110,rhr:46,spo2:96,resp:13.0,sleep_score:null},
    {date:"2026-08-12",hrv:110,rhr:44,spo2:96,resp:12.0,sleep_score:null},
    {date:"2026-08-13",hrv:90,rhr:43,spo2:95,resp:12.0,sleep_score:88},
    {date:"2026-08-14",hrv:105,rhr:40,spo2:95,resp:11.0,sleep_score:88},
    {date:"2026-08-15",hrv:92,rhr:48,spo2:95,resp:12.0,sleep_score:null},
    {date:"2026-08-16",hrv:112,rhr:42,spo2:97,resp:12.0,sleep_score:88},
    {date:"2026-08-17",hrv:120,rhr:42,spo2:93,resp:12.0,sleep_score:95},
    {date:"2026-08-18",hrv:114,rhr:40,spo2:96,resp:12.0,sleep_score:95},
    {date:"2026-08-19",hrv:85,rhr:40,spo2:97,resp:11.0,sleep_score:88},
    {date:"2026-08-20",hrv:119,rhr:43,spo2:97,resp:12.0,sleep_score:null},
    {date:"2026-08-21",hrv:77,rhr:50,spo2:97,resp:12.0,sleep_score:null},
    {date:"2026-08-22",hrv:57,rhr:59,spo2:97,resp:14.0,sleep_score:null},
    {date:"2026-08-23",hrv:91,rhr:41,spo2:98,resp:11.0,sleep_score:95},
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
    {date:"2026-05-14",deep:70,rem:94,light:297,awake:2},
    {date:"2026-05-15",deep:114,rem:89,light:216,awake:0},
    {date:"2026-05-16",deep:102,rem:49,light:213,awake:9},
    {date:"2026-05-17",deep:93,rem:119,light:349,awake:3},
    {date:"2026-05-18",deep:129,rem:136,light:265,awake:0},
    {date:"2026-05-19",deep:100,rem:117,light:272,awake:2},
    {date:"2026-05-20",deep:139,rem:126,light:200,awake:4},
    {date:"2026-05-21",deep:101,rem:111,light:261,awake:5},
    {date:"2026-05-23",deep:110,rem:115,light:267,awake:8},
    {date:"2026-05-24",deep:77,rem:105,light:303,awake:3},
    {date:"2026-05-25",deep:106,rem:130,light:290,awake:5},
    {date:"2026-05-26",deep:111,rem:117,light:301,awake:2},
    {date:"2026-05-27",deep:109,rem:119,light:223,awake:29},
    {date:"2026-05-28",deep:134,rem:102,light:243,awake:0},
    {date:"2026-05-30",deep:121,rem:111,light:247,awake:10},
    {date:"2026-06-05",deep:114,rem:116,light:296,awake:3},
    {date:"2026-06-07",deep:93,rem:115,light:231,awake:1},
    {date:"2026-06-09",deep:151,rem:165,light:222,awake:1},
    {date:"2026-06-11",deep:112,rem:114,light:263,awake:17},
    {date:"2026-06-16",deep:76,rem:108,light:366,awake:1},
    {date:"2026-06-18",deep:192,rem:65,light:195,awake:21},
    {date:"2026-06-21",deep:152,rem:74,light:191,awake:25},
    {date:"2026-06-23",deep:174,rem:81,light:248,awake:8},
    {date:"2026-06-24",deep:65,rem:10,light:325,awake:0},
    {date:"2026-06-25",deep:130,rem:144,light:247,awake:0},
    {date:"2026-06-26",deep:114,rem:102,light:238,awake:15},
    {date:"2026-06-27",deep:132,rem:87,light:229,awake:8},
    {date:"2026-06-28",deep:121,rem:112,light:197,awake:3},
    {date:"2026-06-30",deep:103,rem:95,light:261,awake:8},
    {date:"2026-07-08",deep:112,rem:109,light:295,awake:2},
    {date:"2026-07-12",deep:44,rem:0,light:386,awake:2},
    {date:"2026-07-16",deep:97,rem:69,light:254,awake:10},
    {date:"2026-07-17",deep:191,rem:66,light:200,awake:12},
    {date:"2026-07-19",deep:90,rem:64,light:343,awake:6},
    {date:"2026-07-20",deep:98,rem:113,light:267,awake:26},
    {date:"2026-07-21",deep:224,rem:78,light:178,awake:2},
    {date:"2026-07-23",deep:91,rem:73,light:315,awake:8},
    {date:"2026-07-24",deep:83,rem:110,light:354,awake:5},
    {date:"2026-07-27",deep:71,rem:122,light:305,awake:7},
    {date:"2026-07-30",deep:64,rem:127,light:332,awake:3},
    {date:"2026-08-01",deep:87,rem:111,light:248,awake:1},
    {date:"2026-08-03",deep:137,rem:124,light:229,awake:6},
    {date:"2026-08-04",deep:97,rem:81,light:240,awake:12},
    {date:"2026-08-07",deep:155,rem:73,light:198,awake:7},
    {date:"2026-08-08",deep:77,rem:0,light:152,awake:25},
    {date:"2026-08-09",deep:30,rem:0,light:221,awake:15},
    {date:"2026-08-10",deep:65,rem:93,light:413,awake:5},
    {date:"2026-08-11",deep:80,rem:64,light:368,awake:12},
    {date:"2026-08-12",deep:52,rem:124,light:368,awake:18},
    {date:"2026-08-13",deep:104,rem:173,light:252,awake:12},
    {date:"2026-08-14",deep:173,rem:165,light:175,awake:0},
    {date:"2026-08-15",deep:66,rem:65,light:227,awake:20},
    {date:"2026-08-16",deep:129,rem:150,light:229,awake:3},
    {date:"2026-08-17",deep:100,rem:129,light:312,awake:8},
    {date:"2026-08-18",deep:120,rem:137,light:249,awake:1},
    {date:"2026-08-19",deep:148,rem:90,light:248,awake:14},
    {date:"2026-08-20",deep:52,rem:32,light:331,awake:8},
    {date:"2026-08-21",deep:55,rem:61,light:323,awake:34},
    {date:"2026-08-22",deep:59,rem:0,light:145,awake:12},
    {date:"2026-08-23",deep:115,rem:197,light:232,awake:0},
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
"23716186911": {
    date:"2026-07-24", name:"Hyrox group ", type:"group",
    totalTime:2456, avgHR:130, maxHR:172,
    description:``,
    photos:[],
    laps:[{i:1,t:320,avgHr:93,maxHr:112,dist:110,role:"station"},{i:2,t:571,avgHr:138,maxHr:172,dist:1202,role:"run"},{i:3,t:688,avgHr:128,maxHr:170,dist:186,role:"station"},{i:4,t:701,avgHr:145,maxHr:166,dist:430,role:"station"},{i:5,t:176,avgHr:119,maxHr:161,dist:14,role:"station"}],
  },
"23752567198": {
    date:"2026-07-27", name:"Hyrox group ", type:"group",
    totalTime:2308, avgHR:145, maxHR:170,
    description:`Row 1:58, skiErg 1:56`,
    photos:[],
    laps:[{i:1,t:307,avgHr:123,maxHr:153,dist:269,role:"station"},{i:2,t:417,avgHr:151,maxHr:170,dist:161,role:"station"},{i:3,t:141,avgHr:153,maxHr:169,dist:69,role:"station"},{i:4,t:124,avgHr:119,maxHr:153,dist:58,role:"station"},{i:5,t:146,avgHr:147,maxHr:161,dist:82,role:"station"},{i:6,t:428,avgHr:159,maxHr:169,dist:1030,role:"run"},{i:7,t:124,avgHr:121,maxHr:168,dist:73,role:"station"},{i:8,t:570,avgHr:150,maxHr:166,dist:165,role:"station"},{i:9,t:50,avgHr:149,maxHr:164,dist:22,role:"station"}],
  },
"23777920563": {
    date:"2026-07-29", name:"Hyrox group ", type:"group",
    totalTime:2849, avgHR:138, maxHR:175,
    description:`1km ski, row, run + sled push, trusters, burpees + 100WB`,
    photos:[],
    laps:[{i:1,t:563,avgHr:107,maxHr:129,dist:582,role:"run"},{i:2,t:130,avgHr:139,maxHr:158,dist:89,role:"station"},{i:3,t:16,avgHr:153,maxHr:156,dist:2,role:"station"},{i:4,t:414,avgHr:156,maxHr:168,dist:899,role:"run"},{i:5,t:426,avgHr:132,maxHr:167,dist:399,role:"station"},{i:6,t:125,avgHr:149,maxHr:154,dist:290,role:"station"},{i:7,t:139,avgHr:138,maxHr:152,dist:56,role:"station"},{i:8,t:685,avgHr:147,maxHr:167,dist:271,role:"station"},{i:9,t:264,avgHr:157,maxHr:175,dist:240,role:"station"},{i:10,t:89,avgHr:137,maxHr:171,dist:51,role:"station"}],
  },
"24039256230": {
    date:"2026-08-19", name:"Hyrox Full Simulation", type:"sim",
    totalTime:4256, avgHR:159, maxHR:176,
    description:``,
    photos:[],
    laps:[{i:1,t:272,avgHr:150,maxHr:165,dist:921,role:"run"},{i:2,t:247,avgHr:165,maxHr:169,dist:145,role:"station"},{i:3,t:286,avgHr:166,maxHr:170,dist:880,role:"run"},{i:4,t:136,avgHr:155,maxHr:170,dist:52,role:"station"},{i:5,t:310,avgHr:162,maxHr:167,dist:886,role:"run"},{i:6,t:192,avgHr:160,maxHr:165,dist:99,role:"station"},{i:7,t:327,avgHr:160,maxHr:166,dist:859,role:"run"},{i:8,t:261,avgHr:159,maxHr:164,dist:29,role:"station"},{i:9,t:355,avgHr:159,maxHr:163,dist:890,role:"run"},{i:10,t:263,avgHr:154,maxHr:162,dist:186,role:"station"},{i:11,t:343,avgHr:156,maxHr:161,dist:895,role:"run"},{i:12,t:197,avgHr:144,maxHr:160,dist:323,role:"station"},{i:13,t:325,avgHr:156,maxHr:162,dist:926,role:"run"},{i:14,t:225,avgHr:155,maxHr:160,dist:193,role:"station"},{i:15,t:300,avgHr:164,maxHr:170,dist:888,role:"run"},{i:16,t:216,avgHr:170,maxHr:176,dist:265,role:"station"}],
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
"Running","2026-08-23 14:56:09","false","Z2 10km","10,45","719","00:52:44","137","148","3,3","180","--","5:02","--","--","--","57","56","--","110,16","6,3","7,2","261","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:52:44","00:53:16","--","--"
"Cycling","2026-08-23 13:21:48","false","Vilnius Cycling","5,97","131","00:19:12","90","126","0,5","--","--","3:13","--","--","--","54","61","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:16:35","01:06:40","--","--"
"Cycling","2026-08-23 12:15:30","false","Vilnius Cycling","1,71","37","00:05:56","93","110","0,1","--","--","3:28","--","--","--","11","33","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:05:34","00:05:56","--","--"
"Strength Training","2026-08-23 11:13:49","false","Strength - DL, shoulders, back, dips","0,00","160","00:47:49","82","113","0,3","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:47:49","00:47:49","--","--"
"Cycling","2026-08-23 10:59:04","false","Vilnius Cycling","1,80","65","00:08:17","103","129","0,5","--","--","4:37","--","--","--","34","6","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:08:13","00:09:39","--","--"
"Running","2026-08-21 11:53:22","false","Z2 10km","10,02","685","00:51:29","135","145","3,1","179","--","5:08","--","--","--","50","53","--","109,00","6,7","7,5","266","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:51:28","00:52:04","--","--"
"Cycling","2026-08-20 08:46:24","false","Vilnius Cycling","6,80","153","00:25:14","93","120","0,3","--","--","3:42","--","--","--","76","64","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:24:55","09:12:07","--","--"
"Indoor Running","2026-08-19 19:17:50","false","Hyrox Full Simulation","8,44","1105","01:10:56","159","176","4,8","128","--","8:24","--","--","--","--","--","--","86,89","9,9","8,5","327","--","--","--","--","--","--","--","--","--","No","--","16","--","--","--","--","--","01:00:25","01:10:56","--","--"
"Cycling","2026-08-19 09:25:08","false","Vilnius Cycling","7,38","162","00:29:12","90","119","0,4","--","--","3:57","--","--","--","83","73","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:28:07","03:35:17","--","--"
"Tennis V2","2026-08-18 10:08:34","false","Tennis training ","0,22","491","01:43:25","89","133","0,5","12","--","462:57","--","--","--","--","--","--","18,77","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:04:22","01:43:25","--","--"
"Tennis V2","2026-08-17 19:15:41","false","sparring🎾Laurynas Pletkus","0,60","501","01:17:34","103","145","1,4","27","--","129:11","--","--","--","--","--","--","29,03","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:09:38","01:17:34","--","--"
"Cycling","2026-08-17 18:42:35","false","Vilnius Cycling","1,70","42","00:04:47","110","122","0,2","--","--","2:49","--","--","--","11","21","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:04:29","00:04:47","--","--"
"Running","2026-08-17 11:15:12","false","1h Z2","11,26","771","01:00:24","130","142","3,1","178","--","5:21","--","--","--","53","55","--","104,84","6,7","7,2","270","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","01:00:24","01:00:24","--","--"
"Cycling","2026-08-16 20:10:20","false","Vilnius Cycling","0,93","29","00:04:28","94","106","0,1","--","--","4:49","--","--","--","16","2","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:04:17","00:05:33","--","--"
"Cycling","2026-08-16 13:23:33","false","Vilnius Cycling","30,58","439","01:51:12","81","110","0,2","--","--","3:38","--","--","--","220","216","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","01:46:55","04:14:06","--","--"
"Cycling","2026-08-16 11:45:30","false","Vilnius Cycling","1,80","44","00:06:41","93","115","0,1","--","--","3:43","--","--","--","1","38","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:05:43","00:07:05","--","--"
"Strength Training","2026-08-16 10:23:39","false","DL + Skierg 1km, 200 lunges, 100 burpees","0,00","411","00:55:26","104","159","2,2","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:50:19","01:05:11","--","--"
"Cycling","2026-08-16 10:07:23","false","Vilnius Cycling","1,83","64","00:07:42","108","127","0,4","--","--","4:12","--","--","--","35","4","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:07:35","00:07:48","--","--"
"Cycling","2026-08-14 12:12:15","false","Vilnius Cycling","5,10","136","00:16:10","126","138","0,8","--","--","3:10","--","--","--","48","45","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:15:50","00:16:14","--","--"
"Strength Training","2026-08-14 10:26:59","false","Back+shoulder strength ","0,00","503","01:05:56","112","169","2,5","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","01:05:56","01:05:56","--","--"
"Cycling","2026-08-14 09:55:36","false","Vilnius Cycling","5,26","100","00:15:32","98","115","0,3","--","--","2:57","--","--","--","35","31","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:14:58","00:15:32","--","--"
"Running","2026-08-13 13:43:54","false","8x {600m Tempo + 10 BBJ}","7,60","726","00:47:27","153","172","4,1","140","--","6:14","--","--","--","67","67","--","110,58","7,0","8,0","301","--","--","--","--","--","--","--","--","--","No","--","30","--","--","--","--","--","00:40:52","00:47:27","--","--"
"Cycling","2026-08-13 09:22:22","false","Vilnius Cycling","6,69","166","00:23:24","98","135","0,9","--","--","3:29","--","--","--","80","67","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:22:28","03:41:34","--","--"
"Running","2026-08-11 19:38:07","false","Z2 60min","11,54","827","01:00:54","138","149","3,3","176","--","5:16","--","--","--","51","50","--","107,68","6,8","7,5","268","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","01:00:54","01:00:54","--","--"
"Cycling","2026-08-11 13:35:51","false","Vilnius Cycling","6,91","176","00:25:31","99","124","0,6","--","--","3:41","--","--","--","88","79","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:24:15","05:30:14","--","--"
"Tennis V2","2026-08-11 11:25:03","false","Tennis training ","0,30","401","00:54:48","104","153","1,6","20","--","179:12","--","--","--","--","--","--","28,50","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:04:56","00:54:48","--","--"
"Cycling","2026-08-10 20:37:15","false","Vilnius Cycling","1,60","58","00:05:56","112","131","0,4","--","--","3:41","--","--","--","22","12","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:05:01","00:05:56","--","--"
"Tennis V2","2026-08-10 19:08:46","false","Tennis","0,79","755","01:26:58","115","151","2,4","23","--","110:22","--","--","--","--","--","--","38,71","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:09:13","01:28:12","--","--"
"Cycling","2026-08-10 18:53:48","false","Vilnius Cycling","1,71","48","00:05:15","107","120","0,3","--","--","3:05","--","--","--","7","18","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:04:51","00:05:51","--","--"
"Cycling","2026-08-07 10:36:14","false","Vilnius Cycling","1,52","41","00:04:50","104","121","0,2","--","--","3:10","--","--","--","15","7","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:04:47","00:04:50","--","--"
"Tennis V2","2026-08-07 09:24:48","false","Tennis sparring","0,50","532","01:11:04","107","144","2,0","21","--","142:27","--","--","--","--","--","--","33,28","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:08:24","01:11:04","--","--"
"Cycling","2026-08-07 08:49:56","false","Vilnius Cycling","1,68","41","00:05:10","104","117","0,2","--","--","3:05","--","--","--","12","20","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:04:47","00:05:25","--","--"
"Cycling","2026-08-06 09:46:57","false","Vilnius Cycling","6,74","147","00:25:00","92","122","0,4","--","--","3:42","--","--","--","54","58","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:24:34","03:21:34","--","--"
"Cycling","2026-08-05 21:18:39","false","Vilnius Cycling","7,18","113","00:24:09","84","101","0,2","--","--","3:21","--","--","--","34","34","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:23:54","00:25:09","--","--"
"Tennis V2","2026-08-05 19:15:27","false","Tennis","0,46","773","01:55:51","103","175","2,3","19","--","252:31","--","--","--","--","--","--","20,57","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:08:30","02:01:27","--","--"
"Cycling","2026-08-05 18:48:55","false","Vilnius Cycling","6,95","155","00:17:39","109","121","0,8","--","--","2:32","--","--","--","38","44","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:17:36","00:19:27","--","--"
"Running","2026-08-05 08:52:48","false","Vilnius - Changing Tempo 6x1500","12,73","912","01:04:38","144","171","3,9","165","--","5:04","--","--","--","40","32","--","115,47","6,2","7,2","262","--","--","--","--","--","--","--","--","--","No","--","26","--","--","--","--","--","01:03:59","01:04:38","--","--"
"Cycling","2026-08-04 20:00:48","false","Vilnius Cycling","1,98","30","00:06:59","80","99","0,0","--","--","3:31","--","--","--","6","50","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:06:51","00:07:03","--","--"
"Strength Training","2026-08-04 19:07:06","false","Strength","0,00","84","00:12:07","94","130","0,3","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:12:07","00:12:07","--","--"
"Indoor Cardio","2026-08-04 18:38:51","false","ROXFIT(3)","0,00","289","00:24:35","130","164","2,5","--","--","--","--","--","--","0","0","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","9","--","--","--","--","--","00:24:35","00:24:36","--","--"
"Cycling","2026-08-04 18:23:33","false","Vilnius Cycling","1,39","28","00:04:41","90","99","0,1","--","--","3:22","--","--","--","8","3","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:04:35","00:05:13","--","--"
"Cycling","2026-08-04 07:45:49","false","Vilnius Cycling","3,63","106","00:14:22","101","125","0,5","--","--","3:57","--","--","--","58","13","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:14:09","09:23:27","--","--"
"Tennis V2","2026-08-03 19:19:55","false","Tennis","0,57","648","01:11:00","120","161","2,5","27","--","125:18","--","--","--","--","--","--","29,38","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:08:34","01:11:00","--","--"
"Tennis V2","2026-08-03 10:09:16","false","Tennis","0,39","520","01:31:25","93","138","1,3","15","--","234:44","--","--","--","--","--","--","28,00","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:06:21","01:34:46","--","--"
"Running","2026-08-02 09:45:49","false","Vilnius Running","8,22","563","00:42:06","131","143","3,0","177","--","5:07","--","--","--","40","28","--","110,13","6,6","7,5","268","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:42:05","00:42:20","--","--"
"Rowing V2","2026-08-01 15:29:52","false","Trakai Rowing","2,19","156","00:43:41","77","112","0,1","--","--","19:54","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","5","--","--","--","--","--","00:35:50","00:47:03","--","--"
"Cycling","2026-08-01 13:05:41","false","Vilnius Cycling","4,98","130","00:13:48","161","230","1,7","--","--","2:46","--","--","--","35","97","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:13:32","00:14:31","--","--"
"Tennis V2","2026-08-01 11:13:23","false","Tennis","0,53","398","01:25:01","91","145","0,5","22","--","160:15","--","--","--","--","--","--","28,22","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:08:38","01:27:54","--","--"
"Cycling","2026-08-01 10:32:47","false","Vilnius Cycling","5,08","141","00:18:16","106","139","0,8","--","--","3:35","--","--","--","92","24","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:18:07","00:18:16","--","--"
"Strength Training","2026-07-31 17:26:05","false","Strength","0,00","333","01:01:20","92","142","1,4","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","01:01:20","01:01:20","--","--"
"Tennis V2","2026-07-31 09:20:07","false","Tennis","1,71","1178","02:45:30","111","162","2,6","28","--","96:53","--","--","--","--","--","--","36,54","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:24:29","02:45:30","--","--"
"Cycling","2026-07-30 09:46:29","false","Vilnius Cycling","7,37","176","00:25:43","97","129","0,8","--","--","3:29","--","--","--","74","62","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:25:16","04:24:42","--","--"
"Indoor Running","2026-07-29 17:59:46","false","Indoor Running","2,88","611","00:47:29","138","175","3,4","78","--","16:30","--","--","--","--","--","--","72,40","15,6","10,3","435","--","--","--","--","--","--","--","--","--","No","--","10","--","--","--","--","--","00:32:24","00:50:41","--","--"
"Tennis V2","2026-07-29 10:00:07","false","Tennis training ","0,63","756","02:08:20","97","160","2,1","16","--","205:45","--","--","--","--","--","--","30,25","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:10:22","02:08:20","--","--"
"Cycling","2026-07-28 21:15:06","false","Vilnius Cycling","2,13","25","00:07:24","75","84","0,0","--","--","3:28","--","--","--","11","51","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:05:40","00:07:48","--","--"
"Indoor Cardio","2026-07-28 19:27:21","false","Cardio","0,00","393","00:47:40","109","161","2,2","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","11","--","--","--","--","--","00:47:40","00:47:40","--","--"
"Cycling","2026-07-28 19:14:46","false","Vilnius Cycling","2,25","75","00:09:55","102","122","0,4","--","--","4:24","--","--","--","51","4","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:09:36","00:10:48","--","--"
"Indoor Running","2026-07-27 19:04:26","false","Hyrox group ","1,93","538","00:38:28","145","170","3,4","67","--","19:56","--","--","--","--","--","--","84,07","8,9","8,4","439","--","--","--","--","--","--","--","--","--","No","--","9","--","--","--","--","--","00:23:27","00:44:07","--","--"
"Running","2026-07-26 14:06:54","false","Vilnius Running","12,84","898","01:08:21","136","145","3,3","180","--","5:19","--","--","--","75","79","--","104,30","6,4","6,9","268","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","01:08:21","01:08:21","--","--"
"Walking","2026-07-24 21:45:00","false","Walking","0,00","93","01:00:13","59","74","0,0","4","--","16666:39","--","--","--","--","--","--","1,57","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:00:06","01:00:13","--","--"
"Indoor Running","2026-07-24 17:05:30","false","Hyrox group ","1,94","471","00:40:56","130","172","3,0","60","--","21:04","--","--","--","--","--","--","73,81","5,6","4,2","448","--","--","--","--","--","--","--","--","--","No","--","5","--","--","--","--","--","00:21:20","00:43:59","--","--"
"Running","2026-07-24 09:01:06","false","Recovery run 5km","5,50","375","00:30:08","124","139","2,3","176","--","5:28","--","--","--","23","27","--","103,96","7,0","7,5","268","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:30:08","00:30:08","--","--"
"Tennis V2","2026-07-23 17:26:26","false","Tennis","0,87","830","01:41:22","114","156","2,3","25","--","117:22","--","--","--","--","--","--","33,83","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:12:51","01:41:22","--","--"
"Cycling","2026-07-23 09:43:19","false","Vilnius Cycling","7,21","198","00:26:05","101","127","0,7","--","--","3:37","--","--","--","72","60","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:23:38","05:59:36","--","--"
"Tennis V2","2026-07-22 09:59:37","false","Tennis","0,25","459","01:05:13","102","148","1,9","14","--","256:24","--","--","--","--","--","--","28,95","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:04:15","01:05:13","--","--"
"Tennis V2","2026-07-26 09:03:50","false","Tomas Stulpinas 🎾7/6(2) 6/4","1,06","669","01:44:16","101","146","1,9","30","--","98:37","--","--","--","--","--","--","34,12","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:15:28","01:44:16","--","--"
"Cycling","2026-07-25 09:56:23","false","Vilnius Cycling","18,89","321","01:09:36","84","122","0,5","--","--","3:41","--","--","--","120","112","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","01:06:11","10:47:49","--","--"
"Running","2026-07-21 09:27:02","false","Palanga - Changing Tempo 6x1500","14,38","1045","01:14:21","140","170","3,9","171","--","5:10","--","--","--","16","15","--","110,93","6,6","7,3","254","--","--","--","--","--","--","--","--","--","No","--","26","--","--","--","--","--","01:14:11","01:14:36","--","--"
"Treadmill Running","2026-07-18 18:55:10","false","Treadmill Running","5,57","322","00:30:24","127","135","1,8","178","--","5:27","--","--","--","--","--","--","103,35","6,4","6,8","274","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:30:17","00:30:24","--","--"
"Strength Training","2026-07-18 18:13:15","false","Strength","0,00","240","00:37:53","100","158","1,7","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:37:53","00:37:53","--","--"
"Indoor Rowing","2026-07-18 17:44:00","false","Indoor Rowing","2,00","107","00:08:03","139","153","1,5","--","--","4:01","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:08:03","00:08:03","--","--"
"Cycling","2026-07-17 12:33:30","false","Palanga Cycling","3,22","67","00:10:10","99","109","0,2","--","--","3:09","--","--","--","8","12","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:10:03","00:16:10","--","--"
"Strength Training","2026-07-17 12:17:30","false","Strength","0,00","74","00:15:03","91","138","0,2","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:15:03","00:15:03","--","--"
"Cycling","2026-07-17 12:06:52","false","Palanga Cycling","3,16","54","00:09:40","92","104","0,1","--","--","3:03","--","--","--","10","5","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:09:37","00:09:40","--","--"
"Inline Skating","2026-07-14 17:21:10","false","Palanga Inline Skating","10,04","208","00:39:45","99","114","0,4","--","--","3:57","--","--","--","11","9","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:39:34","00:39:45","--","--"
"Cycling","2026-07-11 12:22:43","false","Recovery ride","5,49","84","00:21:03","84","97","0,2","--","--","3:50","--","--","--","32","25","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:20:58","00:35:44","--","--"
"Cycling","2026-07-11 08:17:54","false","Nida Z2 ride","101,48","2509","03:26:36","128","150","3,7","--","--","2:02","--","--","--","550","545","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","03:26:31","04:00:30","--","--"
"Treadmill Running","2026-07-20 10:49:19","false","Treadmill Running","2,76","135","00:15:18","118","130","0,6","172","--","5:33","--","--","--","--","--","--","105,36","6,8","7,2","277","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:14:56","00:15:18","--","--"
"Strength Training","2026-07-20 09:56:30","false","Sled push-pull, kettlebells, bench press, WBx100 (3:30min)","0,00","406","00:51:53","116","164","2,0","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:48:11","00:51:53","--","--"
"Treadmill Running","2026-07-20 09:34:17","false","Treadmill Running","4,04","262","00:19:28","143","157","2,3","181","--","4:49","--","--","--","--","--","--","113,41","6,1","7,1","260","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:19:21","00:19:28","--","--"
"Tennis V2","2026-07-19 09:10:06","false","Povilas🎾4/6 4/6","1,01","646","01:52:11","104","149","0,9","26","--","111:06","--","--","--","--","--","--","34,30","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:14:26","01:52:11","--","--"
"Running","2026-07-16 17:35:17","false","Palanga - 16x400m Speed","10,72","735","00:55:44","139","170","3,3","164","--","5:12","--","--","--","30","28","--","114,81","6,6","7,5","256","--","--","--","--","--","--","--","--","--","No","--","34","--","--","--","--","--","00:55:27","00:55:44","--","--"
"Tennis V2","2026-07-16 08:01:06","false","Tennis","0,31","363","01:01:43","104","145","0,9","17","--","198:24","--","--","--","--","--","--","29,42","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:04:16","01:01:43","--","--"
"Inline Skating","2026-07-15 19:44:22","false","Palanga Inline Skating","12,00","318","00:52:12","105","146","0,5","--","--","4:21","--","--","--","11","5","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:27:04","01:34:52","--","--"
"Strength Training","2026-07-15 17:59:01","false","Strength","0,00","356","00:45:43","116","169","2,1","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:45:43","00:45:43","--","--"
"Cycling","2026-07-15 10:42:11","false","Palanga Cycling","6,29","104","00:20:58","86","97","0,2","--","--","3:20","--","--","--","9","11","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:20:57","00:22:11","--","--"
"Tennis V2","2026-07-15 09:10:48","false","Tennis","1,30","355","01:26:10","90","135","0,3","33","--","66:24","--","--","--","--","--","--","45,09","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:15:49","01:26:10","--","--"
"Cycling","2026-07-15 08:36:28","false","Palanga Cycling","6,59","109","00:22:20","87","101","0,2","--","--","3:23","--","--","--","18","10","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:22:16","00:26:54","--","--"
"Tennis V2","2026-07-14 08:11:18","false","Tennis","0,25","328","00:49:43","108","152","1,1","14","--","198:24","--","--","--","--","--","--","34,96","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:03:34","00:49:43","--","--"
"Strength Training","2026-07-13 17:06:32","false","Strength","0,00","497","01:10:37","111","164","1,9","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","01:10:37","01:10:37","--","--"
"Tennis V2","2026-07-13 14:34:23","false","Tennis","0,22","108","00:27:42","86","145","0,4","16","--","128:12","--","--","--","--","--","--","48,92","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:02:51","00:27:42","--","--"
"Cycling","2026-07-12 20:28:42","false","Palanga Cycling","12,78","221","00:49:06","86","114","0,3","--","--","3:50","--","--","--","17","21","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:48:54","03:21:46","--","--"
"Running","2026-07-12 14:09:28","false","Palanga Running","7,40","497","00:41:23","130","139","2,3","176","--","5:35","--","--","--","12","13","--","102,13","7,0","7,3","274","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:41:19","00:41:38","--","--"
"Strength Training","2026-07-12 13:13:20","false","Strength","0,00","263","00:51:46","97","158","0,9","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:51:46","00:51:46","--","--"
"Running","2026-07-12 12:30:52","false","Palanga Running","6,26","415","00:33:04","132","140","2,3","176","--","5:17","--","--","--","13","6","--","106,52","6,3","6,9","272","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:33:02","00:33:12","--","--"
"Cycling","2026-07-12 10:09:16","false","Palanga Cycling","6,56","123","00:20:48","94","110","0,3","--","--","3:10","--","--","--","11","12","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:20:41","00:25:48","--","--"
"Tennis V2","2026-07-12 09:09:33","false","2/6🎾Deividas Mikaliūnas ","0,37","309","00:51:01","104","140","0,6","24","--","138:53","--","--","--","--","--","--","30,30","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:05:09","00:51:01","--","--"
"Cycling","2026-07-12 08:39:50","false","Palanga Cycling","6,38","127","00:21:34","96","114","0,3","--","--","3:22","--","--","--","14","9","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:21:31","00:22:53","--","--"
"Running","2026-07-08 10:17:05","false","Z2 10km","10,11","491","00:50:08","140","156","2,2","180","--","4:57","--","--","--","47","44","--","111,85","6,3","7,3","264","--","--","--","--","--","--","--","--","--","No","--","2","--","--","--","--","--","00:50:08","00:50:08","--","--"
"Tennis V2","2026-07-07 16:30:03","false","Tennis","0,71","544","01:30:32","109","162","1,2","25","--","128:12","--","--","--","--","--","--","31,00","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:10:50","01:30:32","--","--"
"Cycling","2026-07-05 17:48:00","false","Vilnius Cycling","4,44","82","00:18:28","86","110","0,1","--","--","4:09","--","--","--","49","42","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:17:32","00:49:52","--","--"
"Running","2026-07-05 10:33:36","false","Vilnius - Threshold Endurance","14,33","986","01:09:07","150","172","3,9","180","--","4:49","--","--","--","78","81","--","114,65","6,2","7,3","264","--","--","--","--","--","--","--","--","--","No","--","15","--","--","--","--","--","01:09:03","01:09:07","--","--"
"Tennis V2","2026-07-07 10:03:53","false","Tennis","0,18","366","01:34:12","87","152","0,3","10","--","520:49","--","--","--","--","--","--","20,32","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:03:18","01:34:12","--","--"
"Cycling","2026-07-06 13:09:31","false","Vilnius Cycling","5,52","108","00:17:15","100","116","0,4","--","--","3:07","--","--","--","70","80","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:16:51","00:18:19","--","--"
"Other","2026-07-06 12:29:25","false","Sauna","0,00","43","00:15:45","76","130","0,0","0","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:15:45","00:15:45","--","--"
"Strength Training","2026-07-06 11:26:52","false","Strength ","0,00","437","00:52:44","121","164","2,2","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:52:44","00:52:44","--","--"
"Cycling","2026-07-06 10:56:50","false","Vilnius Cycling","5,25","90","00:15:25","97","120","0,3","--","--","2:56","--","--","--","34","29","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:15:22","00:17:58","--","--"
"Strength Training","2026-07-04 13:27:09","false","Strength","0,00","177","00:57:58","80","141","0,3","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","--","No","--","1","--","--","--","--","--","00:57:58","00:57:58","--","--"
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

const TODAY = "2026-08-23";
// LAST_RUN: when update.py last attempted a sync (any outcome). LAST_DATA: when fresh Garmin data was last ingested. Both ISO UTC, written by update.py.
const LAST_RUN  = "2026-08-23T22:07:00Z";
const LAST_DATA = "2026-08-23T22:07:00Z";

// Column layout that update.py's fetch_activities() actually writes: 44 fields.
// The header row embedded in CSV_DATA is the older 42-column Garmin export
// layout, so mapping bot-written rows through it shifts every running-dynamics
// column by two — that is what used to surface as "GCT 109ms" (really the
// stride length) and "vertical ratio 53%" (really the elevation loss).
// Rows are therefore mapped by field count: 44 → this layout, anything else →
// the embedded header, which still describes the older hand-imported rows.
// Positions update.py leaves as "--" are named _spare so nothing reads them.
const COLS_BOT = [
  "Activity Type","Date","Favorite","Title","Distance","Calories","Time",
  "Avg HR","Max HR","Aerobic TE","Avg Run Cadence","Max Run Cadence",
  "Avg Speed","Max Speed","_spare14","_spare15","Total Ascent","Total Descent",
  "_spare18","Avg Stride Length","Avg Vertical Ratio","Avg Vertical Oscillation",
  "Avg Ground Contact Time","_spare23","_spare24","_spare25","_spare26",
  "_spare27","_spare28","_spare29","_spare30","Body Battery Drain",
  "Decompression","Best Lap Time","Number of Laps","_spare35","_spare36",
  "_spare37","_spare38","_spare39","Moving Time","Elapsed Time",
  "Min Elevation","Max Elevation",
];

function splitCsvLine(line) {
  const vals = []; let cur = "", inQ = false;
  for (const ch of line) {
    if (ch === '"') inQ = !inQ;
    else if (ch === ',' && !inQ) { vals.push(cur.trim()); cur = ""; }
    else cur += ch;
  }
  vals.push(cur.trim().replace(/\r/g,""));
  return vals.map(v => v.replace(/"/g,"").trim());
}

function parseCSV(raw) {
  const lines = raw.trim().split("\n");
  const headers = splitCsvLine(lines[0]).map(h => h.replace(/\r/g,""));
  return lines.slice(1).map(line => {
    const vals = splitCsvLine(line);
    const cols = vals.length === COLS_BOT.length ? COLS_BOT : headers;
    const obj = {};
    cols.forEach((h, i) => obj[h] = vals[i] || "");
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

const COLORS = { run:"#fb923c", hyrox:"#a78bfa", tennis:"#38bdf8", strength:"#34d399", cycling:"#fbbf24", recovery:"#f472b6", other:"#94a3b8" };

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

  // Weekly TRIMP (last 8 weeks), with real ISO date bounds so the LOAD tab
  // can match each week against TAPER_PLAN without re-parsing display labels.
  const fmtShort = (d) => d.toLocaleDateString('en', { month:'short', day:'numeric' });
  const weeklyTrimp = [];
  for (let w = 7; w >= 0; w--) {
    const start = w * 7 + 1, end = (w + 1) * 7;
    const trimp = enriched.filter(a => a._days >= start && a._days <= end).reduce((s,a) => s + a._trimp, 0);
    const weekStart = new Date(TODAY); weekStart.setDate(weekStart.getDate() - end);
    const weekEnd = new Date(TODAY); weekEnd.setDate(weekEnd.getDate() - start);
    const weekStartISO = weekStart.toISOString().slice(0,10);
    const weekEndISO = weekEnd.toISOString().slice(0,10);
    const wLabel = weekStart.getMonth() === weekEnd.getMonth()
      ? `${fmtShort(weekStart)}–${weekEnd.getDate()}`
      : `${fmtShort(weekStart)}–${fmtShort(weekEnd)}`;
    weeklyTrimp.push({ label: wLabel, trimp: Math.round(trimp), daysAgo: start, weekStartISO, weekEndISO });
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

const RACE = { name:"HYROX ATHENS", dateISO:"2026-09-05", label:"SEP 5", target:"1:10:00" };

// Single source of truth for weekly TRIMP targets through race day.
// Used by both the LOAD tab's weekly bars AND the roadmap — replaces the old
// hardcoded May-30-Riga-date target logic that made every current bar read hi=0.
const TAPER_PLAN = [
  { start:"2026-07-27", end:"2026-08-02", theme:"Specificity",  lo:400, hi:460, note:"Rebuild Hyrox specificity · erg baselines" },
  { start:"2026-08-03", end:"2026-08-09", theme:"Erg Engine",   lo:440, hi:500, note:"Ski/row volume · compromised running" },
  { start:"2026-08-10", end:"2026-08-16", theme:"Full Sim #1",  lo:420, hi:480, note:"Sim at 1:12–1:13 · log all splits" },
  { start:"2026-08-17", end:"2026-08-23", theme:"Peak Load",    lo:470, hi:540, note:"Highest week · heat acclimation starts" },
  { start:"2026-08-24", end:"2026-08-30", theme:"Sharpen",      lo:300, hi:360, note:"Half sim at exact Athens splits" },
  { start:"2026-08-31", end:"2026-09-05", theme:"Race Week 🏁", lo:100, hi:200, note:"Cut 40% · activate only · TSB +10→+20" },
];

// Look up the target band for a week given its [startISO, endISO] range.
// Falls back to a generic base-phase target before the taper plan starts,
// and to a rest target after race day.
function getWeekTarget(startISO, endISO) {
  const hit = TAPER_PLAN.find(b => startISO <= b.end && endISO >= b.start);
  if (hit) return hit;
  if (endISO < TAPER_PLAN[0].start) return { theme:"Build phase", lo:350, hi:480, note:"Aerobic base + strength" };
  return { theme:"Post-race", lo:0, hi:0, note:"Recovery" };
}

const SCHEDULE = [
  { week:1, label:"Jul 27–Aug 2", theme:"Specificity Restart", days:[
    { date:"2026-07-27", dow:"MON", label:"Jul 27", sessions:[{type:"hyrox",text:"Hyrox group · evening",cal:true},{type:"plan",text:"✅ DONE · ski 2×500m @ 1:56 + row 2×500m @ 1:58 (fatigued) · 1000m TT still owed"}] },
    { date:"2026-07-28", dow:"TUE", label:"Jul 28", sessions:[{type:"tennis",text:"Tennis 🎾 · morning",cal:true},{type:"plan",text:"✅ SKI 1000m TT = 3:54 (1:57/500m) · 45s faster than Riga's 4:39 · row TT deferred (heavy legs)"}] },
    { date:"2026-07-29", dow:"WED", label:"Jul 29", sessions:[{type:"tennis",text:"Tennis 🎾 · morning",cal:true},{type:"hyrox",text:"Hyrox group · evening",cal:true}] },
    { date:"2026-07-30", dow:"THU", label:"Jul 30", sessions:[{type:"plan",text:"ROW 1000m TT first (fresh legs), then threshold 3×1km @ 4:20/km · TT is the priority"}] },
    { date:"2026-07-31", dow:"FRI", label:"Jul 31", sessions:[{type:"tennis",text:"Tennis 🎾",cal:true},{type:"plan",text:"Strength 45min · sled PULL 6×25m technique + BBJ 5×20m @ 70s + lat pulldown 4×10"}] },
    { date:"2026-08-01", dow:"SAT", label:"Aug 1", sessions:[{type:"hyrox",text:"HALF SIM · 4×1km @ 4:40 + Ski / Sled Push / Sled Pull / BBJ · JOG every transition"}] },
    { date:"2026-08-02", dow:"SUN", label:"Aug 2", sessions:[{type:"rest",text:"Full rest · family day"}] },
  ]},
  { week:2, label:"Aug 3–9", theme:"Erg Engine", days:[
    { date:"2026-08-03", dow:"MON", label:"Aug 3", sessions:[{type:"hyrox",text:"Hyrox group · evening",cal:true},{type:"plan",text:"After: 3×500m ski @ 2:07/500m"}] },
    { date:"2026-08-04", dow:"TUE", label:"Aug 4", sessions:[{type:"tennis",text:"Tennis 🎾 · morning",cal:true},{type:"plan",text:"4×1000m ski @ 2:03/500m · 2min rest · hold the split the whole 1000m, no fade"}] },
    { date:"2026-08-05", dow:"WED", label:"Aug 5", sessions:[{type:"tennis",text:"Tennis 🎾",cal:true},{type:"hyrox",text:"Hyrox group · evening",cal:true}] },
    { date:"2026-08-06", dow:"THU", label:"Aug 6", sessions:[{type:"plan",text:"COMPROMISED: [1000m ski → 1km run @ 4:35] ×3 · this exact pattern cost you Riga"}] },
    { date:"2026-08-07", dow:"FRI", label:"Aug 7", sessions:[{type:"tennis",text:"Tennis 🎾",cal:true},{type:"plan",text:"Strength 45min · sled pull 8×25m heavy · lunges 4×50m · wall balls 2×25 (maintain only)"}] },
    { date:"2026-08-08", dow:"SAT", label:"Aug 8", sessions:[{type:"plan",text:"Long run 70min · last 20min @ 4:40/km · aerobic base + race-pace top-up"}] },
    { date:"2026-08-09", dow:"SUN", label:"Aug 9", sessions:[{type:"rest",text:"Rest · family day"}] },
  ]},
  { week:3, label:"Aug 10–16", theme:"Full Sim #1", days:[
    { date:"2026-08-10", dow:"MON", label:"Aug 10", sessions:[{type:"hyrox",text:"Hyrox group · evening",cal:true}] },
    { date:"2026-08-11", dow:"TUE", label:"Aug 11", sessions:[{type:"tennis",text:"Tennis 🎾",cal:true},{type:"plan",text:"Erg endurance 4×1000m ski @ 4:10 · 2min rest · revised target, hold it"}] },
    { date:"2026-08-12", dow:"WED", label:"Aug 12", sessions:[{type:"tennis",text:"Tennis 🎾",cal:true},{type:"plan",text:"BBJ block 6×20m @ 68s · 75s rest · rhythm over power · + 15min core"}] },
    { date:"2026-08-13", dow:"THU", label:"Aug 13", sessions:[{type:"plan",text:"Easy 30min Z2 jog · freshen up for Saturday"}] },
    { date:"2026-08-14", dow:"FRI", label:"Aug 14", sessions:[{type:"tennis",text:"Tennis 🎾 · light only, no sparring",cal:true}] },
    { date:"2026-08-15", dow:"SAT", label:"Aug 15", sessions:[{type:"hyrox",text:"🏁 FULL RACE SIM #1 · target 1:12–1:13 · log EVERY split incl. roxzone"}] },
    { date:"2026-08-16", dow:"SUN", label:"Aug 16", sessions:[{type:"rest",text:"Full rest"}] },
  ]},
  { week:4, label:"Aug 17–23", theme:"Peak Load", days:[
    { date:"2026-08-17", dow:"MON", label:"Aug 17", sessions:[{type:"rest",text:"Rest / 30min easy walk · sim recovery"}] },
    { date:"2026-08-18", dow:"TUE", label:"Aug 18", sessions:[{type:"tennis",text:"Tennis 🎾",cal:true},{type:"hyrox",text:"Hyrox group · evening",cal:true}] },
    { date:"2026-08-19", dow:"WED", label:"Aug 19", sessions:[{type:"plan",text:"4×[1000m row @ 2:05/500m + 1km run @ 4:35] continuous · the exact Athens pattern"}] },
    { date:"2026-08-20", dow:"THU", label:"Aug 20", sessions:[{type:"tennis",text:"Tennis 🎾",cal:true},{type:"plan",text:"🔥 Sauna 20min post-session · heat acclimation starts (Athens will be 30°C+)"}] },
    { date:"2026-08-21", dow:"FRI", label:"Aug 21", sessions:[{type:"hyrox",text:"Hyrox group · evening",cal:true},{type:"plan",text:"After: sled pull 6×25m + 100 wall balls unbroken-ish"}] },
    { date:"2026-08-22", dow:"SAT", label:"Aug 22", sessions:[{type:"plan",text:"Compromised long: 5×[1km @ 4:35 + 1 station] continuous · peak specificity"}] },
    { date:"2026-08-23", dow:"SUN", label:"Aug 23", sessions:[{type:"rest",text:"Rest · family day · 🔥 sauna 20min"}] },
  ]},
  { week:5, label:"Aug 24–30", theme:"Sharpen", days:[
    { date:"2026-08-24", dow:"MON", label:"Aug 24", sessions:[{type:"hyrox",text:"Hyrox group · evening · moderate, don't race it",cal:true}] },
    { date:"2026-08-25", dow:"TUE", label:"Aug 25", sessions:[{type:"tennis",text:"Tennis 🎾",cal:true},{type:"plan",text:"Erg 6×500m @ 2:05 · 90s rest · sharp not deep · 🔥 sauna 20min"}] },
    { date:"2026-08-26", dow:"WED", label:"Aug 26", sessions:[{type:"plan",text:"Run 45min · 4×3min @ 4:30/km · sharpening only"}] },
    { date:"2026-08-27", dow:"THU", label:"Aug 27", sessions:[{type:"tennis",text:"Tennis 🎾 · light",cal:true},{type:"plan",text:"🔥 Sauna 20min"}] },
    { date:"2026-08-28", dow:"FRI", label:"Aug 28", sessions:[{type:"rest",text:"Rest or 25min easy jog"}] },
    { date:"2026-08-29", dow:"SAT", label:"Aug 29", sessions:[{type:"hyrox",text:"🏁 SIM #2 · HALF distance at EXACT Athens splits · 4 runs @ 4:36 + 4 stations · rehearsal not test"}] },
    { date:"2026-08-30", dow:"SUN", label:"Aug 30", sessions:[{type:"rest",text:"Rest · 🔥 sauna 20min"}] },
  ]},
  { week:6, label:"Aug 31–Sep 5", theme:"🏁 Race Week — Taper", days:[
    { date:"2026-08-31", dow:"MON", label:"Aug 31", sessions:[{type:"rest",text:"Rest / 30min easy walk"}] },
    { date:"2026-09-01", dow:"TUE", label:"Sep 1", sessions:[{type:"plan",text:"30min Z2 + 4×30s strides · legs only, zero fatigue"},{type:"plan",text:"🔥 Sauna 20min · final heat prep"}] },
    { date:"2026-09-02", dow:"WED", label:"Sep 2", sessions:[{type:"plan",text:"Activation 25min: jog + 3×20m BBJ + 2×500m ski @ race pace + 25 wall balls · NO fatigue"}] },
    { date:"2026-09-03", dow:"THU", label:"Sep 3", sessions:[{type:"rest",text:"Rest · hydrate + electrolytes · start carb load"}] },
    { date:"2026-09-04", dow:"FRI", label:"Sep 4", sessions:[{type:"rest",text:"✈️ Travel to Athens · 20min shakeout · WALK THE ROXZONE ROUTE at the venue"}] },
    { date:"2026-09-05", dow:"SAT", label:"Sep 5", sessions:[{type:"race",text:"🏁 HYROX ATHENS · Metropolitan Expo · TARGET 1:10:00",cal:true}] },
  ]},
];

/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN SYSTEM — dark athletic cockpit
   One accent (violet). Colour is reserved for STATUS, never for decoration:
   green = good / on target, amber = watch, red = act. Everything else is
   ink on slate. Numbers are the loudest thing on the screen.
   ═══════════════════════════════════════════════════════════════════════════ */
const T = {
  bg:      "#0b0f19",   // canvas
  bgSoft:  "#0e1422",   // sticky chrome
  panel:   "#121a2b",   // card surface
  panelHi: "#172136",   // raised / hovered surface
  line:    "#232e45",   // card border
  lineDim: "#1a2436",   // inner dividers
  ink:     "#eef2fb",   // primary text
  ink2:    "#97a4bd",   // secondary text
  ink3:    "#5f6b85",   // labels / axis
  accent:  "#8b5cf6",
  accentIn:"#c4b5fd",
  accentBg:"rgba(139,92,246,0.12)",
  ok:      "#34d399",
  okBg:    "rgba(52,211,153,0.10)",
  warn:    "#fbbf24",
  warnBg:  "rgba(251,191,36,0.10)",
  bad:     "#f87171",
  badBg:   "rgba(248,113,113,0.10)",
  info:    "#38bdf8",
  infoBg:  "rgba(56,189,248,0.10)",
  run:     "#fb923c",
};

// Session-type styling for the plan (same keys update-time code expects)
const SS = {
  hyrox:  { bg:"rgba(139,92,246,0.11)", border:"rgba(139,92,246,0.35)", text:"#cbbcff", dot:"#8b5cf6" },
  tennis: { bg:"rgba(56,189,248,0.10)",  border:"rgba(56,189,248,0.30)", text:"#a5dcf7", dot:"#38bdf8" },
  plan:   { bg:"rgba(255,255,255,0.03)", border:"#232e45",               text:"#b7c2d6", dot:"#5f6b85" },
  rest:   { bg:"transparent",            border:"#1c2637",               text:"#6d7992", dot:"#2c3850" },
  race:   { bg:"rgba(251,191,36,0.12)",  border:"rgba(251,191,36,0.40)", text:"#f5cf6d", dot:"#fbbf24" },
  other:  { bg:"rgba(52,211,153,0.10)",  border:"rgba(52,211,153,0.30)", text:"#8fe3c4", dot:"#34d399" },
};

const GLOBAL_CSS = `
:root { color-scheme: dark; }
* , *::before, *::after { box-sizing: border-box; }
html, body { background:${T.bg}; }
body {
  margin:0; color:${T.ink};
  font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;
  -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
}
::selection { background:rgba(139,92,246,0.35); }
button, input, textarea { font-family:inherit; }
a { color:${T.accentIn}; }

.wrap { max-width:1280px; margin:0 auto; padding:0 22px; }
@media (max-width:640px){ .wrap { padding:0 14px; } }

.grid { display:grid; gap:12px; }
.g2 { grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); }
.g3 { grid-template-columns:repeat(auto-fit,minmax(168px,1fr)); }
.g4 { grid-template-columns:repeat(auto-fit,minmax(132px,1fr)); }
.g5 { grid-template-columns:repeat(auto-fit,minmax(108px,1fr)); }
.split { display:grid; gap:16px; grid-template-columns:minmax(0,1.4fr) minmax(0,1fr); align-items:start; }
.split-even { display:grid; gap:16px; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); align-items:start; }
@media (max-width:920px){ .split { grid-template-columns:minmax(0,1fr); } }

.weekgrid { display:grid; gap:10px; grid-template-columns:repeat(7,minmax(0,1fr)); align-items:start; }
@media (max-width:1080px){ .weekgrid { grid-template-columns:repeat(4,minmax(0,1fr)); } }
@media (max-width:760px){ .weekgrid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (max-width:480px){ .weekgrid { grid-template-columns:1fr; } }

.card {
  background:${T.panel}; border:1px solid ${T.line}; border-radius:16px;
  transition:border-color .18s ease, background .18s ease;
}
.card-lift:hover { border-color:#31405f; background:${T.panelHi}; }
.num { font-variant-numeric:tabular-nums; font-feature-settings:"tnum"; }

.scroll-x { overflow-x:auto; scrollbar-width:thin; scrollbar-color:#2a3752 transparent; -webkit-overflow-scrolling:touch; }
.scroll-x::-webkit-scrollbar { height:6px; }
.scroll-x::-webkit-scrollbar-thumb { background:#2a3752; border-radius:99px; }
.scroll-x::-webkit-scrollbar-track { background:transparent; }
.no-bar::-webkit-scrollbar { display:none; }
.no-bar { scrollbar-width:none; }

.tap { cursor:pointer; border:none; background:none; padding:0; color:inherit; }

/* ── Primary navigation ──────────────────────────────────────────────────
   Desktop: a row beneath the header. Phone: pinned to the bottom edge,
   inside thumb reach, the way a native app does it.

   The nav is a SIBLING of the blurred header bar, never a child: an ancestor
   with backdrop-filter becomes the containing block for position:fixed, so a
   fixed bar nested inside the header would anchor to the header instead of
   the viewport. Its own backdrop-filter is fine — that only affects its
   descendants.                                                              */
.chrome { position:sticky; top:0; z-index:30; }
.chrome-bar {
  background:${T.bgSoft}f2; backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
  border-bottom:1px solid ${T.line};
}
.chrome-inner { display:flex; align-items:center; gap:14px; padding-top:13px; padding-bottom:13px; flex-wrap:nowrap; }
.race-line { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

.mainnav { background:${T.bgSoft}f2; border-bottom:1px solid ${T.line}; }
.mainnav-inner { display:flex; gap:2px; }
.navbtn {
  position:relative; display:flex; align-items:center; gap:7px;
  padding:10px 15px 11px; font-size:12.5px; font-weight:700;
  color:${T.ink3}; white-space:nowrap; cursor:pointer;
  transition:color .16s ease;
}
.navbtn.is-active { color:${T.ink}; }
.navicon { font-size:11px; opacity:.6; transition:opacity .16s ease, color .16s ease; }
.navbtn.is-active .navicon { opacity:1; color:${T.accent}; }
.navdot { position:absolute; left:12px; right:12px; bottom:0; height:2px; background:${T.accent}; border-radius:2px 2px 0 0; }

.main-pad { padding-top:22px; padding-bottom:72px; }
.foot-pad { padding-bottom:34px; }

@media (max-width:760px) {
  /* the race name is fixed knowledge; the countdown and target are the live
     part, and dropping the name keeps the whole header on one line */
  .race-name { display:none; }
  .chrome-inner { gap:10px; }
  .mainnav {
    position:fixed; left:0; right:0; bottom:0; top:auto; z-index:60;
    background:${T.bgSoft}fa; backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
    border-top:1px solid ${T.line}; border-bottom:none;
    box-shadow:0 -10px 28px rgba(0,0,0,.42);
    padding-bottom:env(safe-area-inset-bottom, 0px);
  }
  /* full-bleed grid: four equal targets, no .wrap gutter */
  .mainnav-inner { display:grid; grid-template-columns:repeat(4,1fr); gap:0; padding-left:0; padding-right:0; max-width:none; }
  .navbtn {
    flex-direction:column; justify-content:center; gap:4px;
    padding:8px 4px 7px; min-height:54px;
    font-size:10.5px; letter-spacing:.03em;
  }
  .navicon { font-size:18px; }
  /* active marker moves to the top edge, where the bar meets the content */
  .navdot { top:0; bottom:auto; left:26%; right:26%; border-radius:0 0 2px 2px; }
  /* keep content clear of the bar */
  .main-pad { padding-bottom:22px; }
  .foot-pad { padding-bottom:calc(78px + env(safe-area-inset-bottom, 0px)); }
}
.fade { animation:fadeUp .3s cubic-bezier(.2,.7,.3,1) both; }
@keyframes fadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
@keyframes breathe { 0%,100% { opacity:1; } 50% { opacity:.3; } }
.live { animation:breathe 2.6s ease-in-out infinite; }
@media (prefers-reduced-motion:reduce) { .fade, .live { animation:none; } }
`;

function GlobalStyle() {
  return <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />;
}

/* ── tiny helpers ────────────────────────────────────────────────────────── */
let _uid = 0;
function useUid(prefix) {
  const r = useRef(null);
  if (r.current === null) r.current = `${prefix}${++_uid}`;
  return r.current;
}

// mm:ss is right for a split; anything past an hour needs h:mm:ss.
const fmtHMS = (s) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.round(s % 60);
  return h > 0 ? `${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}` : fmtMMSS(s);
};
const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmtISO = (s) => { const p = String(s).split("-"); return `${MON[+p[1]-1]} ${+p[2]}`; };
const fmtMin = (m) => `${Math.floor(m/60)}h${String(Math.round(m%60)).padStart(2,"0")}m`;
const pct = (n, d) => (d > 0 ? (n / d) * 100 : 0);
const TONE = { ok:T.ok, warn:T.warn, bad:T.bad, info:T.info, accent:T.accent, mute:T.ink3, ink:T.ink };
const TONE_BG = { ok:T.okBg, warn:T.warnBg, bad:T.badBg, info:T.infoBg, accent:T.accentBg, mute:"rgba(255,255,255,0.03)", ink:"rgba(255,255,255,0.03)" };
const avgOf = (arr) => {
  const v = arr.filter(x => x != null && !isNaN(x));
  return v.length ? Math.round(v.reduce((s, x) => s + x, 0) / v.length) : "—";
};
const toneOf = (v, good, warn) => (v >= good ? "ok" : v >= warn ? "warn" : "bad");

/* ── primitives ──────────────────────────────────────────────────────────── */
function Card({ children, pad = 16, style, lift = true, className = "" }) {
  return (
    <div className={`card ${lift ? "card-lift" : ""} ${className}`} style={{ padding:pad, ...style }}>
      {children}
    </div>
  );
}

// Section heading: small caps label + optional right-hand slot.
function Sec({ title, sub, right, children, style }) {
  return (
    <section style={{ marginBottom:22, ...style }}>
      {(title || right) && (
        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", gap:12, marginBottom:10, flexWrap:"wrap" }}>
          <div>
            <h2 style={{ margin:0, fontSize:11, fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", color:T.ink2 }}>{title}</h2>
            {sub && <div style={{ fontSize:11.5, color:T.ink3, marginTop:3 }}>{sub}</div>}
          </div>
          {right && <div style={{ fontSize:11, color:T.ink3 }}>{right}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

// The workhorse metric tile. Tone colours the VALUE only — the tile itself
// stays neutral, which is what stops the old rainbow-card effect.
function Stat({ label, value, unit, sub, tone = "ink", accentBar = false, pad = 14 }) {
  const c = TONE[tone] || T.ink;
  return (
    <Card pad={pad} style={{ position:"relative", overflow:"hidden", minWidth:0 }}>
      {accentBar && <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:c, opacity:0.8 }} />}
      <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:T.ink3 }}>{label}</div>
      <div className="num" style={{ fontSize:23, fontWeight:800, color:c, lineHeight:1.15, marginTop:5, letterSpacing:"-0.02em", wordBreak:"break-word" }}>
        {value}{unit && <span style={{ fontSize:12, fontWeight:600, color:T.ink3, marginLeft:4 }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize:10.5, color:T.ink3, marginTop:4, lineHeight:1.45 }}>{sub}</div>}
    </Card>
  );
}

function Chip({ children, tone = "mute", active = false, onClick, title }) {
  const c = TONE[tone] || T.ink3;
  return (
    <button className="tap" onClick={onClick} title={title} style={{
      padding:"6px 12px", borderRadius:99, fontSize:11, fontWeight:700, whiteSpace:"nowrap",
      border:`1px solid ${active ? c : T.line}`,
      background: active ? TONE_BG[tone] || T.accentBg : "transparent",
      color: active ? c : T.ink3,
      cursor: onClick ? "pointer" : "default",
      transition:"all .16s ease",
    }}>{children}</button>
  );
}

function Tag({ children, tone = "mute" }) {
  const c = TONE[tone] || T.ink3;
  return (
    <span style={{ fontSize:9.5, fontWeight:800, letterSpacing:"0.08em", textTransform:"uppercase",
      color:c, background:TONE_BG[tone], border:`1px solid ${c}33`, padding:"2px 7px", borderRadius:5, whiteSpace:"nowrap" }}>
      {children}
    </span>
  );
}

// Horizontal bar used for splits, load, zones.
function Bar({ value, tone = "accent", height = 10, track = T.lineDim, radius = 99, children }) {
  const c = TONE[tone] || T.accent;
  return (
    <div style={{ flex:1, background:track, borderRadius:radius, height, overflow:"hidden", position:"relative", minWidth:20 }}>
      <div style={{ height:"100%", width:`${Math.max(0, Math.min(100, value))}%`, background:c, borderRadius:radius,
                    transition:"width .5s cubic-bezier(.2,.7,.3,1)", display:"flex", alignItems:"center", gap:2, paddingLeft:4 }}>
        {children}
      </div>
    </div>
  );
}

/* ── Ring gauge — the readiness centrepiece ──────────────────────────────── */
function Ring({ value, max = 10, size = 132, stroke = 10, tone = "ok", label, sub }) {
  const c = TONE[tone] || T.ok;
  const uid = useUid("ring");
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const frac = Math.max(0, Math.min(1, value / max));
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display:"block", transform:"rotate(-90deg)" }}>
        <defs>
          <linearGradient id={uid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c} stopOpacity="0.55" />
            <stop offset="100%" stopColor={c} stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.lineDim} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`url(#${uid})`} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={`${circ*frac} ${circ}`}
          style={{ transition:"stroke-dasharray .8s cubic-bezier(.2,.7,.3,1)" }} />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <div className="num" style={{ fontSize:size*0.33, fontWeight:800, color:c, lineHeight:1, letterSpacing:"-0.03em" }}>{value}</div>
        {label && <div style={{ fontSize:9.5, color:T.ink3, letterSpacing:"0.1em", marginTop:2 }}>{label}</div>}
        {sub && <div style={{ fontSize:9, color:T.ink3, marginTop:1 }}>{sub}</div>}
      </div>
    </div>
  );
}

// Catmull-Rom → cubic bezier. Passes through every point without the flat
// shelves the quadratic Q…T shorthand leaves between them.
function smoothPath(pts) {
  if (!pts.length) return "";
  if (pts.length < 3) return pts.map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

/* ── Sparkline ────────────────────────────────────────────────────────────
   The plot area is an SVG stretched to fill its box (preserveAspectRatio
   "none"), so the chart is as tall as the CSS says at every screen width —
   a fixed-aspect viewBox collapsed to an unreadable 20px sliver on a phone.
   Stroke width is held with vectorEffect, and every label is real HTML so
   nothing gets horizontally stretched with the geometry.
   ───────────────────────────────────────────────────────────────────────── */
function Sparkline({ data, color = T.accent, height = 110, area = true, fmt, showAxis = true }) {
  const uid = useUid("spark");
  if (!data || data.length < 2) return null;
  const entries = data.map(d => {
    if (Array.isArray(d)) return { date:d[0], val:d[1] };
    if (d.bf !== undefined) return { date:d.date, val:d.bf };
    return { date:d.date, val:d.val };
  }).filter(e => e.val != null && !isNaN(e.val));
  if (entries.length < 2) return null;

  const vals = entries.map(e => e.val);
  const min = Math.min(...vals), max = Math.max(...vals), range = max - min || 1;
  const W = 1000, H = 100, padT = 6, padB = 6;
  const innerH = H - padT - padB;
  const xAt = i => (i / (entries.length - 1)) * W;
  const yAt = v => padT + innerH - ((v - min) / range) * innerH;

  const pts = entries.map((e, i) => [xAt(i), yAt(e.val)]);
  const path = smoothPath(pts);
  const areaPath = `${path} L ${W},${H} L 0,${H} Z`;
  const last = entries.length - 1;
  const labelIdx = entries.length <= 3 ? entries.map((_, i) => i) : [0, Math.floor(entries.length / 2), last];
  const fv = fmt || (v => v);
  const lastTopPct = (yAt(entries[last].val) / H) * 100;

  return (
    <div style={{ width:"100%" }}>
      <div style={{ position:"relative", height, paddingRight: showAxis ? 34 : 0 }}>
        <div style={{ position:"relative", height:"100%" }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
            style={{ display:"block", overflow:"visible" }}>
            <defs>
              <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.30" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="0" x2={W} y1={padT} y2={padT} stroke={T.lineDim} strokeDasharray="4,5" vectorEffect="non-scaling-stroke" />
            <line x1="0" x2={W} y1={H - padB} y2={H - padB} stroke={T.lineDim} strokeDasharray="4,5" vectorEffect="non-scaling-stroke" />
            {area && <path d={areaPath} fill={`url(#${uid})`} />}
            <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
              vectorEffect="non-scaling-stroke" />
          </svg>
          {/* end marker as HTML so the "none" scaling can't turn it into an ellipse */}
          <div style={{ position:"absolute", right:0, top:`${lastTopPct}%`, width:7, height:7, marginTop:-3.5, marginRight:-3.5,
            borderRadius:"50%", background:color, boxShadow:`0 0 0 2px ${T.panel}` }} />
        </div>
        {showAxis && (
          <div className="num" style={{ position:"absolute", right:0, top:0, bottom:0, width:32,
            display:"flex", flexDirection:"column", justifyContent:"space-between", fontSize:9.5, color:T.ink3, paddingLeft:5 }}>
            <span>{fv(max)}</span><span>{fv(min)}</span>
          </div>
        )}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:5, paddingRight: showAxis ? 34 : 0,
        fontSize:9.5, color:T.ink3 }}>
        {labelIdx.map((i, k) => (
          <span key={i} className="num" style={{ textAlign: k === 0 ? "left" : k === labelIdx.length - 1 ? "right" : "center" }}>
            {fmtISO(entries[i].date)}
          </span>
        ))}
      </div>
    </div>
  );
}

// Note / callout line. Left rule instead of a filled pastel box.
function Note({ children, tone = "mute", icon }) {
  const c = TONE[tone] || T.ink3;
  return (
    <div style={{ display:"flex", gap:9, padding:"9px 12px", background:TONE_BG[tone], borderLeft:`2px solid ${c}`,
                  borderRadius:"0 8px 8px 0", fontSize:12, color:T.ink2, lineHeight:1.55, marginBottom:6 }}>
      {icon && <span style={{ flexShrink:0 }}>{icon}</span>}
      <span style={{ minWidth:0 }}>{children}</span>
    </div>
  );
}

function Empty({ children }) {
  return <div style={{ padding:"28px 14px", textAlign:"center", color:T.ink3, fontSize:12 }}>{children}</div>;
}

// HRV baseline (rolling weekly average). Rewritten by update.py — keep this
// declaration on one line and in this exact shape.
const hrvBaseline = 92; // updated 2026-08-23

/* ═══════════════════════════════════════════════════════════════════════════
   SESSION ANALYSIS — derived, never hardcoded.
   Every tile reads a real CSV column and is dropped when that column is empty,
   so the panel can't drift into quoting numbers from a session months old.
   ═══════════════════════════════════════════════════════════════════════════ */
function sessionMetrics(a) {
  if (!a) return [];
  const n = k => parseNum(a[k]);
  const out = [];
  const push = (label, value, note, tone) => out.push({ label, value, note, tone });

  push("Duration", fmtDur(a._dur), a._dist > 0 ? `${a._dist.toFixed(2)} km covered` : "total session", "ink");
  if (a._avgHR > 0) {
    const t = a._avgHR > 167 ? "bad" : a._avgHR > 146 ? "warn" : "ok";
    push("Avg HR", `${a._avgHR}`, `bpm · zone ${a._avgHR > 167 ? "E" : a._avgHR > 146 ? "D" : a._avgHR > 132 ? "C" : a._avgHR > 115 ? "B" : "A"}`, t);
  }
  if (n("Max HR")) push("Max HR", `${n("Max HR")}`, `bpm · ${Math.round(n("Max HR")/177*100)}% of ceiling`, "ink");
  if (n("Aerobic TE")) {
    const te = n("Aerobic TE");
    push("Aerobic TE", te.toFixed(1), te >= 4 ? "high — needs recovery" : te >= 3 ? "maintaining/improving" : "easy stimulus", te >= 4 ? "warn" : "ok");
  }
  const gct = n("Avg Ground Contact Time");
  if (gct) push("GCT", `${Math.round(gct)}`, gct < 380 ? "ms · under race target ✓" : "ms · target <380 at race pace", gct < 380 ? "ok" : "warn");
  const vr = n("Avg Vertical Ratio");
  if (vr) push("Vert ratio", `${vr}`, vr < 9 ? "% · efficient ✓" : "% · lean forward, drive hips", vr < 9 ? "ok" : "warn");
  const bal = a["Avg GCT Balance"];
  if (bal && bal !== "--") {
    const l = parseFloat(String(bal).replace(",", "."));
    const off = Math.abs(l - 50) > 2;
    push("GCT balance", bal, off ? "asymmetric — monitor" : "balanced ✓", off ? "warn" : "ok");
  }
  const np = n("Normalized Power® (NP®)");
  if (np) push("Norm power", `${Math.round(np)}`, "W · running power output", "ink");
  const resp = n("Avg Resp");
  if (resp) push("Avg resp", `${resp}`, n("Max Resp") ? `br/min · peak ${n("Max Resp")}` : "br/min", "ink");
  const bb = n("Body Battery Drain");
  if (bb) push("Body battery", `−${Math.round(bb)}`, bb < 20 ? "light drain — well paced ✓" : "significant drain", bb < 20 ? "ok" : "warn");
  const speed = a["Avg Speed"];
  if (speed && speed !== "--" && isRun(a)) push("Avg pace", speedToPace(speed).replace("/km",""), "min/km", "ink");
  return out;
}

/* ── coaching notes, generated from the actual data in view ──────────────── */
function buildNotes({ yesterday, weeklyKm, atl, ctl, tsb, hrv, hrvBaseline, sleepMin, rhr }) {
  const notes = [];
  const hy = yesterday.find(isHyrox), rn = yesterday.find(a => isRun(a) && a._avgHR > 120);
  const key = hy || rn;
  if (key) {
    notes.push({ tone:"accent", text:`${key.Title || key["Activity Type"]}: ${fmtDur(key._dur)}${key._avgHR ? ` · HR ${key._avgHR} avg` : ""}${parseNum(key["Max HR"]) ? `/${parseNum(key["Max HR"])} max` : ""}${key._dist > 0 ? ` · ${key._dist.toFixed(2)} km` : ""}.` });
    const gct = parseNum(key["Avg Ground Contact Time"]);
    if (gct) notes.push({ tone: gct < 380 ? "ok" : "warn", text:`Ground contact ${Math.round(gct)}ms — ${gct < 380 ? "inside the sub-380ms race-pace target." : "above the 380ms race target: raise cadence, cut the bounce."}` });
    const vr = parseNum(key["Avg Vertical Ratio"]);
    if (vr) notes.push({ tone: vr < 9 ? "ok" : "warn", text:`Vertical ratio ${vr}% — ${vr < 9 ? "efficient mechanics." : "too much vertical travel; lean forward and drive the hips."}` });
  }
  if (yesterday.some(isRecovery)) notes.push({ tone:"ok", text:"Sauna logged — speeds glycogen resynthesis and parasympathetic rebound, and doubles as Athens heat prep." });
  if (hrv && hrvBaseline) {
    const d = hrv - hrvBaseline;
    notes.push({ tone: d >= 0 ? "ok" : d > -10 ? "warn" : "bad",
      text:`HRV ${hrv}ms vs ${hrvBaseline}ms baseline (${d >= 0 ? "+" : ""}${d}). ${d >= 10 ? "Strongly recovered — the hard session is on." : d >= 0 ? "Recovered and absorbing load well." : d > -10 ? "Slightly suppressed — keep intensity honest." : "Suppressed — favour easy volume or rest."}${rhr ? ` RHR ${rhr}bpm.` : ""}` });
  }
  if (sleepMin) notes.push({ tone: sleepMin >= 420 ? "ok" : sleepMin >= 360 ? "warn" : "bad", text:`Slept ${fmtMin(sleepMin)} last night — ${sleepMin >= 420 ? "enough to support a quality session." : sleepMin >= 360 ? "short of ideal; protect tonight." : "well short. Cut intensity, not volume."}` });
  notes.push({ tone:"mute", text:`Running ${weeklyKm.toFixed(1)} km logged over the last 7 days · ATL ${atl.toFixed(0)} · CTL ${ctl.toFixed(0)} · form ${tsb >= 0 ? "+" : ""}${tsb.toFixed(0)}.` });
  return notes;
}

/* ═══════════════════════════════════════════════════════════════════════════
   TODAY
   ═══════════════════════════════════════════════════════════════════════════ */
function TodayView({ ana, health }) {
  const { yesterday, tsb, atl, ctl, daysSinceHard, weeklyKm } = ana;
  const daily = health.daily;
  const today = daily[daily.length - 1] || {};
  const lastSleep = health.sleep[health.sleep.length - 1];
  const sleepMin = lastSleep ? lastSleep.deep + lastSleep.rem + lastSleep.light : null;
  const hrv = today.hrv || null;

  const R = readiness(tsb, daysSinceHard, hrv, hrvBaseline);
  const tone = R >= 7 ? "ok" : R >= 4 ? "warn" : "bad";
  const label = R >= 7 ? "READY TO PUSH" : R >= 4 ? "TRAIN SMART" : "TAKE IT EASY";
  const headline = R >= 7
    ? "Recovery is ahead of load — take the quality session as written."
    : R >= 4
    ? "Recovered enough for controlled work. Hold the prescribed paces, skip the extras."
    : "Load is stacking faster than you're clearing it. Easy volume or rest.";

  const todaySched = SCHEDULE.flatMap(w => w.days).find(d => d.date === TODAY);
  const keyAct = yesterday.find(isHyrox) || yesterday.find(a => isRun(a) && a._avgHR > 120) || yesterday[0];
  const metrics = sessionMetrics(keyAct);
  const notes = buildNotes({ yesterday, weeklyKm, atl, ctl, tsb, hrv, hrvBaseline, sleepMin, rhr:today.rhr });

  const hrvPct = hrv && hrvBaseline ? Math.min(140, (hrv / hrvBaseline) * 100) : 0;
  const recent = daily.slice(-21);

  return (
    <div className="fade">
      {/* ── READINESS HERO ────────────────────────────────────────────── */}
      <Card pad={0} lift={false} style={{ marginBottom:20, overflow:"hidden" }}>
        <div style={{ display:"flex", gap:22, padding:"20px 22px", flexWrap:"wrap", alignItems:"center",
                      background:`linear-gradient(135deg, ${TONE_BG[tone]}, transparent 60%)` }}>
          <Ring value={R} max={10} tone={tone} label="/10" size={128} stroke={10} />
          <div style={{ flex:1, minWidth:240 }}>
            <div style={{ display:"flex", alignItems:"center", gap:9, flexWrap:"wrap" }}>
              <span style={{ fontSize:15, fontWeight:800, letterSpacing:"0.11em", color:TONE[tone] }}>{label}</span>
              <Tag tone={tsb >= 5 ? "ok" : tsb >= -10 ? "info" : tsb >= -20 ? "warn" : "bad"}>
                FORM {tsb >= 0 ? "+" : ""}{tsb.toFixed(0)}
              </Tag>
            </div>
            <p style={{ margin:"8px 0 0", fontSize:14, color:T.ink, lineHeight:1.55, maxWidth:560 }}>{headline}</p>
            {hrv && (
              <div style={{ marginTop:14, maxWidth:400 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:10.5, color:T.ink3, marginBottom:5 }}>
                  <span>HRV vs baseline</span>
                  <span className="num" style={{ color:TONE[tone], fontWeight:700 }}>{hrv}ms / {hrvBaseline}ms</span>
                </div>
                <div style={{ position:"relative" }}>
                  <Bar value={(hrvPct / 140) * 100} tone={tone} height={7} />
                  <div style={{ position:"absolute", left:`${(100/140)*100}%`, top:-3, width:2, height:13, background:T.ink3, borderRadius:1 }} title="baseline" />
                </div>
              </div>
            )}
          </div>
          <div className="grid g4" style={{ flex:"1 1 300px", minWidth:260 }}>
            <Stat pad={12} label="HRV" value={hrv ?? "—"} unit="ms" sub={`base ${hrvBaseline}`} tone={hrv ? (hrv >= hrvBaseline ? "ok" : hrv >= hrvBaseline - 10 ? "warn" : "bad") : "mute"} />
            <Stat pad={12} label="RHR" value={today.rhr ?? "—"} unit="bpm" sub="40–46 typical" tone={today.rhr && today.rhr <= 46 ? "ok" : "warn"} />
            <Stat pad={12} label="Sleep" value={sleepMin ? fmtMin(sleepMin) : "—"} sub={today.sleep_score != null ? `score ${today.sleep_score}` : "last night"} tone={sleepMin ? (sleepMin >= 420 ? "ok" : sleepMin >= 360 ? "warn" : "bad") : "mute"} />
            <Stat pad={12} label="Load" value={atl.toFixed(0)} sub={`fitness ${ctl.toFixed(0)}`} tone="info" />
          </div>
        </div>
        {recent.length > 3 && (
          <div style={{ borderTop:`1px solid ${T.lineDim}`, padding:"10px 22px 6px" }}>
            <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:"0.12em", color:T.ink3, marginBottom:2 }}>HRV · LAST 3 WEEKS</div>
            <Sparkline data={recent.map(d => [d.date, d.hrv])} color={T.accent} height={54} />
          </div>
        )}
      </Card>

      <div className="split">
        {/* ── LEFT: what to do, what was done ─────────────────────────── */}
        <div>
          <Sec title="Today's plan" sub={new Date(TODAY).toLocaleDateString(undefined, { weekday:"long", month:"long", day:"numeric" })}>
            {(todaySched?.sessions || []).length === 0 && <Card><Empty>Nothing scheduled — the plan has you free today.</Empty></Card>}
            {(todaySched?.sessions || []).map((s, i) => {
              const st = SS[s.type] || SS.plan;
              return (
                <div key={i} style={{ display:"flex", gap:11, padding:"13px 15px", marginBottom:8, background:st.bg,
                                      border:`1px solid ${st.border}`, borderRadius:12 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:st.dot, marginTop:6, flexShrink:0 }} />
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:13.5, fontWeight:600, color:st.text, lineHeight:1.5 }}>{s.text}</div>
                    {s.cal && <div style={{ fontSize:9, fontWeight:800, letterSpacing:"0.1em", color:st.dot, marginTop:5 }}>IN CALENDAR</div>}
                  </div>
                </div>
              );
            })}
          </Sec>

          <Sec title="Yesterday" right={yesterday.length ? `${yesterday.length} session${yesterday.length > 1 ? "s" : ""}` : null}>
            {yesterday.length === 0 && <Card><Empty>No activity recorded yesterday.</Empty></Card>}
            {yesterday.map((a, i) => (
              <Card key={i} pad={13} style={{ marginBottom:8, display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:20, width:26, textAlign:"center", flexShrink:0 }}>{getEmoji(a)}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:getColor(a) }}>{a.Title || a["Activity Type"]}</div>
                  <div className="num" style={{ fontSize:11.5, color:T.ink3, marginTop:3 }}>
                    {fmtDur(a._dur)}
                    {a._avgHR > 0 ? ` · ♥ ${a._avgHR}${parseNum(a["Max HR"]) ? `/${parseNum(a["Max HR"])}` : ""}` : ""}
                    {a._dist > 0 ? ` · ${a._dist.toFixed(1)} km` : ""}
                    {a["Avg Speed"] && a["Avg Speed"] !== "--" && isRun(a) ? ` · ${speedToPace(a["Avg Speed"])}` : ""}
                  </div>
                </div>
                {a._trimp > 0 && <Tag tone={a._trimp > 80 ? "bad" : a._trimp > 40 ? "warn" : "ok"}>TRIMP {a._trimp.toFixed(0)}</Tag>}
              </Card>
            ))}
          </Sec>

          {metrics.length > 0 && (
            <Sec title="Session analysis" sub={keyAct ? `${keyAct.Title || keyAct["Activity Type"]} · ${keyAct._date}` : null}>
              <div className="grid g4">
                {metrics.map((m, i) => (
                  <Stat key={i} pad={12} label={m.label} value={m.value} sub={m.note} tone={m.tone} accentBar />
                ))}
              </div>
            </Sec>
          )}

          <Sec title="Next up" sub="Rest of this week">
            <Card pad={13}>
              {SCHEDULE.flatMap(w => w.days).filter(d => d.date > TODAY).slice(0, 5).map((d, i) => (
                <div key={i} style={{ display:"flex", gap:11, padding:"8px 0", borderBottom: i < 4 ? `1px solid ${T.lineDim}` : "none" }}>
                  <div style={{ minWidth:38, fontSize:10, fontWeight:800, letterSpacing:"0.08em", color:T.ink3, paddingTop:2 }}>{d.dow}</div>
                  <div style={{ flex:1, minWidth:0, fontSize:11.5, color:T.ink2, lineHeight:1.5 }}>
                    {d.sessions.map((s, si) => <div key={si} style={{ marginBottom: si < d.sessions.length - 1 ? 3 : 0 }}>{s.text}</div>)}
                  </div>
                </div>
              ))}
            </Card>
          </Sec>
        </div>

        {/* ── RIGHT RAIL: coaching ────────────────────────────────────── */}
        <div>
          <Sec title="Coach notes">
            <Card pad={13}>
              {notes.map((n, i) => <Note key={i} tone={n.tone}>{n.text}</Note>)}
              <div style={{ fontSize:10.5, color:T.ink3, marginTop:6, lineHeight:1.5 }}>
                Generated from the last sync — no fixed text, so it moves with the data.
              </div>
            </Card>
          </Sec>

          <Sec title="Recovery snapshot" sub="Overnight, from Garmin">
            <div className="grid g2">
              <Stat label="HRV" value={today.hrv ?? "—"} unit="ms" sub={`7d avg ${avgOf(daily.slice(-7).map(d => d.hrv))} · baseline ${hrvBaseline}`} tone={hrv >= hrvBaseline ? "ok" : "warn"} />
              <Stat label="Resting HR" value={today.rhr ?? "—"} unit="bpm" sub="athlete range 40–46" tone={today.rhr <= 46 ? "ok" : "warn"} />
              <Stat label="SpO₂" value={today.spo2 != null ? `${today.spo2}%` : "—"} sub="normal >95%" tone={today.spo2 >= 95 ? "ok" : "warn"} />
              <Stat label="Respiration" value={today.resp ?? "—"} unit="br/min" sub="baseline 10.7–13.7" tone={today.resp && today.resp <= 14 ? "ok" : "warn"} />
            </div>
          </Sec>

        </div>
      </div>

      <SyncPanel />
    </div>
  );
}

/* ── segmented sub-navigation ────────────────────────────────────────────── */
function SubNav({ items, value, onChange }) {
  return (
    <div className="scroll-x no-bar" style={{ display:"flex", gap:4, padding:3, background:T.bgSoft,
      border:`1px solid ${T.line}`, borderRadius:11, marginBottom:18, width:"fit-content", maxWidth:"100%" }}>
      {items.map(([k, l]) => (
        <button key={k} className="tap" onClick={() => onChange(k)} style={{
          padding:"7px 15px", borderRadius:8, fontSize:11.5, fontWeight:700, whiteSpace:"nowrap",
          letterSpacing:"0.04em", cursor:"pointer", transition:"all .16s ease",
          background: value === k ? T.accent : "transparent",
          color: value === k ? "#fff" : T.ink3,
        }}>{l}</button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TRAIN — plan · load · log
   ═══════════════════════════════════════════════════════════════════════════ */
function PlanBoard({ activities }) {
  const todayWk = SCHEDULE.findIndex(w => w.days.some(d => d.date === TODAY));
  const [wk, setWk] = useState(Math.max(0, todayWk));
  const week = SCHEDULE[wk];
  const raceIdx = SCHEDULE.findIndex(w => w.days.some(d => d.sessions.some(s => s.type === "race")));

  return (
    <div>
      <div className="scroll-x no-bar" style={{ display:"flex", gap:7, marginBottom:14 }}>
        {SCHEDULE.map((w, i) => (
          <Chip key={i} active={wk === i} tone={i === raceIdx ? "warn" : "accent"} onClick={() => setWk(i)}>
            WK{w.week}{i === raceIdx ? " 🏁" : ""}{i === todayWk ? " ●" : ""}
          </Chip>
        ))}
      </div>

      <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", gap:12, flexWrap:"wrap", marginBottom:14 }}>
        <div>
          <div style={{ fontSize:18, fontWeight:800, color:T.ink, letterSpacing:"-0.01em" }}>{week.theme}</div>
          <div style={{ fontSize:11.5, color:T.ink3, marginTop:2 }}>Week {week.week} · {week.label}</div>
        </div>
        {(() => {
          const t = getWeekTarget(week.days[0].date, week.days[week.days.length-1].date);
          return t.hi > 0 ? <Tag tone="accent">TARGET {t.lo}–{t.hi} TRIMP</Tag> : null;
        })()}
      </div>

      <div className="weekgrid">
        {week.days.map((day, di) => {
          const isToday = day.date === TODAY, isPast = day.date < TODAY;
          const done = activities.filter(a => a._date === day.date);
          return (
            <div key={di} style={{
              background: isToday ? "rgba(139,92,246,0.07)" : T.panel,
              border:`1px solid ${isToday ? T.accent : T.line}`,
              borderRadius:13, padding:"11px 12px", opacity: isPast && !isToday ? 0.55 : 1,
              display:"flex", flexDirection:"column", gap:7, minWidth:0,
            }}>
              <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", gap:6 }}>
                <span style={{ fontSize:10.5, fontWeight:800, letterSpacing:"0.1em", color: isToday ? T.accentIn : T.ink2 }}>{day.dow}</span>
                <span style={{ fontSize:10, color:T.ink3 }}>{day.label}</span>
              </div>
              {isToday && <div style={{ fontSize:9, fontWeight:800, letterSpacing:"0.14em", color:T.accent }}>● TODAY</div>}

              {done.map((a, ai) => (
                <div key={ai} style={{ display:"flex", alignItems:"center", gap:7, padding:"6px 8px",
                  background:"rgba(52,211,153,0.08)", border:`1px solid ${T.ok}33`, borderRadius:8 }}>
                  <span style={{ fontSize:12 }}>{getEmoji(a)}</span>
                  <div style={{ minWidth:0, flex:1 }}>
                    <div style={{ fontSize:10.5, fontWeight:700, color:T.ok, lineHeight:1.35, overflowWrap:"anywhere" }}>
                      ✓ {a.Title || a["Activity Type"]}
                    </div>
                    <div className="num" style={{ fontSize:9.5, color:T.ink3 }}>{fmtDur(a._dur)}{a._avgHR > 0 ? ` · ♥${a._avgHR}` : ""}</div>
                  </div>
                </div>
              ))}

              {day.sessions.map((s, si) => {
                const st = SS[s.type] || SS.plan;
                return (
                  <div key={si} style={{ display:"flex", gap:7, padding:"7px 9px", background:st.bg,
                                         border:`1px solid ${st.border}`, borderRadius:8 }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:st.dot, marginTop:5, flexShrink:0 }} />
                    <div style={{ fontSize:11, color:st.text, lineHeight:1.5, minWidth:0 }}>
                      {s.text}
                      {s.cal && <span style={{ fontSize:8.5, fontWeight:800, color:st.dot, marginLeft:6, letterSpacing:"0.08em" }}>CAL</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LoadPanel({ ana, activities }) {
  const { atl, ctl, tsb, weeklyTrimp, zoneMinutes, totalZoneMin, paceTrend } = ana;
  const formTone = tsb >= 5 ? "ok" : tsb >= -10 ? "info" : tsb >= -20 ? "warn" : "bad";
  const formWord = tsb >= 5 ? "fresh" : tsb >= -10 ? "optimal" : tsb >= -20 ? "tired" : "fatigued";
  const formMsg = tsb >= 5 ? "Fresh — green light for a hard session."
    : tsb >= -10 ? "Normal training fatigue. Prescribed load is fine."
    : tsb >= -20 ? "Fatigue accumulating — protect sleep and keep intensity controlled."
    : "High fatigue — favour recovery or easy volume.";

  const days = [];
  for (let d = 13; d >= 0; d--) {
    const acts = activities.filter(a => a._days === d);
    const base = new Date(TODAY); base.setDate(base.getDate() - d);
    days.push({ d, acts, total: acts.reduce((s, a) => s + a._trimp, 0), date: base });
  }
  const maxDay = Math.max(...days.map(x => x.total), 60);
  // Shared x-scale for the weekly roadmap: the biggest actual week or target,
  // whichever is larger, plus a little headroom.
  const roadmapMax = Math.max(
    ...weeklyTrimp.map(w => w.trimp),
    ...weeklyTrimp.map(w => getWeekTarget(w.weekStartISO, w.weekEndISO).hi),
    1) * 1.05;

  return (
    <div>
      <div className="grid g3" style={{ marginBottom:12 }}>
        <Stat label="ATL · fatigue" value={atl.toFixed(0)} sub="7-day acute load" tone="bad" accentBar />
        <Stat label="CTL · fitness" value={ctl.toFixed(0)} sub="42-day chronic load" tone="ok" accentBar />
        <Stat label="Form · TSB" value={`${tsb >= 0 ? "+" : ""}${tsb.toFixed(0)}`} sub={formWord} tone={formTone} accentBar />
      </div>
      <Note tone={formTone}>{formMsg}</Note>

      <Sec title="Daily load" sub="Last 14 days · TRIMP per day" style={{ marginTop:22 }}>
        <Card pad={16}>
          <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:130 }}>
            {days.map((x, i) => {
              const h = Math.max(2, (x.total / maxDay) * 100);
              const tone = x.total > 90 ? "bad" : x.total > 45 ? "warn" : x.total > 0 ? "ok" : "mute";
              return (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, minWidth:0 }}
                     title={`${x.date.toDateString()} — TRIMP ${x.total.toFixed(0)}`}>
                  <div className="num" style={{ fontSize:9, color: x.total > 0 ? TONE[tone] : "transparent" }}>{x.total.toFixed(0)}</div>
                  <div style={{ width:"100%", height:78, display:"flex", alignItems:"flex-end" }}>
                    <div style={{ width:"100%", height:`${h}%`, background:TONE[tone], opacity: x.d === 0 ? 1 : 0.75,
                                  borderRadius:"4px 4px 2px 2px", transition:"height .5s ease" }} />
                  </div>
                  <div style={{ fontSize:11, height:14 }}>{x.acts.slice(0,1).map((a, ai) => <span key={ai}>{getEmoji(a)}</span>)}</div>
                  <div style={{ fontSize:8.5, color: x.d === 0 ? T.accentIn : T.ink3, whiteSpace:"nowrap" }}>
                    {x.d === 0 ? "today" : x.date.toLocaleDateString("en", { day:"numeric" })}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </Sec>

      <Sec title="Weekly roadmap" sub="Actual TRIMP against this phase's target band · rolling 7-day weeks">
        <Card pad={16}>
          {weeklyTrimp.map((w, i) => {
            const isCurrent = w.weekStartISO <= TODAY && w.weekEndISO >= TODAY;
            const isPast = w.weekEndISO < TODAY;
            const { lo, hi, theme } = getWeekTarget(w.weekStartISO, w.weekEndISO);
            // One shared scale across every row. Capping each bar at its own
            // target made a 703 week and a 500 week both render as a full bar.
            const p = roadmapMax > 0 ? (w.trimp / roadmapMax) * 100 : 0;
            const status = w.trimp === 0 || hi === 0 ? "mute" : (w.trimp >= lo && w.trimp <= hi) ? "ok" : w.trimp > hi ? "warn" : "bad";
            const loPct = roadmapMax > 0 ? (lo / roadmapMax) * 100 : 0;
            const hiPct = roadmapMax > 0 ? (hi / roadmapMax) * 100 : 0;
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:11, marginBottom:11, opacity: isPast && !isCurrent ? 0.6 : 1 }}>
                <div style={{ minWidth:104 }}>
                  <div style={{ fontSize:11.5, fontWeight: isCurrent ? 800 : 600, color: isCurrent ? T.accentIn : T.ink }}>
                    {w.label}{isCurrent && " ←"}
                  </div>
                  <div style={{ fontSize:9.5, color:T.ink3 }}>{theme}</div>
                </div>
                <div style={{ flex:1, background:T.lineDim, borderRadius:6, height:22, position:"relative", overflow:"hidden", minWidth:60 }}>
                  {hi > 0 && <div style={{ position:"absolute", left:`${loPct}%`, width:`${Math.max(0, hiPct - loPct)}%`,
                    top:0, bottom:0, background:"rgba(52,211,153,0.12)" }} />}
                  <div style={{ height:"100%", width:`${p}%`, background:TONE[status], opacity:0.85, borderRadius:6, transition:"width .5s ease" }} />
                  {hi > 0 && <>
                    <div style={{ position:"absolute", left:`${loPct}%`, top:0, bottom:0, width:2, background:T.ok, opacity:0.75 }} />
                    <div style={{ position:"absolute", left:`${hiPct}%`, top:0, bottom:0, width:2, background:T.warn, opacity:0.75 }} />
                  </>}
                </div>
                <div className="num" style={{ fontSize:12.5, fontWeight:800, color:TONE[status], minWidth:36, textAlign:"right" }}>
                  {w.trimp > 0 ? w.trimp : "—"}
                </div>
                <div className="num" style={{ fontSize:9.5, color:T.ink3, minWidth:54, textAlign:"right" }}>{hi > 0 ? `${lo}–${hi}` : "rest"}</div>
              </div>
            );
          })}
          <div style={{ display:"flex", gap:14, marginTop:10, paddingTop:10, borderTop:`1px solid ${T.lineDim}`, fontSize:10, color:T.ink3, flexWrap:"wrap" }}>
            {[["ok","In target band"],["warn","Over target"],["bad","Under target"]].map(([t, l]) => (
              <span key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ width:9, height:9, borderRadius:3, background:TONE[t] }} />{l}
              </span>
            ))}
          </div>
        </Card>
      </Sec>

      <Sec title="Upcoming phases" sub="Planned targets through race day">
        <div className="grid g2">
          {TAPER_PLAN.filter(b => b.start > TODAY).map((b, i) => {
            const sd = new Date(b.start), ed = new Date(b.end);
            const lbl = sd.getMonth() === ed.getMonth()
              ? `${MON[sd.getMonth()]} ${sd.getDate()}–${ed.getDate()}`
              : `${MON[sd.getMonth()]} ${sd.getDate()}–${MON[ed.getMonth()]} ${ed.getDate()}`;
            return (
              <Card key={i} pad={14} style={{ borderStyle:"dashed" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:8 }}>
                  <span style={{ fontSize:12.5, fontWeight:800, color:T.ink }}>{b.theme}</span>
                  <span style={{ fontSize:10, color:T.ink3 }}>{lbl}</span>
                </div>
                <div className="num" style={{ fontSize:11.5, color:T.accentIn, marginTop:6, fontWeight:700 }}>{b.lo}–{b.hi} TRIMP</div>
                <div style={{ fontSize:11, color:T.ink3, marginTop:4, lineHeight:1.5 }}>{b.note}</div>
              </Card>
            );
          })}
        </div>
      </Sec>

      <div className="split-even">
        <Sec title="HR zone distribution" sub="Last 28 days, by session average">
          <Card pad={16}>
            {totalZoneMin > 0 ? <>
              {[["E","VO₂max","bad"],["D","Development","warn"],["C","Intensive","warn"],["B","Aerobic","ok"],["A","Recovery","mute"]].map(([z, name, tone]) => {
                const mins = Math.round(zoneMinutes[z]);
                const p = pct(mins, totalZoneMin);
                return (
                  <div key={z} style={{ display:"flex", alignItems:"center", gap:9, marginBottom:9 }}>
                    <div style={{ width:22, height:22, borderRadius:"50%", background:TONE_BG[tone], border:`1px solid ${TONE[tone]}55`,
                                  color:TONE[tone], fontSize:10, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{z}</div>
                    <Bar value={p} tone={tone} height={16} radius={5} />
                    <div className="num" style={{ fontSize:11, fontWeight:700, color:TONE[tone], minWidth:34, textAlign:"right" }}>{p.toFixed(0)}%</div>
                    <div className="num" style={{ fontSize:10, color:T.ink3, minWidth:74 }}>{mins}m · {name}</div>
                  </div>
                );
              })}
              <Note tone="accent" icon="◆">Ideal Hyrox split: ~40% zone B/C aerobic · ~35% zone D/E race intensity · ~25% recovery.</Note>
            </> : <Empty>No HR data in the last 28 days.</Empty>}
          </Card>
        </Sec>

        <Sec title="Aerobic efficiency" sub="Pace at comparable heart rate">
          <Card pad={16}>
            {paceTrend.length < 2 ? <Empty>Need at least 2 Z2/Z3 runs to show a trend.</Empty> : (() => {
              const maxSec = Math.max(...paceTrend.map(p => p.paceSec));
              const minSec = Math.min(...paceTrend.map(p => p.paceSec));
              const fmtPace = s => `${Math.floor(s/60)}:${String(Math.round(s%60)).padStart(2,"0")}`;
              const first = paceTrend[0], last = paceTrend[paceTrend.length-1];
              const diff = first.paceSec - last.paceSec;
              return <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, marginBottom:14, flexWrap:"wrap" }}>
                  <div>
                    <div className="num" style={{ fontSize:19, fontWeight:800, color: diff > 0 ? T.ok : diff < -10 ? T.bad : T.ink }}>
                      {diff > 0 ? `↑ ${fmtPace(Math.abs(diff))}/km faster` : diff < 0 ? `↓ ${fmtPace(Math.abs(diff))}/km slower` : "→ stable"}
                    </div>
                    <div style={{ fontSize:10.5, color:T.ink3, marginTop:2 }}>vs first recorded run in range</div>
                  </div>
                  <div className="num" style={{ textAlign:"right", fontSize:11, color:T.ink2 }}>
                    <div>{fmtPace(first.paceSec)} → {fmtPace(last.paceSec)}/km</div>
                    <div style={{ fontSize:10, color:T.ink3 }}>♥ {first.hr} → {last.hr} bpm</div>
                  </div>
                </div>
                {paceTrend.map((p, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:9, marginBottom:6 }}>
                    <div className="num" style={{ fontSize:9.5, color:T.ink3, minWidth:62 }}>{fmtISO(p.date)}</div>
                    <Bar value={(p.paceSec / (maxSec || 1)) * 88 + 12}
                      tone={p.paceSec <= minSec + (maxSec - minSec) * 0.34 ? "ok" : p.paceSec >= maxSec - (maxSec - minSec) * 0.2 ? "bad" : "warn"}
                      height={14} radius={5} />
                    <div className="num" style={{ fontSize:10.5, fontWeight:700, color:T.run, minWidth:46, textAlign:"right" }}>{fmtPace(p.paceSec)}</div>
                    <div className="num" style={{ fontSize:9.5, color:T.ink3, minWidth:34, textAlign:"right" }}>{p.hr}</div>
                  </div>
                ))}
                <Note tone="accent" icon="◆">Longer bar = slower pace. Faster at the same HR means the aerobic engine is adapting; race target is sub-5:00/km at HR 140.</Note>
              </>;
            })()}
          </Card>
        </Sec>
      </div>
    </div>
  );
}

const LOG_FILTERS = [
  ["all", "All"],
  ["hyrox", "🦘 Hyrox"],
  ["run", "🏃 Run"],
  ["tennis", "🎾 Tennis"],
  ["strength", "💪 Strength"],
];

function LogPanel({ activities }) {
  const [f, setF] = useState("all");
  const match = (a) => f === "all" || (f === "hyrox" && isHyrox(a)) || (f === "run" && isRun(a) && !isHyrox(a))
    || (f === "tennis" && isTennis(a)) || (f === "strength" && isStrength(a));
  const list = activities.filter(match).slice(0, 40);
  const totalTrimp = list.reduce((s, a) => s + a._trimp, 0);

  return (
    <div>
      <div className="scroll-x no-bar" style={{ display:"flex", gap:7, marginBottom:14, alignItems:"center" }}>
        {LOG_FILTERS.map(([k, l]) => <Chip key={k} active={f === k} onClick={() => setF(k)}>{l}</Chip>)}
        <span className="num" style={{ fontSize:10.5, color:T.ink3, marginLeft:6, whiteSpace:"nowrap" }}>
          {list.length} sessions · {totalTrimp.toFixed(0)} TRIMP
        </span>
      </div>
      {list.length === 0 && <Card><Empty>Nothing logged in this category yet.</Empty></Card>}
      <div className="grid g2">
        {list.map((a, i) => (
          <Card key={i} pad={13} style={{ display:"flex", gap:12, alignItems:"center" }}>
            <span style={{ fontSize:19, width:26, textAlign:"center", flexShrink:0 }}>{getEmoji(a)}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", gap:8, alignItems:"baseline" }}>
                <span style={{ fontSize:12.5, fontWeight:700, color:getColor(a), overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {a.Title || a["Activity Type"]}
                </span>
                <span style={{ fontSize:9.5, color:T.ink3, whiteSpace:"nowrap" }}>
                  {a._days === 0 ? "today" : a._days === 1 ? "yesterday" : `${a._days}d ago`}
                </span>
              </div>
              <div className="num" style={{ fontSize:11, color:T.ink3, marginTop:3 }}>
                {fmtDur(a._dur)}
                {a._avgHR > 0 ? ` · ♥ ${a._avgHR}` : ""}
                {a._dist > 0 ? ` · ${a._dist.toFixed(1)}km` : ""}
                {a["Avg Speed"] && a["Avg Speed"] !== "--" && isRun(a) ? ` · ${speedToPace(a["Avg Speed"])}` : ""}
                {a._trimp > 0 ? ` · TRIMP ${a._trimp.toFixed(0)}` : ""}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TrainView({ ana, activities }) {
  const [tab, setTab] = useState("plan");
  return (
    <div className="fade">
      <SubNav items={[["plan","PLAN"],["load","LOAD"],["log","LOG"]]} value={tab} onChange={setTab} />
      {tab === "plan" && <PlanBoard activities={activities} />}
      {tab === "load" && <LoadPanel ana={ana} activities={activities} />}
      {tab === "log"  && <LogPanel activities={activities} />}
    </div>
  );
}

/* ── dual-axis line chart (load vs recovery) ─────────────────────────────── */
function DualLine({ points, aKey, bKey, aColor, bColor, aLabel, bLabel, height = 210 }) {
  if (!points || points.length < 2) return <Empty>Not enough data yet.</Empty>;
  const aVals = points.map(p => p[aKey]).filter(v => v != null);
  const bVals = points.map(p => p[bKey]).filter(v => v != null);
  if (!aVals.length || !bVals.length) return <Empty>Not enough data yet.</Empty>;
  const aMax = Math.max(...aVals, 1);
  const bMin = Math.min(...bVals), bMax = Math.max(...bVals);
  const W = 1000, H = 100, padT = 6, padB = 6;
  const innerH = H - padT - padB;
  const xAt = i => (i / (points.length - 1)) * W;
  const yA = v => padT + innerH - (v / aMax) * innerH;
  const yB = v => padT + innerH - ((v - bMin) / (bMax - bMin || 1)) * innerH;
  const aPath = smoothPath(points.map((p, i) => [xAt(i), yA(p[aKey] ?? 0)]));
  const bPath = smoothPath(points.map((p, i) => p[bKey] != null ? [xAt(i), yB(p[bKey])] : null).filter(Boolean));
  const labelIdx = [0, Math.floor(points.length / 3), Math.floor(2 * points.length / 3), points.length - 1];

  return (
    <div>
      <div style={{ display:"flex", gap:16, marginBottom:10, fontSize:10.5, flexWrap:"wrap" }}>
        <span style={{ color:aColor, fontWeight:700 }}>━ {aLabel}</span>
        <span style={{ color:bColor, fontWeight:700 }}>━ {bLabel}</span>
      </div>
      <div style={{ position:"relative", height, paddingRight:36 }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display:"block" }}>
          {[padT, H/2, H - padB].map((y, i) => (
            <line key={i} x1="0" x2={W} y1={y} y2={y} stroke={T.lineDim} strokeDasharray="4,5" vectorEffect="non-scaling-stroke" />
          ))}
          <path d={aPath} fill="none" stroke={aColor} strokeWidth="2" strokeLinejoin="round" opacity="0.9" vectorEffect="non-scaling-stroke" />
          <path d={bPath} fill="none" stroke={bColor} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="num" style={{ position:"absolute", right:0, top:0, bottom:0, width:34, paddingLeft:6,
          display:"flex", flexDirection:"column", justifyContent:"space-between", fontSize:9.5 }}>
          <span style={{ color:bColor }}>{Math.round(bMax)}</span>
          <span style={{ color:bColor }}>{Math.round(bMin)}</span>
        </div>
        <div className="num" style={{ position:"absolute", left:0, top:-2, fontSize:9.5, color:aColor }}>{Math.round(aMax)}</div>
      </div>
      <div className="num" style={{ display:"flex", justifyContent:"space-between", marginTop:5, paddingRight:36, fontSize:9.5, color:T.ink3 }}>
        {labelIdx.map(i => <span key={i}>{fmtISO(points[i].date)}</span>)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BODY — recovery · composition · reference
   ═══════════════════════════════════════════════════════════════════════════ */
function RecoveryPanel({ ana }) {
  const daily = HEALTH_DATA.daily;
  const today = daily[daily.length - 1] || {};
  const last7 = HEALTH_DATA.sleep.slice(-7);
  const avgTotal = last7.length ? Math.round(last7.reduce((s, x) => s + x.deep + x.rem + x.light, 0) / last7.length) : 0;
  const lastSleep = HEALTH_DATA.sleep[HEALTH_DATA.sleep.length - 1];
  const lastTotal = lastSleep ? lastSleep.deep + lastSleep.rem + lastSleep.light : 0;
  const scores = daily.filter(d => d.sleep_score != null);
  const latestScore = scores[scores.length - 1];
  const hrvByDate = {};
  daily.forEach(d => { if (d.hrv > 0) hrvByDate[d.date] = d.hrv; });
  const overlay = ana.atlHistory.filter(d => d.atl > 0).slice(-42)
    .map(d => ({ date:d.date, atl:Math.round(d.atl), hrv:hrvByDate[d.date] || null }));
  const readinessSeries = daily.filter(d => d.hrv > 0).slice(-30).map(d => {
    const h = ana.atlHistory.find(a => a.date === d.date);
    return { date:d.date, val: readiness(h ? h.ctl - h.atl : 0, 99, d.hrv, hrvBaseline) };
  });

  return (
    <div>
      <div className="grid g4" style={{ marginBottom:20 }}>
        <Stat label="HRV" value={today.hrv ?? "—"} unit="ms" sub={`7d avg ${avgOf(daily.slice(-7).map(d => d.hrv))} · base ${hrvBaseline}`}
          tone={today.hrv >= hrvBaseline ? "ok" : "warn"} accentBar />
        <Stat label="Resting HR" value={today.rhr ?? "—"} unit="bpm" sub="athlete range 40–46" tone={today.rhr <= 46 ? "ok" : "warn"} accentBar />
        <Stat label="SpO₂" value={today.spo2 != null ? `${today.spo2}%` : "—"} sub="normal >95%" tone={today.spo2 >= 95 ? "ok" : "warn"} accentBar />
        <Stat label="Respiration" value={today.resp ?? "—"} unit="br/min" sub="baseline 10.7–13.7" tone={today.resp <= 14 ? "ok" : "warn"} accentBar />
      </div>

      <div className="split-even">
        <Sec title="HRV trend" sub={`${daily.length} days of overnight readings`}>
          <Card pad={16}>
            <Sparkline data={daily.map(d => [d.date, d.hrv])} color={T.accent} height={120} />
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:8, fontSize:10.5, color:T.ink3 }}>
              <span>Higher = better recovered</span>
              <span className="num" style={{ color:T.accentIn, fontWeight:700 }}>today {today.hrv}ms</span>
            </div>
          </Card>
        </Sec>

        {latestScore && (
          <Sec title="Sleep score" sub="Garmin nightly score">
            <Card pad={16}>
              <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:12, flexWrap:"wrap" }}>
                <Ring value={latestScore.sleep_score} max={100} size={92} stroke={8}
                  tone={toneOf(latestScore.sleep_score, 80, 60)} label={fmtISO(latestScore.date)} />
                <div style={{ flex:1, minWidth:150 }}>
                  <div className="num" style={{ fontSize:13, color:T.ink }}>
                    7-night average <strong style={{ color:TONE[toneOf(avgOf(scores.slice(-7).map(s => s.sleep_score)), 80, 60)] }}>
                      {avgOf(scores.slice(-7).map(s => s.sleep_score))}
                    </strong>
                  </div>
                  <div style={{ fontSize:10.5, color:T.ink3, marginTop:6, lineHeight:1.7 }}>
                    ≥80 good · 60–79 fair · &lt;60 poor
                  </div>
                </div>
              </div>
              <Sparkline data={scores.map(d => [d.date, d.sleep_score])} color={TONE[toneOf(latestScore.sleep_score, 80, 60)]} height={70} />
            </Card>
          </Sec>
        )}
      </div>

      <Sec title="Sleep architecture" sub="Last 7 nights · deep / REM / light">
        <Card pad={16}>
          <div className="grid g4" style={{ marginBottom:16 }}>
            <Stat pad={12} label="Last night" value={fmtMin(lastTotal)} sub={lastSleep ? `awake ${lastSleep.awake}m` : ""} tone={lastTotal >= 420 ? "ok" : "warn"} />
            <Stat pad={12} label="Deep" value={lastSleep ? `${lastSleep.deep}m` : "—"} sub="target 60–110m" tone={lastSleep && lastSleep.deep >= 60 ? "ok" : "warn"} />
            <Stat pad={12} label="REM" value={lastSleep ? `${lastSleep.rem}m` : "—"} sub="target 90–150m" tone={lastSleep && lastSleep.rem >= 90 ? "ok" : "warn"} />
            <Stat pad={12} label="7-night avg" value={fmtMin(avgTotal)} sub="total sleep" tone={avgTotal >= 420 ? "ok" : "warn"} />
          </div>
          {(() => {
            // Bars are scaled against the longest night in the window, so a 6h
            // night reads visibly shorter than a 9h one. Segments stay
            // proportional inside each bar.
            const maxNight = Math.max(...last7.map(s => s.deep + s.rem + s.light), 1);
            return last7.map((s, i) => {
              const total = s.deep + s.rem + s.light || 1;
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
                  <div className="num" style={{ fontSize:10, color:T.ink3, width:44, textAlign:"right" }}>{fmtISO(s.date)}</div>
                  <div style={{ flex:1, height:13, borderRadius:99, overflow:"hidden", background:T.lineDim }}>
                    <div style={{ width:`${(total/maxNight)*100}%`, height:"100%", display:"flex", borderRadius:99, overflow:"hidden" }}>
                      <div style={{ width:`${(s.deep/total)*100}%`, background:"#4f46e5" }} title={`deep ${s.deep}m`} />
                      <div style={{ width:`${(s.rem/total)*100}%`, background:T.accent }} title={`REM ${s.rem}m`} />
                      <div style={{ width:`${(s.light/total)*100}%`, background:"#6f8bd6" }} title={`light ${s.light}m`} />
                    </div>
                  </div>
                  <div className="num" style={{ fontSize:10, color: total >= 420 ? T.ok : T.ink3, width:48 }}>{fmtMin(total)}</div>
                </div>
              );
            });
          })()}
          <div style={{ display:"flex", gap:14, marginTop:12, paddingTop:10, borderTop:`1px solid ${T.lineDim}` }}>
            {[["#4f46e5","Deep"],[T.accent,"REM"],["#6f8bd6","Light"]].map(([c, l]) => (
              <span key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:T.ink3 }}>
                <span style={{ width:9, height:9, borderRadius:3, background:c }} />{l}
              </span>
            ))}
          </div>
        </Card>
      </Sec>

      <div className="split-even">
        <Sec title="Recovery vs load" sub="HRV falls when acute load spikes — that lag is the signal">
          <Card pad={16}>
            <DualLine points={overlay} aKey="atl" bKey="hrv" aColor={T.bad} bColor={T.accent}
              aLabel="ATL — fatigue" bLabel="HRV — recovery" height={200} />
          </Card>
        </Sec>

        <Sec title="Readiness history" sub="Last 30 days, same formula as the daily score">
          <Card pad={16}>
            {readinessSeries.length < 2 ? <Empty>Not enough data yet.</Empty> : <>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <span className="num" style={{ fontSize:14, fontWeight:800, color:T.ink }}>
                  avg {(readinessSeries.reduce((s, o) => s + o.val, 0) / readinessSeries.length).toFixed(1)}/10
                </span>
                <span style={{ fontSize:10.5, color:T.ink3 }}>{readinessSeries.length} days</span>
              </div>
              <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:110 }}>
                {readinessSeries.map((s, i) => (
                  <div key={i} title={`${s.date} — ${s.val}/10`} style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"flex-end", height:"100%" }}>
                    <div style={{ height:`${(s.val/10)*100}%`, background:TONE[toneOf(s.val, 7, 4)],
                                  borderRadius:"3px 3px 1px 1px", opacity: i === readinessSeries.length-1 ? 1 : 0.7 }} />
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:14, marginTop:12, fontSize:10, color:T.ink3, flexWrap:"wrap" }}>
                {[["ok","7–10 push"],["warn","4–6 smart"],["bad","1–3 rest"]].map(([t, l]) => (
                  <span key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ width:9, height:9, borderRadius:3, background:TONE[t] }} />{l}
                  </span>
                ))}
              </div>
            </>}
          </Card>
        </Sec>
      </div>
    </div>
  );
}

function CompositionPanel() {
  const [bfEntries, setBfEntries] = useState(BF_FALLBACK);
  const [bfStatus, setBfStatus] = useState("loading");

  useEffect(() => {
    let alive = true;
    fetch(SHEET_URL)
      .then(r => r.text())
      .then(csv => { if (!alive) return; setBfEntries(parseSheetBf(csv)); setBfStatus("live"); })
      .catch(() => { if (alive) setBfStatus("fallback"); });
    return () => { alive = false; };
  }, []);

  const weights = HEALTH_DATA.weight;
  const latestWeight = weights[weights.length - 1];
  const wVals = weights.map(w => w[1]);
  const latestVo2 = HEALTH_DATA.vo2max[HEALTH_DATA.vo2max.length - 1];
  const fa = HEALTH_DATA.fitnessAge;
  const latestBf = bfEntries.length ? bfEntries[bfEntries.length - 1] : null;
  const firstBf = bfEntries.length ? bfEntries[0] : null;
  const leanMass = latestBf && latestWeight ? (latestWeight[1] * (1 - latestBf.bf / 100)).toFixed(1) : null;

  return (
    <div>
      {/* BIO AGE HERO */}
      <Card pad={0} lift={false} style={{ marginBottom:20, overflow:"hidden" }}>
        <div style={{ display:"flex", gap:22, alignItems:"center", flexWrap:"wrap", padding:"20px 22px",
                      background:`linear-gradient(135deg, ${T.accentBg}, transparent 62%)` }}>
          <div style={{ textAlign:"center", minWidth:96 }}>
            <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:"0.14em", color:T.ink3 }}>BIO AGE</div>
            <div className="num" style={{ fontSize:46, fontWeight:800, color:T.accentIn, lineHeight:1.05, letterSpacing:"-0.03em" }}>{fa.bio}</div>
            <div style={{ fontSize:10.5, color:T.ink3 }}>vs {fa.chrono} chronological</div>
          </div>
          <div style={{ flex:1, minWidth:220 }}>
            <div style={{ fontSize:15, fontWeight:700, color:T.ink }}>
              {(fa.chrono - fa.bio).toFixed(1)} years younger than the calendar
            </div>
            <div style={{ fontSize:12, color:T.ink2, marginTop:7, lineHeight:1.8 }}>
              Garmin VO₂max <strong style={{ color:T.ink }}>{fa.vo2max}</strong> · resting HR <strong style={{ color:T.ink }}>{fa.rhr} bpm</strong> · BMI <strong style={{ color:T.ink }}>{fa.bmi}</strong>
            </div>
          </div>
        </div>
      </Card>

      <div className="split-even">
        <Sec title="Weight" sub={`${weights.length} readings · last ${latestWeight[0]}`}>
          <Card pad={16}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, gap:12, flexWrap:"wrap" }}>
              <div>
                <div className="num" style={{ fontSize:30, fontWeight:800, color:T.ink, letterSpacing:"-0.02em" }}>
                  {latestWeight[1]}<span style={{ fontSize:14, fontWeight:600, color:T.ink3, marginLeft:4 }}>kg</span>
                </div>
                <div style={{ fontSize:10.5, color:T.ink3, marginTop:2 }}>last logged {latestWeight[0]}</div>
              </div>
              <div className="num" style={{ textAlign:"right", fontSize:11.5, color:T.ink2 }}>
                <div>range {Math.min(...wVals).toFixed(1)}–{Math.max(...wVals).toFixed(1)} kg</div>
                <div style={{ fontSize:10.5, color:T.ink3, marginTop:2 }}>race target 72–73 kg</div>
              </div>
            </div>
            <Sparkline data={weights} color={T.info} height={110} fmt={v => v.toFixed(1)} />
          </Card>
        </Sec>

        <Sec title="Body fat" right={
          <span style={{ color: bfStatus === "live" ? T.ok : T.ink3 }}>
            {bfStatus === "loading" ? "⟳ fetching sheet…" : bfStatus === "live" ? "● live from Google Sheet" : "○ cached (sheet unavailable)"}
          </span>
        }>
          <Card pad={16}>
            <div className="grid g3" style={{ marginBottom:14 }}>
              <Stat pad={12} label="Latest" value={latestBf ? `${latestBf.bf}%` : "—"} sub={latestBf ? latestBf.date : ""} tone="ok" />
              {leanMass && <Stat pad={12} label="Lean mass" value={leanMass} unit="kg" sub="est. from last weight" tone="ok" />}
              {firstBf && latestBf && (
                <Stat pad={12} label={`Since ${firstBf.date.slice(0,7)}`}
                  value={`${latestBf.bf <= firstBf.bf ? "↓" : "↑"} ${Math.abs(latestBf.bf - firstBf.bf).toFixed(1)}%`}
                  sub={`${firstBf.bf}% → ${latestBf.bf}%`} tone={latestBf.bf <= firstBf.bf ? "ok" : "warn"} />
              )}
            </div>
            {bfEntries.length > 1 && <Sparkline data={bfEntries} color={T.ok} height={110} fmt={v => v.toFixed(1)} />}
            <div style={{ fontSize:10, color:T.ink3, marginTop:8, lineHeight:1.5 }}>
              Readings outside 9–20% are treated as scale outliers and excluded.
            </div>
          </Card>
        </Sec>
      </div>

      <Sec title="VO₂max" sub="Garmin running estimate vs lab CPET">
        <Card pad={16}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:14, marginBottom:12, flexWrap:"wrap" }}>
            <div>
              <div className="num" style={{ fontSize:30, fontWeight:800, color:T.run, letterSpacing:"-0.02em" }}>
                {latestVo2[1]}<span style={{ fontSize:13, fontWeight:600, color:T.ink3, marginLeft:5 }}>mL/kg/min</span>
              </div>
              <div style={{ fontSize:10.5, color:T.ink3, marginTop:2 }}>Garmin estimate · {latestVo2[0]}</div>
            </div>
            <div style={{ textAlign:"right", fontSize:11, color:T.ink2, lineHeight:1.9 }}>
              <div>Elite for 35M: &gt;55 <span style={{ color:T.ok }}>✓</span></div>
              <div>Hyrox sub-75: 50+ <span style={{ color:T.ok }}>✓</span></div>
            </div>
          </div>
          <Sparkline data={HEALTH_DATA.vo2max} color={T.run} height={100} />
          <Note tone="ok" icon="🏆">
            <strong>Lab CPET (Nov 2024): 60 ml/kg/min</strong> — 152% of predicted, classified EXCELLENT. The Garmin figure runs conservative.
          </Note>
        </Card>
      </Sec>
    </div>
  );
}

function ReferencePanel() {
  const zones = [
    { z:"E", name:"Top / VO₂max",        hr:">167",    w:">262W",     tone:"bad" },
    { z:"D", name:"Development",         hr:"146–167", w:"206–262W",  tone:"warn" },
    { z:"C", name:"Intensive endurance", hr:"132–146", w:"154–206W",  tone:"warn" },
    { z:"B", name:"Extensive endurance", hr:"115–132", w:"112–154W",  tone:"ok" },
    { z:"A", name:"Compensation",        hr:"<115",    w:"<112W",     tone:"mute" },
  ];
  return (
    <div className="split-even">
      <Sec title="HR training zones" sub="From CPET, Nov 2024">
        <Card pad={16}>
          {zones.map(z => (
            <div key={z.z} style={{ display:"flex", alignItems:"center", gap:11, padding:"9px 11px", marginBottom:6,
              background:TONE_BG[z.tone], border:`1px solid ${TONE[z.tone]}2e`, borderRadius:9 }}>
              <div style={{ width:26, height:26, borderRadius:"50%", background:TONE[z.tone], color:T.bg,
                            fontSize:11, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{z.z}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:700, color:TONE[z.tone] }}>{z.name}</div>
                <div className="num" style={{ fontSize:10.5, color:T.ink3 }}>HR {z.hr} bpm · {z.w}</div>
              </div>
            </div>
          ))}
          <Note tone="mute">Adjust: <strong>+10 running</strong> · <strong>+5 walking</strong> · <strong>−10 swimming</strong>.</Note>
        </Card>
      </Sec>

      <Sec title="Athlete profile" sub="Fixed reference values">
        <Card pad={16}>
          {[
            ["Age / height / weight", "35 · 176 cm · ~75 kg"],
            ["Lab VO₂max (CPET 2024)", "60 mL/kg/min — excellent"],
            ["HRV baseline", `${hrvBaseline} ms (rolling weekly)`],
            ["Resting HR range", "40–46 bpm"],
            ["Devices", "Garmin Epix 2 Pro · HRM-Pro Plus"],
            ["Last race", "Hyrox Riga · 30 May 2026 · 1:14:56"],
            ["Next race", `${RACE.name} · ${RACE.label} · target ${RACE.target}`],
          ].map(([k, v], i, arr) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between", gap:12, padding:"10px 0",
              borderBottom: i < arr.length - 1 ? `1px solid ${T.lineDim}` : "none" }}>
              <span style={{ fontSize:11.5, color:T.ink3 }}>{k}</span>
              <span style={{ fontSize:11.5, color:T.ink, fontWeight:600, textAlign:"right" }}>{v}</span>
            </div>
          ))}
        </Card>
      </Sec>
    </div>
  );
}

function BodyView({ ana }) {
  const [tab, setTab] = useState("recovery");
  return (
    <div className="fade">
      <SubNav items={[["recovery","RECOVERY"],["composition","COMPOSITION"],["reference","REFERENCE"]]} value={tab} onChange={setTab} />
      {tab === "recovery" && <RecoveryPanel ana={ana} />}
      {tab === "composition" && <CompositionPanel />}
      {tab === "reference" && <ReferencePanel />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RACE — targets · sessions · trends
   ═══════════════════════════════════════════════════════════════════════════ */
const RACE_BUDGET = [
  { part:"8 × 1 km runs",  target:36*60+48, note:"4:36 per km, every km" },
  { part:"8 × stations",   target:28*60+30, note:"including sled work" },
  { part:"Roxzone",        target: 4*60+22, note:"jog every transition" },
];
// Where the five minutes from Riga (1:14:56) actually come from.
const RACE_GAINS = [
  { name:"Runs",      sec:122, how:"8 × 4:36 instead of drifting past 5:00" },
  { name:"Roxzone",   sec: 56, how:"jog every transition, no walking" },
  { name:"Sled pull", sec: 38, how:"pure technique — hand-over-hand rhythm" },
  { name:"Burpee BJ", sec: 36, how:"6×20m blocks at 68s, rhythm over power" },
  { name:"Ski erg",   sec: 31, how:"TT already at 3:54, so 4:08 is ~85% effort" },
  { name:"Row",       sec: 31, how:"hold 2:05/500m off tired legs" },
  { name:"Lunges",    sec:  9, how:"stop resetting mid-lane" },
];
const RIGA_SPLITS = [
  { label:"Ski erg 1000m",  riga:"4:39", target:"4:08" },
  { label:"Row 1000m",      riga:"4:43", target:"4:12" },
  { label:"Sled pull 50m",  riga:"4:08", target:"3:30" },
  { label:"Roxzone",        riga:"5:18", target:"4:22" },
];

function RaceTargets({ ana }) {
  const days = Math.max(0, Math.ceil((new Date(RACE.dateISO) - new Date(TODAY)) / 86400000));
  const budgetTotal = RACE_BUDGET.reduce((s, b) => s + b.target, 0);
  const gainTotal = RACE_GAINS.reduce((s, g) => s + g.sec, 0);
  const maxGain = Math.max(...RACE_GAINS.map(g => g.sec));
  const blockStart = new Date(TAPER_PLAN[0].start);
  const raceDay = new Date(RACE.dateISO);
  const progress = Math.min(100, Math.max(0, ((new Date(TODAY) - blockStart) / (raceDay - blockStart)) * 100));
  const { tsb } = ana;

  return (
    <div>
      {/* countdown hero */}
      <Card pad={0} lift={false} style={{ marginBottom:20, overflow:"hidden" }}>
        <div style={{ padding:"22px", background:`linear-gradient(135deg, ${T.accentBg}, transparent 60%)` }}>
          <div style={{ display:"flex", gap:22, alignItems:"center", flexWrap:"wrap" }}>
            <div>
              <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:"0.18em", color:T.ink3 }}>{RACE.name} · {RACE.label}</div>
              <div className="num" style={{ display:"flex", alignItems:"baseline", gap:9, marginTop:4 }}>
                <span style={{ fontSize:54, fontWeight:800, color:T.ink, lineHeight:1, letterSpacing:"-0.04em" }}>{days}</span>
                <span style={{ fontSize:15, fontWeight:700, color:T.ink3 }}>{days === 1 ? "day" : "days"} out</span>
              </div>
            </div>
            <div style={{ marginLeft:"auto", textAlign:"right" }}>
              <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:"0.14em", color:T.ink3 }}>TARGET</div>
              <div className="num" style={{ fontSize:36, fontWeight:800, color:T.accentIn, letterSpacing:"-0.03em" }}>{RACE.target}</div>
              <div className="num" style={{ fontSize:11, color:T.ink3 }}>Riga was 1:14:56</div>
            </div>
          </div>
          <div style={{ marginTop:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:T.ink3, marginBottom:6 }}>
              <span>{TAPER_PLAN[0].theme} · block start</span>
              <span>{progress.toFixed(0)}% through the block</span>
              <span>Race day</span>
            </div>
            <Bar value={progress} tone="accent" height={8} />
          </div>
        </div>
      </Card>

      <div className="split-even">
        <Sec title="Race-day budget" sub={`Adds up to ${fmtHMS(budgetTotal)} — 20s of headroom on ${RACE.target}`}>
          <Card pad={16}>
            {RACE_BUDGET.map((b, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:11, marginBottom:12 }}>
                <div style={{ minWidth:118 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:T.ink }}>{b.part}</div>
                  <div style={{ fontSize:10, color:T.ink3 }}>{b.note}</div>
                </div>
                <Bar value={pct(b.target, budgetTotal)} tone={i === 0 ? "warn" : i === 1 ? "accent" : "info"} height={18} radius={6} />
                <div className="num" style={{ fontSize:13, fontWeight:800, color:T.ink, minWidth:52, textAlign:"right" }}>{fmtMMSS(b.target)}</div>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-between", paddingTop:11, borderTop:`1px solid ${T.lineDim}` }}>
              <span style={{ fontSize:11.5, fontWeight:700, color:T.ink2 }}>Total</span>
              <span className="num" style={{ fontSize:13, fontWeight:800, color:T.accentIn }}>{fmtHMS(budgetTotal)}</span>
            </div>
          </Card>
        </Sec>

        <Sec title="Where the 5 minutes comes from" sub={`${fmtMMSS(gainTotal)} of identified gains vs Riga`}>
          <Card pad={16}>
            {RACE_GAINS.map((g, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:11, marginBottom:10 }}>
                <div style={{ minWidth:78, fontSize:11.5, fontWeight:700, color:T.ink }}>{g.name}</div>
                <Bar value={(g.sec / maxGain) * 100} tone="ok" height={15} radius={5} />
                <div className="num" style={{ fontSize:11.5, fontWeight:800, color:T.ok, minWidth:44, textAlign:"right" }}>−{fmtMMSS(g.sec)}</div>
              </div>
            ))}
            <div style={{ marginTop:8, paddingTop:10, borderTop:`1px solid ${T.lineDim}` }}>
              {RACE_GAINS.slice(0, 3).map(g => (
                <div key={g.name} style={{ fontSize:10.5, color:T.ink3, marginBottom:4, lineHeight:1.5 }}>
                  <strong style={{ color:T.ink2 }}>{g.name}:</strong> {g.how}
                </div>
              ))}
            </div>
          </Card>
        </Sec>
      </div>

      <Sec title="Station targets" sub="Riga result → Athens target">
        <div className="grid g4">
          {RIGA_SPLITS.map((r, i) => (
            <Stat key={i} label={r.label} value={r.target} sub={`Riga ${r.riga}`} tone="accent" accentBar />
          ))}
        </div>
      </Sec>

      <Sec title="Race week">
        <div className="grid g2">
          <Card pad={14}>
            <Tag tone={tsb >= 10 ? "ok" : "warn"}>FORM TARGET</Tag>
            <div className="num" style={{ fontSize:22, fontWeight:800, color:T.ink, marginTop:8 }}>TSB +10 → +20</div>
            <div style={{ fontSize:11, color:T.ink3, marginTop:4 }}>by Sep 4 · currently {tsb >= 0 ? "+" : ""}{tsb.toFixed(0)}</div>
          </Card>
          <Card pad={14}>
            <Tag tone="accent">TAPER</Tag>
            <div className="num" style={{ fontSize:22, fontWeight:800, color:T.ink, marginTop:8 }}>Aug 31 · −40%</div>
            <div style={{ fontSize:11, color:T.ink3, marginTop:4 }}>cut volume, keep intensity touches</div>
          </Card>
          <Card pad={14}>
            <Tag tone="warn">HEAT</Tag>
            <div className="num" style={{ fontSize:22, fontWeight:800, color:T.ink, marginTop:8 }}>30°C+ in Athens</div>
            <div style={{ fontSize:11, color:T.ink3, marginTop:4 }}>sauna 20min blocks from Aug 20</div>
          </Card>
          <Card pad={14}>
            <Tag tone="info">VENUE</Tag>
            <div style={{ fontSize:15, fontWeight:800, color:T.ink, marginTop:8 }}>Metropolitan Expo</div>
            <div style={{ fontSize:11, color:T.ink3, marginTop:4 }}>walk the roxzone route on Sep 4</div>
          </Card>
        </div>
      </Sec>
    </div>
  );
}

/* ── one Hyrox session, in detail ────────────────────────────────────────── */
function SessionDetail({ s }) {
  const allLaps = s.laps || [];
  const runLaps = allLaps.filter(l => l.role === "run");
  const stationLaps = allLaps.filter(l => l.role === "station");
  const warmupLaps = allLaps.filter(l => l.role === "warmup" || l.role === "cooldown");
  const stationDisplay = (lap, idx) => (s.stationNames && s.stationNames[lap.i]) || `Station ${idx + 1}`;

  // Official results (when uploaded) are the source of truth for times and ranks;
  // Garmin laps still supply heart rate, which official data never carries.
  const official = s.official || null;
  const hasOfficial = !!official;
  const runHrByOrder = runLaps.map(l => ({ avgHr:l.avgHr, maxHr:l.maxHr }));
  const stationHrByName = {};
  stationLaps.forEach(l => {
    const nm = (s.stationNames && s.stationNames[l.i]) || null;
    if (nm) stationHrByName[nm] = { avgHr:l.avgHr, maxHr:l.maxHr };
  });
  const stationHrByOrder = stationLaps.map(l => ({ avgHr:l.avgHr, maxHr:l.maxHr }));

  const runs = hasOfficial && official.runs
    ? official.runs.map((r, i) => ({ i:i+1, t:r.time, rank:r.rank ?? null,
        avgHr:(runHrByOrder[i] || {}).avgHr ?? null, maxHr:(runHrByOrder[i] || {}).maxHr ?? null }))
    : runLaps.map((l, i) => ({ i:i+1, t:l.t, rank:null, avgHr:l.avgHr ?? null, maxHr:l.maxHr ?? null }));

  const stations = hasOfficial && official.stations
    ? official.stations.map((st, i) => {
        const hr = stationHrByName[st.name] || stationHrByOrder[i] || {};
        return { i:i+1, name:st.name, t:st.time, rank:st.rank ?? null, avgHr:hr.avgHr ?? null, named:true };
      })
    : stationLaps.map((l, i) => ({ i:i+1, name:stationDisplay(l, i), t:l.t, rank:null, avgHr:l.avgHr ?? null,
        dist:l.dist, named: !!(s.stationNames && s.stationNames[l.i]) }));

  const runTimes = runs.map(r => r.t), statTimes = stations.map(x => x.t);
  const totalRun = runTimes.reduce((a, b) => a + b, 0);
  const totalStat = statTimes.reduce((a, b) => a + b, 0);
  const avgRun = runTimes.length ? totalRun / runTimes.length : 0;
  const fastRun = runTimes.length ? Math.min(...runTimes) : 0;
  const slowRun = runTimes.length ? Math.max(...runTimes) : 0;
  const maxStat = statTimes.length ? Math.max(...statTimes) : 1;
  const displayTotal = hasOfficial && official.finishTime ? official.finishTime : s.totalTime;
  const hrTone = hr => !hr ? "mute" : hr > 167 ? "bad" : hr > 146 ? "warn" : "ok";

  return (
    <div>
      <div style={{ display:"flex", alignItems:"baseline", gap:10, flexWrap:"wrap", marginBottom:14 }}>
        <h3 style={{ margin:0, fontSize:17, fontWeight:800, color:T.ink, letterSpacing:"-0.01em" }}>{s.name}</h3>
        <span className="num" style={{ fontSize:11.5, color:T.ink3 }}>{s.date}</span>
        {hasOfficial && <Tag tone="ok">🏁 OFFICIAL RESULTS</Tag>}
        {s.type && <Tag tone="accent">{s.type}</Tag>}
      </div>

      <div className="grid g3" style={{ marginBottom:16 }}>
        <Stat label="Total time" value={fmtHMS(displayTotal)} sub={hasOfficial ? "official finish" : "session total"} tone="ink" accentBar />
        <Stat label={`Running ×${runs.length}`} value={fmtMMSS(totalRun)} sub={avgRun ? `avg ${fmtMMSS(avgRun)}` : "—"} tone="warn" accentBar />
        <Stat label={`Stations ×${stations.length}`} value={fmtMMSS(totalStat)} sub={`${pct(totalStat, displayTotal).toFixed(0)}% of session`} tone="accent" accentBar />
        <Stat label="Avg HR" value={s.avgHR ? `${s.avgHR}` : "—"} unit="bpm" sub={s.maxHR ? `max ${s.maxHR}` : "whole session"} tone={hrTone(s.avgHR)} accentBar />
        <Stat label="Run range" value={runs.length ? `${fmtMMSS(fastRun)}–${fmtMMSS(slowRun)}` : "—"} sub="fastest → slowest" tone="info" accentBar />
        {runs.length > 1 && <Stat label="Run drift" value={`+${fmtMMSS(slowRun - fastRun)}`} sub="first → worst split" tone={slowRun - fastRun > 25 ? "warn" : "ok"} accentBar />}
      </div>

      {s.estimateMin && (
        <Card pad={18} lift={false} style={{ marginBottom:16, background:`linear-gradient(135deg, ${T.accentBg}, transparent 65%)`,
          display:"flex", justifyContent:"space-between", alignItems:"center", gap:14, flexWrap:"wrap" }}>
          <div>
            <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:"0.14em", color:T.ink3 }}>PROJECTED FINISH</div>
            <div className="num" style={{ fontSize:34, fontWeight:800, color:T.accentIn, letterSpacing:"-0.03em", marginTop:2 }}>~{s.estimateMin} min</div>
          </div>
          <div style={{ textAlign:"right", fontSize:11, color:T.ink3 }}>
            <div>extrapolated from this session</div>
            <div style={{ marginTop:3 }}>target {RACE.target} in {RACE.label}</div>
          </div>
        </Card>
      )}

      <div className="split-even">
        {runs.length > 0 && (
          <Sec title={`Run splits · ${runs.length} laps${hasOfficial ? " · official" : ""}`}>
            <Card pad={16}>
              {runs.map((run, i) => {
                const isF = run.t === fastRun, isS = run.t === slowRun && fastRun !== slowRun;
                const tone = isF ? "ok" : isS ? "bad" : "warn";
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:9, marginBottom:6 }}>
                    <div className="num" style={{ fontSize:10, color:T.ink3, minWidth:24, textAlign:"right" }}>R{i+1}</div>
                    <Bar value={(run.t / (slowRun || 1)) * 86 + 14} tone={tone} height={18} radius={5} />
                    <div className="num" style={{ fontSize:12, fontWeight:800, color:TONE[tone], minWidth:44, textAlign:"right" }}>{fmtMMSS(run.t)}</div>
                    {run.avgHr && (
                      <div className="num" style={{ fontSize:10, color:TONE[hrTone(run.avgHr)], minWidth:46, textAlign:"right" }}>
                        ♥{run.avgHr}{run.maxHr ? <span style={{ color:T.ink3 }}>/{run.maxHr}</span> : null}
                      </div>
                    )}
                    {run.rank != null && <div className="num" style={{ fontSize:9.5, color:T.ink3, minWidth:34, textAlign:"right" }}>#{run.rank}</div>}
                  </div>
                );
              })}
              <div className="num" style={{ display:"flex", gap:16, flexWrap:"wrap", marginTop:11, paddingTop:10,
                borderTop:`1px solid ${T.lineDim}`, fontSize:10.5, color:T.ink3 }}>
                {avgRun > 0 && <span>avg <strong style={{ color:T.ink }}>{fmtMMSS(avgRun)}</strong></span>}
                {fastRun !== slowRun && <span>drift <strong style={{ color:T.warn }}>+{fmtMMSS(slowRun - fastRun)}</strong></span>}
                <span>total <strong style={{ color:T.ink }}>{fmtMMSS(totalRun)}</strong></span>
              </div>
            </Card>
          </Sec>
        )}

        {stations.length > 0 && (
          <Sec title={`Station breakdown${hasOfficial ? " · official" : ""}`}>
            <Card pad={16}>
              {stations.map((st, i) => (
                <div key={i} style={{ marginBottom:11 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:11.5, fontWeight:600, color: st.named ? T.ink : T.ink3, fontStyle: st.named ? "normal" : "italic" }}>{st.name}</span>
                    <span className="num" style={{ fontSize:12.5, fontWeight:800, color:T.accentIn }}>{fmtMMSS(st.t)}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                    <Bar value={(st.t / maxStat) * 88 + 12} tone="accent" height={13} radius={5} />
                    <div className="num" style={{ fontSize:9.5, color:T.ink3, minWidth:72, textAlign:"right" }}>
                      {st.avgHr ? `♥${st.avgHr}` : ""}
                      {st.rank != null ? `${st.avgHr ? " · " : ""}#${st.rank}` : (st.dist ? ` · ${st.dist}m` : "")}
                    </div>
                  </div>
                </div>
              ))}
              {hasOfficial && official.roxzone && (
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:10, paddingTop:10, borderTop:`1px solid ${T.lineDim}` }}>
                  <span style={{ fontSize:11, color:T.ink2 }}>Roxzone (transitions)</span>
                  <span className="num" style={{ fontSize:12, fontWeight:800, color:T.info }}>
                    {fmtMMSS(official.roxzone.time)}{official.roxzone.rank != null ? ` · #${official.roxzone.rank}` : ""}
                  </span>
                </div>
              )}
              {!hasOfficial && !s.stationNames && (
                <Note tone="warn" icon="💡">Add <code>stationNames</code> to this entry in HYROX_DATA to unlock per-station trends.</Note>
              )}
            </Card>
          </Sec>
        )}
      </div>

      {warmupLaps.length > 0 && (
        <div className="num" style={{ fontSize:10, color:T.ink3, textAlign:"center", marginBottom:16 }}>
          Ignoring {warmupLaps.length} warm-up/cool-down lap{warmupLaps.length > 1 ? "s" : ""} ({warmupLaps.map(l => fmtMMSS(l.t)).join(", ")}) — anomalous distance, likely treadmill drift.
        </div>
      )}

      {s.description && (
        <Sec title="Garmin description">
          <Card pad={16}><div style={{ fontSize:12.5, color:T.ink2, whiteSpace:"pre-wrap", lineHeight:1.6 }}>{s.description}</div></Card>
        </Sec>
      )}

      {s.photos && s.photos.length > 0 && (
        <Sec title={`Photos · ${s.photos.length}`}>
          <div className="scroll-x" style={{ display:"flex", gap:10, paddingBottom:6 }}>
            {s.photos.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ flexShrink:0 }}>
                <img src={url} alt={`session photo ${i+1}`} style={{ height:150, borderRadius:11, border:`1px solid ${T.line}`, display:"block" }} />
              </a>
            ))}
          </div>
        </Sec>
      )}

      <SessionNotes s={s} />
    </div>
  );
}

function SessionNotes({ s }) {
  const key = `hyrox-notes-${s.id}`;
  const [text, setText] = useState(() => {
    if (typeof window === "undefined") return s.notes || "";
    try { return window.localStorage.getItem(key) || s.notes || ""; } catch { return s.notes || ""; }
  });
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(key, text); } catch { /* private mode — notes stay in-session */ }
  }, [text, key]);

  return (
    <Sec title="Session notes" right={
      <button className="tap" onClick={() => setOpen(o => !o)} style={{ fontSize:11, fontWeight:700, color:T.accentIn, cursor:"pointer" }}>
        {open ? "Hide" : text ? "Edit" : "Add notes"}
      </button>
    }>
      {!open && text && (
        <Card pad={16}><div style={{ fontSize:12.5, color:T.ink2, whiteSpace:"pre-wrap", lineHeight:1.6 }}>{text}</div></Card>
      )}
      {!open && !text && <Card pad={16}><Empty>No notes for this session yet.</Empty></Card>}
      {open && (
        <Card pad={16}>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Prescribed workout, conditions, how it felt…"
            style={{ width:"100%", minHeight:170, padding:"11px 13px", background:T.bg, color:T.ink,
              border:`1px solid ${T.line}`, borderRadius:10, fontSize:13, lineHeight:1.6, resize:"vertical", outline:"none" }} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, marginTop:10, flexWrap:"wrap" }}>
            <span style={{ fontSize:10, color:T.ink3 }}>Saved in this browser only · {text.length} chars</span>
            <Chip tone="accent" active onClick={() => { try { navigator.clipboard.writeText(text); } catch {} }}>📋 Copy</Chip>
          </div>
        </Card>
      )}
    </Sec>
  );
}

/* ── cross-session trends ────────────────────────────────────────────────── */
function HyroxTrends({ sessions, ana }) {
  const sessRuns = (sess) => {
    const laps = (sess.laps || []).filter(l => l.role === "run");
    if (sess.official && sess.official.runs)
      return sess.official.runs.map((r, i) => ({ t:r.time, avgHr:(laps[i] || {}).avgHr || null }));
    return laps.map(l => ({ t:l.t, avgHr:l.avgHr || null }));
  };
  const sessStations = (sess) => {
    const laps = (sess.laps || []).filter(l => l.role === "station");
    if (sess.official && sess.official.stations) {
      const hrByName = {};
      laps.forEach(l => { const n = sess.stationNames && sess.stationNames[l.i]; if (n) hrByName[n] = l.avgHr || null; });
      return sess.official.stations.map((st, i) => ({ name:st.name, t:st.time, hr:hrByName[st.name] ?? ((laps[i] || {}).avgHr || null) }));
    }
    return laps.map(l => ({ name: sess.stationNames && sess.stationNames[l.i], t:l.t, hr:l.avgHr || null }));
  };
  const sessTotal = (sess) => (sess.official && sess.official.finishTime) ? sess.official.finishTime : sess.totalTime;

  const tot = sessions.map(s => ({
    date:s.date, id:s.id, totalTime:sessTotal(s),
    runTime:sessRuns(s).reduce((a, b) => a + b.t, 0),
    stationTime:sessStations(s).reduce((a, b) => a + b.t, 0),
  }));
  const byStation = {};
  sessions.forEach(s => sessStations(s).forEach(st => {
    if (!st.name) return;
    (byStation[st.name] = byStation[st.name] || []).push({ date:s.date, time:st.t, hr:st.hr });
  }));
  const runIdx = {};
  sessions.forEach(s => sessRuns(s).forEach((r, i) => {
    (runIdx[`R${i+1}`] = runIdx[`R${i+1}`] || []).push({ date:s.date, time:r.t });
  }));
  const stationNames = Object.keys(byStation);
  const sims = ana.hyroxSims;

  return (
    <div>
      <Sec title="Total time across sessions">
        <Card pad={16}>
          {tot.length >= 2
            ? <Sparkline data={tot.map(t => [t.date, t.totalTime])} color={T.accent} height={110} fmt={v => fmtHMS(v)} />
            : <Empty>Need at least 2 sessions to draw a trend ({tot.length} so far).</Empty>}
          <div className="grid g3" style={{ marginTop:14 }}>
            {tot.map(t => (
              <Card key={t.id} pad={12}>
                <div className="num" style={{ fontSize:10, color:T.ink3 }}>{t.date}</div>
                <div className="num" style={{ fontSize:17, fontWeight:800, color:T.ink, marginTop:3 }}>{fmtHMS(t.totalTime)}</div>
                <div className="num" style={{ fontSize:10, color:T.ink3, marginTop:3 }}>run {fmtMMSS(t.runTime)} · stn {fmtMMSS(t.stationTime)}</div>
              </Card>
            ))}
          </div>
        </Card>
      </Sec>

      <Sec title="Station times" sub="Same station, session over session">
        {stationNames.length === 0
          ? <Card><Empty>No stations named across sessions yet — add <code>stationNames</code> in HYROX_DATA to unlock this.</Empty></Card>
          : <div className="grid g2">
              {stationNames.map(name => {
                const series = byStation[name];
                const times = series.map(x => x.time);
                const best = Math.min(...times), worst = Math.max(...times);
                const delta = series[series.length-1].time - series[0].time;
                const tone = series.length < 2 ? "mute" : delta < -5 ? "ok" : delta > 5 ? "bad" : "mute";
                const trend = series.length < 2 ? "single session" : delta < -5 ? `↓ ${fmtMMSS(Math.abs(delta))} faster` : delta > 5 ? `↑ ${fmtMMSS(delta)} slower` : "≈ holding";
                return (
                  <Card key={name} pad={14}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:8, marginBottom:10 }}>
                      <span style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{name}</span>
                      <span style={{ fontSize:11, fontWeight:700, color:TONE[tone] }}>{trend}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:74 }}>
                      {series.map((p, i) => {
                        const h = ((p.time - best) / (worst - best || 1)) * 62 + 16;
                        const isLast = i === series.length - 1;
                        return (
                          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", height:"100%" }}>
                            <div className="num" style={{ fontSize:10, fontWeight:700, color: isLast ? T.accentIn : T.ink3 }}>{fmtMMSS(p.time)}</div>
                            <div style={{ width:"100%", height:h, background: isLast ? T.accent : "#4c3a86", borderRadius:"4px 4px 0 0", marginTop:4 }} />
                            <div className="num" style={{ fontSize:9, color:T.ink3, marginTop:4 }}>{fmtISO(p.date)}</div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
            </div>}
      </Sec>

      <Sec title="Run times by position" sub="Does the drift show up in the same lap every time?">
        <Card pad={16}>
          {Object.entries(runIdx).filter(([, arr]) => arr.length >= 2).length === 0
            ? <Empty>Need ≥2 sessions with run laps.</Empty>
            : Object.entries(runIdx).filter(([, arr]) => arr.length >= 2).map(([k, series]) => {
                const delta = series[series.length-1].time - series[0].time;
                const tone = delta < -3 ? "ok" : delta > 3 ? "bad" : "mute";
                return (
                  <div key={k} style={{ display:"flex", alignItems:"center", gap:11, padding:"8px 0",
                    borderBottom:`1px solid ${T.lineDim}` }}>
                    <div style={{ fontSize:11.5, fontWeight:800, color:T.run, minWidth:30 }}>{k}</div>
                    <div className="num" style={{ flex:1, display:"flex", gap:6 }}>
                      {series.map((p, i) => (
                        <span key={i} style={{ flex:1, fontSize:10.5, textAlign:"center",
                          color: i === series.length-1 ? T.ink : T.ink3, fontWeight: i === series.length-1 ? 700 : 400 }}>
                          {fmtMMSS(p.time)}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize:10.5, fontWeight:700, color:TONE[tone], minWidth:64, textAlign:"right" }}>
                      {delta < -3 ? "↓ faster" : delta > 3 ? "↑ slower" : "≈ same"}
                    </div>
                  </div>
                );
              })}
        </Card>
      </Sec>

      {sims.length > 0 && (
        <Sec title="Simulation log" sub="Sessions titled as a Hyrox sim or race">
          <Card pad={16}>
            {sims.map((a, i) => (
              <div key={i} style={{ padding:"11px 0", borderBottom: i < sims.length-1 ? `1px solid ${T.lineDim}` : "none" }}>
                <div style={{ display:"flex", justifyContent:"space-between", gap:8, alignItems:"baseline" }}>
                  <span style={{ fontSize:12.5, fontWeight:700, color:T.accentIn }}>🦘 {a.Title}</span>
                  <span className="num" style={{ fontSize:10, color:T.ink3 }}>{a._date}</span>
                </div>
                <div className="num" style={{ display:"flex", gap:13, flexWrap:"wrap", fontSize:10.5, color:T.ink3, marginTop:5 }}>
                  <span>{fmtDur(a._dur)}</span>
                  <span>♥ {a._avgHR}</span>
                  {a._dist > 0 && <span>{a._dist.toFixed(1)} km</span>}
                  {parseNum(a["Avg Ground Contact Time"]) && <span>GCT {Math.round(parseNum(a["Avg Ground Contact Time"]))}ms</span>}
                  <span style={{ color: a._trimp > 80 ? T.bad : T.accentIn, fontWeight:700 }}>TRIMP {a._trimp.toFixed(0)}</span>
                </div>
              </div>
            ))}
            {sims.length > 1 && (() => {
              const d = sims[sims.length-1]._avgHR - sims[0]._avgHR;
              return <Note tone={d < 0 ? "ok" : "warn"}>
                {d < 0
                  ? `Average HR down ${Math.abs(d)} bpm across ${sims.length} sims — aerobic efficiency improving.`
                  : `Average HR up ${d} bpm across ${sims.length} sims — either accumulated fatigue or genuinely harder efforts.`}
              </Note>;
            })()}
          </Card>
        </Sec>
      )}
    </div>
  );
}

function RaceView({ ana }) {
  const sessions = Object.entries(HYROX_DATA).map(([id, s]) => ({ id, ...s })).sort((a, b) => a.date.localeCompare(b.date));
  const [tab, setTab] = useState("targets");
  const [sel, setSel] = useState(Math.max(0, sessions.length - 1));

  return (
    <div className="fade">
      <SubNav items={[["targets","TARGETS"],["sessions","SESSIONS"],["trends","TRENDS"]]} value={tab} onChange={setTab} />
      {tab === "targets" && <RaceTargets ana={ana} />}
      {tab === "sessions" && (sessions.length === 0
        ? <Card><Empty>No Hyrox sessions yet. They appear automatically when an activity is named with “hyrox” or “race simulation”.</Empty></Card>
        : <>
            {sessions.length > 1 && (
              <div className="scroll-x no-bar" style={{ display:"flex", gap:7, marginBottom:18 }}>
                {sessions.map((s, i) => (
                  <Chip key={s.id} active={sel === i} onClick={() => setSel(i)}>
                    {fmtISO(s.date)}{s.official ? " 🏁" : ""}
                  </Chip>
                ))}
              </div>
            )}
            <SessionDetail s={sessions[sel]} />
          </>)}
      {tab === "trends" && (sessions.length === 0
        ? <Card><Empty>No Hyrox sessions to compare yet.</Empty></Card>
        : <HyroxTrends sessions={sessions} ana={ana} />)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHELL — header, sync state, auth controls, navigation
   ═══════════════════════════════════════════════════════════════════════════ */
const WORKER = "https://auth.simas.fit";

// Sync freshness. LAST_RUN = update.py attempted a sync (any outcome).
// LAST_DATA = fresh Garmin data actually landed. The gap between them is what
// tells you whether the scheduler or the tokens are the thing that broke.
function syncState() {
  const now = new Date();
  const lastRun = new Date(LAST_RUN), lastData = new Date(LAST_DATA);
  const clock = d => d.toLocaleTimeString(undefined, { hour:"2-digit", minute:"2-digit" });
  const day = d => {
    const t = new Date(); t.setHours(0,0,0,0);
    const y = new Date(t); y.setDate(y.getDate() - 1);
    const dd = new Date(d); dd.setHours(0,0,0,0);
    if (dd.getTime() === t.getTime()) return "today";
    if (dd.getTime() === y.getTime()) return "yesterday";
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
  const runMin = (now - lastRun) / 60000, dataMin = (now - lastData) / 60000;
  if (dataMin > 28 * 60) return { tone:"bad", short:"tokens expired",
    msg:`Last data ${day(lastData)} ${clock(lastData)} (${ago(lastData)}) — OAuth1 likely expired, tap Renew.` };
  if (runMin > 90) return { tone:"warn", short:"scheduler stuck",
    msg:`Last run ${clock(lastRun)} (${ago(lastRun)}) — the hourly cron may have stopped, tap Refresh.` };
  return { tone:"ok", short:`synced ${ago(lastRun)}`, msg:`Synced ${clock(lastRun)} · data through ${day(lastData)}.` };
}

function AuthControls() {
  const [refresh, setRefresh] = useState({ state:"idle", msg:"" });
  const [renew, setRenew] = useState({ state:"idle", msg:"", session:null });
  const [code, setCode] = useState("");

  async function doRefresh() {
    setRefresh({ state:"busy", msg:"" });
    try {
      const res = await fetch(`${WORKER}/refresh`, {
        method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ mode:"activities" }),
      });
      const data = await res.json();
      if (data.status === "triggered") {
        setRefresh({ state:"ok", msg:"sync running" });
        setTimeout(() => setRefresh({ state:"idle", msg:"" }), 8000);
      } else setRefresh({ state:"err", msg:data.error || "failed" });
    } catch (e) { setRefresh({ state:"err", msg:e.message }); }
  }

  async function startRenew() {
    setRenew({ state:"busy", msg:"", session:null });
    try {
      const res = await fetch(`${WORKER}/auth/start`, { method:"POST" });
      const data = await res.json();
      if (data.status === "mfa_required") setRenew({ state:"mfa", msg:"code sent to your email", session:data.session });
      else if (data.error) setRenew({ state:"err", msg:data.error, session:null });
      else { setRenew({ state:"ok", msg:"credentials renewed" }); }
    } catch { setRenew({ state:"err", msg:"worker unreachable", session:null }); }
  }

  async function verify() {
    if (!code.trim()) return;
    setRenew(r => ({ ...r, state:"verifying" }));
    try {
      const res = await fetch(`${WORKER}/auth/verify`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ code:code.trim(), session:renew.session }),
      });
      const data = await res.json();
      if (data.status === "success") { setRenew({ state:"ok", msg:"renewed — sync running", session:null }); setCode(""); }
      else setRenew(r => ({ ...r, state:"mfa", msg:data.error || "wrong code" }));
    } catch { setRenew(r => ({ ...r, state:"mfa", msg:"verify failed" })); }
  }

  const btn = (bg, border, color) => ({
    padding:"8px 13px", borderRadius:9, fontSize:11, fontWeight:700, cursor:"pointer",
    background:bg, border:`1px solid ${border}`, color, whiteSpace:"nowrap", transition:"all .16s ease",
  });

  return (
    <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
      {renew.state === "mfa" || renew.state === "verifying" ? (
        <div style={{ display:"flex", gap:7, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ fontSize:10.5, color:T.ink3 }}>Code from email:</span>
          <input value={code} onChange={e => setCode(e.target.value)} autoFocus inputMode="numeric" maxLength={8}
            placeholder="123456" onKeyDown={e => { if (e.key === "Enter") verify(); }}
            className="num"
            style={{ width:92, padding:"7px 10px", borderRadius:8, border:`1px solid ${T.accent}`, background:T.bg,
              color:T.ink, fontSize:14, fontWeight:700, letterSpacing:"0.16em", textAlign:"center", outline:"none" }} />
          <button className="tap" onClick={verify} disabled={renew.state === "verifying"} style={btn(T.accent, T.accent, "#fff")}>
            {renew.state === "verifying" ? "Verifying…" : "Submit"}
          </button>
          <button className="tap" onClick={() => { setRenew({ state:"idle", msg:"", session:null }); setCode(""); }}
            style={btn("transparent", T.line, T.ink3)}>Cancel</button>
          {renew.msg && <span style={{ fontSize:10.5, color: renew.msg.includes("sent") ? T.ink3 : T.bad }}>{renew.msg}</span>}
        </div>
      ) : (
        <>
          <button className="tap" onClick={doRefresh} disabled={refresh.state === "busy"}
            style={btn(refresh.state === "err" ? T.badBg : T.accent, refresh.state === "err" ? T.bad : T.accent,
                       refresh.state === "err" ? T.bad : "#fff")}>
            {refresh.state === "busy" ? "Refreshing…" : refresh.state === "ok" ? "✓ Running…" : refresh.state === "err" ? `✗ ${refresh.msg}` : "⟳ Refresh"}
          </button>
          <button className="tap" onClick={startRenew} disabled={renew.state === "busy"}
            style={btn("transparent", renew.state === "err" ? T.bad : T.line, renew.state === "err" ? T.bad : T.ink2)}>
            {renew.state === "busy" ? "Connecting…" : renew.state === "ok" ? "✓ Renewed" : renew.state === "err" ? `✗ ${renew.msg}` : "🔑 Renew"}
          </button>
        </>
      )}
    </div>
  );
}

// Sync status and the credential controls. These are read once in a while and
// tapped rarely, so they sit at the foot of Today rather than occupying the
// top of every screen. The header keeps only a status dot, which turns amber
// or red — with a word saying which — when something actually needs attention.
function SyncPanel() {
  const sync = syncState();
  return (
    <Sec title="Sync" sub="Garmin data updates hourly on its own">
      <Card pad={16}>
        <div style={{ display:"flex", gap:14, alignItems:"flex-start", flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 240px", minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span className={sync.tone === "ok" ? "live" : ""} style={{ width:7, height:7, borderRadius:"50%",
                background:TONE[sync.tone], flexShrink:0 }} />
              <span style={{ fontSize:12.5, color: sync.tone === "ok" ? T.ink2 : TONE[sync.tone],
                fontWeight: sync.tone === "ok" ? 400 : 700, lineHeight:1.5 }}>{sync.msg}</span>
            </div>
            <div className="num" style={{ fontSize:10.5, color:T.ink3, marginTop:7 }}>
              Last run {LAST_RUN.replace("T", " ").replace("Z", " UTC")}
            </div>
          </div>
          <AuthControls />
        </div>
        <div style={{ fontSize:10.5, color:T.ink3, marginTop:12, paddingTop:11,
          borderTop:`1px solid ${T.lineDim}`, lineHeight:1.6 }}>
          <strong style={{ color:T.ink2 }}>Refresh</strong> pulls new activities now, instead of waiting for the hour.
          {" "}<strong style={{ color:T.ink2 }}>Renew</strong> re-authorises Garmin and needs the emailed code — only
          necessary about once a year, when the long-lived token expires.
        </div>
      </Card>
    </Sec>
  );
}

const TABS = [
  ["today", "Today",  "◎"],
  ["train", "Train",  "▤"],
  ["body",  "Body",   "♡"],
  ["race",  "Race",   "⚑"],
];

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [ana, setAna] = useState(null);
  const [view, setView] = useState("today");

  useEffect(() => {
    const a = analyze(parseCSV(CSV_DATA));
    setActivities(a.enriched);
    setAna(a);
  }, []);

  useEffect(() => { window.scrollTo({ top:0, behavior:"smooth" }); }, [view]);

  const daysOut = Math.round((new Date(RACE.dateISO) - new Date(TODAY)) / 86400000);
  const sync = syncState();

  return (
    <>
      <GlobalStyle />
      <div style={{ minHeight:"100vh", background:T.bg, color:T.ink, fontSize:13 }}>

        {/* ── HEADER ──────────────────────────────────────────────────── */}
        <div className="chrome">
          <header className="chrome-bar">
            <div className="wrap chrome-inner">
              <span style={{ fontSize:16, fontWeight:800, letterSpacing:"-0.02em", color:T.ink }}>Training</span>
              <span style={{ width:1, height:14, background:T.line, flexShrink:0 }} />
              <span className="num race-line" style={{ fontSize:10.5, fontWeight:800, letterSpacing:"0.12em", color:T.accentIn }}>
                <span className="race-name">{RACE.name} · </span>
                {daysOut > 0 ? `${daysOut} DAYS` : daysOut === 0 ? "TODAY 🏁" : "DONE"} · {RACE.target}
              </span>
              {/* Only a dot while healthy; it names the problem when there is one,
                  so moving the detail to Today cannot hide a broken sync. */}
              <button className="tap" onClick={() => setView("today")} title={sync.msg}
                style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6, cursor:"pointer", flexShrink:0 }}>
                <span className={sync.tone === "ok" ? "live" : ""} style={{ width:7, height:7, borderRadius:"50%",
                  background:TONE[sync.tone], flexShrink:0 }} />
                {sync.tone !== "ok" && (
                  <span style={{ fontSize:10.5, fontWeight:700, color:TONE[sync.tone], whiteSpace:"nowrap" }}>{sync.short}</span>
                )}
              </button>
            </div>
          </header>

          {/* ── NAV — header row on desktop, bottom bar on phone ───────── */}
          <nav className="mainnav" aria-label="Sections">
            <div className="wrap mainnav-inner">
              {TABS.map(([k, l, icon]) => (
                <button key={k} onClick={() => setView(k)}
                  className={`tap navbtn${view === k ? " is-active" : ""}`}
                  aria-current={view === k ? "page" : undefined}>
                  <span className="navicon" aria-hidden="true">{icon}</span>
                  <span>{l}</span>
                  {view === k && <span className="navdot" />}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* ── CONTENT ─────────────────────────────────────────────────── */}
        <main className="wrap main-pad">
          {!ana ? (
            <Card pad={40}><Empty>Loading training data…</Empty></Card>
          ) : (
            <>
              {view === "today" && <TodayView ana={ana} health={HEALTH_DATA} />}
              {view === "train" && <TrainView ana={ana} activities={activities} />}
              {view === "body"  && <BodyView ana={ana} />}
              {view === "race"  && <RaceView ana={ana} />}
            </>
          )}
        </main>

        <footer className="wrap foot-pad" style={{ fontSize:10.5, color:T.ink3, lineHeight:1.7 }}>
          <div style={{ borderTop:`1px solid ${T.lineDim}`, paddingTop:16, display:"flex", gap:14, flexWrap:"wrap", justifyContent:"space-between" }}>
            <span>Garmin data synced hourly · {activities.length} activities · {HEALTH_DATA.daily.length} days of wellness</span>
          </div>
        </footer>
      </div>
    </>
  );
}
