import { format } from "date-fns";
import { User, Certificate } from "@shared/schema";
import logoImage from "@assets/Gemini_Generated_Image_d86gqtd86gqtd86g_1761457022206.png";

interface CertificatePreviewProps {
  certificate: Certificate;
  user: User | null;
}

export function CertificatePreview({ certificate, user }: CertificatePreviewProps) {
  if (!certificate || !user) return null;
  
  const certificateData = certificate.certificateData as any;
  const personalInfo = certificateData.personalInfo || {};
  const details = certificateData.details || {};
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };
  
  const renderCertificateContent = () => {
    switch (certificate.certificateType) {
      case 'caste':
        return (
          <p className="mb-4 text-justify">
            This is to certify that Shri/Smt./Kumari <span className="font-semibold">{personalInfo.fullName}</span> son/daughter of <span className="font-semibold">{details.fatherName}</span> of village/town <span className="font-semibold">{details.birthPlace}</span> in District/Division <span className="font-semibold">{details.district}</span> of the State/Union Territory <span className="font-semibold">{details.state}</span> belongs to the <span className="font-semibold">{details.subCaste}</span> which is recognized as a {details.casteCategory.toUpperCase()} under the Constitution (Scheduled Castes) Order, 1950.
            <br /><br />
            Shri/Smt./Kumari <span className="font-semibold">{personalInfo.fullName}</span> and/or his/her family ordinarily reside(s) in village/town <span className="font-semibold">{details.birthPlace}</span> of District/Division <span className="font-semibold">{details.district}</span> of the State/Union Territory of <span className="font-semibold">{details.state}</span>.
          </p>
        );
        
      case 'income':
        return (
          <p className="mb-4 text-justify">
            This is to certify that Shri/Smt./Kumari <span className="font-semibold">{personalInfo.fullName}</span> son/daughter/wife of <span className="font-semibold">{details.occupation === 'Business' ? 'Self' : 'Unknown'}</span> resident of <span className="font-semibold">{personalInfo.address}</span> has an annual income of <span className="font-semibold">₹{details.annualIncome}/-</span> (Rupees {numberToWords(details.annualIncome)} Only) from all sources for the financial year <span className="font-semibold">{details.financialYear}</span>.
            <br /><br />
            This certificate is being issued for <span className="font-semibold">official purposes</span> based on the verification of income documents provided by the applicant.
          </p>
        );
        
      case 'residence':
        return (
          <p className="mb-4 text-justify">
            This is to certify that Shri/Smt./Kumari <span className="font-semibold">{personalInfo.fullName}</span> son/daughter/wife of <span className="font-semibold">Unknown</span> is a resident of <span className="font-semibold">{personalInfo.address}</span> in the District of <span className="font-semibold">{details.district}</span>, <span className="font-semibold">{details.state}</span> - <span className="font-semibold">{details.pincode}</span>.
            <br /><br />
            As per records, the applicant has been residing at the above address since <span className="font-semibold">{formatDate(details.residingSince)}</span> in a <span className="font-semibold">{details.propertyType}</span> which is <span className="font-semibold">{details.ownershipStatus}</span>.
            <br /><br />
            This certificate is valid for all official purposes.
          </p>
        );
        
      default:
        return (
          <p className="mb-4 text-justify">
            This is to certify that the information provided in this certificate has been verified and found to be accurate according to government records.
          </p>
        );
    }
  };
  
  // Function to convert numbers to words (for income certificate)
  const numberToWords = (num: string | number) => {
    // Simple implementation for demo purpose
    const number = Number(num);
    if (isNaN(number)) return "Unknown Amount";
    
    if (number < 1000) return "Less than One Thousand";
    if (number < 10000) return "Less than Ten Thousand";
    if (number < 100000) return "Less than One Lakh";
    if (number < 1000000) return "Less than Ten Lakhs";
    return "More than Ten Lakhs";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-neutral-200">
      {/* Certificate Header */}
      <div className="bg-primary text-white p-6 text-center">
        <div className="flex justify-center mb-4">
          <img src={logoImage} alt="CertAi Logo" className="h-20 w-20 rounded-full object-cover bg-white" />
        </div>
        <h3 className="font-bold text-xl md:text-2xl uppercase">Government of India</h3>
        <p className="text-sm md:text-base">Department of Social Welfare</p>
      </div>
      
      {/* Certificate Body */}
      <div className="p-6 md:p-8 border-b border-neutral-200">
        <div className="flex justify-between mb-6">
          <div>
            <p className="text-sm text-neutral-500">Certificate No:</p>
            <p className="font-medium">{certificate.certificateId}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Issue Date:</p>
            <p className="font-medium">{format(new Date(certificate.issuedAt), "MMMM d, yyyy")}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Valid Until:</p>
            <p className="font-medium">{format(new Date(certificate.validUntil), "MMMM d, yyyy")}</p>
          </div>
        </div>
        
        <h3 className="font-bold text-xl text-center uppercase mb-6">
          {certificate.certificateType.charAt(0).toUpperCase() + certificate.certificateType.slice(1)} Certificate
        </h3>
        
        {renderCertificateContent()}
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm text-neutral-500 mb-1">Applicant's Photo:</p>
            <div className="w-32 h-40 bg-neutral-200 border border-neutral-300 flex items-center justify-center">
              <i className="fas fa-user text-neutral-400 text-3xl"></i>
            </div>
          </div>
          
          <div className="text-center">
            <div className="mb-2">
              <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M10,20 Q30,5 50,15 T90,20" stroke="#000" fill="none" strokeWidth="1"/>
                <path d="M20,25 Q40,40 60,30 T100,25" stroke="#000" fill="none" strokeWidth="1"/>
                <text x="40" y="25" fontSize="12" fontFamily="serif">Signature</text>
              </svg>
            </div>
            <p className="font-medium">District Magistrate</p>
            <p className="text-sm text-neutral-500">{details.district || "District"}</p>
          </div>
        </div>
      </div>
      
      {/* Certificate Footer */}
      <div className="p-4 bg-neutral-50 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-neutral-200 w-20 h-20 flex items-center justify-center mr-4">
            <i className="fas fa-qrcode text-neutral-500 text-3xl"></i>
          </div>
          <div>
            <p className="text-sm font-medium">Verify Authenticity</p>
            <p className="text-xs text-neutral-500">Scan QR code or visit portal<br/>with certificate number</p>
          </div>
        </div>
        
        <div className="text-center md:text-right">
          <p className="text-xs text-neutral-500 mb-1">This is a digitally signed certificate.</p>
          <p className="text-xs text-neutral-500">No physical signature is required.</p>
        </div>
      </div>
    </div>
  );
}
