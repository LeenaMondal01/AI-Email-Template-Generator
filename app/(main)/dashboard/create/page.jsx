// import AiInputBox from '@/components/custom/AiInputBox'
// import StartFromScratch from '@/components/custom/StartFromScratch'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Sparkles } from 'lucide-react'
// import React from 'react'

// const Create = () => {
//   return (
//     <div className='px-10 md:px-28 lg:px-64 xl:px-72 mt-20'>
//         <div className='flex items-center flex-col'>
//             <h2 className='font-bold text-3xl text-primary'>CREATE NEW EMAIL TEMPLATE</h2>
//             <p className='text-lg text-gray-400'>Effortlessly design and customize proffessional AI-powered email templates with ease</p>
//             <Tabs defaultValue="AI" className="w-[500px] mt-10">
//                 <TabsList>
//                     <TabsTrigger value="AI">Create with AI <Sparkles className='h-5 w-5 ml-2'/> </TabsTrigger>
//                     <TabsTrigger value="SCRATCH">Start from Scratch</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="AI">
//                   <AiInputBox/>
//                 </TabsContent>
//                 <TabsContent value="SCRATCH">
//                   <StartFromScratch/>
//                 </TabsContent>
//             </Tabs>
//         </div>
//     </div>
//   )
// }

// export default Create








"use client" // Keep this at the top

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sparkles } from 'lucide-react'
import React from 'react'

// --- CRITICAL FIX: Use dynamic import for client components ---
import dynamic from 'next/dynamic';

// Dynamically import AiInputBox and StartFromScratch
// This ensures they are loaded on the client side and not treated as server components
const AiInputBox = dynamic(() => import('@/components/custom/AiInputBox'), { ssr: false });
const StartFromScratch = dynamic(() => import('@/components/custom/StartFromScratch'), { ssr: false });

// No need for other imports like Button, useRouter, useMutation, api, useUserDetail directly here
// as they are used inside the dynamically loaded components.

const Create = () => {
  return (
    <div className='px-10 md:px-28 lg:px-64 xl:px-72 mt-20'>
        <div className='flex items-center flex-col'>
            <h2 className='font-bold text-3xl text-primary'>CREATE NEW EMAIL TEMPLATE</h2>
            <p className='text-lg text-gray-400'>Effortlessly design and customize professional AI-powered email templates with ease</p>
            <Tabs defaultValue="AI" className="w-[500px] mt-10">
                <TabsList>
                    <TabsTrigger value="AI">Create with AI <Sparkles className='h-5 w-5 ml-2'/></TabsTrigger>
                    <TabsTrigger value="SCRATCH">Start from Scratch</TabsTrigger>
                </TabsList>
                <TabsContent value="AI">
                  {/* Now renders the dynamically imported component */}
                  <AiInputBox/>
                </TabsContent>
                <TabsContent value="SCRATCH">
                  {/* Now renders the dynamically imported component */}
                  <StartFromScratch />
                </TabsContent>
            </Tabs>
        </div>
    </div>
  )
}

export default Create;












// "use client"
// import AiInputBox from '@/components/custom/AiInputBox'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Sparkles } from 'lucide-react'
// import React from 'react'
// import { Button } from '@/components/ui/button' // Import Button component
// import { useRouter } from 'next/navigation' // Import useRouter
// import { useMutation } from 'convex/react' // Import useMutation
// import { api } from '@/convex/_generated/api' // Import your Convex API
// import { useUserDetail } from '@/app/provider' // Import your custom user context

// const Create = () => {
//   const router = useRouter();
//   const createNewTemplate = useMutation(api.emailTemplates.createTemplate); // Your Convex mutation
//   const { userDetail, isAuthLoading } = useUserDetail(); // Get user details from your context

//   const handleStartFromScratch = async () => {
//     if (isAuthLoading) {
//       alert("Please wait while we load your user details.");
//       return;
//     }
//     if (!userDetail || !userDetail._id) {
//       alert("You must be logged in to create a template from scratch. Please sign in via the dashboard.");
//       router.push('/dashboard'); // Redirect to dashboard or home if not logged in
//       return;
//     }

//     try {
//       // Create a new empty template in Convex
//       const newTemplateId = await createNewTemplate({
//         userId: userDetail._id, // Link to the logged-in user
//         name: "Untitled Email Template", // Default name for new templates
//       });

//       console.log("New empty template created with ID:", newTemplateId);
//       // Redirect to the editor page with the newly generated ID
//       router.push(`/editor/${newTemplateId}`);
//     } catch (error) {
//       console.error("Failed to create new template from scratch:", error);
//       alert("Failed to create a new template. Please try again.");
//     }
//   };


//   return (
//     <div className='px-10 md:px-28 lg:px-64 xl:px-72 mt-20'>
//         <div className='flex items-center flex-col'>
//             <h2 className='font-bold text-3xl text-primary'>CREATE NEW EMAIL TEMPLATE</h2>
//             <p className='text-lg text-gray-400'>Effortlessly design and customize professional AI-powered email templates with ease</p>
//             <Tabs defaultValue="AI" className="w-[500px] mt-10">
//                 <TabsList>
//                     <TabsTrigger value="AI">Create with AI <Sparkles className='h-5 w-5 ml-2'/></TabsTrigger>
//                     <TabsTrigger value="SCRATCH">Start from Scratch</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="AI">
//                   <AiInputBox/>
//                 </TabsContent>
//                 <TabsContent value="SCRATCH" className="flex flex-col items-center justify-center p-8 border rounded-lg bg-gray-50">
//                   <p className="text-lg text-gray-700 mb-6 text-center">
//                     Ready to design from the ground up? <br/> Click the button below to start with a blank canvas.
//                   </p>
//                   <Button
//                     onClick={handleStartFromScratch}
//                     disabled={isAuthLoading} // Disable button while checking auth status
//                   >
//                     {isAuthLoading ? 'Loading...' : 'Start Designing'}
//                   </Button>
//                   {isAuthLoading && <p className="text-sm text-gray-500 mt-2">Checking login status...</p>}
//                 </TabsContent>
//             </Tabs>
//         </div>
//     </div>
//   )
// }

// export default Create;