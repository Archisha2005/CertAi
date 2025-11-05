import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCardProps {
  name: string;
  location: string;
  rating: number;
  comment: string;
}

export function TestimonialCard({ name, location, rating, comment }: TestimonialCardProps) {
  // Render stars based on rating (supports half stars)
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    // Half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    // Empty stars to make 5 total
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <div className="text-accent">
            {renderStars()}
          </div>
        </div>
        <p className="text-neutral-700 mb-4">{comment}</p>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-neutral-200 rounded-full mr-3 flex items-center justify-center">
            <i className="fas fa-user text-neutral-400"></i>
          </div>
          <div>
            <h4 className="font-medium">{name}</h4>
            <p className="text-sm text-neutral-500">{location}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
