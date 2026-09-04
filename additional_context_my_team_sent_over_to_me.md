# RAILSYNC-ABP — Dataset Sourcing & Synthetic Data Generation Guide

## 1. Overview: What's Real vs. What's Synthetic

| # | Dataset | Real or Synthetic | Why |
|---|---|---|---|
| 1 | Train Timetable | **Real (available)** | Published open data exists |
| 2 | Weather (optional, if reinstated) | **Real (available)** | Public historical weather data exists |
| 3 | Assets (track, signal, OHE/traction equipment) | Synthetic | No public access to TMS/SMMS/TDMS asset registers |
| 4 | Corridors & network graph | Synthetic (structurally realistic) | No public COA network topology export |
| 5 | Defects & maintenance tasks (Engineering/TMS, S&T/SMMS, Traction/TDMS) | Synthetic | No public access to departmental defect logs |
| 6 | Block windows / existing reservations (COA/BDMS) | Synthetic | No public access to COA |
| 7 | Goods train forecast | Synthetic | Not publicly published at this granularity |
| 8 | Resources (crew, machines, materials) | Synthetic | No public HR/asset-fleet data |
| 9 | Isolation records | Synthetic | Internal operational data, not public |
| 10 | Diversion links (alternate routes) | Synthetic (derived from your synthetic corridor graph) | Depends on #4 |
| 11 | Approval/audit records | **Not sourced at all — generated live** | These are created by the system as planners use it, not pre-built data |

---

## 2. Real Datasets — Where to Get Them

### Train Timetable
- **Source:** [Indian Railways Train Time Table — data.gov.in](https://www.data.gov.in/catalog/indian-railways-train-time-table)
- **Use:** Pull a real subset (pick 1–2 real corridors/routes) to anchor your synthetic data in something verifiably real. This is a strong, cheap credibility signal — "our timetable data is real, our operational/maintenance data is synthetic because it isn't publicly available" is a defensible, honest line to say to judges.
- Verify freshness/format before committing — check the file structure early so your data model matches it, rather than adapting late.

### Weather (optional)
- **Source:** IMD open data or data.gov.in weather datasets (search "India Meteorological Department" on data.gov.in), for the region matching whichever real corridor you pick above.
- **Use:** Only worth doing if you reinstate weather-aware scheduling. Skip if it's staying cut — better to leave it out cleanly than half-integrate it.

---

## 3. Synthetic Datasets — Generation Order (Important)

LLMs generate referentially-consistent data much better in sequence than in one giant request — asking for everything at once tends to produce IDs that don't line up (a defect referencing an asset ID that doesn't exist in your asset table, etc.). Generate in this order, feeding each output's real IDs into the next prompt:

1. **Corridors & network graph** → gives you corridor IDs
2. **Assets** → references corridor IDs
3. **Resources (crew/machines)** → references corridor/base-location IDs
4. **Defects & maintenance tasks** → references asset IDs
5. **Block windows (existing reservations)** → references corridor IDs
6. **Goods forecast** → references corridor IDs
7. **Isolation records** → references asset/task IDs
8. **Diversion links** → derived directly from the corridor graph (step 1)
9. **Dirty-data injection pass** → run last, on top of everything above

---

## 4. Gemini Prompts (use in AI Studio, structured/JSON output mode where possible)

For each prompt below, turn on **structured output / JSON schema mode** in AI Studio if available — it keeps field names and types consistent across batches, which matters a lot once you're joining these tables in code. Generate in batches (e.g. 30–50 records at a time) rather than one huge request — quality and consistency degrade in very large single generations.

### Prompt 1 — Corridors & Network Graph
```
Generate a synthetic dataset of 12 railway corridors for a prototype railway
maintenance-planning system, structurally realistic for Indian Railways but
entirely fictional (do not use real station codes).

Each corridor needs these fields:
- corridor_id (e.g. COR-001)
- start_station (fictional station name + code)
- end_station (fictional station name + code)
- line_type (single line / double line)
- direction (up / down / bidirectional)
- capacity_assumption (trains per hour, realistic range 2-8)
- adjacent_corridors (list of corridor_ids that physically connect to this one)
- permitted_block_patterns (short text, e.g. "night block 00:00-04:00 only")

Design the 12 corridors so they form a small connected network (some corridors
share stations, so trains can be diverted between at least 3 alternate-route
pairs). Output as a JSON array. Also separately list which corridor pairs are
valid "alternate route" pairs (a train diverted off one can use the other) —
call this array diversion_pairs.
```

### Prompt 2 — Assets
```
Generate a synthetic dataset of 60 fixed railway infrastructure assets across
these 12 corridors: [PASTE YOUR CORRIDOR IDS FROM PROMPT 1].

Split assets roughly evenly across three owning departments: Engineering
(track assets), Traction Distribution (OHE/electrical assets), and Signal &
Telecommunication (signalling/comms assets).

Each asset needs:
- asset_id (e.g. AST-0001)
- source_ids (a fictional legacy ID as it would appear in TMS, SMMS, or TDMS
  depending on department, e.g. "TMS-TRK-4471")
- type (specific equipment type, e.g. "rail fastening", "point machine",
  "OHE mast", "axle counter")
- owning_department (Engineering / Traction Distribution / S&T)
- corridor_id (must be one of the corridor IDs provided)
- km_location (kilometer marker within that corridor, e.g. "KM 122.4")
- line, direction
- criticality (High / Medium / Low, weighted toward more High on
  higher-capacity corridors)

Output as a JSON array.
```

### Prompt 3 — Resources (Crew & Machines)
```
Generate a synthetic dataset of 25 maintenance resources (mix of work-gang
crews and machines) for a railway maintenance-planning prototype, covering
Engineering, Traction Distribution, and S&T departments, based near these
corridors: [PASTE CORRIDOR IDS].

Each resource needs:
- resource_id (e.g. RES-001)
- resource_type (crew / machine)
- department
- skill_or_equipment_type (e.g. "track fastening gang", "OHE inspection
  vehicle", "signal testing team")
- base_location (a corridor_id or station where it's normally based)
- travel_time_to_corridor (a small lookup: realistic travel time in minutes
  to each of 3-4 nearby corridors)
- availability_window (a weekly availability pattern, e.g. "Mon-Sat 22:00-06:00")
- setup_time_minutes, removal_time_minutes
- current_maintenance_state (available / under repair / reserved)

Deliberately make 2-3 resources have incomplete or unavailable status (e.g.
"under repair" with no return date) to simulate real-world resource gaps.
Output as a JSON array.
```

### Prompt 4 — Defects & Maintenance Tasks
```
Generate a synthetic dataset of 80 maintenance tasks/defects for a railway
maintenance-planning prototype, referencing these asset IDs:
[PASTE ASSET IDS FROM PROMPT 2].

Each task needs:
- defect_id / task_id (e.g. DEF-0001)
- asset_id (must reference a real asset_id provided)
- defect_category (specific to the asset type)
- severity (Critical / Major / Minor)
- priority_tier (P0 / P1 / P2 / P3, roughly correlated with severity but not
  perfectly — include a few mismatches to make prioritization logic
  meaningful to demonstrate)
- reported_date (spread across the last 60 days)
- deadline (a due date consistent with severity — P0 due very soon, P3 due
  much later)
- recurrence_indicator (true/false — true for about 15% of tasks, meaning
  this type of defect has recurred on this asset before)
- status (open / in-progress / overdue)
- preparation_time_minutes, work_time_minutes, testing_time_minutes,
  clearance_time_minutes (realistic durations for the task type)
- required_skills_or_equipment (referencing the kind of resource that would
  do this work)

Make about 20% of tasks currently overdue relative to their deadline. Output
as a JSON array.
```

### Prompt 5 — Block Windows (Existing Reservations)
```
Generate a synthetic dataset of 40 existing/planned block window reservations
for a railway corridor-availability system, referencing these corridor IDs:
[PASTE CORRIDOR IDS].

Each block window needs:
- block_id (e.g. BLK-001)
- corridor_id
- line, direction
- start_datetime, end_datetime (spread across the next 4 weeks, mostly in
  typical night-block hours)
- block_type (maintenance / inspection / emergency / other)
- reservation_status (confirmed / provisional / cancelled)
- source_timestamp (when this record was last updated)

Include a few overlapping or conflicting reservations on the same corridor
around the same time window, to simulate real scheduling conflicts. Output
as a JSON array.
```

### Prompt 6 — Goods Train Forecast
```
Generate a synthetic dataset of 30 goods-train movement forecast entries for
these corridor IDs: [PASTE CORRIDOR IDS], covering the next 4 weeks.

Each entry needs:
- forecast_id
- corridor_id
- expected_movement_window (start and end time)
- confidence (High / Medium / Low)
- issue_time (when this forecast was generated)

Bias more goods movement toward daytime and evening windows, leaving some
consistent low-traffic night windows across most corridors (this should be
realistic, since maintenance blocks typically target low-traffic periods).
Output as a JSON array.
```

### Prompt 7 — Isolation Records
```
Generate a synthetic dataset of 20 isolation records for a railway electrical/
signalling maintenance system, referencing these asset IDs (prefer OHE/
electrical and signalling assets): [PASTE RELEVANT ASSET IDS].

Each record needs:
- isolation_id
- asset_id
- location (corridor_id + km marker)
- isolation_type (electrical / signalling / mechanical)
- start_time, end_time
- responsible_authority (a role title, e.g. "Traction Power Controller")
- compatibility_state (a short note on what other isolation types this
  is/isn't compatible with simultaneously)

Output as a JSON array.
```

### Prompt 8 — Dirty-Data Injection Pass (run last)
```
I'm going to give you a clean synthetic dataset (JSON) for a railway
maintenance-planning prototype. I need you to deliberately corrupt a realistic
subset of it to simulate real-world data quality issues, WITHOUT telling me
which records you changed inline — instead, return a summary list at the end
of exactly what you changed and why, separate from the corrupted dataset.

Apply these issues to roughly 10-15% of records, spread across the dataset:
- A few duplicate or near-duplicate task/defect entries (same asset, similar
  description, slightly different IDs or timestamps)
- A few records with missing km_location or missing deadline fields
- A few inconsistent severity labels (e.g. one department calls it "Critical",
  a duplicate-like record calls the same issue "High")
- A few stale source_timestamp values (older than 30 days, to simulate a
  feed that hasn't refreshed)
- A few conflicting asset identifiers (same physical asset referenced with
  two different asset_ids, as if two source systems disagree)
- One or two tasks whose required duration doesn't fit in any available
  block window in the dataset (genuinely infeasible requests)
- One or two resource references to a resource_id that's marked unavailable

Here is the dataset: [PASTE YOUR COMBINED JSON DATA]
```

---

## 5. Practical Notes

- **Do the corridor graph (Prompt 1) yourself carefully, don't fully delegate it** — this is the one dataset where you actually want tight control over the topology, since your alternate-route/diversion-conflict feature depends entirely on it making structural sense. Treat Gemini's output as a first draft you sanity-check by hand.
- **Every record should carry the audit fields** from the spec (`source_system`, `source_record_id`, `ingested_at`, `last_updated_at`, `schema_version`, `data_quality_status`, `mapping_confidence`) — easiest to add these programmatically after generation rather than asking Gemini to produce them, since they're mechanical, not creative.
- **Approval/audit records are not a dataset you generate ahead of time** — they get created as your demo runs (a planner approves/overrides a plan, the system logs it). Don't waste generation effort here.
- Keep every generated file — you'll want to regenerate the dirty-data pass a few times until the corruption looks natural rather than obviously scripted.
