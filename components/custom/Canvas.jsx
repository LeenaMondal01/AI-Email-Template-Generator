"use client"
import { useDragElementLayout, useEmailTemplate, useScreenSize, useSelectedElement } from '@/app/provider';
import React, { useEffect, useRef, useState, useCallback } from 'react'
import ColumnLayout from '../LayoutElements/ColumnLayout';
import ViewHtmlDialog from './ViewHtmlDialog';

const Canvas = ({viewHTMLCode,closeDialog}) => {
    const htmlRef = useRef();
    const {screenSize} = useScreenSize();
    const {dragElementLayout,setDragElementLayout} = useDragElementLayout();
    const {emailTemplate,setEmailTemplate} = useEmailTemplate();
    const {setSelectedElement} = useSelectedElement();
    const [dragOver,setDragOver] = useState(false);
    const [htmlCode,setHtmlCode] = useState();

    const onDragOver = useCallback((e) => {
      e.preventDefault();
      setDragOver(true);
    }, []);

    const onDragLeave = useCallback(() => {
      setDragOver(false);
    }, []);

    const onDropHandle = useCallback(() => {
      setDragOver(false);
      if(dragElementLayout?.dragLayout){
        setEmailTemplate(prev => [...(Array.isArray(prev) ? prev : []), dragElementLayout?.dragLayout]);
      }
      setDragElementLayout(null);
    }, [dragElementLayout, setEmailTemplate, setDragElementLayout]);

    const getLayoutComponent = useCallback((layout) => {
      if(layout?.type === 'column'){
        return <ColumnLayout layout={layout}/>
      }
      return null;
    }, []);

    useEffect(() => {
      if (viewHTMLCode) {
        getHTMLCode();
      }
    },[viewHTMLCode]);

    const getHTMLCode = useCallback(() => {
      if(htmlRef.current){
        const htmlContent = htmlRef.current.innerHTML;
        const cleanedHtml = cleanEditorHtml(htmlContent);
        setHtmlCode(cleanedHtml);
      }
    }, []);

    const cleanEditorHtml = (html) => {
      let tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      tempDiv.querySelectorAll('[class*="border-dashed"]').forEach(el => {
          el.classList.remove('border', 'border-dashed', 'border-blue-500', 'border-4');
      });
      tempDiv.querySelectorAll('[class*="bg-purple-100"]').forEach(el => {
          el.classList.remove('bg-purple-100', 'p-4');
      });
      tempDiv.querySelectorAll('[class*="bg-green-200"]').forEach(el => {
          el.classList.remove('bg-green-200');
      });
      tempDiv.querySelectorAll('[class*="bg-gray-100.border.border-dashed"]').forEach(el => {
          el.classList.remove('bg-gray-100', 'border', 'border-dashed');
      });

      tempDiv.querySelectorAll('.absolute.group-hover\\:opacity-100, .absolute.-right-10').forEach(el => {
          el.remove();
      });

      tempDiv.querySelectorAll('[class*="border-blue-500"]').forEach(el => {
          el.classList.remove('border-blue-500', 'border-4');
      });
      
      tempDiv.querySelectorAll('[ondragover], [ondrop], [ondragleave], [onclick]').forEach(el => {
          el.removeAttribute('ondragover');
          el.removeAttribute('ondrop');
          el.removeAttribute('ondragleave');
          el.removeAttribute('onclick');
      });

      tempDiv.querySelectorAll('h2.p-4.text-center.bg-gray-100.border.border-dashed').forEach(el => {
          if (el.textContent.trim() === 'Add Layout Here') {
              el.remove();
          }
      });

      return tempDiv.innerHTML;
    };

    const handleCanvasClick = useCallback((e) => {
        if (htmlRef.current && e.target === htmlRef.current) {
            setSelectedElement(null); 
        }
    }, [setSelectedElement]);

  return (
    <div className='mt-20 flex justify-center'>
        <div 
          id="email-template-root"
          className={`transition-colors duration-200 bg-white p-6 w-full 
            ${screenSize === 'desktop' ? 'max-w-2xl' : 'max-w-md'}
            ${dragOver ? 'bg-blue-100 border-2 border-blue-400 rounded-lg' : 'border border-dashed border-gray-300'}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDropHandle}
          onClick={handleCanvasClick}
          ref={htmlRef}
        >
            {
              emailTemplate?.length > 0 ? emailTemplate?.map((layout,index) => (
                <div key={index}>
                  {getLayoutComponent(layout)}
                </div>
              )) :
              <h2 className='p-4 text-center text-gray-500'>Add Layout Here</h2>
            }
        </div>
        <ViewHtmlDialog openDialog={viewHTMLCode} htmlCode={htmlCode} closeDialog={closeDialog} />
    </div>
  );
};

export default Canvas;
