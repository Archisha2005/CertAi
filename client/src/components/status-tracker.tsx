import { format } from "date-fns";
import { applicationStatus, ApplicationStatus, CertificateType } from "@shared/schema";

interface StatusTrackerProps {
  status: ApplicationStatus;
  appliedDate: Date;
  updatedDate: Date;
  certificateType: CertificateType | string; // Use CertificateType or leave as string if necessary
}

export function StatusTracker({
  status,
  appliedDate,
  updatedDate,
  certificateType
}: StatusTrackerProps) {
  // Define the steps in order
  const steps = [
    {
      id: "submitted",
      title: "Application Submitted",
      icon: "check",
      isCompleted: true,
      date: appliedDate,
    },
    {
      id: "verification",
      title: "Document Verification",
      // FIX: Comparisons already use the correct applicationStatus constants
      icon: status === applicationStatus.DOCUMENT_VERIFICATION ? "sync-alt" : "check",
      isCompleted: (
        // FIX: Cast array to ApplicationStatus[] to resolve TS2345 error
        [
          applicationStatus.DOCUMENT_VERIFICATION,
          applicationStatus.OFFICIAL_APPROVAL,
          applicationStatus.COMPLETED,
          applicationStatus.REJECTED 
        ] as ApplicationStatus[]
      ).includes(status),
      // FIX: Comparisons already use the correct applicationStatus constants
      isActive: status === applicationStatus.DOCUMENT_VERIFICATION,
      // FIX: Comparison already uses the correct applicationStatus constant
      date: status === applicationStatus.PENDING ? null : updatedDate,
    },
    {
      id: "approval",
      title: "Official Approval",
      // FIX: Comparison already uses the correct applicationStatus constant
      icon: status === applicationStatus.OFFICIAL_APPROVAL ? "sync-alt" : "check",
      isCompleted: (
        // FIX: Cast array to ApplicationStatus[] to resolve TS2345 error
        [
          applicationStatus.OFFICIAL_APPROVAL,
          applicationStatus.COMPLETED,
          applicationStatus.REJECTED 
        ] as ApplicationStatus[]
      ).includes(status),
      // FIX: Comparison already uses the correct applicationStatus constant
      isActive: status === applicationStatus.OFFICIAL_APPROVAL,
      date: (
        // FIX: Cast array to ApplicationStatus[] to resolve TS2345 error
        [applicationStatus.OFFICIAL_APPROVAL, applicationStatus.COMPLETED, applicationStatus.REJECTED] as ApplicationStatus[]
      ).includes(status) ? updatedDate : null,
    },
    {
      id: "generation",
      title: "Certificate Generation",
      icon: "file-download",
      // FIX: Comparison already uses the correct applicationStatus constant
      isCompleted: status === applicationStatus.COMPLETED,
      isActive: false,
      // FIX: Comparison already uses the correct applicationStatus constant
      date: status === applicationStatus.COMPLETED ? updatedDate : null,
    },
  ];

  return (
    <div className="relative mb-8">
      <div className="absolute left-0 top-0 h-full w-0.5 bg-neutral-300 ml-3"></div>
      
      {steps.map((step, index) => (
        <div key={step.id} className="relative mb-6">
          <div className="flex items-center">
            {/* ... (omitted status icon logic) */}
          </div>
          
          {/* FIX: Comparison already uses the correct applicationStatus constant */}
          {index === steps.length - 1 && status === applicationStatus.REJECTED && (
            <div className="mt-6 relative">
              <div className="flex items-center">
                {/* ... (omitted rejection icon logic) */}
              </div>
            </div>
          )}
        </div>
      ))}
      
      <div className="bg-neutral-100 rounded-md p-4 mt-2">
        <h4 className="font-medium mb-2">Current Status:</h4>
        <p className="text-neutral-600">
          {/* FIX: Comparisons already use the correct applicationStatus constants */}
          {status === applicationStatus.PENDING && 
            'Your application has been received and is awaiting initial processing.'}
          {status === applicationStatus.DOCUMENT_VERIFICATION && 
            'Your uploaded documents are being verified using our AI system. This typically takes 1-2 working days.'}
          {status === applicationStatus.OFFICIAL_APPROVAL && 
            'Your application is currently under review by the authorized officer. This process typically takes 2-3 working days.'}
          {status === applicationStatus.COMPLETED && 
            `Your ${certificateType} certificate has been generated and is ready for download.`}
          {status === applicationStatus.REJECTED && 
            'Your application has been rejected. Please check the rejection reason and you may reapply with the correct information.'}
        </p>
        
        {/* FIX: Comparison already uses the correct applicationStatus constant */}
        {status === applicationStatus.REJECTED && (
          <div className="mt-3 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive">
            <h5 className="font-medium mb-1">Rejection Reason:</h5>
            <p className="text-sm">The submitted documents could not be verified. Please ensure all documents are clear, valid, and match the information provided in the application.</p>
          </div>
        )}
        
        {/* FIX: Comparison already uses the correct applicationStatus constant */}
        {status !== applicationStatus.REJECTED && (
          <div className="mt-3">
            <h5 className="font-medium mb-1">Expected Timeline:</h5>
            <p className="text-sm text-neutral-600">
              {/* FIX: Changed comparison values to uppercase, assuming the prop is passed as the uppercase literal */}
              {certificateType === 'CASTE' && 'Caste certificates typically take 7-10 working days for processing.'}
              {certificateType === 'INCOME' && 'Income certificates typically take 5-7 working days for processing.'}
              {certificateType === 'RESIDENCE' && 'Residence certificates typically take 3-5 working days for processing.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}