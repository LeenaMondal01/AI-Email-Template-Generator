"use client"
import Image from 'next/image'
import React, { useEffect, useState, useCallback } from 'react'
import { Button } from '../ui/button'
import { Code, Monitor, Smartphone, Download } from 'lucide-react'
import { useEmailTemplate, useScreenSize } from '@/app/provider'
import { useMutation, useConvex } from 'convex/react'
import { useParams } from 'next/navigation'
import { api } from '@/convex/_generated/api'
import Link from 'next/link'
import { toast } from 'sonner'
import * as htmlToImage from 'html-to-image';
import SaveTemplateModal from './SaveTemplateModal';
import { useRouter } from "next/navigation";

const EditorHeader = ({ viewHTMLCode, htmlCode }) => {
  const { screenSize, setScreenSize } = useScreenSize();
  const updateEmailTemplate = useMutation(api.emailTemplate.UpdateTemplateDesign);
  const updateTemplateDescription = useMutation(api.emailTemplate.UpdateTemplateDescription);
  const convex = useConvex();

  const { templateId } = useParams();
  const { emailTemplate } = useEmailTemplate();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentName, setCurrentName] = useState("");
  const router = useRouter();


  // --- sanitize stays the same ---
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

  // Fetch existing description once (or whenever templateId/user changes)
  useEffect(() => {
    const load = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("userDetail") || "{}");
        if (!user?.email || !templateId) return;
        const doc = await convex.query(api.emailTemplate.GetTemplateDesign, {
          tid: templateId,
          email: user.email
        });
        setCurrentName(doc?.description || "");
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [convex, templateId]);

  const handleSaveClick = () => {
    setModalOpen(true);
  };

  const onSaveTemplate = useCallback(async (nameFromModal) => {
    try {
      const user = JSON.parse(localStorage.getItem("userDetail") || "{}");
      if (!user?.email) {
        toast.error("Please sign in first.");
        return;
      }

      const cleanDesign = sanitize(emailTemplate);

      const templateElement = document.getElementById("email-template-root");
      let previewImage = null;
      if (templateElement) {
      try {
        const canvas = await htmlToImage.toCanvas(templateElement, {
          cacheBust: true,
          backgroundColor: "#ffffff",
        });

        // Compress to JPEG (smaller than PNG)
        previewImage = canvas.toDataURL("image/jpeg", 0.6);
        

      } catch (err) {
        console.warn("Preview image generation failed:", err);
      }
    }

      // 1) Save design
      await updateEmailTemplate({
        tid: templateId,
        design: cleanDesign,
        photo: previewImage,
      });

      // 2) Save/Update name
      await updateTemplateDescription({
        tid: templateId,
        email: user.email,
        description: nameFromModal
      });

      setCurrentName(nameFromModal); // reflect in UI
      toast.success('Email Template Saved Successfully!');
      router.push("/dashboard");
      } catch (error) {
        console.error("Save failed:", error);
        toast.error('Failed to save template');
      }
    }, [emailTemplate, templateId, updateEmailTemplate, updateTemplateDescription]);

  // Replaced html2canvas with html-to-image
  const handleExportImage = async () => {
    try {
      const templateElement = document.getElementById('email-template-root');
      if (!templateElement) {
        toast.error('Template element not found!');
        return;
      }

      const dataUrl = await htmlToImage.toPng(templateElement, {
        cacheBust: true,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'email-template.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Template image downloaded successfully!');
    } catch (error) {
      console.error('Error exporting image:', error);
      toast.error(`Failed to download image: ${error.message}`);
    }
  };

  return (
    <div className='p-4 shadow-sm flex justify-between items-center'>
      <Link href={'/dashboard'}>
        <Image src={'/logo2.png'} alt='logo' width={160} height={150} />
      </Link>
      <div className='flex gap-3'>
        <Button variant="ghost" onClick={() => setScreenSize('desktop')}
          className={`${screenSize == 'desktop' && 'bg-purple-100 text-primary'}`}>
          <Monitor />Desktop
        </Button>
        <Button variant="ghost" onClick={() => setScreenSize('mobile')}
          className={`${screenSize == 'mobile' && 'bg-purple-100 text-primary'}`}>
          <Smartphone />Mobile
        </Button>
      </div>
      <div className='flex gap-3'>
        <Button variant="ghost" className='hover:text-primary hover:bg-purple-100'
          onClick={() => viewHTMLCode(true)} >
          <Code />
        </Button>
        <Button variant="outline" onClick={handleExportImage}>
          <Download className='h-4 w-4 mr-2' />Generate Image
        </Button>
        <Button onClick={handleSaveClick}>Save Template</Button>
      </div>

      {/* Modal */}
      <SaveTemplateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={onSaveTemplate}
        initialName={currentName}  // <- prefill if exists
      />
    </div>
  )
}

export default EditorHeader
