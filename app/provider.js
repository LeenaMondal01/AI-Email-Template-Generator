"use client"
import React, {useContext, useEffect, useState } from 'react'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserDetailContext } from '@/context/UserDetailContext';
import { ScreenSizeContext } from '@/context/ScreenSizeContext';
import { DragDropLayoutContext } from '@/context/DragDropLayoutContext';
import { EmailTemplateContext } from '@/context/EmailTemplateContext';
import { SelectedElementContext } from '@/context/SelectedElementContext';

const Provider = ({children}) => {
    const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
    const [userDetail,setUserDetail] = useState();
    const [screenSize,setScreenSize] = useState('desktop');
    const [dragElementLayout,setDragElementLayout] = useState();
    const [emailTemplate,setEmailTemplate] = useState([]);
    const [selectedElement,setSelectedElement] = useState();
    const safeParseJSON = (raw, fallback) => {
      try {
        if (!raw || raw === 'undefined' || raw === 'null') return fallback;
        return JSON.parse(raw);
      } catch {
        return fallback;
      }
    };
    useEffect(() => {
      if(typeof window !== "undefined"){
        const storage = JSON.parse(localStorage.getItem('userDetail'));
        // const emailTemplateStorage = JSON.parse(localStorage.getItem('emailTemplate') ?? '{}');
        // emailTemplateStorage != undefined && setEmailTemplate(emailTemplateStorage??[]);
        const raw = localStorage.getItem("emailTemplate");
        const parsed = safeParseJSON(raw, []);
    setEmailTemplate(Array.isArray(parsed) ? parsed : []);
        if(!storage?.email || !storage){
          //redirect to home screen
        }
        else{
          setUserDetail(storage);
        }
      }
    },[])


    useEffect(() => {
      if(typeof window !== "undefined"){
        localStorage.setItem('emailTemplate',JSON.stringify(emailTemplate));
      }
    },[emailTemplate])

    useEffect(() => {
      if(selectedElement){
        let updatedEmailTemplate = [];
        emailTemplate.forEach((item,index) => {
          if(item?.id===selectedElement?.layout?.id){
            updatedEmailTemplate?.push(selectedElement?.layout);
          }
          else{
            updatedEmailTemplate?.push(item);
          }
        })
        setEmailTemplate(updatedEmailTemplate);
      }
    },[selectedElement])


  return (
    <ConvexProvider client={convex}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
            <ScreenSizeContext.Provider value={{screenSize,setScreenSize}}>
              <DragDropLayoutContext value={{dragElementLayout,setDragElementLayout}}>
                <EmailTemplateContext.Provider value={{emailTemplate,setEmailTemplate}}>
                  <SelectedElementContext.Provider value={{selectedElement,setSelectedElement}}>
                    <div>{children}</div>
                  </SelectedElementContext.Provider>
                </EmailTemplateContext.Provider>
              </DragDropLayoutContext>
            </ScreenSizeContext.Provider>
          </UserDetailContext.Provider>
        </GoogleOAuthProvider>
    </ConvexProvider>
    
  )
}

export default Provider;

export const useUserDetail = () => {
  return useContext(UserDetailContext);
}

export const useScreenSize = () => {
  return useContext(ScreenSizeContext);
}

export const useDragElementLayout = () => {
  return useContext(DragDropLayoutContext);
}

export const useEmailTemplate = () => {
  return useContext(EmailTemplateContext);
}

export const useSelectedElement = () => {
  return useContext(SelectedElementContext);
}