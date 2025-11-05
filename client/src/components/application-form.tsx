import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DocumentUpload } from "./document-upload";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel, // <--- NOTE: Ensure this component is used correctly
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
// FIX: Import verificationStatus constant for correct comparison
import { Certificate, Document, User, verificationStatus } from "@shared/schema"; 

/**
 * IMPORTANT:
 * We use uppercase internal values for certificate types to match shared typing
 * and avoid the CASE mismatch that caused compilation errors.
 */
type CertificateType = "CASTE" | "INCOME" | "RESIDENCE";

interface ApplicationFormProps {
  user: User | null;
  currentStep: number;
  certificateType: CertificateType;
  onCertificateTypeChange: (type: CertificateType) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onUploadDocument: (data: any) => void;
  onSubmit: (formData: any, documentIds: number[]) => void;
  documents: Document[];
  isDocumentsLoading: boolean;
  isUploading: boolean;
  isSubmitting: boolean;
}

export function ApplicationForm({
  user,
  currentStep,
  certificateType,
  onCertificateTypeChange,
  onNextStep,
  onPrevStep,
  onUploadDocument,
  onSubmit,
  documents,
  isDocumentsLoading,
  isUploading,
  isSubmitting,
}: ApplicationFormProps) {
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<number[]>(
    []
  );

  // ---------------------------
  // Schemas
  // ---------------------------
  const personalInfoSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    aadhaar: z.string().min(12, "Valid Aadhaar number is required"),
    dob: z.string().min(1, "Date of birth is required"),
    gender: z.string().min(1, "Gender is required"),
    mobile: z.string().min(10, "Valid mobile number is required"),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    address: z.string().min(10, "Complete address is required"),
    certificateType: z.enum(["CASTE", "INCOME", "RESIDENCE"]),
  });

  const casteSchema = z.object({
    casteCategory: z.string().min(1, "Caste category is required"),
    subCaste: z.string().min(1, "Sub-caste is required"),
    fatherName: z.string().min(2, "Father's name is required"),
    motherName: z.string().min(2, "Mother's name is required"),
    birthPlace: z.string().min(2, "Birth place is required"),
    district: z.string().min(2, "District is required"),
    state: z.string().min(2, "State is required"),
    purpose: z.string().min(2, "Purpose is required"),
  });

  const incomeSchema = z.object({
    annualIncome: z.string().min(1, "Annual income is required"),
    occupation: z.string().min(2, "Occupation is required"),
    employerName: z.string().optional(),
    financialYear: z.string().min(4, "Financial year is required"),
    familyMembers: z.string().min(1, "Number of family members is required"),
    incomeSources: z.string().min(2, "Income sources are required"),
  });

  const residenceSchema = z.object({
    residingSince: z.string().min(1, "Residing since date is required"),
    propertyType: z.string().min(1, "Property type is required"),
    ownershipStatus: z.string().min(1, "Ownership status is required"),
    district: z.string().min(2, "District is required"),
    state: z.string().min(2, "State is required"),
    pincode: z.string().min(6, "Valid pincode is required"),
  });

  // Select details schema at runtime based on certificateType
  const getDetailsSchema = (type: CertificateType) => {
    if (type === "CASTE") return casteSchema;
    if (type === "INCOME") return incomeSchema;
    return residenceSchema;
  };

  // ---------------------------
  // Forms
  // ---------------------------
  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      aadhaar: (user as any)?.aadhaar || "",
      dob: "",
      gender: "",
      mobile: (user as any)?.mobile || "",
      email: (user as any)?.email || "",
      address: (user as any)?.address || "",
      certificateType: certificateType,
    },
  });

  // detailsForm uses a runtime-chosen schema => use any for the generic to avoid TS inference issues
  const detailsSchema = useMemo(() => getDetailsSchema(certificateType), [
    certificateType,
  ]);

  const detailsForm = useForm<any>({
    resolver: zodResolver(detailsSchema),
    defaultValues:
      certificateType === "CASTE"
        ? {
            casteCategory: "",
            subCaste: "",
            fatherName: "",
            motherName: "",
            birthPlace: "",
            district: "",
            state: "",
            purpose: "",
          }
        : certificateType === "INCOME"
        ? {
            annualIncome: "",
            occupation: "",
            employerName: "",
            financialYear: new Date().getFullYear().toString(),
            familyMembers: "",
            incomeSources: "",
          }
        : {
            residingSince: "",
            propertyType: "",
            ownershipStatus: "",
            district: "",
            state: "",
            pincode: "",
          },
  });

  // ---------------------------
  // Handlers
  // ---------------------------
  const handlePersonalInfoSubmit = (data: z.infer<typeof personalInfoSchema>) => {
    // data.certificateType is "CASTE" | "INCOME" | "RESIDENCE"
    onCertificateTypeChange(data.certificateType as CertificateType);
    onNextStep();
  };

  const handleDetailSubmit = (data: any) => {
    onNextStep();
  };

  const handleFinalSubmit = () => {
    const personalInfo = personalInfoForm.getValues();
    const details = detailsForm.getValues();

    onSubmit(
      {
        personalInfo,
        details,
        certificateType,
      },
      selectedDocumentIds
    );
  };

  // ---------------------------
  // Required documents list based on certificate type
  // ---------------------------
  const requiredDocuments =
    certificateType === "CASTE"
      ? [
          {
            type: "aadhaar",
            label: "Aadhaar Card",
            description: "Upload front and back of Aadhaar card",
          },
          {
            type: "previous_certificate",
            label: "Previous Caste Certificate",
            description: "Upload if you have any previous certificate",
          },
          {
            type: "parent_certificate",
            label: "Parent's Caste Certificate",
            description: "Father's or mother's caste certificate",
          },
        ]
      : certificateType === "INCOME"
      ? [
          {
            type: "aadhaar",
            label: "Aadhaar Card",
            description: "Upload front and back of Aadhaar card",
          },
          {
            type: "income_proof",
            label: "Income Proof",
            description: "Salary slip, IT returns, or income certificate from employer",
          },
          {
            type: "residence_proof",
            label: "Residence Proof",
            description: "Electricity bill, water bill, or rent agreement",
          },
        ]
      : [
          {
            type: "aadhaar",
            label: "Aadhaar Card",
            description: "Upload front and back of Aadhaar card",
          },
          {
            type: "residence_proof",
            label: "Residence Proof",
            description: "Electricity bill, water bill, or rent agreement",
          },
          {
            type: "photo",
            label: "Recent Photograph",
            description: "Passport size photograph",
          },
        ];

  // friendly label for heading
  const displayCertificateLabel =
    certificateType.charAt(0).toUpperCase() +
    certificateType.slice(1).toLowerCase();

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-xl">
          {displayCertificateLabel} Certificate Application
        </h2>
        <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
          Step {currentStep} of 3
        </span>
      </div>

      <div className="w-full bg-neutral-200 rounded-full h-2 mb-6">
        <div
          className="bg-primary h-2 rounded-full"
          style={{ width: `${(currentStep / 3) * 100}%` }}
        ></div>
      </div>

      {currentStep === 1 && (
        <Form {...personalInfoForm}>
          <form
            onSubmit={personalInfoForm.handleSubmit(handlePersonalInfoSubmit)}
            className="space-y-4"
          >
            <FormField
              control={personalInfoForm.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="As per Aadhaar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={personalInfoForm.control}
                name="aadhaar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aadhaar Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="12 digit Aadhaar number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={personalInfoForm.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={personalInfoForm.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={personalInfoForm.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="10 digit mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={personalInfoForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Your email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={personalInfoForm.control}
                name="certificateType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate Type*</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        // value will be one of "CASTE" | "INCOME" | "RESIDENCE"
                        field.onChange(value);
                        onCertificateTypeChange(value as CertificateType);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select certificate type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CASTE">Caste Certificate</SelectItem>
                        <SelectItem value="INCOME">Income Certificate</SelectItem>
                        <SelectItem value="RESIDENCE">Residence Certificate</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={personalInfoForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permanent Address*</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your permanent address" className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">Continue to Next Step</Button>
            </div>
          </form>
        </Form>
      )}

      {currentStep === 2 && (
        <Form {...detailsForm}>
          <form onSubmit={detailsForm.handleSubmit(handleDetailSubmit)} className="space-y-4">
            {certificateType === "CASTE" && (
              <>
                <FormField
                  control={detailsForm.control}
                  name="casteCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Caste Category*</FormLabel>
                      <div className="space-y-2">
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="sc" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">SC</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="st" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">ST</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="obc" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">OBC</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="general" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">General</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={detailsForm.control}
                  name="subCaste"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub-Caste/Community*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your sub-caste or community" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={detailsForm.control} name="fatherName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Father's Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter father's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={detailsForm.control} name="motherName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mother's Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter mother's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={detailsForm.control} name="birthPlace" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Place*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your place of birth" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={detailsForm.control} name="district" render={({ field }) => (
                    <FormItem>
                      <FormLabel>District*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your district" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={detailsForm.control} name="state" render={({ field }) => (
                    <FormItem>
                      <FormLabel>State*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your state" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={detailsForm.control} name="purpose" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose of Certificate*</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Education, Employment, Welfare Scheme, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}

            {certificateType === "INCOME" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={detailsForm.control} name="annualIncome" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Income (₹)*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your annual income" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={detailsForm.control} name="occupation" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your occupation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={detailsForm.control} name="employerName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employer Name (if applicable)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your employer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={detailsForm.control} name="financialYear" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Financial Year*</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. 2023-24" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={detailsForm.control} name="familyMembers" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Family Members*</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={detailsForm.control} name="incomeSources" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sources of Income*</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List all sources of income (E.g. Salary, Business, Agriculture, etc.)" className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}

            {certificateType === "RESIDENCE" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={detailsForm.control} name="residingSince" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residing Since*</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={detailsForm.control} name="propertyType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="flat">Flat</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={detailsForm.control} name="ownershipStatus" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ownership Status*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ownership status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="owned">Owned</SelectItem>
                          <SelectItem value="rented">Rented</SelectItem>
                          <SelectItem value="leased">Leased</SelectItem>
                          <SelectItem value="family_owned">Family Owned</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={detailsForm.control} name="district" render={({ field }) => (
                    <FormItem>
                      <FormLabel>District*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your district" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={detailsForm.control} name="state" render={({ field }) => (
                    <FormItem>
                      <FormLabel>State*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your state" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={detailsForm.control} name="pincode" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter 6-digit pincode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </>
            )}

            <div className="mb-6">
              <h3 className="font-medium mb-4">Document Upload*</h3>

              {isDocumentsLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {requiredDocuments.map((doc, index) => (
                    <DocumentUpload
                      key={index}
                      documentType={doc.type}
                      title={doc.label}
                      description={doc.description}
                      onUpload={onUploadDocument}
                      isUploading={isUploading}
                    documents={documents
  .filter((d) => d.documentType === doc.type)
  .map((d) => ({
    ...d,
    // FIX: Use uppercase constants for comparison and assignment
    verificationStatus:
      d.verificationStatus === verificationStatus.VERIFIED
        ? verificationStatus.VERIFIED
        : d.verificationStatus === verificationStatus.FAILED
        ? verificationStatus.FAILED
        : verificationStatus.PENDING, // default fallback
  }))
}

                      onSelect={(documentId: number) => {
                        if (selectedDocumentIds.includes(documentId)) {
                          setSelectedDocumentIds(selectedDocumentIds.filter((id) => id !== documentId));
                        } else {
                          setSelectedDocumentIds([...selectedDocumentIds, documentId]);
                        }
                      }}
                      selectedDocumentIds={selectedDocumentIds}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center mb-6">
              <Checkbox id="declaration" className="mr-2" required />
              <label htmlFor="declaration" className="text-sm text-neutral-700">
                I hereby declare that all the information provided by me is true to the best of my knowledge.
              </label>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onPrevStep}>
                Previous Step
              </Button>

              <Button type="submit">Continue to Next Step</Button>
            </div>
          </form>
        </Form>
      )}

      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-lg mb-4">Review Your Application</h3>

            <div className="bg-neutral-100 rounded-lg p-4 mb-4">
              <h4 className="font-medium mb-2">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <div>
                  <span className="text-sm text-neutral-500">Full Name:</span>
                  <p>{personalInfoForm.getValues().fullName}</p>
                </div>
                <div>
                  <span className="text-sm text-neutral-500">Aadhaar Number:</span>
                  <p>{personalInfoForm.getValues().aadhaar}</p>
                </div>
                <div>
                  <span className="text-sm text-neutral-500">Date of Birth:</span>
                  <p>{personalInfoForm.getValues().dob}</p>
                </div>
                <div>
                  <span className="text-sm text-neutral-500">Gender:</span>
                  <p>{personalInfoForm.getValues().gender}</p>
                </div>
                <div>
                  <span className="text-sm text-neutral-500">Mobile Number:</span>
                  <p>{personalInfoForm.getValues().mobile}</p>
                </div>
                <div>
                  <span className="text-sm text-neutral-500">Email:</span>
                  <p>{personalInfoForm.getValues().email || "Not provided"}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-sm text-neutral-500">Address:</span>
                  <p>{personalInfoForm.getValues().address}</p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-100 rounded-lg p-4 mb-4">
              <h4 className="font-medium mb-2">Certificate Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                {certificateType === "CASTE" && (
                  <>
                    <div>
                      <span className="text-sm text-neutral-500">Caste Category:</span>
                      <p>{detailsForm.getValues().casteCategory}</p>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500">Sub-Caste:</span>
                      <p>{detailsForm.getValues().subCaste}</p>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500">Father's Name:</span>
                      <p>{detailsForm.getValues().fatherName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500">Mother's Name:</span>
                      <p>{detailsForm.getValues().motherName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500">Birth Place:</span>
                      <p>{detailsForm.getValues().birthPlace}</p>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500">District:</span>
                      <p>{detailsForm.getValues().district}</p>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500">State:</span>
                      <p>{detailsForm.getValues().state}</p>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500">Purpose:</span>
                      <p>{detailsForm.getValues().purpose}</p>
                    </div>
                  </>
                )}

                {certificateType === "INCOME" && (
                  <>
                    <div>
                      <span className="text-sm text-neutral-500">Annual Income:</span>
                      <p>₹{detailsForm.getValues().annualIncome}</p>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500">Occupation:</span>
                      <p>{detailsForm.getValues().occupation}</p>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500">Employer Name:</span>
                      <p>{detailsForm.getValues().employerName || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500">Financial Year:</span>
                      <p>{detailsForm.getValues().financialYear}</p>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500">Family Members:</span>
                      <p>{detailsForm.getValues().familyMembers}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-sm text-neutral-500">Income Sources:</span>
                      <p>{detailsForm.getValues().incomeSources}</p>
                    </div>
                  </>
                )}

                {certificateType === "RESIDENCE" && (
                  <>
                    <div>
                      <span className="text-sm text-neutral-500">Residing Since:</span>
                      <p>{detailsForm.getValues().residingSince}</p>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500">Property Type:</span>
                      <p>{detailsForm.getValues().propertyType}</p>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500">Ownership Status:</span>
                      <p>{detailsForm.getValues().ownershipStatus}</p>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500">District:</span>
                      <p>{detailsForm.getValues().district}</p>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500">State:</span>
                      <p>{detailsForm.getValues().state}</p>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500">Pincode:</span>
                      <p>{detailsForm.getValues().pincode}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-neutral-100 rounded-lg p-4 mb-4">
              <h4 className="font-medium mb-2">Uploaded Documents</h4>
              {selectedDocumentIds.length > 0 ? (
                <ul className="list-disc pl-5">
                  {selectedDocumentIds.map((id) => {
                    const doc = documents.find((d) => d.id === id);
                    return doc ? (
                      <li key={id} className="mb-1">
                        {doc.documentType
                          .split("_")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}{" "}
                        - {doc.fileName}
                      </li>
                    ) : null;
                  })}
                </ul>
              ) : (
                <p className="text-neutral-500">No documents selected. Please go back and select documents.</p>
              )}
            </div>

            <div className="flex items-center mb-6">
              <Checkbox id="final_declaration" className="mr-2" required />
              <label htmlFor="final_declaration" className="text-sm text-neutral-700">
                I hereby confirm that all the information provided is correct. I understand that providing false information may lead to rejection of my application and legal consequences.
              </label>
            </div>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrevStep}>
              Previous Step
            </Button>

            <Button type="button" onClick={handleFinalSubmit} disabled={isSubmitting || selectedDocumentIds.length === 0}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}