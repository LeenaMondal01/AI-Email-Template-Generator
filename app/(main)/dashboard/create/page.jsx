"use client" 
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sparkles } from 'lucide-react'
import React from 'react'
import dynamic from 'next/dynamic';
import { motion } from "framer-motion";

// Dynamically import AiInputBox and StartFromScratch
// This ensures they are loaded on the client side and not treated as server components
const AiInputBox = dynamic(() => import('@/components/custom/AiInputBox'), { ssr: false });
const StartFromScratch = dynamic(() => import('@/components/custom/StartFromScratch'), { ssr: false });

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
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <AiInputBox />
                  </motion.div>
                </TabsContent>

                <TabsContent value="SCRATCH">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <StartFromScratch />
                  </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    </div>
  )
}

export default Create;