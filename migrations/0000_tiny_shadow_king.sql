CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"certificate_type" text NOT NULL,
	"application_id" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"applied_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"form_data" jsonb NOT NULL,
	"document_ids" integer[] NOT NULL,
	"verification_result" jsonb,
	"certificate_id" text,
	CONSTRAINT "applications_application_id_unique" UNIQUE("application_id")
);
--> statement-breakpoint
CREATE TABLE "certificates" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"application_id" integer NOT NULL,
	"certificate_id" text NOT NULL,
	"certificate_type" text NOT NULL,
	"issued_at" timestamp DEFAULT now() NOT NULL,
	"valid_until" timestamp NOT NULL,
	"certificate_data" jsonb NOT NULL,
	CONSTRAINT "certificates_certificate_id_unique" UNIQUE("certificate_id")
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"document_type" text NOT NULL,
	"file_name" text NOT NULL,
	"file_data" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	"verification_status" text DEFAULT 'PENDING' NOT NULL,
	"verification_details" jsonb
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"mobile" text NOT NULL,
	"aadhaar" text NOT NULL,
	"address" text NOT NULL,
	"profile_pic" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
