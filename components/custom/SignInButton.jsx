"use client"
import React from 'react'
import { Button } from '../ui/button';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUserDetail } from '@/app/provider';

const SignInButton = () => {
    const CreateUser = useMutation(api.users.CreateUser);
    const { setUserDetail } = useUserDetail();
    
    const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
        console.log(tokenResponse);
        const userInfo = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: 'Bearer'+tokenResponse?.access_token } },
        );

        console.log(userInfo.data);
        const user = userInfo.data;

        //save to database
        const result = await CreateUser({
            name: user?.name,
            email: user?.email,
            picture: user?.picture,
        })

        //save to local storage
        const userDetail = {
            ...user,
            _id:result?._id??result
        }
        if(typeof window !== undefined){
            localStorage.setItem('userDetail',JSON.stringify(userDetail));
        }
        setUserDetail(userDetail);

  },
  onError: errorResponse => console.log(errorResponse),
});
  return (
    <div>
        <Button onClick={googleLogin}>Get Started</Button>
    </div>
  )
}

export default SignInButton