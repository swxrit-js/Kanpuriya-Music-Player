import React, { useState } from 'react';
import { FeedbackCategory, Feedback } from '../types';
import { MessageSquarePlus, Star, Send, Check } from 'lucide-react';

interface FeedbackModalProps {
  onSubmitFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt' | 'status'>) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ onSubmitFeedback }) => {
  const [category, setCategory] = useState<FeedbackCategory>('general');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  const categories: { id: FeedbackCategory; label: string }[] = [
    { id: 'general', label: 'सामान्य समीक्षा' },
    { id: 'flavour', label: 'गोला स्वाद सुझाव' },
    { id: 'request', label: 'गाना रिक्वेस्ट' },
    { id: 'feature', label: 'नया फ़ीचर सुझाव' },
    { id: 'bug', label: 'तकनीकी समस्या' },
    { id: 'complaint', label: 'शिकायत' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSubmitFeedback({
      category,
      rating,
      message,
      userName: 'Desi Street Visitor',
      userEmail: 'visitor@desigola.com'
    });

    setSubmitted(true);
    setTimeout(() => {
      setMessage('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#0c1319] text-[#e5dfd3] p-4 md:p-8 flex items-center justify-center pb-28 font-sans selection:bg-[#e0a96d] selection:text-[#0c1319]">
      <div className="bg-[#121c23] border border-[#e0a96d]/30 p-6 md:p-8 rounded-3xl max-w-lg w-full shadow-[0_0_50px_rgba(224,169,109,0.1)]">
        
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#18232c] border border-[#e0a96d]/40 text-[#e0a96d] flex items-center justify-center text-2xl mx-auto mb-2 font-bold shadow-lg">
            ☕
          </div>
          <h2 className="text-xl md:text-2xl font-normal text-[#f5eedc] font-hindi-display">कटिंग चाय स्टॉल प्रतिक्रिया व सुझाव</h2>
          <p className="text-xs md:text-sm text-[#8a9aa8] mt-1">
            "चाय की चुस्की के साथ अपना सुझाव दें भैया!"
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-[#18232c] border border-[#e0a96d]/40 text-center space-y-2">
            <Check className="w-8 h-8 text-[#e0a96d] mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-[#f5eedc] font-hindi-display">शुक्रिया! आपकी प्रतिक्रिया दर्ज हो गई</h3>
            <p className="text-xs text-[#8a9aa8]">आपकी राय हमारे डेटाबेस में सेव हो गई है और एडमिन को ईमेल (swaritshukla125@gmail.com) द्वारा भेज दी गई है।</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category selection */}
            <div>
              <label className="text-xs md:text-sm text-[#8a9aa8] block mb-1 font-medium">विषय श्रेणी चुनें:</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`p-2 rounded-xl text-xs font-bold transition-all border ${
                      category === c.id
                        ? 'bg-[#e0a96d] text-[#0c1319] border-[#e0a96d]'
                        : 'bg-[#0c1319] text-[#a8b5c0] border-white/10 hover:text-white'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="text-xs md:text-sm text-[#8a9aa8] block mb-1 font-medium">रेटिंग दें:</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'text-[#e0a96d] fill-[#e0a96d]' : 'text-white/20'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Message input */}
            <div>
              <label className="text-xs md:text-sm text-[#8a9aa8] block mb-1 font-medium">संदेश / गाना रिक्वेस्ट का विवरण:</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="अपने विचार, गाना रिक्वेस्ट या नए गोले का स्वाद लिखें..."
                className="w-full bg-[#0c1319] border border-white/10 px-3 py-2.5 rounded-xl text-xs md:text-sm text-[#f5eedc] focus:outline-none focus:border-[#e0a96d] h-28"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#e0a96d] hover:bg-[#d9a05b] text-[#0c1319] font-bold text-xs md:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 font-hindi-bold"
            >
              <Send className="w-4 h-4" />
              <span>चाय स्टॉल पर भेजें</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
