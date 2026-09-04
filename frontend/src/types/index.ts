export interface Corridor {
  corridor_id: string;
  start_station: string;
  end_station: string;
  line_type: string;
  direction: string;
  capacity_assumption: number;
  adjacent_corridors: string[];
  permitted_block_patterns: string;
}

export interface DefectTask {
  defect_id: string;
  asset_id: string;
  asset_type: string;
  owning_department: string;
  corridor_id: string;
  km_location?: string;
  defect_category: string;
  severity: string;
  priority_tier: string;
  reported_date: string;
  deadline?: string;
  recurrence_indicator: boolean;
  status: string;
  preparation_time_minutes: number;
  work_time_minutes: number;
  testing_time_minutes: number;
  clearance_time_minutes: number;
  total_duration_minutes: number;
  criticality_score?: number;
  explanation?: string;
}

export interface CandidateBlock {
  block_id: string;
  corridor_id: string;
  section: string;
  km_span?: string;
  line?: string;
  start_time: string;
  end_time: string;
  start_minutes?: number;
  end_minutes?: number;
  duration_hours: number;
  bundled_tasks?: string[];
  task_id?: string;
  department?: string;
  departments_involved?: string[];
  isolation_required?: boolean;
  isolation_type?: string;
  affected_trains_count?: number;
  passenger_trains_delayed?: number;
  freight_trains_delayed?: number;
  operational_impact_score: number;
  explainability_notes?: string;
}

export interface CandidatePlan {
  plan_name: string;
  primary_objective: string;
  total_candidate_blocks: number;
  bundled_blocks_ratio?: string;
  tasks_scheduled: number;
  unscheduled_tasks: number;
  total_block_hours: number;
  average_operational_impact: number;
  passenger_trains_delayed: number;
  freight_trains_delayed: number;
  candidate_blocks: CandidateBlock[];
  trade_off_summary: string;
}

export interface DataQualityIssue {
  record_id: string;
  source_system: string;
  entity_type: string;
  status: string;
  reasons: string[];
  recommended_action: string;
}

export interface DataQualityReport {
  summary: {
    total_records_screened: number;
    valid_records: number;
    anomalies_detected: number;
    issues: DataQualityIssue[];
    source_system_health: Record<string, { total: number; issues: number }>;
  };
  clean_defects_count: number;
  flagged_defects_count: number;
}

export interface LookAheadOpportunity {
  opportunity_id: string;
  corridor_id: string;
  section_name: string;
  departments: string[];
  tasks_count: number;
  bundled_task_ids: string[];
  estimated_shared_window_hours: number;
  blocks_avoided: number;
  recommended_window: string;
  safety_feasibility: string;
  summary: string;
}
