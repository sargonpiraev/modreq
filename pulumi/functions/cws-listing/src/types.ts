export type ListingDailyRow = {
  snapshot_date: string; // YYYY-MM-DD (Europe/Moscow calendar day of scrape)
  item_id: string;
  item_slug: string;
  users: number | null;
  rating: number | null;
  rating_count: number | null;
  version: string | null;
  listing_updated: string | null;
  size_label: string | null;
  offered_by: string | null;
  source: "public_listing";
  scraped_at: string; // ISO
};

export type MetricsDailyRow = {
  snapshot_date: string;
  item_id: string;
  report: string; // installs | uninstalls | impressions | page_views | weekly_users | ...
  dimension: string; // all | country | language | os | version | utm_source | ...
  dimension_value: string;
  metric_name: string;
  metric_value: number;
  source: "dashboard_csv";
  scraped_at: string;
};

export type EtlRunRow = {
  run_id: string;
  started_at: string;
  finished_at: string;
  status: "ok" | "partial" | "error";
  sources: string;
  listing_rows: number;
  metrics_rows: number;
  error_message: string | null;
};

export type DashboardFetchResult = {
  rows: MetricsDailyRow[];
  reports: string[];
  blockedReason?: string;
};
