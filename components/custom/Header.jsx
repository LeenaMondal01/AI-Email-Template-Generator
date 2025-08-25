"use client"
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import SignInButton from './SignInButton'
import { useUserDetail } from '@/app/provider'
import Link from 'next/link'

const Header = () => {
  const {userDetail,setUserDetail} = useUserDetail();
  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("userDetail");

    // Reset context state
    setUserDetail(null);

    // Redirect to home
    window.location.href = "/";
  };


  return (
    <div className='flex justify-between items-center p-4 shadow-sm px-10'>
      <Image src={'/logo2.png'} alt='logo' width={180} height={140} />
      <div>
        {userDetail?.email ? (
          <div className='flex gap-3 items-center'>
            <Link href={'/dashboard'}>
              <Button>Dashboard</Button>
            </Link>
            <Image 
              src={userDetail?.picture} 
              alt='user' 
              width={35} 
              height={35} 
              className='rounded-full'
            />
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <SignInButton />
        )}
      </div>
    </div>
  )
}

export default Header