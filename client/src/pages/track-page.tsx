import { useState } from "react";
import { useSearch } from "wouter";
import { Helmet } from "react-helmet";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StatusTracker } from "@/components/status-tracker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";

export default function TrackPage() {
  const { user } = useAuth();
  const search = useSearch();
  const idParam = new URLSearchParams(search).get("id");
  
  const [applicationId, setApplicationId] = useState(idParam || "");
  const [mobileNumber, setMobileNumber] = useState("");
  const [application, setApplication] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const trackMutation = useMutation({
    mutationFn: async (data: { applicationId: string; mobileNumber: string }) => {
      const res = await apiRequest("POST", "/api/track-application", data);
      return await res.json();
    },
    onSuccess: (data) => {
      setApplication(data);
      setError(null);
    },
    onError: (err: any) => {
      setApplication(null);
      setError(err.message || "Application not found. Please verify your details.");
    },
  });
  
  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationId || !mobileNumber) {
      setError("Please enter both Application ID and Mobile Number");
      return;
    }
    
    trackMutation.mutate({ applicationId, mobileNumber });
  };
  
  return (
    <>
      <Helmet>
        <title>Track Application - CertAi</title>
        <meta name="description" content="Track the status of your certificate application using your application ID and registered mobile number." />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-12 bg-neutral-100">
          <div className="container mx-auto px-4">
            <h1 className="font-bold text-2xl md:text-3xl text-center mb-10 text-secondary">Track Your Application</h1>
            
            <div className="max-w-3xl mx-auto">
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                      <Label htmlFor="application_id">Application ID</Label>
                      <Input 
                        id="application_id" 
                        placeholder="Enter your application ID" 
                        value={applicationId}
                        onChange={(e) => setApplicationId(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <Label htmlFor="mobile_number">Mobile Number</Label>
                      <Input 
                        id="mobile_number" 
                        placeholder="Enter registered mobile number" 
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                      />
                    </div>
                    
                    <div className="md:self-end">
                      <Button 
                        type="submit" 
                        className="w-full mt-6 md:mt-0"
                        disabled={trackMutation.isPending}
                      >
                        {trackMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Tracking...
                          </>
                        ) : (
                          "Track Status"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {application && (
                <Card className="border border-neutral-200 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-medium text-lg">
                        Application Status: <span className="text-primary">{application.status.charAt(0).toUpperCase() + application.status.slice(1).replace(/_/g, ' ')}</span>
                      </h2>
                      <span className="text-sm text-neutral-500">Application ID: {application.applicationId}</span>
                    </div>
                    
                    <StatusTracker 
                      status={application.status} 
                      appliedDate={new Date(application.appliedAt)}
                      updatedDate={new Date(application.updatedAt)}
                      certificateType={application.certificateType}
                    />
                    
                    <div className="bg-neutral-100 rounded-md p-4 mb-4">
                      <h3 className="font-medium mb-2">Current Status:</h3>
                      <p className="text-neutral-600">
                        {application.status === 'pending' && 'Your application has been received and is awaiting initial processing.'}
                        {application.status === 'document_verification' && 'Your uploaded documents are being verified using our AI system.'}
                        {application.status === 'official_approval' && 'Your application is currently under review by the authorized officer. This process typically takes 2-3 working days.'}
                        {application.status === 'completed' && 'Your certificate has been generated and is ready for download.'}
                        {application.status === 'rejected' && 'Your application has been rejected. Please check your email for details.'}
                      </p>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" className="text-neutral-700">
                        <i className="fas fa-download mr-2"></i>
                        Download Receipt
                      </Button>
                      
                      <Button variant="outline" className="text-primary bg-primary/10 hover:bg-primary/20">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        Report Issue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {!application && !error && (
                <div className="text-center p-8 bg-white rounded-lg shadow border border-neutral-200">
                  <i className="fas fa-search text-4xl text-neutral-400 mb-4"></i>
                  <h2 className="text-xl font-medium text-neutral-700 mb-2">No Application Found</h2>
                  <p className="text-neutral-600">
                    Enter your application ID and registered mobile number to track your certificate application status.
                  </p>
                </div>
              )}
              
              <div className="mt-8 bg-white p-6 rounded-lg shadow border border-neutral-200">
                <h3 className="font-medium text-lg mb-3">Tracking Information</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <i className="fas fa-info-circle text-primary mt-1 mr-3"></i>
                    <span className="text-neutral-700">The application ID is provided to you after submitting your application.</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-info-circle text-primary mt-1 mr-3"></i>
                    <span className="text-neutral-700">Use the same mobile number that you provided during application.</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-info-circle text-primary mt-1 mr-3"></i>
                    <span className="text-neutral-700">For any assistance, call our toll-free helpline at 1800-XXX-XXXX.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
