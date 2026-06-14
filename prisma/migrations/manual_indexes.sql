CREATE INDEX IF NOT EXISTS idx_etf_holdingsnapshot_etf_date_desc
  ON "EtfHoldingSnapshot" ("etfId", "asOfDate" DESC);

CREATE INDEX IF NOT EXISTS idx_etfholdingitem_snapshot_weight_desc
  ON "EtfHoldingItem" ("snapshotId", "weightPct" DESC);
