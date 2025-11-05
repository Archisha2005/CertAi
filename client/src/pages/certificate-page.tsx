import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CertificatePreview } from "@/components/certificate-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function CertificatePage() {
  const { user } = useAuth();
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);

  // Fetch certificates for the logged-in user
  const { data: certificates, isLoading } = useQuery({
    queryKey: ["/api/certificates"],
    enabled: !!user,
  });

  // Safe fallback: ensure certificates is always an array
  const certificateList = Array.isArray(certificates) ? certificates : [];

  // Fetch certificate details when a certificate is selected
  const { data: certificateDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ["/api/certificates", selectedCertificate?.certificateId],
    enabled: !!selectedCertificate,
  });

  // Group certificates by type
  const certificatesByType: Record<string, any[]> = {};
  certificateList.forEach((cert: any) => {
    if (!certificatesByType[cert.certificateType]) {
      certificatesByType[cert.certificateType] = [];
    }
    certificatesByType[cert.certificateType].push(cert);
  });

  return (
    <>
      <Helmet>
        <title>My Certificates - CertAi</title>
        <meta
          name="description"
          content="View, download, and manage your issued government certificates including caste, income, and residence certificates."
        />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow py-12 bg-neutral-100">
          <div className="container mx-auto px-4">
            <h1 className="font-bold text-2xl md:text-3xl text-center mb-10 text-secondary">
              My Certificates
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Issued Certificates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : certificateList.length > 0 ? (
                      <Tabs defaultValue="all">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="caste">Caste</TabsTrigger>
                          <TabsTrigger value="income">Income</TabsTrigger>
                          <TabsTrigger value="residence">Residence</TabsTrigger>
                        </TabsList>

                        {/* All Certificates */}
                        <TabsContent value="all" className="mt-4">
                          <div className="space-y-3">
                            {certificateList.map((cert: any, index: number) => (
                              <button
                                key={index}
                                className={`w-full text-left p-3 rounded-md border ${
                                  selectedCertificate?.id === cert.id
                                    ? "border-primary bg-primary/10"
                                    : "border-neutral-200 hover:bg-neutral-100"
                                }`}
                                onClick={() => setSelectedCertificate(cert)}
                              >
                                <div className="font-medium">
                                  {cert.certificateType.charAt(0).toUpperCase() +
                                    cert.certificateType.slice(1)}{" "}
                                  Certificate
                                </div>
                                <div className="text-sm text-neutral-500">
                                  ID: {cert.certificateId}
                                </div>
                                <div className="text-sm text-neutral-500">
                                  Issued:{" "}
                                  {new Date(cert.issuedAt).toLocaleDateString()}
                                </div>
                              </button>
                            ))}
                          </div>
                        </TabsContent>

                        {/* Certificates by Type */}
                        {Object.keys(certificatesByType).map((type) => (
                          <TabsContent key={type} value={type} className="mt-4">
                            <div className="space-y-3">
                              {certificatesByType[type].map(
                                (cert: any, index: number) => (
                                  <button
                                    key={index}
                                    className={`w-full text-left p-3 rounded-md border ${
                                      selectedCertificate?.id === cert.id
                                        ? "border-primary bg-primary/10"
                                        : "border-neutral-200 hover:bg-neutral-100"
                                    }`}
                                    onClick={() => setSelectedCertificate(cert)}
                                  >
                                    <div className="font-medium">
                                      {cert.certificateType
                                        .charAt(0)
                                        .toUpperCase() +
                                        cert.certificateType.slice(1)}{" "}
                                      Certificate
                                    </div>
                                    <div className="text-sm text-neutral-500">
                                      ID: {cert.certificateId}
                                    </div>
                                    <div className="text-sm text-neutral-500">
                                      Issued:{" "}
                                      {new Date(
                                        cert.issuedAt
                                      ).toLocaleDateString()}
                                    </div>
                                  </button>
                                )
                              )}
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    ) : (
                      <div className="text-center py-12">
                        <i className="fas fa-file-alt text-3xl text-neutral-400 mb-3"></i>
                        <h3 className="text-lg font-medium text-neutral-700 mb-2">
                          No Certificates Found
                        </h3>
                        <p className="text-neutral-600 mb-4">
                          You don't have any issued certificates yet.
                        </p>
                        <Button asChild>
                          <a href="/apply">Apply for Certificate</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {selectedCertificate && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Certificate Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full">
                        <i className="fas fa-download mr-2"></i> Download
                        Certificate
                      </Button>
                      <Button variant="outline" className="w-full">
                        <i className="fas fa-print mr-2"></i> Print Certificate
                      </Button>
                      <Button variant="outline" className="w-full">
                        <i className="fas fa-envelope mr-2"></i> Email
                        Certificate
                      </Button>
                      <Button variant="outline" className="w-full">
                        <i className="fas fa-qrcode mr-2"></i> View QR Code
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Certificate Preview Section */}
              <div className="lg:col-span-2">
                {selectedCertificate ? (
                  detailsLoading ? (
                    <div className="flex items-center justify-center h-96">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <CertificatePreview
                      certificate={certificateDetails || selectedCertificate}
                      user={user}
                    />
                  )
                ) : (
                  <div className="bg-white rounded-lg shadow-md h-full flex items-center justify-center p-8">
                    <div className="text-center">
                      <i className="fas fa-file-certificate text-5xl text-neutral-300 mb-4"></i>
                      <h2 className="text-xl font-medium text-neutral-700 mb-2">
                        Select a Certificate
                      </h2>
                      <p className="text-neutral-600 max-w-md">
                        Please select a certificate from the list to view its
                        details. You can download, print, or share your
                        certificate.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
