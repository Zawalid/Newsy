ALTER TABLE "scan_jobs" ADD COLUMN "scan_depth" varchar(50) DEFAULT '''standard''';--> statement-breakpoint
ALTER TABLE "scan_jobs" ADD COLUMN "smart_filtering" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "scan_jobs" ADD COLUMN "categories" jsonb DEFAULT '{"primary": true, "promotions": true, "social": false, "updates": false, "forums": false}'::jsonb;