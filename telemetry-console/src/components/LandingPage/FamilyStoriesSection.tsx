import React from 'react';
import { Heart, MapPin } from 'lucide-react';

interface FamilyStoriesSectionProps {
  currentLang: 'en' | 'hi';
}

export const FamilyStoriesSection: React.FC<FamilyStoriesSectionProps> = ({ currentLang }) => {
  const stories = [
    {
      author: 'Rohan Sharma',
      role: 'Tech Lead, Bengaluru',
      parentInfo: 'Papa (72 yrs) in Rohini Sector 8, Delhi',
      quote:
        'Before Sambandh, I had a permanent knot in my stomach every morning wondering if Papa took his morning Telma 40. Now, I get a clean WhatsApp summary before my morning standup. Papa actually smiles when the morning call rings.',
      meta: 'Flow 1 & Flow 2 in daily use'
    },
    {
      author: 'Priya Kulkarni',
      role: 'Operations Manager, Mumbai',
      parentInfo: 'Aai (69 yrs) in Kothrud, Pune',
      quote:
        'My mother threw away every pill dispenser and refused to use health apps. With Sambandh, she chats in Marathi about gardening, while her diabetes medicines arrive at her doorstep 48 hours before the bottle runs out.',
      meta: 'Zero apps on mother’s phone'
    },
    {
      author: 'Vikram Mehta',
      role: 'Software Architect, San Jose (USA)',
      parentInfo: 'Parents in C-Scheme, Jaipur',
      quote:
        'Living 12 timezones away made doctor visits terrifying. When Papa visited his cardiologist, Sambandh’s in-clinic bridge sent us the verified prescription changes in 30 seconds. Invaluable peace of mind.',
      meta: 'Flow 4 in-clinic summary'
    }
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center space-y-2.5">
        <span className="text-xs font-semibold text-amber-950 font-sans">
          Real family experiences
        </span>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          {currentLang === 'hi'
            ? 'दूरी चाहे जितनी हो, अपनों का ख्याल हमेशा करीब।'
            : 'Fills the gaps so guilt doesn’t eat you up.'}
        </h2>

        <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl mx-auto">
          {currentLang === 'hi'
            ? 'देखें कैसे भारत और विदेश में रहने वाले बेटे और बेटियां अपने माता-पिता के स्वास्थ्य और आत्मसम्मान का ध्यान रख रहे हैं।'
            : 'How working professionals across Indian metros and abroad ensure their parents thrive with dignity.'}
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stories.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E7E2DB] shadow-2xs space-y-4 flex flex-col justify-between"
          >
            <p className="font-sans text-xs sm:text-sm text-stone-700 leading-relaxed italic">
              "{item.quote}"
            </p>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-xs sm:text-sm text-stone-900 leading-tight">
                  {item.author}
                </h4>
                <span className="text-[11px] text-stone-500 block">{item.role}</span>
                <span className="text-[10px] text-amber-900 font-medium flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  <span>{item.parentInfo}</span>
                </span>
              </div>

              <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                {item.meta}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
