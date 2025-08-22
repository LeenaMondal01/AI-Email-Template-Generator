// "use client"
// import { useDragElementLayout, useEmailTemplate, useScreenSize } from '@/app/provider';
// import React, { useEffect, useRef, useState } from 'react'
// import ColumnLayout from '../LayoutElements/ColumnLayout';
// import ViewHtmlDialog from './ViewHtmlDialog';

// const Canvas = ({viewHTMLCode,closeDialog}) => {
//     const htmlRef = useRef();
//     const {screenSize,setScreenSize} = useScreenSize();
//     const {dragElementLayout,setDragElementLayout} = useDragElementLayout();
//     const {emailTemplate,setEmailTemplate} = useEmailTemplate();
//     const [dragOver,setDragOver] = useState(false);
//     const [htmlCode,setHtmlCode] = useState();

//     const onDragOver = (e) => {
//       e.preventDefault();
//       setDragOver(true);
//       //console.log("over")
//     }
//     const onDropHandle = () => {
//       setDragOver(false);
//       if(dragElementLayout?.dragLayout){
//         setEmailTemplate(prev => [...(Array.isArray(prev) ? prev:[]),dragElementLayout?.dragLayout]);      //(Array.isArray(prev) ? prev:[])
//       }
//     }
    
//     const getLayoutComponent = (layout) => {
//       if(layout?.type == 'column'){
//         return <ColumnLayout layout={layout}/>
//       }
//     }

//     useEffect(() => {
//       viewHTMLCode && getHTMLCode()
//     },[viewHTMLCode])

//     const getHTMLCode = () => {
//       if(htmlRef.current){
//         const htmlContennt = htmlRef.current.innerHTML;
//         //console.log(htmlContennt);
//         setHtmlCode(htmlContennt);
//       }
//     }

//   return (
//     <div className='mt-20 flex justify-center'>
//         <div className={`bg-white p-6 w-full 
//           ${screenSize == 'desktop' ? 'max-w-2xl' : 'max-w-md'} 
//           ${dragOver && 'bg-purple-100 p-4'}`} 
//           onDragOver={onDragOver} onDrop={() => onDropHandle()} ref={htmlRef}>
//             {
//               emailTemplate?.length>0 ? emailTemplate?.map((layout,index) => (
//                 <div key={index}>
//                   {getLayoutComponent(layout)}
//                 </div>
//               )) : 
//               <h2 className='p-4 text-center bg-gray-100 border border-dashed'>Add Layout Here</h2>
//             }
//         </div>
//         <ViewHtmlDialog openDialog={viewHTMLCode} htmlCode={htmlCode} closeDialog={closeDialog} />
//     </div>
//   )
// }

// export default Canvas





"use client"
import { useDragElementLayout, useEmailTemplate, useScreenSize, useSelectedElement } from '@/app/provider'; // Import useSelectedElement
import React, { useEffect, useRef, useState, useCallback } from 'react' // Import useCallback
import ColumnLayout from '../LayoutElements/ColumnLayout';
import ViewHtmlDialog from './ViewHtmlDialog';

const Canvas = ({viewHTMLCode,closeDialog}) => {
    const htmlRef = useRef();
    const {screenSize,setScreenSize} = useScreenSize();
    const {dragElementLayout,setDragElementLayout} = useDragElementLayout();
    const {emailTemplate,setEmailTemplate} = useEmailTemplate();
    const {selectedElement,setSelectedElement} = useSelectedElement(); // Get setSelectedElement
    const [dragOver,setDragOver] = useState(false);
    const [htmlCode,setHtmlCode] = useState();

    const onDragOver = useCallback((e) => {
      e.preventDefault();
      setDragOver(true);
    }, []);

    const onDropHandle = useCallback(() => {
      setDragOver(false);
      if(dragElementLayout?.dragLayout){
        // Ensure prev is an array and then spread it to create a new array
        setEmailTemplate(prev => [...(Array.isArray(prev) ? prev : []), dragElementLayout?.dragLayout]);
      }
      setDragElementLayout(null); // Clear dragElementLayout after drop
    }, [dragElementLayout, setEmailTemplate, setDragElementLayout]);


    const getLayoutComponent = useCallback((layout) => {
      if(layout?.type === 'column'){ // Use strict equality
        return <ColumnLayout layout={layout}/>
      }
      return null; // Return null if layout type doesn't match
    }, []);

    useEffect(() => {
      if (viewHTMLCode) { // Only call getHTMLCode if dialog is open
        getHTMLCode();
      }
    },[viewHTMLCode]); // Depend on viewHTMLCode


    const getHTMLCode = useCallback(() => {
      if(htmlRef.current){
        const htmlContent = htmlRef.current.innerHTML;
        const cleanedHtml = cleanEditorHtml(htmlContent); // Call a new helper function
        setHtmlCode(cleanedHtml);
      }
    }, []);

    // Helper function to clean the editor-specific HTML
    const cleanEditorHtml = (html) => {
      let tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // Remove specific editor classes
      tempDiv.querySelectorAll('[class*="border-dashed"]').forEach(el => {
          el.classList.remove('border', 'border-dashed', 'border-blue-500', 'border-4');
      });
      tempDiv.querySelectorAll('[class*="bg-purple-100"]').forEach(el => {
          el.classList.remove('bg-purple-100', 'p-4');
      });
      tempDiv.querySelectorAll('[class*="bg-green-200"]').forEach(el => { // Remove drag-over highlight
          el.classList.remove('bg-green-200');
      });
      tempDiv.querySelectorAll('[class*="bg-gray-100.border.border-dashed"]').forEach(el => {
          // This removes "Add Layout Here" default background and border for empty columns
          el.classList.remove('bg-gray-100', 'border', 'border-dashed');
      });

      // Remove the control buttons div
      tempDiv.querySelectorAll('.absolute.group-hover\\:opacity-100, .absolute.-right-10').forEach(el => {
          el.remove();
      });

      // Remove selectedElement class from all elements
      tempDiv.querySelectorAll('[class*="border-blue-500"]').forEach(el => {
          el.classList.remove('border-blue-500', 'border-4');
      });
      
      // Remove specific attributes related to editor functionality
      tempDiv.querySelectorAll('[ondragover], [ondrop], [ondragleave], [onclick]').forEach(el => {
          el.removeAttribute('ondragover');
          el.removeAttribute('ondrop');
          el.removeAttribute('ondragleave');
          el.removeAttribute('onclick');
          // You might need to remove other data-attributes or event handlers if any
      });


      // Remove the "Add Layout Here" text if it's still present in a div
      tempDiv.querySelectorAll('h2.p-4.text-center.bg-gray-100.border.border-dashed').forEach(el => {
          if (el.textContent.trim() === 'Add Layout Here') {
              el.remove();
          }
      });


      return tempDiv.innerHTML;
    };


    // Handler for clicks on the canvas background
    const handleCanvasClick = useCallback((e) => {
        if (htmlRef.current && e.target === htmlRef.current) {
            setSelectedElement(null); 
        }
        
    }, [setSelectedElement]);


  return (
    <div className='mt-20 flex justify-center'>
        <div className={`bg-white p-6 w-full ${screenSize === 'desktop' ? 'max-w-2xl' : 'max-w-md'}
          ${dragOver ? 'bg-purple-100 p-4' : ''}`}
          onDragOver={onDragOver}
          onDrop={onDropHandle}
          onClick={handleCanvasClick} // Add the click handler here
          ref={htmlRef}>
            {
              emailTemplate?.length > 0 ? emailTemplate?.map((layout,index) => (
                <div key={index}>
                  {getLayoutComponent(layout)}
                </div>
              )) :
              <h2 className='p-4 text-center bg-gray-100 border border-dashed'>Add Layout Here</h2>
            }
        </div>
        <ViewHtmlDialog openDialog={viewHTMLCode} htmlCode={htmlCode} closeDialog={closeDialog} />
    </div>
  );
};

export default Canvas;






// // components/Canvas.jsx
// "use client"
// import { useDragElementLayout, useEmailTemplate, useScreenSize, useSelectedElement } from '@/app/provider';
// import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
// import ColumnLayout from '../LayoutElements/ColumnLayout';
// import ViewHtmlDialog from './ViewHtmlDialog';
// import * as htmlToImage from 'html-to-image';

// const Canvas = forwardRef(({ viewHTMLCode, closeDialog }, ref) => {
//     const htmlContentRef = useRef();
//     const { screenSize, setScreenSize } = useScreenSize();
//     const { dragElementLayout, setDragElementLayout } = useDragElementLayout();
//     const { emailTemplate, setEmailTemplate } = useEmailTemplate();
//     const { selectedElement, setSelectedElement } = useSelectedElement();
//     const [dragOver, setDragOver] = useState(false);
//     const [htmlCode, setHtmlCode] = useState('');

//     const onDragOver = useCallback((e) => {
//       e.preventDefault();
//       setDragOver(true);
//     }, []);

//     const onDropHandle = useCallback(() => {
//       setDragOver(false);
//       if(dragElementLayout?.dragLayout){
//         setEmailTemplate(prev => [...(Array.isArray(prev) ? prev : []), dragElementLayout?.dragLayout]);
//       }
//       setDragElementLayout(null);
//     }, [dragElementLayout, setEmailTemplate, setDragElementLayout]);

//     const onDragLeave = useCallback(() => {
//         setDragOver(false);
//     }, []);

//     const getLayoutComponent = useCallback((layout) => {
//       if(layout?.type === 'column'){
//         return <ColumnLayout layout={layout}/>
//       }
//       return null;
//     }, []);

//     const cleanEditorHtml = useCallback((html) => {
//       let tempDiv = document.createElement('div');
//       tempDiv.innerHTML = html;

//       tempDiv.querySelectorAll('[class*="border-dashed"]').forEach(el => {
//           el.classList.remove('border', 'border-dashed', 'border-blue-500', 'border-4');
//       });
//       tempDiv.querySelectorAll('[class*="bg-purple-100"]').forEach(el => {
//           el.classList.remove('bg-purple-100', 'p-4');
//       });
//       tempDiv.querySelectorAll('[class*="bg-green-200"]').forEach(el => {
//           el.classList.remove('bg-green-200');
//       });
//       tempDiv.querySelectorAll('[class*="bg-gray-100.border.border-dashed"]').forEach(el => {
//           el.classList.remove('bg-gray-100', 'border', 'border-dashed');
//       });

//       tempDiv.querySelectorAll('.absolute.group-hover\\:opacity-100, .absolute.-right-10').forEach(el => {
//           el.remove();
//       });

//       tempDiv.querySelectorAll('[class*="border-blue-500"]').forEach(el => {
//           el.classList.remove('border-blue-500', 'border-4');
//       });
      
//       tempDiv.querySelectorAll('[ondragover], [ondrop], [ondragleave], [onclick]').forEach(el => {
//           el.removeAttribute('ondragover');
//           el.removeAttribute('ondrop');
//           el.removeAttribute('ondragleave');
//           el.removeAttribute('onclick');
//       });

//       tempDiv.querySelectorAll('h2.p-4.text-center.bg-gray-100.border.border-dashed').forEach(el => {
//           if (el.textContent.trim() === 'Add Layout Here') {
//               el.remove();
//           }
//       });
//         tempDiv.querySelectorAll('[data-selectable-element]').forEach(el => {
//             el.removeAttribute('data-selectable-element');
//         });
//         tempDiv.querySelectorAll('[data-slot], [data-size]').forEach(el => {
//             el.removeAttribute('data-slot');
//             el.removeAttribute('data-size');
//         });
        
//         tempDiv.querySelectorAll('[style]').forEach(el => {
//           if (el.style.backgroundColor === 'rgb(234, 242, 255)') {
//             el.style.backgroundColor = '';
//           }
//         });

//       return tempDiv.innerHTML;
//     }, []);

//     const getHTMLCodeForDialog = useCallback(() => {
//       if(htmlContentRef.current){
//         const htmlContent = htmlContentRef.current.innerHTML;
//         const cleanedHtml = cleanEditorHtml(htmlContent);
//         setHtmlCode(cleanedHtml);
//       }
//     }, [cleanEditorHtml]);

//     useEffect(() => {
//       if (viewHTMLCode) {
//         getHTMLCodeForDialog();
//       }
//     },[viewHTMLCode, getHTMLCodeForDialog]);

//     const generateTemplateImage = useCallback(async (format = 'png') => {
//         if (!htmlContentRef.current) {
//             console.error("Canvas ref not available for image generation.");
//             throw new Error("Canvas content not ready for image export.");
//         }

//         const node = htmlContentRef.current;
//         let dataUrl = null;
        
//         const originalInnerHtml = node.innerHTML;
//         const originalStyle = node.getAttribute('style'); 

//         try {
//             node.innerHTML = cleanEditorHtml(originalInnerHtml);
            
//             if (format === 'png') {
//                 dataUrl = await htmlToImage.toPng(node);
//             } else if (format === 'jpeg') {
//                 dataUrl = await htmlToImage.toJpeg(node, { quality: 0.95 });
//             } else {
//                 throw new Error("Unsupported image format. Use 'png' or 'jpeg'.");
//             }

//             node.innerHTML = originalInnerHtml;
//             if (originalStyle) {
//                 node.setAttribute('style', originalStyle);
//             } else {
//                 node.removeAttribute('style');
//             }
            
//             const link = document.createElement('a');
//             link.download = `mailcraft-template.${format}`;
//             link.href = dataUrl;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);

//             return dataUrl;
//         } catch (error) {
//             console.error('Error generating image:', error);
//             if (node) {
//                  node.innerHTML = originalInnerHtml;
//                  if (originalStyle) {
//                     node.setAttribute('style', originalStyle);
//                  } else {
//                     node.removeAttribute('style');
//                  }
//             }
//             throw new Error(`Failed to generate ${format} image: ${error.message || ''}`);
//         }
//     }, [cleanEditorHtml]);

//     useImperativeHandle(ref, () => ({
//         getCleanedHtml: () => {
//             if (htmlContentRef.current) {
//                 return cleanEditorHtml(htmlContentRef.current.innerHTML);
//             }
//             return '';
//         },
//         generateTemplateImage: generateTemplateImage,
//     }));

//     const handleCanvasClick = useCallback((e) => {
//         if (e.target === htmlContentRef.current) {
//             setSelectedElement(null);
//         }
//     }, [setSelectedElement]);

//   return (
//     <div className='mt-20 flex justify-center'>
//         <div className={`bg-white p-6 w-full ${screenSize === 'desktop' ? 'max-w-2xl' : 'max-w-md'}
//           ${dragOver ? 'bg-purple-100 p-4' : ''}`}
//           onDragOver={onDragOver}
//           onDrop={onDropHandle}
//           onDragLeave={onDragLeave}
//           onClick={handleCanvasClick}
//           ref={htmlContentRef}>
//             {
//               emailTemplate?.length > 0 ? emailTemplate?.map((layout,index) => (
//                 <div key={index} data-layout-id={layout.id}>
//                   {getLayoutComponent(layout)}
//                 </div>
//               )) :
//               <h2 className='p-4 text-center bg-gray-100 border border-dashed'>Add Layout Here</h2>
//             }
//         </div>
//         <ViewHtmlDialog openDialog={viewHTMLCode} htmlCode={htmlCode} closeDialog={closeDialog} />
//     </div>
//   );
// });

// export default Canvas;







// components/Canvas.jsx
// "use client"
// import { useDragElementLayout, useEmailTemplate, useScreenSize, useSelectedElement } from '@/app/provider';
// import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
// import ColumnLayout from '../LayoutElements/ColumnLayout';
// import ViewHtmlDialog from './ViewHtmlDialog';
// import * as htmlToImage from 'html-to-image';

// const Canvas = forwardRef(({ viewHTMLCode, closeDialog }, ref) => {
//     const htmlRef = useRef();
//     const { screenSize, setScreenSize } = useScreenSize();
//     const { dragElementLayout, setDragElementLayout } = useDragElementLayout();
//     const { emailTemplate, setEmailTemplate } = useEmailTemplate();
//     const { selectedElement, setSelectedElement } = useSelectedElement();
//     const [dragOver, setDragOver] = useState(false);
//     const [htmlCode, setHtmlCode] = useState('');

//     const onDragOver = useCallback((e) => {
//       e.preventDefault();
//       setDragOver(true);
//     }, []);

//     const onDropHandle = useCallback(() => {
//       setDragOver(false);
//       if(dragElementLayout?.dragLayout){
//         setEmailTemplate(prev => [...(Array.isArray(prev) ? prev : []), dragElementLayout?.dragLayout]);
//       }
//       setDragElementLayout(null);
//     }, [dragElementLayout, setEmailTemplate, setDragElementLayout]);

//     const onDragLeave = useCallback(() => {
//         setDragOver(false);
//     }, []);

//     const getLayoutComponent = useCallback((layout) => {
//       if(layout?.type === 'column'){
//         return <ColumnLayout layout={layout}/>
//       }
//       return null;
//     }, []);

//     const cleanEditorHtml = useCallback((html) => {
//       let tempDiv = document.createElement('div');
//       tempDiv.innerHTML = html;

//       tempDiv.querySelectorAll('[class*="border-dashed"]').forEach(el => {
//           el.classList.remove('border', 'border-dashed', 'border-blue-500', 'border-4');
//       });
//       tempDiv.querySelectorAll('[class*="bg-purple-100"]').forEach(el => {
//           el.classList.remove('bg-purple-100', 'p-4');
//       });
//       tempDiv.querySelectorAll('[class*="bg-green-200"]').forEach(el => {
//           el.classList.remove('bg-green-200');
//       });
//       tempDiv.querySelectorAll('[class*="bg-gray-100.border.border-dashed"]').forEach(el => {
//           el.classList.remove('bg-gray-100', 'border', 'border-dashed');
//       });

//       tempDiv.querySelectorAll('.absolute.group-hover\\:opacity-100, .absolute.-right-10').forEach(el => {
//           el.remove();
//       });

//       tempDiv.querySelectorAll('[class*="border-blue-500"]').forEach(el => {
//           el.classList.remove('border-blue-500', 'border-4');
//       });
      
//       tempDiv.querySelectorAll('[ondragover], [ondrop], [ondragleave], [onclick]').forEach(el => {
//           el.removeAttribute('ondragover');
//           el.removeAttribute('ondrop');
//           el.removeAttribute('ondragleave');
//           el.removeAttribute('onclick');
//       });

//       tempDiv.querySelectorAll('h2.p-4.text-center.bg-gray-100.border.border-dashed').forEach(el => {
//           if (el.textContent.trim() === 'Add Layout Here') {
//               el.remove();
//           }
//       });
//         tempDiv.querySelectorAll('[data-selectable-element]').forEach(el => {
//             el.removeAttribute('data-selectable-element');
//         });
//         tempDiv.querySelectorAll('[data-slot], [data-size]').forEach(el => {
//             el.removeAttribute('data-slot');
//             el.removeAttribute('data-size');
//         });
        
//         tempDiv.querySelectorAll('[style]').forEach(el => {
//           if (el.style.backgroundColor === 'rgb(234, 242, 255)') {
//             el.style.backgroundColor = '';
//           }
//         });

//       return tempDiv.innerHTML;
//     }, []);

//     const getHTMLCodeForDialog = useCallback(() => {
//       if(htmlRef.current){
//         const htmlContent = htmlRef.current.innerHTML;
//         const cleanedHtml = cleanEditorHtml(htmlContent);
//         setHtmlCode(cleanedHtml);
//       }
//     }, [cleanEditorHtml]);

//     useEffect(() => {
//       if (viewHTMLCode) {
//         getHTMLCodeForDialog();
//       }
//     },[viewHTMLCode, getHTMLCodeForDialog]);

//     const generateTemplateImage = useCallback(async (format = 'png') => {
//         if (!htmlRef.current) {
//             console.error("Canvas ref not available for image generation.");
//             throw new Error("Canvas content not ready for image export.");
//         }

//         const node = htmlRef.current;
//         let dataUrl = null;
        
//         // Save original state before modification
//         const originalInnerHtml = node.innerHTML;
//         const originalStyle = node.getAttribute('style'); 

//         try {
//             // Apply cleaning to the live DOM before capture
//             node.innerHTML = cleanEditorHtml(originalInnerHtml);

//             // Temporarily set specific styles for better image output, if needed
//             // Example: node.style.width = '600px'; 
//             // Example: node.style.backgroundColor = 'white'; 

//             if (format === 'png') {
//                 dataUrl = await htmlToImage.toPng(node);
//             } else if (format === 'jpeg') {
//                 dataUrl = await htmlToImage.toJpeg(node, { quality: 0.95 });
//             } else {
//                 throw new Error("Unsupported image format. Use 'png' or 'jpeg'.");
//             }

//             // Restore original state after capture
//             node.innerHTML = originalInnerHtml;
//             if (originalStyle) {
//                 node.setAttribute('style', originalStyle);
//             } else {
//                 node.removeAttribute('style');
//             }
            
//             // Trigger download
//             const link = document.createElement('a');
//             link.download = `mailcraft-template.${format}`;
//             link.href = dataUrl;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);

//             return dataUrl;
//         } catch (error) {
//             console.error('Error generating image:', error);
//             // Ensure restoration happens even on error
//             if (node) {
//                  node.innerHTML = originalInnerHtml;
//                  if (originalStyle) {
//                     node.setAttribute('style', originalStyle);
//                  } else {
//                     node.removeAttribute('style');
//                  }
//             }
//             throw new Error(`Failed to generate ${format} image: ${error.message || ''}`);
//         }
//     }, [cleanEditorHtml]);

//     useImperativeHandle(ref, () => ({
//         getCleanedHtml: () => {
//             if (htmlRef.current) {
//                 return cleanEditorHtml(htmlRef.current.innerHTML);
//             }
//             return '';
//         },
//         generateTemplateImage: generateTemplateImage,
//     }));

//     const handleCanvasClick = useCallback((e) => {
//         if (e.target === htmlRef.current) {
//             setSelectedElement(null);
//         }
//     }, [setSelectedElement]);

//   return (
//     <div className='mt-20 flex justify-center'>
//         <div className={`bg-white p-6 w-full ${screenSize === 'desktop' ? 'max-w-2xl' : 'max-w-md'}
//           ${dragOver ? 'bg-purple-100 p-4' : ''}`}
//           onDragOver={onDragOver}
//           onDrop={onDropHandle}
//           onDragLeave={onDragLeave}
//           onClick={handleCanvasClick}
//           ref={htmlRef}>
//             {
//               emailTemplate?.length > 0 ? emailTemplate?.map((layout,index) => (
//                 <div key={index} data-layout-id={layout.id}>
//                   {getLayoutComponent(layout)}
//                 </div>
//               )) :
//               <h2 className='p-4 text-center bg-gray-100 border border-dashed'>Add Layout Here</h2>
//             }
//         </div>
//         <ViewHtmlDialog openDialog={viewHTMLCode} htmlCode={htmlCode} closeDialog={closeDialog} />
//     </div>
//   );
// });

// export default Canvas;