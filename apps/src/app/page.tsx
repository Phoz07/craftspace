"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import {
  EstimatorWizard,
  type EstimatorState,
} from "@/components/EstimatorWizard";
import { PortfolioShowcase } from "@/components/PortfolioShowcase";
import {
  LeadCaptureModal,
  type LeadSubmissionResponse,
} from "@/components/LeadCaptureModal";
import { SubmissionSuccessModal } from "@/components/SubmissionSuccessModal";

export default function Home() {
  const [activeEstimateState, setActiveEstimateState] =
    useState<EstimatorState | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [submittedLead, setSubmittedLead] =
    useState<LeadSubmissionResponse | null>(null);

  const handleProceedToLeadCapture = (state: EstimatorState) => {
    setActiveEstimateState(state);
    setIsLeadModalOpen(true);
  };

  const handleLeadCaptureSuccess = (lead: LeadSubmissionResponse) => {
    setIsLeadModalOpen(false);
    setSubmittedLead(lead);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      <Navbar />

      <main className="flex-1 w-full">
        {/* Visual Storytelling Hero Section with Interactive Before/After Slider */}
        <HeroSection />

        {/* Interactive 4-Step Cost Estimator Wizard */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <EstimatorWizard onProceedToLeadCapture={handleProceedToLeadCapture} />
        </div>

        {/* Portfolio Showcase with Real Metadata & Multi-category Filtering */}
        <PortfolioShowcase />
      </main>

      {/* Value-Exchange Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        estimatorState={activeEstimateState}
        onSuccess={handleLeadCaptureSuccess}
      />

      {/* Omnichannel LINE Routing & Slip Download Success Modal */}
      <SubmissionSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        lead={submittedLead}
      />

      <Footer />
    </div>
  );
}
