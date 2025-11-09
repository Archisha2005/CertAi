import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./db-storage.js";
import { setupAuth } from "./auth.js";
import { nanoid } from "nanoid";
import { applicationStatus, certificateType } from "../shared/schema";
import { insertDocumentSchema, insertApplicationSchema } from "../shared/schema";
import { addYears } from "date-fns";

export default async function registerRoutes(app: Express): Promise<Server> {
  // Setup passport/session routes
  setupAuth(app);

  // Document upload
  app.post("/api/documents", async (req, res, next) => {
    try {
      if (!req.isAuthenticated?.() || !req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const documentData = insertDocumentSchema.parse({
        ...req.body,
        userId: (req.user as any).id,
      });

      const document = await storage.createDocument(documentData);

      // Auto-verify
      await storage.updateDocumentVerification(document.id, "verified", {
        message: "Document uploaded and auto-verified",
      });

      res.status(201).json({
        id: document.id,
        documentType: document.documentType,
        fileName: document.fileName,
        uploadedAt: document.uploadedAt,
        verificationStatus: document.verificationStatus,
      });
    } catch (err) {
      next(err);
    }
  });

  // Get user documents
  app.get("/api/documents", async (req, res, next) => {
    try {
      if (!req.isAuthenticated?.() || !req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const documents = await storage.getUserDocuments((req.user as any).id);
      const documentsWithoutFileData = documents.map((doc: any) => {
        const { fileData, ...rest } = doc;
        return rest;
      });
      res.json(documentsWithoutFileData);
    } catch (err) {
      next(err);
    }
  });

  // Apply for certificate
  app.post("/api/applications", async (req, res, next) => {
    try {
      if (!req.isAuthenticated?.() || !req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const applicationId = `CERT-${Date.now().toString().slice(-6)}-${nanoid(6).toUpperCase()}`;

      const applicationData = insertApplicationSchema.parse({
        ...req.body,
        userId: (req.user as any).id,
        applicationId,
      });

      const application = await storage.createApplication(applicationData);
      res.status(201).json(application);

      // Auto verification
      if (application.documentIds && application.documentIds.length > 0) {
        await storage.updateApplicationStatus(application.id, applicationStatus.DOCUMENT_VERIFICATION);

        const verificationResults: any[] = [];
        for (const docId of application.documentIds) {
          const document = await storage.getDocument(docId);
          if (document) {
            await storage.updateDocumentVerification(document.id, "verified", {
              message: "Auto-verified successfully",
            });
            verificationResults.push({
              documentId: docId,
              documentType: document.documentType,
              verified: true,
            });
          }
        }

        await storage.updateVerificationResult(application.id, {
          documents: verificationResults,
        });

        await storage.updateApplicationStatus(application.id, applicationStatus.OFFICIAL_APPROVAL);
      }
    } catch (err) {
      next(err);
    }
  });

  // Get user applications
  app.get("/api/applications", async (req, res, next) => {
    try {
      if (!req.isAuthenticated?.() || !req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const applications = await storage.getUserApplications((req.user as any).id);
      res.json(applications);
    } catch (err) {
      next(err);
    }
  });

  // Get application by ID
  app.get("/api/applications/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated?.() || !req.user) return res.status(401).json({ message: "Not authenticated" });

      const application = await storage.getApplicationByApplicationId(req.params.id);
      if (!application) return res.status(404).json({ message: "Application not found" });

      if (application.userId !== (req.user as any).id) return res.status(403).json({ message: "Unauthorized access" });

      res.json(application);
    } catch (err) {
      next(err);
    }
  });

  // Track application (unauthenticated)
  app.post("/api/track-application", async (req, res, next) => {
    try {
      const { applicationId, mobileNumber } = req.body;
      if (!applicationId || !mobileNumber) return res.status(400).json({ message: "Application ID and mobile number required" });

      const application = await storage.getApplicationByApplicationId(applicationId);
      if (!application) return res.status(404).json({ message: "Application not found" });

      const user = await storage.getUser(application.userId);
      if (!user || user.mobile !== mobileNumber) return res.status(403).json({ message: "Invalid mobile number" });

      res.json({
        applicationId: application.applicationId,
        status: application.status,
        appliedAt: application.appliedAt,
        updatedAt: application.updatedAt,
        certificateType: application.certificateType,
      });
    } catch (err) {
      next(err);
    }
  });

  // Get user certificates
  app.get("/api/certificates", async (req, res, next) => {
    try {
      if (!req.isAuthenticated?.() || !req.user) return res.status(401).json({ message: "Not authenticated" });

      const certificates = await storage.getUserCertificates((req.user as any).id);
      res.json(certificates);
    } catch (err) {
      next(err);
    }
  });

  // Get certificate by ID
  app.get("/api/certificates/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated?.() || !req.user) return res.status(401).json({ message: "Not authenticated" });

      const certificate = await storage.getCertificateByCertificateId(req.params.id);
      if (!certificate) return res.status(404).json({ message: "Certificate not found" });

      if (certificate.userId !== (req.user as any).id) return res.status(403).json({ message: "Unauthorized access" });

      res.json(certificate);
    } catch (err) {
      next(err);
    }
  });

  // Admin approval — generate certificate
  app.post("/api/admin/approve-application", async (req, res, next) => {
    try {
      const { applicationId } = req.body;
      if (!applicationId) return res.status(400).json({ message: "Application ID required" });

      const application = await storage.getApplicationByApplicationId(applicationId);
      if (!application) return res.status(404).json({ message: "Application not found" });

      await storage.updateApplicationStatus(application.id, applicationStatus.COMPLETED);

      const certificateId = `${application.certificateType.toUpperCase()}/${new Date().getFullYear()}/${nanoid(10).toUpperCase()}`;

      let validUntil: Date;
      switch (application.certificateType) {
        case certificateType.CASTE:
          validUntil = addYears(new Date(), 5);
          break;
        case certificateType.INCOME:
          validUntil = addYears(new Date(), 1);
          break;
        case certificateType.RESIDENCE:
          validUntil = addYears(new Date(), 3);
          break;
        default:
          validUntil = addYears(new Date(), 2);
      }

      const certificate = await storage.createCertificate({
        userId: application.userId,
        applicationId: application.id,
        certificateId,
        certificateType: application.certificateType,
        validUntil,
        certificateData: {
          ...(application.formData || {}),
          verificationResult: application.verificationResult,
        },
      });

      await storage.updateVerificationResult(application.id, {
        ...(application.verificationResult || {}),
        certificateId: certificate.certificateId,
      });

      res.status(201).json(certificate);
    } catch (err) {
      next(err);
    }
  });

  // Public certificate verification
  app.get("/api/verify-certificate/:id", async (req, res, next) => {
    try {
      const certificate = await storage.getCertificateByCertificateId(req.params.id);
      if (!certificate) return res.status(404).json({ message: "Certificate not found" });

      const isExpired = new Date() > new Date((certificate as any).validUntil);
      res.json({
        isValid: !isExpired,
        certificateId: certificate.certificateId,
        certificateType: certificate.certificateType,
        issuedAt: certificate.issuedAt,
        validUntil: (certificate as any).validUntil,
        isExpired,
      });
    } catch (err) {
      next(err);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
