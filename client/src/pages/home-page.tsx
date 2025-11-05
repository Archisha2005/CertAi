import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CertificateTypeCard } from "@/components/certificate-type-card";
import { ProcessStep } from "@/components/process-step";
import { FeatureCard } from "@/components/feature-card";
import { FaqSection } from "@/components/faq-section";
import { TestimonialCard } from "@/components/testimonial-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { user } = useAuth();

  const certificateTypes = [
    {
      id: "caste",
      title: "Caste Certificate",
      icon: "id-card",
      description: "Official document certifying an individual's caste as recognized by the government.",
      benefits: [
        "Accepted for education, employment & welfare schemes",
        "Valid across all government departments"
      ],
      processingTime: "7-10 working days"
    },
    {
      id: "income",
      title: "Income Certificate",
      icon: "money-bill-wave",
      description: "Official document verifying annual income of an individual or family.",
      benefits: [
        "Required for scholarships & financial assistance",
        "Issued based on verified income documents"
      ],
      processingTime: "5-7 working days"
    },
    {
      id: "residence",
      title: "Residence Certificate",
      icon: "home",
      description: "Proof of residence for accessing local services and benefits.",
      benefits: [
        "Verifies domicile status for government schemes",
        "Based on address proof verification"
      ],
      processingTime: "3-5 working days"
    }
  ];

  const processSteps = [
    {
      number: 1,
      title: "Register & Login",
      description: "Create an account with your Aadhaar/ID to access services."
    },
    {
      number: 2,
      title: "Apply Online",
      description: "Fill the form and upload required supporting documents."
    },
    {
      number: 3,
      title: "AI Verification",
      description: "AI-powered system verifies documents with original records."
    },
    {
      number: 4,
      title: "Get Certificate",
      description: "Download digitally signed certificate after approval."
    }
  ];

  const features = [
    {
      icon: "robot",
      title: "AI-Powered Verification",
      description: "Advanced AI system compares uploaded documents with government database records for authentic verification."
    },
    {
      icon: "shield-alt",
      title: "Secure Document Handling",
      description: "End-to-end encryption for all document uploads and storage with secure access controls."
    },
    {
      icon: "clock",
      title: "Real-time Status Tracking",
      description: "Track your application status in real-time with notifications at each step of the process."
    },
    {
      icon: "file-pdf",
      title: "Digital Certificate Delivery",
      description: "Download digitally signed certificates with QR verification code for authenticity."
    },
    {
      icon: "mobile-alt",
      title: "Mobile Responsive",
      description: "Apply, track, and receive certificates from any device with our fully responsive platform."
    },
    {
      icon: "headset",
      title: "24/7 Support",
      description: "Get assistance anytime through our helpdesk, chatbot, and knowledge base resources."
    }
  ];

  const testimonials = [
    {
      name: "Rahul Sharma",
      location: "Delhi",
      rating: 5,
      comment: "I was amazed by the efficiency of this system. Got my caste certificate within 5 days without having to visit any government office. The AI verification made the process so smooth!"
    },
    {
      name: "Sunita Patel",
      location: "Gujarat",
      rating: 4.5,
      comment: "As a senior citizen, I was concerned about applying online, but the process was surprisingly simple. The helpdesk was very supportive when I needed assistance. Received my income certificate promptly."
    },
    {
      name: "Arjun Singh",
      location: "Maharashtra",
      rating: 5,
      comment: "The tracking system is excellent! I could see exactly what stage my application was at. The digital certificate with QR verification is a great improvement over traditional paper certificates."
    }
  ];

  return (
    <>
      <Helmet>
        <title>CertAi - Simplifying Certificates & Citizen Services</title>
        <meta
          name="description"
          content="Apply, track, and receive government certificates all in one place. CertAi offers AI-powered verification for caste, income, and residence certificates with seamless online processing."
        />
      </Helmet>

      <div className="flex flex-col min-h-screen bg-white text-gray-900">
        <Header />

        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-white to-[#F7F9FC] border-b border-gray-200">
          <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-[#0A3D62] leading-tight">
                Simplifying Certificates & Citizen Services
              </h1>
              <div className="h-1 w-24 bg-[#FF9933] rounded"></div>
              <p className="text-lg text-gray-700">
                Apply, Track, Receive — All in One Place. Get your government certificates with AI-powered verification and seamless processing.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#FF9933] text-white font-semibold rounded-none hover:bg-[#e6892d]"
                >
                  <Link href={user ? "/apply" : "/auth?redirect=/apply"}>
                    Apply for Certificate
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-[#0A3D62] text-[#0A3D62] font-semibold rounded-none hover:bg-[#0A3D62] hover:text-white"
                >
                  <Link href="/track">Track Application</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
                alt="Digital India"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Certificate Types */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-center text-3xl font-bold text-[#0A3D62] mb-12 relative">
              Available Certificate Types
              <div className="h-1 w-20 bg-[#FF9933] mx-auto mt-2"></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {certificateTypes.map((certificate) => (
                <CertificateTypeCard key={certificate.id} {...certificate}
                  href={user ? `/apply?type=${certificate.id}` : `/auth?redirect=/apply?type=${certificate.id}`} />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-[#F7F9FC]">
          <div className="container mx-auto px-6">
            <h2 className="text-center text-3xl font-bold text-[#0A3D62] mb-12">
              How It Works
              <div className="h-1 w-20 bg-[#FF9933] mx-auto mt-2"></div>
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
              {processSteps.map((step, index) => (
                <ProcessStep key={step.number} {...step} isLast={index === processSteps.length - 1} />
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-center text-3xl font-bold text-[#0A3D62] mb-12">
              Key Features
              <div className="h-1 w-20 bg-[#FF9933] mx-auto mt-2"></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <FaqSection />

        {/* Testimonials */}
        <section className="py-16 bg-[#F7F9FC]">
          <div className="container mx-auto px-6">
            <h2 className="text-center text-3xl font-bold text-[#0A3D62] mb-12">
              What Citizens Say
              <div className="h-1 w-20 bg-[#FF9933] mx-auto mt-2"></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
