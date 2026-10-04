import React, { useState } from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { DignityGapSection } from './DignityGapSection';
import { DailyMomentsSection } from './DailyMomentsSection';
import { DoctorBridgeSection } from './DoctorBridgeSection';
import { JioAdvantageSection } from './JioAdvantageSection';
import { FamilyStoriesSection } from './FamilyStoriesSection';
import { PricingPlansSection } from './PricingPlansSection';
import { SignUpSection } from './SignUpSection';
import { LandingFooter } from './LandingFooter';

export const LandingPage: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('en');

  const handleToggleLang = () => {
    setCurrentLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans selection:bg-[#0057E7] selection:text-white antialiased overflow-x-hidden flex flex-col">
      {/* Top Fixed Jio-Branded Navbar */}
      <LandingNavbar currentLang={currentLang} onToggleLang={handleToggleLang} />

      {/* Main Landing Content */}
      <main className="flex-1 w-full">
        {/* Section 1: Hero with Interactive Audio Player & Instant CTAs */}
        <LandingHero currentLang={currentLang} />

        {/* Section 2: The Dignity Gap (Why Old Apps Fail vs. Jio Sambandh) */}
        <DignityGapSection currentLang={currentLang} />

        {/* Section 3: 3 Everyday Moments (The Daily Care Loop) */}
        <DailyMomentsSection currentLang={currentLang} />

        {/* Section 4: In-Clinic Doctor Consultation Bridge */}
        <DoctorBridgeSection currentLang={currentLang} />

        {/* Section 5: The Reliance Jio Scale & Zero-Hardware Advantage */}
        <JioAdvantageSection currentLang={currentLang} />

        {/* Section 6: Real Testimonials from Indian Families */}
        <FamilyStoriesSection currentLang={currentLang} />

        {/* Section 7: Transparent, Honest Pricing Plans */}
        <PricingPlansSection currentLang={currentLang} />

        {/* Section 8: Embedded Sign-Up & Parent Enrollment Card */}
        <SignUpSection />
      </main>

      {/* Footer with Compliance & Quick Scenario Launchers */}
      <LandingFooter />
    </div>
  );
};
