"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUserDetail } from '@/app/provider';
import { Button } from '@/components/ui/button';
import { Loader2, PencilLine } from 'lucide-react';
import { v4 as uuid4 } from 'uuid'; // Ensure you have 'npm install uuid' and 'npm install @types/uuid' if using TypeScript

const StartFromScratch = () => {
  const router = useRouter();
  // Using api.emailTemplate.createTemplate if that's the name you chose in your Convex file.
  // If your Convex mutation is named SaveTemplate, then it would be api.emailTemplate.SaveTemplate.
  const createNewTemplateMutation = useMutation(api.emailTemplate.createTemplate); // Make sure this matches your Convex function name
  
  const { userDetail, isAuthLoading } = useUserDetail();
  const [loading, setLoading] = React.useState(false); // Using React.useState explicitly for clarity

  const handleStart = async () => {
    if (isAuthLoading || loading) {
        alert("Please wait, checking login status and template creation status.");
        return;
    }
    // Check for userDetail.email as per your schema, or userDetail._id if you're using userId in schema
    if (!userDetail || !userDetail.email) { 
        alert("You must be logged in with a valid email to create a template. Please sign in via the header.");
        return;
    }

    setLoading(true);
    try {
        const newClientTid = uuid4(); 
        const newTemplateConvexId = await createNewTemplateMutation({
            tid: newClientTid, 
            design: [],            
            description: "",        
            email: userDetail.email, 
        });
        
        console.log("New blank template created with Convex ID:", newTemplateConvexId, "and client TID:", newClientTid);
        if (typeof window !== "undefined") {
            localStorage.setItem("emailTemplate", JSON.stringify([]));
        }
        
        // Navigate using the client-generated tid, which your editor page should then query by
        router.push(`/editor/${newClientTid}`); 

    } catch (error) {
        console.error("Failed to create new template from scratch:", error);
        alert("Failed to create a new template. Please try again: " + (error.message || error.toString()));
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-gray-50">
        <p className="text-lg text-gray-700 mb-6 text-center">
            Ready to design from the ground up? <br/> Start with a blank canvas.
        </p>
        <Button
            onClick={handleStart}
            disabled={loading || isAuthLoading} // Button disabled while loading or authenticating
        >
            {loading ? (
                <span className='flex gap-2 items-center'>
                    <Loader2 className='animate-spin' size={18} /> Please Wait...
                </span>
            ) : (
                <span className='flex gap-2 items-center'>
                    <PencilLine size={18} /> Start Designing
                </span>
            )}
        </Button>
        {(loading || isAuthLoading) && ( // Show loading text below button
            <p className="text-sm text-gray-500 mt-2">Creating template...</p>
        )}
    </div>
  );
};

export default StartFromScratch; // CRITICAL: Ensure this is a default export