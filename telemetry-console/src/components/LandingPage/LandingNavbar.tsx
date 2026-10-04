import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Sparkles, Globe, Menu, X, ArrowRight } from 'lucide-react';
import { JioLogo } from '../../data/brandLogos';

interface LandingNavbarProps {
  currentLang: 'en' | 'hi';
  onToggleLang: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ currentLang, onToggleLang }) => {
  const { launchDemoScenario } = useTelemetry();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7E2DB] shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Co-Branding with Jio */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            {/* Jio Emblem */}
            <div className="flex items-center gap-1.5">
              <JioLogo className="w-7 h-7 rounded-xl shadow-2xs shrink-0" />
              <img
                src="/favicon.svg"
                alt="Sambandh Emblem"
                className="w-7 h-7 object-contain rounded-xl shadow-2xs border border-[#E7E2DB] bg-[#FAF4EC] shrink-0"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-base text-stone-900 tracking-tight leading-none group-hover:text-amber-900 transition-colors">
                  Jio Sambandh
                </span>
                <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                  सम्बन्ध
                </span>
              </div>
              <span className="text-[10px] text-amber-900 font-medium hidden sm:block leading-none mt-0.5">
                {currentLang === 'hi' ? 'अपनों का सच्चा ख्याल · हर सुबह' : 'Closer today. Always.'}
              </span>
            </div>
          </a>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-stone-700">
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-amber-950 transition-colors cursor-pointer"
          >
            {currentLang === 'hi' ? 'यह कैसे काम करता है' : 'How It Works'}
          </button>
          <button
            onClick={() => scrollToSection('dignity-gap')}
            className="hover:text-amber-950 transition-colors cursor-pointer"
          >
            {currentLang === 'hi' ? 'सम्मान बनाम ऐप' : 'Dignity vs. Apps'}
          </button>
          <button
            onClick={() => scrollToSection('doctor-bridge')}
            className="hover:text-amber-950 transition-colors cursor-pointer"
          >
            {currentLang === 'hi' ? 'डॉक्टर क्लिनिक ब्रिज' : 'Doctor Bridge'}
          </button>
          <button
            onClick={() => scrollToSection('jio-advantage')}
            className="hover:text-amber-950 transition-colors cursor-pointer"
          >
            {currentLang === 'hi' ? 'जियो का भरोसा' : 'Jio Advantage'}
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="hover:text-amber-950 transition-colors cursor-pointer"
          >
            {currentLang === 'hi' ? 'प्लान और शुल्क' : 'Plans'}
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-300 hover:border-stone-400 bg-white text-stone-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Toggle English / Hindi language mode"
          >
            <Globe className="w-3.5 h-3.5 text-amber-800" />
            <span>{currentLang === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Launch Live Demo Console */}
          <button
            type="button"
            onClick={() => launchDemoScenario()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 font-bold text-xs shadow-2xs transition-all cursor-pointer"
            title="Open the 3-Persona Live Telemetry & Judge Console"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Live Demo Console ⚡</span>
          </button>

          {/* Sign Up CTA */}
          <button
            type="button"
            onClick={() => scrollToSection('signup-section')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0057E7] hover:bg-[#0047C4] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <span>{currentLang === 'hi' ? 'फ्री केयर शुरू करें' : 'Sign Up Free'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => launchDemoScenario()}
            className="px-2.5 py-1.5 bg-white text-stone-900 border border-stone-300 rounded-lg text-xs font-bold"
          >
            Console ⚡
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-700 hover:text-stone-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FAF8F5] border-b border-[#E7E2DB] px-4 py-4 space-y-3 animate-fadeIn">
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left py-2 text-sm font-semibold text-stone-800"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('dignity-gap')}
            className="block w-full text-left py-2 text-sm font-semibold text-stone-800"
          >
            Dignity vs. Apps
          </button>
          <button
            onClick={() => scrollToSection('doctor-bridge')}
            className="block w-full text-left py-2 text-sm font-semibold text-stone-800"
          >
            Doctor Bridge
          </button>
          <button
            onClick={() => scrollToSection('jio-advantage')}
            className="block w-full text-left py-2 text-sm font-semibold text-stone-800"
          >
            Jio Advantage
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="block w-full text-left py-2 text-sm font-semibold text-stone-800"
          >
            Plans
          </button>
          <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
            <button
              onClick={onToggleLang}
              className="w-full py-2.5 px-3 bg-white text-stone-800 border border-stone-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Globe className="w-4 h-4 text-amber-800" />
              <span>Language: {currentLang === 'en' ? 'Switch to हिंदी' : 'Switch to English'}</span>
            </button>
            <button
              onClick={() => scrollToSection('signup-section')}
              className="w-full py-2.5 px-3 bg-[#0057E7] text-white rounded-xl text-xs font-bold text-center"
            >
              Sign Up Free (14-Day Trial)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
