import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload } from "lucide-react";

interface DocumentType {
  id: number;
  fileName: string;
  uploadedAt: string | Date;
  // FIX: Changed to uppercase status literals to match the expected type
  verificationStatus: "VERIFIED" | "FAILED" | "PENDING";
}

interface DocumentUploadProps {
  documentType: string;
  title: string;
  description: string;
  onUpload: (data: {
    documentType: string;
    fileName: string;
    fileData: string;
  }) => void;
  isUploading: boolean;
  documents: DocumentType[];
  onSelect: (documentId: number) => void;
  selectedDocumentIds: number[];
}

export function DocumentUpload({
  documentType,
  title,
  description,
  onUpload,
  isUploading,
  documents,
  onSelect,
  selectedDocumentIds,
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const fileData = base64String.split(",")[1];

        onUpload({
          documentType,
          fileName: file.name,
          fileData,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      // FIX: Changed cases to uppercase
      case "VERIFIED":
        return "default";
      case "FAILED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="border-2 border-dashed border-neutral-300 rounded-md p-4 text-center">
      <div className="mb-2">
        <i
          className={`fas fa-${
            documentType === "aadhaar" ? "id-card" : "file-alt"
          } text-neutral-400 text-3xl`}
        ></i>
      </div>

      <h4 className="font-medium mb-1">{title}</h4>
      <p className="text-neutral-500 text-sm mb-3">{description}</p>

      {documents.length > 0 ? (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`flex items-center justify-between p-2 rounded border cursor-pointer ${
                selectedDocumentIds.includes(doc.id)
                  ? "border-primary bg-primary/10"
                  : "border-neutral-200"
              }`}
              onClick={() => onSelect(doc.id)}
            >
              <div className="flex items-center">
                <i className="fas fa-file-alt text-neutral-500 mr-2"></i>
                <div className="text-left">
                  <div className="text-sm font-medium truncate max-w-[150px]">
                    {doc.fileName}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <Badge variant={getBadgeVariant(doc.verificationStatus)}>
                {doc.verificationStatus.charAt(0).toUpperCase() +
                  doc.verificationStatus.slice(1).toLowerCase()}
              </Badge>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={handleClick}
            disabled={isUploading || uploading}
          >
            {isUploading || uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Another
              </>
            )}
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="bg-primary/10 text-primary hover:bg-primary/20"
          onClick={handleClick}
          disabled={isUploading || uploading}
        >
          {isUploading || uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload File"
          )}
        </Button>
      )}

      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.pdf"
      />

      {documents.length > 0 && (
        <div className="mt-2 text-xs text-neutral-500">
          Click on a document to select it for your application
        </div>
      )}
    </div>
  );
}