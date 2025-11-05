// server/storage-interface.ts
import type {
  User,
  InsertUser,
  Document,
  InsertDocument,
  Application,
  InsertApplication,
  Certificate,
  InsertCertificate,
} from "../shared/schema";

export interface IStorage {
  // ---------- USER ----------
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;

  // ---------- DOCUMENT ----------
  getDocument(id: number): Promise<Document | undefined>;
  getUserDocuments(userId: number): Promise<Document[]>;
  createDocument(insertDocument: InsertDocument): Promise<Document>;
  updateDocumentVerification(id: number, status: string, details?: any): Promise<Document | undefined>;

  // ---------- APPLICATION ----------
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationByApplicationId(applicationId: string): Promise<Application | undefined>;
  getUserApplications(userId: number): Promise<Application[]>;
  createApplication(insertApplication: InsertApplication): Promise<Application>;
  updateApplicationStatus(id: number, status: string): Promise<Application | undefined>;
  updateVerificationResult(id: number, verificationResult: any): Promise<Application | undefined>;

  // ---------- CERTIFICATE ----------
  getCertificate(id: number): Promise<Certificate | undefined>;
  getCertificateByCertificateId(certificateId: string): Promise<Certificate | undefined>;
  getUserCertificates(userId: number): Promise<Certificate[]>;
  createCertificate(insertCertificate: InsertCertificate): Promise<Certificate>;
}
