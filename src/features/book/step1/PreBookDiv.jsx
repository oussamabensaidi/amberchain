import React from 'react';
import QuoteHelperCard from './QuoteHelperCard';
import { ArrowRight, Zap, Shield, CheckCircle } from 'lucide-react';
import useAuthStore from '@/store/authStore';


export default function PreBookDiv({ onSelectQuote, onCreateNew }) {
  const { user } = useAuthStore();
  const userId = user?.id;
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start max-w-7xl mx-auto">

          {/* Left: Clean, confident visual */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
              <img
                src="https://i.postimg.cc/WbNndR0Q/amberchain.jpg"
                alt="Clean data flow and pricing"
                className="w-full h-full max-h-[500px] min-h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                {/* <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  Know Your Price in Seconds
                </h1>
                <p className="text-xl opacity-95 max-w-md">
                  No waiting. No back-and-forth. Just answer a few questions.
                </p>
                
                <div className="mt-8 flex items-center gap-3 text-lg">
                  <span>Chose Your Booking</span>
                  <ArrowRight className="w-6 h-6" />
                </div> */}
              </div>
            </div>
            
            {/* Subtle trust badges below image */}
            <div className="mt-8 grid grid-cols-3 gap-4 lg:hidden">
              {['Instant', 'Accurate', 'No commitment'].map((text) => (
                <div key={text} className="bg-white/90 backdrop-blur rounded-2xl py-4 text-center border border-slate-200">
                  <span className="text-sm font-medium text-slate-700">{text}</span>
                </div>
              ))}
            </div>
             {/* Desktop trust badges */}
            <div className="hidden lg:grid grid-cols-3 gap-6 mt-10">
              {[
                { icon: Zap, text: 'Instant quote', color: 'emerald' },
                { icon: Shield, text: 'Price guaranteed', color: 'indigo' },
                { icon: CheckCircle, text: 'No commitment', color: 'blue' },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center text-nowrap ">
                  <div className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                  </div>
                  <span className="font-medium text-slate-700">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Your card — now the star */}
          <div className="order-1 lg:order-2">
            {/* Optional subtle header */}
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
                Let's get your quote
              </h2>
              <p className="mt-3 text-lg text-slate-600">
                Takes less than 2 minutes
              </p>
            </div>

              <QuoteHelperCard 
                showCreateNew
                onCreateNew={onCreateNew}
                onSelectQuote={onSelectQuote}
                userId={userId}
              />
        
        

           
          </div>

        </div>
      </div>
    </section>
  );
}