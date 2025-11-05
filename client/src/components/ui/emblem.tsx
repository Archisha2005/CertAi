import { cn } from "@/lib/utils";

interface EmblemProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Emblem({ className, size = "md" }: EmblemProps) {
  const sizeClasses = {
    sm: "h-8 w-auto",
    md: "h-12 w-auto",
    lg: "h-16 w-auto"
  };

  return (
    <svg 
      className={cn(sizeClasses[size], className)}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Simplified Ashoka Lion Capital SVG */}
      <circle cx="50" cy="50" r="48" fill="#f1f1f1" stroke="#0A5688" strokeWidth="2"/>
      
      {/* Lion Silhouette */}
      <g transform="translate(20, 15) scale(0.6)">
        <path d="M50,10 C70,15 90,30 95,50 C90,70 70,80 50,90 C30,80 10,70 5,50 C10,30 30,15 50,10" fill="#0A5688"/>
        
        {/* Chakra wheel */}
        <circle cx="50" cy="50" r="15" fill="none" stroke="#f1f1f1" strokeWidth="2"/>
        <circle cx="50" cy="50" r="12" fill="none" stroke="#f1f1f1" strokeWidth="1"/>
        
        {/* Spokes */}
        {Array.from({ length: 24 }).map((_, i) => (
          <line 
            key={i}
            x1="50" 
            y1="50" 
            x2={50 + 15 * Math.cos(i * Math.PI / 12)} 
            y2={50 + 15 * Math.sin(i * Math.PI / 12)} 
            stroke="#f1f1f1" 
            strokeWidth={i % 2 === 0 ? "1.5" : "0.75"}
          />
        ))}
      </g>
      
      {/* Text */}
      <path
        d="M15,85 C25,75 40,70 50,70 C60,70 75,75 85,85"
        fill="none"
        stroke="#0A5688"
        strokeWidth="2"
      />
    </svg>
  );
}
