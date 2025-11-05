export type VerificationStatus = "PENDING" | "VERIFIED" | "FAILED";
export const verificationStatus = {
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  FAILED: "FAILED",
} as const;

export type ApplicationStatus =
  | "PENDING"
  | "DOCUMENT_VERIFICATION"
  | "OFFICIAL_APPROVAL"
  | "COMPLETED"
  | "REJECTED";

export const applicationStatus = {
  PENDING: "PENDING",
  DOCUMENT_VERIFICATION: "DOCUMENT_VERIFICATION",
  OFFICIAL_APPROVAL: "OFFICIAL_APPROVAL",
  COMPLETED: "COMPLETED",
  REJECTED: "REJECTED",
} as const;
