import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CertificateTypeCardProps {
  title: string;
  icon: string;
  description: string;
  benefits: string[];
  processingTime: string;
  href: string;
}

export function CertificateTypeCard({
  title,
  icon,
  description,
  benefits,
  processingTime,
  href
}: CertificateTypeCardProps) {
  return (
    <Card className="transition-transform hover:scale-105">
      <CardContent className="pt-6">
        <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
          <i className={`fas fa-${icon} text-primary text-2xl`}></i>
        </div>
        <h3 className="font-medium text-xl mb-2">{title}</h3>
        <p className="text-neutral-600 mb-4">{description}</p>
        <ul className="mb-4 text-sm">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start mb-2">
              <i className="fas fa-check-circle text-success mt-1 mr-2"></i>
              <span>{benefit}</span>
            </li>
          ))}
          <li className="flex items-start">
            <i className="fas fa-info-circle text-info mt-1 mr-2"></i>
            <span>Processing time: {processingTime}</span>
          </li>
        </ul>
        <Button asChild className="w-full">
          <a href={href}>Apply Now</a>
        </Button>
      </CardContent>
    </Card>
  );
}
