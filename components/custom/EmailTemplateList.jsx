import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import Link from 'next/link';
import { useConvex, useMutation } from 'convex/react';
import { useUserDetail } from '@/app/provider';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';

const EmailTemplateList = () => {
    const [emailList,setEmailList] = useState([]);
    const convex = useConvex();
    const {userDetail,setUserDetail} = useUserDetail();
    const deleteTemplate = useMutation(api.emailTemplate.DeleteTemplate);

    useEffect(() => {
      userDetail && GetTemplateList();
    },[userDetail])

    const handleDelete = async (tid) => {
        try {
          await deleteTemplate({ tid, email: userDetail?.email });
          toast.success("Template deleted successfully!");
          GetTemplateList(); // refresh after delete
        } catch (error) {
          console.error("Error deleting template:", error);
          toast.error("Failed to delete template. Please try again.");
        }
    };

    const GetTemplateList = async () => {
      const result = await convex.query(api.emailTemplate.GetAllUserTemplate,{
        email: userDetail?.email
      })
      console.log(result);
      setEmailList(result);
    }
  return (
    <div>
        <h2 className='font-bold text-xl text-primary mt-6'>Workspace</h2>
        {
            emailList?.length==0 ? 
                <div className='flex justify-center mt-7 flex-col items-center '>
                    <Image src={'/email.png'} alt='email' height={250} width={250}/>
                    <Link href={'/dashboard/create'}>
                      <Button className='mt-7'>+ Create New</Button>
                    </Link>
                </div> 
                :
                <div className='grid grid-cols-2 md:grid=cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5'>
                  {
                    emailList?.map((item,index) => (
                      <div key={index} className='p-5 rounded-lg shadow-md border flex flex-col justify-between object-cover'>
                        <Image src={item.photo || '/emailbox.png'} alt='email' width={200} height={200} className='w-full'/>
                        <h2 className='mt-2'>{item?.description || "Untitled Template"}</h2>
                        {/* <Link href={'/editor/'+item.tid}>
                          <Button className='mt-2 w-full'>View/Edit</Button>
                        </Link> */}
                        <div className='flex gap-2 mt-3'>
                          <Link href={'/editor/'+item.tid} className='flex-1'>
                            <Button className='w-full'>View/Edit</Button>
                          </Link>
                          <Button variant="destructive" onClick={() => handleDelete(item.tid)}>Delete</Button>
                        </div>
                      </div>
                    ))
                  }
                </div>
        }
    </div>
  )
}

export default EmailTemplateList