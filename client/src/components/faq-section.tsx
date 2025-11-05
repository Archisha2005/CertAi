import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  const faqs = [
    {
      question: "What documents are required for a caste certificate?",
      answer: (
        <div>
          <p className="text-neutral-700 mb-2">The following documents are typically required:</p>
          <ul className="list-disc ml-5 text-neutral-600">
            <li>Aadhaar Card</li>
            <li>Proof of residence (Electricity/Water Bill)</li>
            <li>Previous caste certificate of parents/relatives (if any)</li>
            <li>Birth certificate or educational certificates</li>
            <li>Passport size photographs</li>
            <li>Any other documents as specified during application</li>
          </ul>
        </div>
      ),
    },
    {
      question: "How long does it take to get a certificate?",
      answer: (
        <div>
          <p className="text-neutral-700">The processing time varies by certificate type:</p>
          <ul className="list-disc ml-5 text-neutral-600 mt-2">
            <li>Caste Certificate: 7-10 working days</li>
            <li>Income Certificate: 5-7 working days</li>
            <li>Residence Certificate: 3-5 working days</li>
          </ul>
          <p className="text-neutral-700 mt-2">These timelines may vary based on verification requirements and document accuracy. Our AI-powered verification system aims to reduce processing times when possible.</p>
        </div>
      ),
    },
    {
      question: "How does the AI verification system work?",
      answer: (
        <div>
          <p className="text-neutral-700">Our AI verification system works in multiple stages:</p>
          <ol className="list-decimal ml-5 text-neutral-600 mt-2">
            <li>Document authenticity check - verifies if the uploaded documents are genuine and not tampered</li>
            <li>Information extraction - extracts key information from documents</li>
            <li>Cross-verification - compares the extracted information with government databases</li>
            <li>Consistency check - ensures all provided information is consistent across documents</li>
          </ol>
          <p className="text-neutral-700 mt-2">In case the AI system flags any discrepancies, a manual verification may be conducted by authorized officials.</p>
        </div>
      ),
    },
    {
      question: "How long is the certificate valid?",
      answer: (
        <div>
          <p className="text-neutral-700">Validity periods differ by certificate type:</p>
          <ul className="list-disc ml-5 text-neutral-600 mt-2">
            <li>Caste Certificate: Usually valid for 5 years or as specified</li>
            <li>Income Certificate: Typically valid for 1 year from the date of issue</li>
            <li>Residence Certificate: Usually valid for 3 years</li>
          </ul>
          <p className="text-neutral-700 mt-2">The exact validity period will be mentioned on your certificate. You can apply for renewal through this portal before expiry.</p>
        </div>
      ),
    },
    {
      question: "Is there a fee for certificate issuance?",
      answer: (
        <div>
          <p className="text-neutral-700">Most certificates are issued free of cost as per government policy. However, certain certificates may have nominal processing fees:</p>
          <ul className="list-disc ml-5 text-neutral-600 mt-2">
            <li>Caste Certificate: No fee</li>
            <li>Income Certificate: ₹50 processing fee</li>
            <li>Residence Certificate: ₹30 processing fee</li>
          </ul>
          <p className="text-neutral-700 mt-2">All fees can be paid online through various payment methods available on the portal. A receipt will be generated for your records.</p>
        </div>
      ),
    },
  ];

  return (
    <section className="py-12 bg-white" id="faq">
      <div className="container mx-auto px-4">
        <h2 className="font-bold text-2xl md:text-3xl text-center mb-10 text-secondary">Frequently Asked Questions</h2>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
