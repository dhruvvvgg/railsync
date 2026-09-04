import unittest
import copy
from app.main import load_canonical_data
from app.gateway import DataQualityGateway
from app.safety_rules import DeterministicSafetyValidator, parse_km
from app.priority import PriorityAndBundlingEngine
from app.solver import AutomaticBlockPlannerSolver

class TestRailSyncOptimizer(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.raw_data = load_canonical_data()

    def test_01_path_portability(self):
        """Verify dataset loads successfully via dynamic relative paths."""
        self.assertIsNotNone(self.raw_data)
        self.assertIn("corridors", self.raw_data)
        self.assertIn("defects", self.raw_data)
        self.assertGreater(len(self.raw_data["defects"]), 50)

    def test_02_data_quality_gateway_sanitization(self):
        """Verify Data Quality Gateway detects anomalies and sanitizes dataset for solver."""
        gateway = DataQualityGateway(self.raw_data)
        sanitized = gateway.get_sanitized_dataset()

        self.assertIn("quarantined_defects", sanitized)
        self.assertIn("clean_defects", gateway.validate_all())
        self.assertGreater(len(sanitized["quarantined_defects"]), 0)
        self.assertLess(len(sanitized["defects"]), len(self.raw_data["defects"]))

    def test_03_safety_rules_km_limit(self):
        """Verify safety validator rejects bundles spanning > 15 km."""
        validator = DeterministicSafetyValidator(self.raw_data["corridors"], self.raw_data.get("diversion_pairs", []))
        tasks_far = [
            {"defect_id": "T1", "corridor_id": "COR-001", "km_location": "KM 100.0"},
            {"defect_id": "T2", "corridor_id": "COR-001", "km_location": "KM 122.0"}  # 22 km apart
        ]
        is_safe, msg = validator.validate_bundle_compatibility(tasks_far)
        self.assertFalse(is_safe)
        self.assertIn("exceeds maximum 15.0 km", msg)

    def test_04_safety_rules_vibration_conflict(self):
        """Verify safety validator catches heavy tamping vs point machine vibration conflict within 1.0 km."""
        validator = DeterministicSafetyValidator(self.raw_data["corridors"], self.raw_data.get("diversion_pairs", []))
        tasks_vibration = [
            {
                "defect_id": "T_TAMP",
                "corridor_id": "COR-001",
                "km_location": "KM 110.2",
                "defect_category": "Track Tamping",
                "required_skills_or_equipment": "CSM-09 Continuous Action Tamper"
            },
            {
                "defect_id": "T_POINT",
                "corridor_id": "COR-001",
                "km_location": "KM 110.5",  # 0.3 km apart
                "asset_type": "Point Machine 143mm",
                "owning_department": "Signal & Telecommunication"
            }
        ]
        is_safe, msg = validator.validate_bundle_compatibility(tasks_vibration)
        self.assertFalse(is_safe)
        self.assertIn("Vibration & Access Conflict", msg)

    def test_05_safety_rules_diversion_conflict(self):
        """Verify safety validator detects concurrent primary and diversion corridor blocks."""
        validator = DeterministicSafetyValidator(self.raw_data["corridors"], self.raw_data.get("diversion_pairs", []))
        # COR-001's diversion is COR-011
        is_safe, msg = validator.screen_diversion_conflict("COR-001", ["COR-011"])
        self.assertFalse(is_safe)
        self.assertIn("CRITICAL DIVERSION CONFLICT", msg)

    def test_06_cp_sat_solver_execution(self):
        """Verify Google OR-Tools CP-SAT executes and produces optimal Plan A and Plan B."""
        solver = AutomaticBlockPlannerSolver(self.raw_data)
        results = solver.solve_all_plans()

        self.assertEqual(results["status"], "OPTIMAL_FOUND")
        self.assertIn("Google OR-Tools CP-SAT", results["solver_engine"])
        self.assertLess(results["solve_runtime_seconds"], 2.0)

        plan_a = results["candidate_plans"]["plan_a"]
        plan_b = results["candidate_plans"]["plan_b"]
        baseline = results["candidate_plans"]["baseline_fcfs"]

        # Plan A has 0 express passenger conflicts
        self.assertEqual(plan_a["passenger_trains_delayed"], 0)
        self.assertGreater(len(plan_a["candidate_blocks"]), 0)

        # Baseline has high operational impact
        self.assertGreater(baseline["average_operational_impact"], 60)
        self.assertGreater(baseline["passenger_trains_delayed"], 0)

    def test_07_cp_sat_dynamic_schedule_response(self):
        """Verify solver mathematically schedules newly injected clean urgent defect."""
        data_mod = copy.deepcopy(self.raw_data)
        data_mod["defects"].append({
            "defect_id": "DEF-TEST-URGENT",
            "asset_id": "AST-UNIQUE-9999",
            "corridor_id": "COR-001",
            "km_location": "KM 112.5",
            "defect_category": "Emergency Rail Fracture",
            "severity": "Critical",
            "priority_tier": "P0",
            "owning_department": "Engineering",
            "total_duration_minutes": 75,
            "source_system": "TMS",
            "status": "open",
            "deadline": "2026-09-11T00:00:00"
        })

        solver = AutomaticBlockPlannerSolver(data_mod)
        results = solver.solve_all_plans()
        plan_b_blocks = results["candidate_plans"]["plan_b"]["candidate_blocks"]

        scheduled_urgent = [b for b in plan_b_blocks if "DEF-TEST-URGENT" in b.get("bundled_tasks", [])]
        self.assertEqual(len(scheduled_urgent), 1)

    def test_08_dynamic_emergency_replanning(self):
        """Verify dynamic re-planner resolves unexpected incident in < 0.5 seconds."""
        solver = AutomaticBlockPlannerSolver(self.raw_data)
        replan = solver.replan_emergency_disruption({
            "type": "P0 Emergency Rail Fracture (IMR Defect)",
            "location": "COR-001 KM 144.2 (Kanpur-Rura UP Line)"
        })

        self.assertEqual(replan["replan_status"], "SUCCESSFULLY_RESOLVED")
        self.assertLess(replan["solver_latency_seconds"], 0.5)
        self.assertIn("vande_bharat_20104", replan["operational_impact"])

if __name__ == "__main__":
    unittest.main()
