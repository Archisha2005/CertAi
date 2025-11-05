interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
}

export function ProcessStep({ number, title, description, isLast = false }: ProcessStepProps) {
  return (
    <>
      <div className="flex flex-col items-center text-center mb-8 md:mb-0 px-4">
        <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
          {number}
        </div>
        <h3 className="font-medium text-xl mb-2">{title}</h3>
        <p className="text-neutral-600">{description}</p>
      </div>
      
      {!isLast && (
        <div className="hidden md:block w-16">
          <div className="border-t-2 border-dashed border-primary-light"></div>
        </div>
      )}
    </>
  );
}
