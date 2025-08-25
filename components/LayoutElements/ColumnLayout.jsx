"use client"
import { useDragElementLayout, useEmailTemplate, useSelectedElement } from '@/app/provider';
import React, { useState } from 'react'
import ButtonComponent from '../Element/ButtonComponent';
import TextComponent from '../Element/TextComponent';
import ImageComponent from '../Element/ImageComponent';
import LogoComponent from '../Element/LogoComponent';
import DividerComponent from '../Element/DividerComponent';
import LogoHeaderComponent from '../Element/LogoHeaderComponent';
import SocialIconsComponent from '../Element/SocialIconsComponent';
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';

const ColumnLayout = ({layout}) => {
    const [dragOver,setDragOver] = useState();
    const {emailTemplate,setEmailTemplate} = useEmailTemplate();
    const {dragElementLayout,setDragElementLayout} = useDragElementLayout();
    const {selectedElement,setSelectedElement} = useSelectedElement();
    const onDragOverHandle = (event,index) => {
        event.preventDefault();
        setDragOver({
            index: index,
            columnId: layout?.id
        })
    }

    const onDropHandle = () => {
        const index = dragOver.index;
        setEmailTemplate(prevItem => 
            prevItem?.map(col => col.id === layout?.id ? {...col,[index] : dragElementLayout?.dragElement} : col)
        )
        console.log(emailTemplate);
        setDragOver(null);
    }

    const getElementComponent = (element) => {
       console.log(element);
       if(element?.type == 'Button'){
        return <ButtonComponent {...element}/>
       }
       else if(element?.type == 'Text'){
        return <TextComponent {...element}/>
       }
       else if(element?.type == 'Image'){
        return <ImageComponent {...element}/>
       }
       else if(element?.type == 'Logo'){
        return <LogoComponent {...element}/>
       }
       else if(element?.type == 'LogoHeader'){
        return <LogoHeaderComponent {...element}/>
       }
       else if(element?.type == 'Divider'){
        return <DividerComponent {...element}/>
       }
       else if(element?.type == 'SocialIcons'){
        return <SocialIconsComponent {...element}/>
       }
    }

    const deleteLayout = (layoutId) => {
        const updatedEmailTemplate = emailTemplate?.filter(item => item.id !=layoutId);
        setEmailTemplate(updatedEmailTemplate);
        setSelectedElement(null);
    }

    const moveItemUp = (layoutId) => {
        const index = emailTemplate.findIndex((item) => item?.id === layoutId);
        if(index>0){
            setEmailTemplate((prevItems) => {
                const updatedItems = [...prevItems];
                //swap the current item with the one above it
                [updatedItems[index],updatedItems[index-1]] = [updatedItems[index-1],updatedItems[index]];
                return updatedItems;
            })
        }
    }

    const moveItemDown = (layoutId) => {
        const index = emailTemplate.findIndex((item) => item?.id === layoutId);
        if(index>=0){
            setEmailTemplate((prevItems) => {
                const updatedItems = [...prevItems];
                //swap the current item with the one below it
                [updatedItems[index],updatedItems[index+1]] = [updatedItems[index+1],updatedItems[index]];
                return updatedItems;
            })
        }
    }

  return (
    <div className='relative'>
        <div style={{display:'grid',gridTemplateColumns:`repeat(${layout?.numOfCol},1fr)`,gap:'0px'}}
            className={`${selectedElement?.layout?.id == layout?.id && 'border border-dashed border-blue-500'}`} >
            {Array.from({length : layout?.numOfCol}).map((_,index) => (
                <div key={index} className={`p-0 flex items-center h-full w-full bg-white cursor-pointer 
                    ${!layout?.[index]?.type && 'bg-gray-100 border border-dashed'}  justify-center
                    ${(index == dragOver?.index && dragOver?.columnId) && 'bg-green-500'}
                    ${(selectedElement?.layout?.id==layout?.id && selectedElement?.index==index) && 'border-blue-500 border-4'}`}
                onDragOver={(event) => onDragOverHandle(event,index)}
                onDrop={onDropHandle}
                onClick={() => setSelectedElement({layout:layout,index:index})}
                >
                    {getElementComponent(layout?.[index]) ?? 'Drag Element Here'}
                </div>
            ))}
            {
                selectedElement?.layout?.id == layout?.id && 
                <div className='absolute -right-10 gap-2 flex-col'>
                    <div className='bg-purple-100 p-2 rounded-full cursor-pointer hover:scale-105 transition-all hover:shadow-md' 
                        onClick={() => deleteLayout(layout?.id)}>
                        <Trash2 className='h-4 w-4 text-red-500' />
                    </div>
                    <div className='bg-gray-100 p-2 rounded-full cursor-pointer hover:scale-105 transition-all hover:shadow-md'
                        onClick={() => moveItemUp(layout.id)}>
                        <ArrowUp className='h-4 w-4' />
                    </div>
                    <div className='bg-gray-100 p-2 rounded-full cursor-pointer hover:scale-105 transition-all hover:shadow-md'
                        onClick={() => moveItemDown(layout.id)}>
                        <ArrowDown className='h-4 w-4' />
                    </div>
                </div>
            }
        </div>
    </div>
  )
}

export default ColumnLayout