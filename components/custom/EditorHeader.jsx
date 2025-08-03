// "use client"
// import Image from 'next/image'
// import React from 'react'
// import { Button } from '../ui/button'
// import { Code, Monitor, Smartphone } from 'lucide-react'
// import { useEmailTemplate, useScreenSize } from '@/app/provider'
// import { useMutation } from 'convex/react'
// import { useParams } from 'next/navigation'
// import { api } from '@/convex/_generated/api'
// import Link from 'next/link'
// import { toast } from 'sonner'

// const EditorHeader = ({viewHTMLCode}) => {
//   const {screenSize,setScreenSize} = useScreenSize();
//   const updateEmailTemplate = useMutation(api.emailTemplate.UpdateTemplateDesign);
//   const {templateId} = useParams();
//   const {emailTemplate,setEmailTemplate} = useEmailTemplate();
  
//   // const onSaveTemplate = async () => {
//   //   await updateEmailTemplate({
//   //     tid: templateId,
//   //     design: emailTemplate
//   //   })
//   //   toast('Email Template Saved Successfully!');
//   // }
//   function sanitize(obj) {
//   if (Array.isArray(obj)) {
//     return obj.map(sanitize);
//   } else if (obj !== null && typeof obj === 'object') {
//     return Object.fromEntries(
//       Object.entries(obj)
//         .filter(([key]) => !key.startsWith('$') && typeof obj[key] !== 'function')
//         .map(([key, value]) => [key, sanitize(value)])
//     );
//   }
//   return obj;
// }

// const onSaveTemplate = async () => {
//   try {
//     const cleanDesign = sanitize(emailTemplate); // Strip $$typeof and other invalid fields

//     await updateEmailTemplate({
//       tid: templateId,
//       design: cleanDesign
//     });

//     toast('Email Template Saved Successfully!');
//   } catch (error) {
//     console.error("Save failed:", error);
//     toast.error('Failed to save template');
//   }
// };

//   return (
//     <div className='p-4 shadow-sm flex justify-between items-center'>
//       <Link href={'/dashboard'}>
//         <Image src={'/logo2.png'} alt='logo' width={160} height={150}/>
//       </Link>
//       <div className='flex gap-3'>
//         <Button variant="ghost" onClick={() => setScreenSize('desktop')} 
//                 className={`${screenSize=='desktop' && 'bg-purple-100 text-primary'}`}><Monitor/>Desktop</Button>
//         <Button variant="ghost" onClick={() => setScreenSize('mobile')}  
//                 className={`${screenSize=='mobile' && 'bg-purple-100 text-primary'}`}><Smartphone/>Mobile</Button>
//       </div>
//       <div className='flex gap-3'>
//         <Button variant="ghost" className='hover:text-primary hover:bg-purple-100'
//                 onClick={() => viewHTMLCode(true)} >
//           <Code/>
//         </Button>
//         <Button variant="outline">Send Test Email</Button>
//         <Button onClick={onSaveTemplate}>Save Template</Button>
//       </div>
//     </div>
//   )
// }

// export default EditorHeader





"use client"
import Image from 'next/image'
import React, { useCallback } from 'react'
import { Button } from '../ui/button'
import { Code, Monitor, Smartphone, Download } from 'lucide-react'
import { useEmailTemplate, useScreenSize } from '@/app/provider'
import { useMutation } from 'convex/react'
import { useParams } from 'next/navigation'
import { api } from '@/convex/_generated/api'
import Link from 'next/link'
import { toast } from 'sonner'

const EditorHeader = ({viewHTMLCode, generateTemplateImage}) => {
  const {screenSize,setScreenSize} = useScreenSize();
  const updateEmailTemplate = useMutation(api.emailTemplate.UpdateTemplateDesign);
  const {templateId} = useParams();
  const {emailTemplate,setEmailTemplate} = useEmailTemplate();
  
  function sanitize(obj) {
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    } else if (obj !== null && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj)
          .filter(([key]) => !key.startsWith('$') && typeof obj[key] !== 'function')
          .map(([key, value]) => [key, sanitize(value)])
      );
    }
    return obj;
  }

  const onSaveTemplate = async () => {
    try {
      const cleanDesign = sanitize(emailTemplate); // Strip $$typeof and other invalid fields

      await updateEmailTemplate({
        tid: templateId,
        design: cleanDesign
      });

      toast('Email Template Saved Successfully!');
    } catch (error) {
      console.error("Save failed:", error);
      toast.error('Failed to save template');
    }
  };

  const handleExportImage = useCallback(async () => {
      try {
          await generateTemplateImage('png'); // Generate PNG image
          toast('Template image downloaded successfully!');
      } catch (error) {
          console.error('Error exporting image:', error);
          toast.error(`Failed to download image: ${error.message}`);
      }
  }, [generateTemplateImage]);

  return (
    <div className='p-4 shadow-sm flex justify-between items-center'>
      <Link href={'/dashboard'}>
        <Image src={'/logo2.png'} alt='logo' width={160} height={150}/>
      </Link>
      <div className='flex gap-3'>
        <Button variant="ghost" onClick={() => setScreenSize('desktop')} 
          className={`${screenSize=='desktop' && 'bg-purple-100 text-primary'}`}><Monitor/>Desktop</Button>
        <Button variant="ghost" onClick={() => setScreenSize('mobile')}  
          className={`${screenSize=='mobile' && 'bg-purple-100 text-primary'}`}><Smartphone/>Mobile</Button>
      </div>
      <div className='flex gap-3'>
        <Button variant="ghost" className='hover:text-primary hover:bg-purple-100'
          onClick={() => viewHTMLCode(true)} >
          <Code/>
        </Button>
        <Button variant="outline" onClick={handleExportImage}>
          <Download className='h-4 w-4 mr-2'/>Generate Image
        </Button>
        <Button onClick={onSaveTemplate}>Save Template</Button>
      </div>
    </div>
  )
}

export default EditorHeader