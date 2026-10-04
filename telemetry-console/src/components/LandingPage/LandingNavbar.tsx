import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Sparkles, Globe, Menu, X } from 'lucide-react';
import { JioLogo } from '../../data/brandLogos';

interface LandingNavbarProps {
  currentLang: 'en' | 'hi';
  onToggleLang: () => void;
  onOpenSignUp: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ currentLang, onToggleLang, onOpenSignUp }) => {
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
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-xs border-b border-[#E7E2DB] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand: Jio × Sambandh */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
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
                <span className="font-serif font-bold text-base text-stone-900 tracking-tight leading-none">
                  Jio × Sambandh
                </span>
                <span className="text-[10px] font-mono text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                  सम्बन्ध
                </span>
              </div>
              <span className="text-[10px] text-stone-500 font-medium hidden sm:block leading-none mt-0.5">
                {currentLang === 'hi' ? 'अपनों का सच्चा साथ' : 'The extended arm for Indian families'}
              </span>
            </div>
          </a>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-stone-700">
          <button
            onClick={() => scrollToSection('how-it-fits')}
            className="hover:text-stone-900 transition-colors cursor-pointer"
          >
            {currentLang === 'hi' ? 'यह कैसे काम करता है' : 'How it fits'}
          </button>
          <button
            onClick={() => scrollToSection('six-flows')}
            className="hover:text-stone-900 transition-colors cursor-pointer"
          >
            {currentLang === 'hi' ? '6 प्रमुख यात्राएं' : 'The 6 flows'}
          </button>
          <button
            onClick={() => scrollToSection('doctor-bridge')}
            className="hover:text-stone-900 transition-colors cursor-pointer"
          >
            {currentLang === 'hi' ? 'डॉक्टर क्लिनिक ब्रिज' : 'Doctor bridge'}
          </button>
          <button
            onClick={() => scrollToSection('partner-rails')}
            className="hover:text-stone-900 transition-colors cursor-pointer"
          >
            {currentLang === 'hi' ? 'पार्टनर रेल्स' : 'Partner rails'}
          </button>
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-stone-300 hover:border-stone-400 bg-white text-stone-800 text-xs font-medium transition-all cursor-pointer shadow-2xs"
            title="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-stone-600" />
            <span>{currentLang === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Launch Live Demo Console */}
          <button
            type="button"
            onClick={() => launchDemoScenario()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-medium text-xs shadow-2xs transition-all cursor-pointer"
            title="Open the 3-persona live console"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Live demo console</span>
          </button>

          {/* Sign Up CTA (Modal Trigger) */}
          <button
            type="button"
            onClick={onOpenSignUp}
            className="px-4 py-2 rounded-xl bg-[#0057E7] hover:bg-[#0047C4] text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
          >
            {currentLang === 'hi' ? 'साइन अप करें' : 'Sign Up'}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => launchDemoScenario()}
            className="px-2.5 py-1.5 bg-white text-stone-900 border border-stone-300 rounded-lg text-xs font-semibold"
          >
            Console
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-stone-700 hover:text-stone-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FAF8F5] border-b border-[#E7E2DB] px-4 py-4 space-y-2.5 animate-fadeIn">
          <button
            onClick={() => scrollToSection('how-it-fits')}
            className="block w-full text-left py-1.5 text-sm font-medium text-stone-800"
          >
            How it fits
          </button>
          <button
            onClick={() => scrollToSection('six-flows')}
            className="block w-full text-left py-1.5 text-sm font-medium text-stone-800"
          >
            The 6 flows
          </button>
          <button
            onClick={() => scrollToSection('doctor-bridge')}
            className="block w-full text-left py-1.5 text-sm font-medium text-stone-800"
          >
            Doctor bridge
          </button>
          <button
            onClick={() => scrollToSection('partner-rails')}
            className="block w-full text-left py-1.5 text-sm font-medium text-stone-800"
          >
            Partner rails
          </button>
          <div className="pt-2.5 border-t border-stone-200 flex flex-col gap-2">
            <button
              onClick={onToggleLang}
              className="w-full py-2 px-3 bg-white text-stone-800 border border-stone-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-stone-600" />
              <span>Language: {currentLang === 'en' ? 'Switch to हिंदी' : 'Switch to English'}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSignUp();
              }}
              className="w-full py-2.5 px-3 bg-[#0057E7] text-white rounded-xl text-xs font-semibold text-center"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
