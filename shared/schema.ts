import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * All certificate types and statuses are uppercase
 * to match frontend usage and shared typings.
 */

// -------------------- USERS TABLE --------------------
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  mobile: text("mobile").notNull(),
  aadhaar: text("aadhaar").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// -------------------- CONSTANTS --------------------
export const applicationStatus = {
  PENDING: "PENDING",
  DOCUMENT_VERIFICATION: "DOCUMENT_VERIFICATION",
  OFFICIAL_APPROVAL: "OFFICIAL_APPROVAL",
  COMPLETED: "COMPLETED",
  REJECTED: "REJECTED",
} as const;

export const verificationStatus = {
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  FAILED: "FAILED",
} as const;

export const certificateType = {
  CASTE: "CASTE",
  INCOME: "INCOME",
  RESIDENCE: "RESIDENCE",
} as const;

// -------------------- DOCUMENTS TABLE --------------------
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  documentType: text("document_type").notNull(),
  fileName: text("file_name").notNull(),
  fileData: text("file_data").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  verificationStatus: text("verification_status").notNull().default("PENDING"),
  verificationDetails: jsonb("verification_details"),
});

// -------------------- APPLICATIONS TABLE --------------------
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  certificateType: text("certificate_type").notNull(),
  applicationId: text("application_id").notNull().unique(),
  status: text("status").notNull().default(applicationStatus.PENDING),
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  formData: jsonb("form_data").notNull(),
  documentIds: integer("document_ids").array().notNull(),
  verificationResult: jsonb("verification_result"),
  certificateId: text("certificate_id"),
});

// -------------------- CERTIFICATES TABLE --------------------
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  applicationId: integer("application_id").notNull(),
  certificateId: text("certificate_id").notNull().unique(),
  certificateType: text("certificate_type").notNull(),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  validUntil: timestamp("valid_until").notNull(),
  certificateData: jsonb("certificate_data").notNull(),
});

// -------------------- ZOD SCHEMAS --------------------
// The explicit "as const" cast fixes Drizzle-Zod inference issues
export const insertUserSchema = createInsertSchema(users).pick({
  username: true as const,
  password: true as const,
  fullName: true as const,
  email: true as const,
  mobile: true as const,
  aadhaar: true as const,
  address: true as const,
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  userId: true as const,
  documentType: true as const,
  fileName: true as const,
  fileData: true as const,
});

export const insertApplicationSchema = createInsertSchema(applications).pick({
  userId: true as const,
  certificateType: true as const,
  applicationId: true as const,
  formData: true as const,
  documentIds: true as const,
});

export const insertCertificateSchema = createInsertSchema(certificates).pick({
  userId: true as const,
  applicationId: true as const,
  certificateId: true as const,
  certificateType: true as const,
  validUntil: true as const,
  certificateData: true as const,
});

// -------------------- TYPES --------------------
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Certificate = typeof certificates.$inferSelect;

export type ApplicationStatus = typeof applicationStatus[keyof typeof applicationStatus];
export type VerificationStatus = typeof verificationStatus[keyof typeof verificationStatus];
export type CertificateType = typeof certificateType[keyof typeof certificateType];
