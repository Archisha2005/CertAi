import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border border-neutral-200 hover:shadow-md transition">
      <CardContent className="pt-6">
        <div className="flex items-start mb-4">
          <div className="bg-primary/10 rounded-lg p-3 mr-4">
            <i className={`fas fa-${icon} text-primary text-xl`}></i>
          </div>
          <h3 className="font-medium text-lg pt-1">{title}</h3>
        </div>
        <p className="text-neutral-600">{description}</p>
      </CardContent>
    </Card>
  );
}
