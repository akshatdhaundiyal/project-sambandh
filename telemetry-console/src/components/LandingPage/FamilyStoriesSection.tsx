import React from 'react';
import { Quote, Heart, Star, MapPin } from 'lucide-react';

interface FamilyStoriesSectionProps {
  currentLang: 'en' | 'hi';
}

export const FamilyStoriesSection: React.FC<FamilyStoriesSectionProps> = ({ currentLang }) => {
  const stories = [
    {
      author: 'Rohan Sharma',
      role: 'Tech Lead, Bengaluru',
      parentInfo: 'Caring for Papa (72 yrs) in Rohini Sector 8, Delhi',
      quote:
        'Before Sambandh, I had a permanent knot in my stomach every morning wondering if Papa took his blood pressure pill. Now, I get a clean WhatsApp summary before my morning standup. Papa loves talking about Northern Railway and local park news.',
      highlight: 'Zero anxiety before work'
    },
    {
      author: 'Priya Kulkarni',
      role: 'VP Operations, Mumbai',
      parentInfo: 'Caring for Aai (69 yrs) in Kothrud, Pune',
      quote:
        'My mother threw away every smart dispenser and refused to use health apps. With Sambandh, she chats in Marathi about gardening, while her diabetes medicines arrive at her doorstep 48 hours before the bottle runs out.',
      highlight: 'Aai loves the daily calls'
    },
    {
      author: 'Vikram & Ananya Mehta',
      role: 'NRI Engineers, Bay Area (USA)',
      parentInfo: 'Caring for Parents in C-Scheme, Jaipur',
      quote:
        'Living 12 timezones away made doctor visits terrifying. When Papa visited his cardiologist, Sambandh’s in-clinic transcriber sent us the verified prescription changes and audio in 30 seconds. Invaluable peace of mind.',
      highlight: 'Total peace across timezones'
    }
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-950 text-xs font-bold font-sans">
          <Heart className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
          <span>Real Family Voices</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          {currentLang === 'hi'
            ? 'दूरी चाहे जितनी हो, अपनों का ख्याल हमेशा करीब।'
            : 'Distance shouldn’t mean disconnect. Built for Indian families.'}
        </h2>

        <p className="font-sans text-sm sm:text-base text-stone-600 leading-relaxed">
          {currentLang === 'hi'
            ? 'देखें कैसे भारत और विदेश में रहने वाले बेटे और बेटियां अपने माता-पिता के स्वास्थ्य और आत्मसम्मान की रक्षा कर रहे हैं।'
            : 'How working professionals across Indian metros and abroad ensure their parents thrive with dignity.'}
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stories.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E7E2DB] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              {/* Star Rating & Highlight */}
              <div className="flex items-center justify-between">
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  {item.highlight}
                </span>
              </div>

              {/* Quote */}
              <p className="font-sans text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                "{item.quote}"
              </p>
            </div>

            {/* Author Meta */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                  {item.author}
                </h4>
                <span className="text-[11px] text-stone-500 block">{item.role}</span>
                <span className="text-[10px] text-amber-900 font-medium flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  <span>{item.parentInfo}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
