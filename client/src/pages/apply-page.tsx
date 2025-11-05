import { useState } from "react";
import { useSearch } from "wouter";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ApplicationForm } from "@/components/application-form";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { certificateType } from "@shared/schema";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ApplyPage() {
  const { user } = useAuth();
  const search = useSearch();
  const typeParam = new URLSearchParams(search).get("type");
  const initialType = Object.values(certificateType).includes(typeParam as any)
    ? (typeParam as keyof typeof certificateType)
    : "caste";

  const [formStep, setFormStep] = useState(1);
  const [selectedType, setSelectedType] = useState<keyof typeof certificateType>(
    initialType as any
  );
  const [applicationId, setApplicationId] = useState<string | null>(null);

  // ✅ Define the document type
  type DocumentType = {
    id: number;
    userId: number;
    documentType: string;
    fileName: string;
    fileData: string;
    uploadedAt: Date;
    verificationStatus: "verified" | "failed" | "pending";
    verificationDetails: unknown;
  };

  // ✅ Fetch user documents safely
  const {
    data: documents = [],
    isLoading: documentsLoading,
  } = useQuery<DocumentType[]>({
    queryKey: ["/api/documents"],
    enabled: !!user,
  });

  // ✅ Application mutation
  const applicationMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/applications", data);
      return await res.json();
    },
    onSuccess: (data) => {
      setApplicationId(data.applicationId);
      setFormStep(3); // Success step
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
    },
  });

  // ✅ Document upload mutation
  const documentMutation = useMutation({
    mutationFn: async (formData: any) => {
      const res = await apiRequest("POST", "/api/documents", formData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
    },
  });

  const handleCertificateTypeChange = (type: keyof typeof certificateType) => {
    setSelectedType(type);
  };

  const handleNextStep = () => setFormStep((prev) => prev + 1);
  const handlePrevStep = () => setFormStep((prev) => prev - 1);

  const handleSubmitApplication = (formData: any, documentIds: number[]) => {
    applicationMutation.mutate({
      certificateType: selectedType,
      formData,
      documentIds,
    });
  };

  return (
    <>
      <Helmet>
        <title>Apply for Certificate - CertAi</title>
        <meta
          name="description"
          content="Apply online for caste, income, or residence certificates. Fill out the form, upload required documents, and track your application status."
        />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow py-12 bg-neutral-100">
          <div className="container mx-auto px-4">
            <h1 className="font-bold text-2xl md:text-3xl text-center mb-10 text-secondary">
              Apply for Certificate
            </h1>

            <div className="bg-white rounded-lg shadow-md max-w-4xl mx-auto p-6 md:p-8">
              {applicationMutation.isError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Failed to submit application. Please try again later.
                  </AlertDescription>
                </Alert>
              )}

              {formStep === 3 ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>

                  <h2 className="text-2xl font-bold text-secondary mb-2">
                    Application Submitted Successfully!
                  </h2>
                  <p className="text-neutral-600 mb-4">
                    Your application has been received and is now being
                    processed.
                  </p>

                  <div className="bg-neutral-100 rounded-md p-4 mb-6 text-left">
                    <h3 className="font-medium mb-2">Application Details:</h3>
                    <p className="mb-1">
                      <strong>Application ID:</strong> {applicationId}
                    </p>
                    <p className="mb-1">
                      <strong>Certificate Type:</strong>{" "}
                      {selectedType.charAt(0).toUpperCase() +
                        selectedType.slice(1)}{" "}
                      Certificate
                    </p>
                    <p className="mb-1">
                      <strong>Submitted on:</strong>{" "}
                      {new Date().toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Estimated processing time:</strong>{" "}
                      {selectedType === "CASTE"
                        ? "7-10 days"
                        : selectedType === "INCOME"
                        ? "5-7 days"
                        : "3-5 days"}
                    </p>
                  </div>

                  <p className="text-sm text-neutral-500 mb-6">
                    You can track your application status using your Application
                    ID and registered mobile number.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <a
                      href={`/track?id=${applicationId}`}
                      className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary-dark transition"
                    >
                      Track Your Application
                    </a>
                    <a
                      href="/"
                      className="bg-neutral-200 text-neutral-700 px-6 py-3 rounded-md font-medium hover:bg-neutral-300 transition"
                    >
                      Return to Home
                    </a>
                  </div>
                </div>
              ) : (
                <ApplicationForm
                  user={user}
                  currentStep={formStep}
                  certificateType={selectedType}
                  onCertificateTypeChange={handleCertificateTypeChange}
                  onNextStep={handleNextStep}
                  onPrevStep={handlePrevStep}
                  onUploadDocument={(data) => documentMutation.mutate(data)}
                  onSubmit={handleSubmitApplication}
                  documents={documents || []} // ✅ now typed safely
                  isDocumentsLoading={documentsLoading}
                  isUploading={documentMutation.isPending}
                  isSubmitting={applicationMutation.isPending}
                />
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
