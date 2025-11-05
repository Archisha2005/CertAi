// server/db-storage.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import session from "express-session";
import createMemoryStore from "memorystore";
import {
  users,
  documents,
  applications,
  certificates,
  type InsertUser,
  type InsertDocument,
  type InsertApplication,
  type InsertCertificate,
  type User,
  type Document,
  type Application,
  type Certificate,
} from "../shared/schema";
import type { IStorage } from "./storage";

const MemoryStore = createMemoryStore(session);

// ---------- DATABASE CONNECTION ----------
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_5KVFgruxn9ZX@ep-aged-shadow-ad26mw3h-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",

});
const db = drizzle(pool);

// ---------- STORAGE IMPLEMENTATION ----------
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Cleanup expired sessions every 24h
    });
  }

  // ---------- USER ----------
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // ---------- DOCUMENT ----------
  async getDocument(id: number): Promise<Document | undefined> {
    const result = await db.select().from(documents).where(eq(documents.id, id));
    return result[0];
  }

  async getUserDocuments(userId: number): Promise<Document[]> {
    return db.select().from(documents).where(eq(documents.userId, userId));
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const result = await db.insert(documents).values(insertDocument).returning();
    return result[0];
  }

  async updateDocumentVerification(
    id: number,
    status: string,
    details?: any
  ): Promise<Document | undefined> {
    const result = await db
      .update(documents)
      .set({
        verificationStatus: status.toUpperCase(),
        verificationDetails: details ?? null,
      })
      .where(eq(documents.id, id))
      .returning();
    return result[0];
  }

  // ---------- APPLICATION ----------
  async getApplication(id: number): Promise<Application | undefined> {
    const result = await db.select().from(applications).where(eq(applications.id, id));
    return result[0];
  }

  async getApplicationByApplicationId(applicationId: string): Promise<Application | undefined> {
    const result = await db.select().from(applications).where(eq(applications.applicationId, applicationId));
    return result[0];
  }

  async getUserApplications(userId: number): Promise<Application[]> {
    return db.select().from(applications).where(eq(applications.userId, userId));
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const newApplicationId = insertApplication.applicationId ?? `APP-${nanoid(10).toUpperCase()}`;
    const result = await db
      .insert(applications)
      .values({
        ...insertApplication,
        applicationId: newApplicationId,
        status: "PENDING", // Always uppercase for frontend compatibility
      })
      .returning();
    return result[0];
  }

  async updateApplicationStatus(id: number, status: string): Promise<Application | undefined> {
    const result = await db
      .update(applications)
      .set({ status: status.toUpperCase() })
      .where(eq(applications.id, id))
      .returning();
    return result[0];
  }

  async updateVerificationResult(id: number, verificationResult: any): Promise<Application | undefined> {
    const result = await db
      .update(applications)
      .set({ verificationResult })
      .where(eq(applications.id, id))
      .returning();
    return result[0];
  }

  // ---------- CERTIFICATE ----------
  async getCertificate(id: number): Promise<Certificate | undefined> {
    const result = await db.select().from(certificates).where(eq(certificates.id, id));
    return result[0];
  }

  async getCertificateByCertificateId(certificateId: string): Promise<Certificate | undefined> {
    const result = await db
      .select()
      .from(certificates)
      .where(eq(certificates.certificateId, certificateId));
    return result[0];
  }

  async getUserCertificates(userId: number): Promise<Certificate[]> {
    return db.select().from(certificates).where(eq(certificates.userId, userId));
  }

  async createCertificate(insertCertificate: InsertCertificate): Promise<Certificate> {
    const result = await db.insert(certificates).values(insertCertificate).returning();
    return result[0];
  }
}

// ---------- EXPORT SINGLETON INSTANCE ----------
export const storage = new DatabaseStorage();
