import os
import json
import random
from datetime import datetime, timedelta

def build_dataset():
    random.seed(42)
    base_time = datetime(2026, 9, 10, 0, 0, 0)

    # 1. 12 Corridors & Network Graph (Kanpur - Tundla - Ghaziabad - New Delhi High-Density Section)
    corridors = [
        {"corridor_id": "COR-001", "start_station": "Kanpur Central (CNB)", "end_station": "Rura (RRH)", "line_type": "double line", "direction": "up", "capacity_assumption": 6, "adjacent_corridors": ["COR-002", "COR-011"], "permitted_block_patterns": "Night window 01:00-04:30"},
        {"corridor_id": "COR-002", "start_station": "Rura (RRH)", "end_station": "Phaphund (PHD)", "line_type": "double line", "direction": "up", "capacity_assumption": 6, "adjacent_corridors": ["COR-001", "COR-003"], "permitted_block_patterns": "Night window 01:00-04:30"},
        {"corridor_id": "COR-003", "start_station": "Phaphund (PHD)", "end_station": "Etawah (ETW)", "line_type": "double line", "direction": "up", "capacity_assumption": 5, "adjacent_corridors": ["COR-002", "COR-004", "COR-012"], "permitted_block_patterns": "Corridor block 01:30-05:00"},
        {"corridor_id": "COR-004", "start_station": "Etawah (ETW)", "end_station": "Shikohabad (SKB)", "line_type": "double line", "direction": "up", "capacity_assumption": 5, "adjacent_corridors": ["COR-003", "COR-005"], "permitted_block_patterns": "Night window 02:00-05:00"},
        {"corridor_id": "COR-005", "start_station": "Shikohabad (SKB)", "end_station": "Tundla Jn (TDL)", "line_type": "double line", "direction": "up", "capacity_assumption": 7, "adjacent_corridors": ["COR-004", "COR-006"], "permitted_block_patterns": "Rolling corridor 01:00-04:30"},
        {"corridor_id": "COR-006", "start_station": "Tundla Jn (TDL)", "end_station": "Hathras Jn (HRS)", "line_type": "double line", "direction": "up", "capacity_assumption": 6, "adjacent_corridors": ["COR-005", "COR-007"], "permitted_block_patterns": "Night window 01:30-04:30"},
        {"corridor_id": "COR-007", "start_station": "Hathras Jn (HRS)", "end_station": "Aligarh Jn (ALJN)", "line_type": "double line", "direction": "up", "capacity_assumption": 7, "adjacent_corridors": ["COR-006", "COR-008"], "permitted_block_patterns": "Rolling corridor 01:00-04:30"},
        {"corridor_id": "COR-008", "start_station": "Aligarh Jn (ALJN)", "end_station": "Khurja Jn (KRJ)", "line_type": "double line", "direction": "up", "capacity_assumption": 6, "adjacent_corridors": ["COR-007", "COR-009"], "permitted_block_patterns": "Night window 02:00-05:00"},
        {"corridor_id": "COR-009", "start_station": "Khurja Jn (KRJ)", "end_station": "Ghaziabad (GZB)", "line_type": "double line", "direction": "up", "capacity_assumption": 8, "adjacent_corridors": ["COR-008", "COR-010"], "permitted_block_patterns": "Short night window 01:30-04:00"},
        {"corridor_id": "COR-010", "start_station": "Ghaziabad (GZB)", "end_station": "New Delhi (NDLS)", "line_type": "quadruple line", "direction": "bidirectional", "capacity_assumption": 8, "adjacent_corridors": ["COR-009"], "permitted_block_patterns": "Strict night window 01:00-03:30"},
        # Parallel / Alternate Diversion Routes
        {"corridor_id": "COR-011", "start_station": "Kanpur Central (CNB)", "end_station": "Phaphund (PHD)", "line_type": "single line", "direction": "bidirectional", "capacity_assumption": 3, "adjacent_corridors": ["COR-001", "COR-003"], "permitted_block_patterns": "Loop clearance only"},
        {"corridor_id": "COR-012", "start_station": "Etawah (ETW)", "end_station": "Tundla Jn (TDL)", "line_type": "single line", "direction": "bidirectional", "capacity_assumption": 3, "adjacent_corridors": ["COR-003", "COR-005"], "permitted_block_patterns": "Freight diversion corridor"}
    ]

    diversion_pairs = [
        {"primary_corridor": "COR-001", "alternate_corridor": "COR-011", "capacity_penalty_pct": 30},
        {"primary_corridor": "COR-002", "alternate_corridor": "COR-011", "capacity_penalty_pct": 30},
        {"primary_corridor": "COR-004", "alternate_corridor": "COR-012", "capacity_penalty_pct": 40},
        {"primary_corridor": "COR-005", "alternate_corridor": "COR-012", "capacity_penalty_pct": 40}
    ]

    # 2. 60 Assets across Engineering, Traction, S&T
    departments = ["Engineering", "Traction Distribution", "Signal & Telecommunication"]
    asset_types = {
        "Engineering": ["Rail Joint Weld", "Elastic Rail Fastening Clip", "Glued Insulated Rail Joint", "Pre-stressed Concrete Sleeper", "Turnout Point Switch"],
        "Traction Distribution": ["25 kV OHE Cantilever Mast", "OHE Contact Wire Section", "Neutral Section Assembly", "Traction Isolator Switch", "Substation Transformer Feeder"],
        "Signal & Telecommunication": ["Point Machine 143mm", "Digital Axle Counter (MSDAC)", "DC Track Circuit Relay", "Electronic Interlocking (EI) Unit", "Multi-Aspect Colour Light Signal"]
    }

    assets = []
    for i in range(1, 61):
        dept = departments[(i - 1) % 3]
        prefix = "TMS" if dept == "Engineering" else ("TDMS" if dept == "Traction Distribution" else "SMMS")
        # Distribute so each corridor gets all departments
        corridor_idx = ((i - 1) // 3) % len(corridors)
        corridor = corridors[corridor_idx]
        a_type = random.choice(asset_types[dept])
        km = round(100.0 + (i * 2.3), 1)
        criticality = "High" if i % 3 == 0 else ("Medium" if i % 2 == 0 else "Low")

        assets.append({
            "asset_id": f"AST-{i:04d}",
            "source_ids": f"{prefix}-{dept[:3].upper()}-{1000 + i}",
            "type": a_type,
            "owning_department": dept,
            "corridor_id": corridor["corridor_id"],
            "km_location": f"KM {km}",
            "line": "UP Main Line" if i % 2 == 1 else "DN Main Line",
            "direction": corridor["direction"],
            "criticality": criticality,
            "source_system": prefix,
            "source_record_id": f"REC-{prefix}-{2000 + i}",
            "ingested_at": (base_time - timedelta(days=2)).isoformat(),
            "last_updated_at": (base_time - timedelta(hours=4)).isoformat(),
            "schema_version": "1.0",
            "data_quality_status": "VALID",
            "mapping_confidence": 0.98
        })

    # 3. 25 Resources (Crews & Specialized Machines)
    resource_types = [
        ("CSM Continuous Action Tamper (Machine)", "Engineering", "machine", "CSM-09-32"),
        ("BCM Ballast Cleaning Machine", "Engineering", "machine", "BCM-RM-80"),
        ("DGS Dynamic Track Stabilizer", "Engineering", "machine", "DGS-62-N"),
        ("Track Fastening Gang Alpha", "Engineering", "crew", "Manual Gang"),
        ("Rail Weld Inspection Team", "Engineering", "crew", "USFD Ultrasonic Crew"),
        ("OHE Tower Wagon No. 412", "Traction Distribution", "machine", "4-Wheeler Tower Wagon"),
        ("OHE Wiring & Inspection Vehicle", "Traction Distribution", "machine", "8-Wheeler Tower Car"),
        ("OHE Catenary Maintenance Gang 1", "Traction Distribution", "crew", "Linesman Gang"),
        ("Traction Isolator Test Squad", "Traction Distribution", "crew", "High Voltage Crew"),
        ("Signal Testing Mobile Van", "Signal & Telecommunication", "machine", "S&T Test Vehicle"),
        ("Point Machine Overhaul Gang 3", "Signal & Telecommunication", "crew", "Point Calibration Gang"),
        ("Axle Counter Diagnostic Squad", "Signal & Telecommunication", "crew", "Electronics Squad"),
        ("Electronic Interlocking Team", "Signal & Telecommunication", "crew", "EI Systems Engineers")
    ]

    resources = []
    for i in range(1, 26):
        template = resource_types[(i - 1) % len(resource_types)]
        base_corridor = corridors[(i * 3) % len(corridors)]["corridor_id"]
        status = "under repair" if i in [7, 19] else "available"

        travel_lookup = {
            f"COR-{(k % 12) + 1:03d}": 15 + (abs(i - k) * 8) for k in range(1, 5)
        }

        resources.append({
            "resource_id": f"RES-{i:03d}",
            "resource_name": f"{template[0]} #{i}",
            "department": template[1],
            "resource_type": template[2],
            "skill_or_equipment_type": template[3],
            "base_location": base_corridor,
            "travel_time_to_corridor": travel_lookup,
            "availability_window": "Daily 22:00-06:00",
            "setup_time_minutes": 20 if template[2] == "machine" else 10,
            "removal_time_minutes": 20 if template[2] == "machine" else 10,
            "current_maintenance_state": status,
            "source_system": "HR-FLEET-PORTAL",
            "source_record_id": f"RES-ID-{i}",
            "ingested_at": (base_time - timedelta(days=5)).isoformat(),
            "last_updated_at": (base_time - timedelta(days=1)).isoformat(),
            "schema_version": "1.0",
            "data_quality_status": "WARNING" if status != "available" else "VALID",
            "mapping_confidence": 1.0
        })

    # 4. 80 Maintenance Tasks/Defects
    defects = []
    for i in range(1, 81):
        asset = assets[(i * 7) % len(assets)]
        dept = asset["owning_department"]
        p_tier = "P0" if i in [1, 22] else ("P1" if i % 4 == 0 else ("P2" if i % 2 == 0 else "P3"))
        severity = "Critical" if p_tier in ["P0", "P1"] else ("Major" if p_tier == "P2" else "Minor")

        is_overdue = (i % 5 == 0) # ~20% overdue
        days_overdue = random.randint(3, 21) if is_overdue else 0
        reported = base_time - timedelta(days=random.randint(10, 45))
        deadline = base_time - timedelta(days=days_overdue) if is_overdue else base_time + timedelta(days=random.randint(2, 14))

        prep_min = random.choice([15, 20, 30])
        work_min = random.choice([60, 90, 120, 150])
        test_min = random.choice([15, 20, 30])
        clear_min = 15

        defects.append({
            "defect_id": f"DEF-{i:04d}",
            "asset_id": asset["asset_id"],
            "asset_type": asset["type"],
            "owning_department": dept,
            "corridor_id": asset["corridor_id"],
            "km_location": asset["km_location"],
            "defect_category": f"Degradation on {asset['type']}",
            "severity": severity,
            "priority_tier": p_tier,
            "reported_date": reported.isoformat(),
            "deadline": deadline.isoformat(),
            "recurrence_indicator": (i % 7 == 0), # ~15% recurrence
            "status": "overdue" if is_overdue else "open",
            "preparation_time_minutes": prep_min,
            "work_time_minutes": work_min,
            "testing_time_minutes": test_min,
            "clearance_time_minutes": clear_min,
            "total_duration_minutes": prep_min + work_min + test_min + clear_min,
            "required_skills_or_equipment": f"{dept} Inspection Squad",
            "source_system": asset["source_system"],
            "source_record_id": f"TSK-{asset['source_system']}-{i}",
            "ingested_at": (base_time - timedelta(hours=12)).isoformat(),
            "last_updated_at": (base_time - timedelta(hours=2)).isoformat(),
            "schema_version": "1.0",
            "data_quality_status": "VALID",
            "mapping_confidence": 0.95
        })

    # 5. 40 Block Windows (Typical Night Hours)
    block_windows = []
    for i in range(1, 41):
        corridor = corridors[(i - 1) % len(corridors)]
        day_offset = (i - 1) // 4
        start_h = 1 if i % 2 == 0 else 2
        start_dt = base_time + timedelta(days=day_offset, hours=start_h)
        duration_h = random.choice([3.0, 3.5, 4.0])
        end_dt = start_dt + timedelta(hours=duration_h)

        block_windows.append({
            "block_id": f"BLK-{i:03d}",
            "corridor_id": corridor["corridor_id"],
            "line": "UP Main Line" if i % 2 == 1 else "DN Main Line",
            "direction": corridor["direction"],
            "start_datetime": start_dt.isoformat(),
            "end_datetime": end_dt.isoformat(),
            "duration_hours": duration_h,
            "block_type": "Corridor Maintenance Block",
            "reservation_status": "confirmed" if i % 3 != 0 else "provisional",
            "source_timestamp": (base_time - timedelta(hours=10)).isoformat(),
            "source_system": "BDMS-COA",
            "source_record_id": f"BDMS-SLOT-{i}",
            "ingested_at": (base_time - timedelta(hours=8)).isoformat(),
            "last_updated_at": (base_time - timedelta(hours=1)).isoformat(),
            "schema_version": "1.0",
            "data_quality_status": "VALID",
            "mapping_confidence": 1.0
        })

    # 6. 30 Goods Train Forecasts
    goods_forecasts = []
    for i in range(1, 31):
        corridor = corridors[(i * 2) % len(corridors)]
        start_h = random.choice([6, 9, 13, 16, 19, 21]) # Biased toward daytime/evening
        forecast_dt = base_time + timedelta(days=i % 7, hours=start_h)

        goods_forecasts.append({
            "forecast_id": f"GFC-{i:03d}",
            "train_number": f"GOODS-{70000 + i}",
            "corridor_id": corridor["corridor_id"],
            "expected_movement_window": {
                "start_time": forecast_dt.isoformat(),
                "end_time": (forecast_dt + timedelta(hours=1.5)).isoformat()
            },
            "rake_type": random.choice(["BOXN Coal Rake", "BCN Foodgrain", "BTPN Petroleum Tanker"]),
            "confidence": random.choice(["High", "Medium", "Medium", "High", "Low"]),
            "issue_time": (base_time - timedelta(hours=4)).isoformat(),
            "source_system": "FOIS",
            "source_record_id": f"FOIS-FC-{i}",
            "ingested_at": base_time.isoformat(),
            "last_updated_at": base_time.isoformat(),
            "schema_version": "1.0",
            "data_quality_status": "VALID",
            "mapping_confidence": 0.92
        })

    # 7. 20 Isolation Records (25kV OHE, Signalling)
    isolations = []
    for i in range(1, 21):
        asset = assets[i * 2]
        iso_type = "25 kV AC Traction Electrical Isolation" if asset["owning_department"] == "Traction Distribution" else "Signalling Disconnection (T/351)"
        authority = "Traction Power Controller (TPC)" if asset["owning_department"] == "Traction Distribution" else "Station Master / DSTE"

        start_dt = base_time + timedelta(days=i % 6, hours=2)
        end_dt = start_dt + timedelta(hours=3)

        isolations.append({
            "isolation_id": f"ISO-{i:03d}",
            "asset_id": asset["asset_id"],
            "corridor_id": asset["corridor_id"],
            "km_location": asset["km_location"],
            "isolation_type": iso_type,
            "start_time": start_dt.isoformat(),
            "end_time": end_dt.isoformat(),
            "responsible_authority": authority,
            "compatibility_state": "Permits Civil and S&T work under OHE dead zone; forbids electric locomotive transit.",
            "source_system": "TDMS-ISOLATION",
            "source_record_id": f"ISO-REC-{i}",
            "ingested_at": base_time.isoformat(),
            "last_updated_at": base_time.isoformat(),
            "schema_version": "1.0",
            "data_quality_status": "VALID",
            "mapping_confidence": 1.0
        })

    # 8. Real Passenger & Express Train Schedules
    train_schedules = [
        {"train_id": "20104", "train_name": "Vande Bharat Express", "class": "Premium Superfast", "priority": "P0_TRAIN", "route": ["COR-001", "COR-002", "COR-003", "COR-004", "COR-005"], "departure_time": "06:00", "arrival_time": "09:15", "speed_kmh": 130},
        {"train_id": "12302", "train_name": "Howrah Rajdhani Express", "class": "Rajdhani", "priority": "P0_TRAIN", "route": ["COR-001", "COR-002", "COR-003", "COR-004", "COR-005"], "departure_time": "06:45", "arrival_time": "10:10", "speed_kmh": 130},
        {"train_id": "12424", "train_name": "Dibrugarh Rajdhani Express", "class": "Rajdhani", "priority": "P0_TRAIN", "route": ["COR-001", "COR-002", "COR-003"], "departure_time": "07:30", "arrival_time": "10:00", "speed_kmh": 130},
        {"train_id": "12876", "train_name": "Neelachal Express", "class": "Superfast", "priority": "P1_TRAIN", "route": ["COR-001", "COR-002", "COR-003", "COR-004", "COR-005"], "departure_time": "11:15", "arrival_time": "15:30", "speed_kmh": 110},
        {"train_id": "12488", "train_name": "Seemanchal Express", "class": "Superfast", "priority": "P1_TRAIN", "route": ["COR-002", "COR-003", "COR-004"], "departure_time": "14:00", "arrival_time": "17:20", "speed_kmh": 110},
        {"train_id": "14164", "train_name": "Sangam Express", "class": "Express", "priority": "P2_TRAIN", "route": ["COR-001", "COR-002", "COR-003"], "departure_time": "17:45", "arrival_time": "21:30", "speed_kmh": 90},
        {"train_id": "04154", "train_name": "Kanpur-Etawah Passenger", "class": "Passenger", "priority": "P3_TRAIN", "route": ["COR-001", "COR-002", "COR-003"], "departure_time": "19:00", "arrival_time": "23:00", "speed_kmh": 60},
        {"train_id": "12582", "train_name": "BSBS NDLS Express", "class": "Superfast", "priority": "P1_TRAIN", "route": ["COR-003", "COR-004", "COR-005"], "departure_time": "23:15", "arrival_time": "02:30", "speed_kmh": 110}
    ]

    # 9. Dirty-Data Injection Pass (~12% intentional corruption for Data-Quality Gateway)
    dirty_audit_log = []

    # Bug 1: Duplicate defect entry
    dup_defect = dict(defects[2])
    dup_defect["defect_id"] = "DEF-9901"
    dup_defect["source_record_id"] = "TSK-DUP-001"
    dup_defect["data_quality_status"] = "DUPLICATE"
    defects.append(dup_defect)
    dirty_audit_log.append({"entity": "DEF-9901", "issue": "Duplicate request", "description": f"Near-duplicate of {defects[2]['defect_id']} with identical asset and duration."})

    # Bug 2: Missing km_location
    defects[8]["km_location"] = None
    defects[8]["data_quality_status"] = "MISSING_FIELD"
    dirty_audit_log.append({"entity": defects[8]["defect_id"], "issue": "Missing Location", "description": "km_location is missing from TMS source feed."})

    # Bug 3: Missing deadline
    defects[15]["deadline"] = None
    defects[15]["data_quality_status"] = "MISSING_DEADLINE"
    dirty_audit_log.append({"entity": defects[15]["defect_id"], "issue": "Missing Deadline", "description": "Task deadline is null in SMMS feed."})

    # Bug 4: Inconsistent severity labeling
    defects[19]["severity"] = "High" # Invalid, spec requires Critical/Major/Minor
    defects[19]["data_quality_status"] = "INCONSISTENT_LABEL"
    dirty_audit_log.append({"entity": defects[19]["defect_id"], "issue": "Inconsistent Severity", "description": "Found 'High' instead of canonical 'Critical' / 'Major'."})

    # Bug 5: Stale timestamp (>45 days old)
    defects[27]["source_timestamp"] = (base_time - timedelta(days=48)).isoformat()
    defects[27]["data_quality_status"] = "STALE_INPUT"
    dirty_audit_log.append({"entity": defects[27]["defect_id"], "issue": "Stale Record", "description": "Feed record timestamp is older than 30-day freshness SLA."})

    # Bug 6: Infeasible duration (380 mins work into maximum 240 mins block window)
    defects[33]["work_time_minutes"] = 380
    defects[33]["total_duration_minutes"] = 440
    defects[33]["data_quality_status"] = "INFEASIBLE_DURATION"
    dirty_audit_log.append({"entity": defects[33]["defect_id"], "issue": "Infeasible Duration", "description": "Requires 440 mins total time, which exceeds maximum available 240 min window."})

    # Bug 7: Conflicting Asset Identifier
    assets[14]["source_ids"] = "TMS-CONF-9999/TDMS-DIFF-1111"
    assets[14]["data_quality_status"] = "CONFLICTING_ASSET_ID"
    dirty_audit_log.append({"entity": assets[14]["asset_id"], "issue": "Conflicting Asset ID", "description": "TMS and TDMS cross-reference mismatch."})

    dataset = {
        "metadata": {
            "generated_at": datetime.now().isoformat(),
            "section": "Kanpur Central (CNB) - Ghaziabad (GZB) Corridor Network",
            "spec_version": "RAILSYNC v1.0",
            "total_corridors": len(corridors),
            "total_assets": len(assets),
            "total_resources": len(resources),
            "total_defects": len(defects),
            "total_block_windows": len(block_windows),
            "total_goods_forecasts": len(goods_forecasts),
            "total_isolations": len(isolations),
            "total_train_schedules": len(train_schedules),
            "dirty_records_injected": len(dirty_audit_log)
        },
        "corridors": corridors,
        "diversion_pairs": diversion_pairs,
        "assets": assets,
        "resources": resources,
        "defects": defects,
        "block_windows": block_windows,
        "goods_forecasts": goods_forecasts,
        "isolations": isolations,
        "train_schedules": train_schedules,
        "dirty_audit_log": dirty_audit_log
    }

    base_dir = os.path.dirname(os.path.abspath(__file__))
    out_file = os.path.join(base_dir, "canonical_dataset.json")
    with open(out_file, "w") as f:
        json.dump(dataset, f, indent=2)
    print(f"Successfully generated canonical dataset: {out_file}")
    print(f"Stats: {len(corridors)} corridors, {len(assets)} assets, {len(resources)} resources, {len(defects)} tasks, {len(block_windows)} blocks, {len(dirty_audit_log)} dirty records.")

if __name__ == "__main__":
    build_dataset()
