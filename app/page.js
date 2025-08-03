'use client';

import Header from "@/components/custom/Header";
import Hero from "@/components/custom/Hero";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const [showLoginMessage, setShowLoginMessage] = useState(false); // State for the login message

  // Function to handle "Generate Your First Template" click
  const handleGenerateClick = () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('userDetail');

      if (storedUser) {
        // User is logged in
        router.push('/dashboard'); // Redirect to dashboard
      } else {
        // User is NOT logged in
        setShowLoginMessage(true); // Show the login message
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top (header)

        // Optionally, hide the message after a few seconds
        setTimeout(() => {
          setShowLoginMessage(false);
        }, 5000); // Message disappears after 5 seconds
      }
    }
  };

  return (
    <div>
      <Header />
      <Hero />

      {/* Login Message Display (only if showLoginMessage is true) */}
      {showLoginMessage && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg shadow-lg text-center animate-fade-in-down">
          <p className="font-semibold text-lg mb-2">Please sign in to access the editor!</p>
          <p className="text-md">Click "Get Started" in the header to continue.</p>
          <button
            onClick={() => setShowLoginMessage(false)}
            className="absolute top-2 right-2 text-yellow-800 hover:text-yellow-600 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* --- Demo Section --- */}
      <section id="demo-section" className="py-20 bg-gray-50 flex justify-center items-center px-4 md:px-10 lg:px-20">
        <div className="max-w-4xl w-full text-center">
          <h2 className="text-4xl font-bold mb-8 text-primary">Experience the Magic!</h2>
          <p className="text-lg text-gray-700 mb-10">See how easy it is to create stunning emails with MailCraft.</p>
          <Image
            src={'/landing1.png'}
            alt='MailCraft Demo'
            width={1200}
            height={800}
            className='rounded-xl shadow-2xl border border-gray-200 object-cover w-full h-auto'
          />
          <p className="mt-8 text-md text-gray-600">
            *This is a static representation. Click 'Get Started' in the header to try the live builder!
          </p>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section id="how-it-works-section" className="py-20 px-4 md:px-10 lg:px-20 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-800">How MailCraft Works</h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-primary text-white flex items-center justify-center rounded-full text-3xl font-bold mb-4">1</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Generate with AI</h3>
              <p className="text-gray-700 leading-relaxed">
                Provide a simple prompt describing your email needs. Our AI instantly drafts copy, selects imagery, and suggests a layout.
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-primary text-white flex items-center justify-center rounded-full text-3xl font-bold mb-4">2</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Customize & Refine</h3>
              <p className="text-gray-700 leading-relaxed">
                Drag-and-drop elements, tweak colors, fonts, and content. Our intuitive editor makes personalization a breeze.
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-pink-50 to-red-50 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-primary text-white flex items-center justify-center rounded-full text-3xl font-bold mb-4">3</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Export & Integrate</h3>
              <p className="text-gray-700 leading-relaxed">
                Download your perfectly designed HTML template, ready for integration with any email marketing platform.
              </p>
            </div>
          </div>
          {/* Call to action */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold mb-6 text-gray-800">Ready to Get Started?</h3>
            <Button size="lg" onClick={handleGenerateClick}>
              Generate Your First Template
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}