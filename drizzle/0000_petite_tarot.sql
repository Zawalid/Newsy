CREATE TYPE "public"."scan_job_status" AS ENUM('PREPARING', 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletters" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"favicon_url" text,
	"unsubscribe_url" text,
	"rss_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "newsletters_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE "scan_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"status" "scan_job_status",
	"emails_processed_count" integer DEFAULT 0 NOT NULL,
	"total_emails_to_scan" integer DEFAULT 0 NOT NULL,
	"inbox_total_emails" integer DEFAULT 0 NOT NULL,
	"scan_depth" varchar(50) DEFAULT '''standard''',
	"smart_filtering" boolean DEFAULT true,
	"categories" jsonb DEFAULT '{"primary": true, "promotions": true, "social": false, "updates": false, "forums": false}'::jsonb,
	"newsletters_found_count" integer DEFAULT 0 NOT NULL,
	"current_page_token" text,
	"discovered_newsletters" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"result" jsonb,
	"error" text,
	"started_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"user_id" text,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_provider_account_id_key" ON "accounts" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "newsletters_address_idx" ON "newsletters" USING btree ("address");--> statement-breakpoint
CREATE INDEX "scan_jobs_user_id_idx" ON "scan_jobs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "scan_jobs_status_idx" ON "scan_jobs" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "scan_jobs_active_user_constraint" ON "scan_jobs" USING btree ("user_id") WHERE "scan_jobs"."status" NOT IN ('COMPLETED', 'FAILED', 'CANCELLED');--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_key" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "verifications_identifier_value_key" ON "verifications" USING btree ("identifier","value");