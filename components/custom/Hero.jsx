// import React from 'react'
// import { Button } from '../ui/button'
// import Image from 'next/image'
// import SignInButton from './SignInButton'

// const Hero = () => {
//   return (
//     <div className='px-10 md:px-28 lg:px-44 xl:px-56 flex flex-col items-center mt-24'>
//         <h2 className='font-extrabold text-5xl text-center'>AI-Powered <span className='text-primary'>Email Templates</span></h2>
//         <p className='text-center mt-4'>Longing to impress clients with AI-powered emails but don't have enough time to build them on your own? Use the AI-powered email templates that already have AI-generated imagery and copy -- save time on email production with us.</p>
//         <div className='flex gap-5 mt-6'>
//             <Button variant="outline">Try Demo</Button>
//             <SignInButton/>
//         </div>
//         <Image src={'/landing1.png'} alt='landing' width={1000} height={800} className='mt-12 rounded-xl'/>
//     </div>
//   )
// }

// export default Hero



'use client';
import React from 'react';
import { Button } from '../ui/button'; // Ensure this import is still present
import Image from 'next/image';
// import SignInButton from './SignInButton'; // No longer needed here

const Hero = () => {
  return (
    <div className='px-10 md:px-28 lg:px-44 xl:px-56 flex flex-col items-center mt-24'>
      <h2 className='font-extrabold text-5xl text-center'>AI-Powered <span className='text-primary'>Email Templates</span></h2>
      <p className='text-center mt-4'>Longing to impress clients with AI-powered emails but don't have enough time to build them on your own? Use the AI-powered email templates that already have AI-generated imagery and copy -- save time on email production with us.</p>

      {/* NEW BUTTONS */}
      <div className='flex gap-5 mt-6'>
        <Button variant="outline" onClick={() => {
          // Logic for 'Try Demo' - scroll to demo section
          document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
        }}>
          Try Demo
        </Button>
        <Button onClick={() => {
          // Logic for 'How It Works' - scroll to how-it-works section
          document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
        }}>
          How It Works
        </Button>
      </div>

      {/* The existing landing image can serve as part of the visual intro or be moved */}
      {/* <Image src={'/landing1.png'} alt='landing' width={1000} height={800} className='mt-12 rounded-xl border shadow-lg'/> */}
    </div>
  );
}

export default Hero;