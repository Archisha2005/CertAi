// server/storage.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import connectPgSimple from "connect-pg-simple";
import session from "express-session";

import {
  users,
  documents,
  applications,
  certificates,
  type User,
  type InsertUser,
  type Document,
  type InsertDocument,
  type Application,
  type InsertApplication,
  type Certificate,
  type InsertCertificate,
} from "../shared/schema";

// ------------------ INTERFACE DEFINITIONS ------------------

export interface IStorage {
  // ---------- USER ----------
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;

  // ---------- DOCUMENT ----------
  getDocument(id: number): Promise<Document | undefined>;
  getUserDocuments(userId: number): Promise<Document[]>;
  createDocument(insertDocument: InsertDocument): Promise<Document>;
  updateDocumentVerification(
    id: number,
    status: string,
    details?: any
  ): Promise<Document | undefined>;

  // ---------- APPLICATION ----------
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationByApplicationId(
    applicationId: string
  ): Promise<Application | undefined>;
  getUserApplications(userId: number): Promise<Application[]>;
  createApplication(insertApplication: InsertApplication): Promise<Application>;
  updateApplicationStatus(
    id: number,
    status: string
  ): Promise<Application | undefined>;
  updateVerificationResult(
    id: number,
    verificationResult: any
  ): Promise<Application | undefined>;

  // ---------- CERTIFICATE ----------
  getCertificate(id: number): Promise<Certificate | undefined>;
  getCertificateByCertificateId(
    certificateId: string
  ): Promise<Certificate | undefined>;
  getUserCertificates(userId: number): Promise<Certificate[]>;
  createCertificate(insertCertificate: InsertCertificate): Promise<Certificate>;
}

// ------------------ DATABASE CONNECTION ------------------

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_5KVFgruxn9ZX@ep-aged-shadow-ad26mw3h-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require",
});

const db = drizzle(pool);

// ------------------ SESSION STORE SETUP ------------------

const PgSession = connectPgSimple(session);
const sessionStore = new PgSession({
  pool,
  tableName: "user_sessions",
});

// ------------------ IMPLEMENTATION ------------------

export class DBStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = sessionStore;
  }

  // ---------- USER ----------
  async getUser(id: number) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string) {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

 async createUser(insertUser: InsertUser) {
  const result = await db.insert(users).values(insertUser).returning();
  return result[0];
}

  // ---------- DOCUMENT ----------
  async getDocument(id: number) {
    const result = await db.select().from(documents).where(eq(documents.id, id));
    return result[0];
  }

  async getUserDocuments(userId: number) {
    return db.select().from(documents).where(eq(documents.userId, userId));
  }

  async createDocument(insertDocument: InsertDocument) {
    const result = await db.insert(documents).values(insertDocument).returning();
    return result[0];
  }

  async updateDocumentVerification(id: number, status: string, details?: any) {
    const result = await db
      .update(documents)
      .set({ verificationStatus: status, verificationDetails: details })
      .where(eq(documents.id, id))
      .returning();
    return result[0];
  }

  // ---------- APPLICATION ----------
  async getApplication(id: number) {
    const result = await db.select().from(applications).where(eq(applications.id, id));
    return result[0];
  }

  async getApplicationByApplicationId(applicationId: string) {
    const result = await db
      .select()
      .from(applications)
      .where(eq(applications.applicationId, applicationId));
    return result[0];
  }

  async getUserApplications(userId: number) {
    return db.select().from(applications).where(eq(applications.userId, userId));
  }

  async createApplication(insertApplication: InsertApplication) {
    const result = await db.insert(applications).values(insertApplication).returning();
    return result[0];
  }

  async updateApplicationStatus(id: number, status: string) {
    const result = await db
      .update(applications)
      .set({ status })
      .where(eq(applications.id, id))
      .returning();
    return result[0];
  }

  async updateVerificationResult(id: number, verificationResult: any) {
    const result = await db
      .update(applications)
      .set({ verificationResult })
      .where(eq(applications.id, id))
      .returning();
    return result[0];
  }

  // ---------- CERTIFICATE ----------
  async getCertificate(id: number) {
    const result = await db.select().from(certificates).where(eq(certificates.id, id));
    return result[0];
  }

  async getCertificateByCertificateId(certificateId: string) {
    const result = await db
      .select()
      .from(certificates)
      .where(eq(certificates.certificateId, certificateId));
    return result[0];
  }

  async getUserCertificates(userId: number) {
    return db.select().from(certificates).where(eq(certificates.userId, userId));
  }

  async createCertificate(insertCertificate: InsertCertificate) {
    const result = await db.insert(certificates).values(insertCertificate).returning();
    return result[0];
  }
}

// ------------------ EXPORT INSTANCE ------------------
export const storage = new DBStorage();
