import React, { useState } from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { DignityGapSection } from './DignityGapSection';
import { DailyMomentsSection } from './DailyMomentsSection';
import { DoctorBridgeSection } from './DoctorBridgeSection';
import { JioAdvantageSection } from './JioAdvantageSection';
import { FamilyStoriesSection } from './FamilyStoriesSection';
import { LandingCTASection } from './LandingCTASection';
import { SignUpModal } from './SignUpModal';
import { LandingFooter } from './LandingFooter';

export const LandingPage: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('en');
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState<boolean>(false);

  const handleToggleLang = () => {
    setCurrentLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleOpenSignUp = () => {
    setIsSignUpModalOpen(true);
  };

  const handleCloseSignUp = () => {
    setIsSignUpModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans selection:bg-[#0057E7] selection:text-white antialiased overflow-x-hidden flex flex-col">
      {/* Top Navbar */}
      <LandingNavbar
        currentLang={currentLang}
        onToggleLang={handleToggleLang}
        onOpenSignUp={handleOpenSignUp}
      />

      {/* Main Narrative Flow */}
      <main className="flex-1 w-full">
        {/* Section 1: Hero with Gnani Voice Player & Instant CTAs */}
        <LandingHero
          currentLang={currentLang}
          onOpenSignUp={handleOpenSignUp}
        />

        {/* Section 2: How It Fits Together (Caregiver, Agent, Parent) */}
        <DignityGapSection currentLang={currentLang} />

        {/* Section 3: The 6 Everyday Flows */}
        <DailyMomentsSection currentLang={currentLang} />

        {/* Section 4: In-Clinic Hospital Visit & Doctor Consent */}
        <DoctorBridgeSection currentLang={currentLang} />

        {/* Section 5: The Three Partner Rails (Gnani, Pine Labs, Delhivery) */}
        <JioAdvantageSection currentLang={currentLang} />

        {/* Section 6: Real Family Stories */}
        <FamilyStoriesSection currentLang={currentLang} />

        {/* Section 7: Final Conversion Section */}
        <LandingCTASection
          currentLang={currentLang}
          onOpenSignUp={handleOpenSignUp}
        />
      </main>

      {/* Footer */}
      <LandingFooter />

      {/* Sign-Up Modal Popup */}
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={handleCloseSignUp}
      />
    </div>
  );
};
