"use client";

import React, { useState } from 'react';
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/navigation'
import { userService } from '@/app/lib/api-services';
import { Button } from 'react-component-tailwindcss';

export const GuestLoginButton = ({ lng }:any) => {
    const [ isLoggingin, setIsLoggingin ] = useState(false);
    const [_, setCookie] = useCookies(["userInfo"])
    const router = useRouter()

    const onClick = async () => {
        try{
            setIsLoggingin(true);
            const email = "guest-user@guest.user.com";
            const password = "guest-user-password";
            const response = await userService.login({email, password});
            setCookie("userInfo", response, { path: '/', maxAge: 3600 }); // maxAge - seconds
            sessionStorage.setItem('userInfo', JSON.stringify(response.userInfo));
            setTimeout(() => {
            router.push(`/${lng}/calendar`);
            }, 300)
        }catch(err){

        }finally{
            setTimeout(() => {
            setIsLoggingin(false);
            }, 500)
        }
    }

    return(<>
        <Button
          onClick={onClick}
          loading={isLoggingin} 
          variant='secondary' color='pink'
          className="w-full"
        >
            <div className="flex items-center justify-center">
                <svg width="28px" height="24px" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 9C12.067 9 10.5 10.567 10.5 12.5C10.5 14.433 12.067 16 14 16C15.933 16 17.5 14.433 17.5 12.5C17.5 10.567 15.933 9 14 9Z" fill="#212121"/>
                    <path d="M10.7001 17C9.84 17 8.904 17.6024 8.87933 18.6719C8.86205 19.421 8.99609 20.5246 9.77391 21.4475C10.5705 22.3927 11.9142 23 14 23C16.0858 23 17.4295 22.3927 18.2261 21.4475C19.0039 20.5246 19.1379 19.421 19.1207 18.6719C19.096 17.6024 18.16 17 17.2999 17H10.7001Z" fill="#212121"/>
                    <path d="M18.8965 4H20.25C21.7688 4 23 5.23122 23 6.75V23.25C23 24.7688 21.7688 26 20.25 26H7.75C6.23122 26 5 24.7688 5 23.25V6.75C5 5.23122 6.23122 4 7.75 4H9.10352C9.42998 2.84575 10.4912 2 11.75 2H16.25C17.5088 2 18.57 2.84575 18.8965 4ZM9.10352 5.5H7.75C7.05964 5.5 6.5 6.05964 6.5 6.75V23.25C6.5 23.9404 7.05964 24.5 7.75 24.5H20.25C20.9404 24.5 21.5 23.9404 21.5 23.25V6.75C21.5 6.05964 20.9404 5.5 20.25 5.5H18.8965C18.57 6.65425 17.5088 7.5 16.25 7.5H11.75C10.4912 7.5 9.42998 6.65425 9.10352 5.5ZM10.5 4.75C10.5 5.44036 11.0596 6 11.75 6H16.25C16.9404 6 17.5 5.44036 17.5 4.75C17.5 4.05964 16.9404 3.5 16.25 3.5H11.75C11.0596 3.5 10.5 4.05964 10.5 4.75Z" fill="#212121"/>
                </svg>
                <span className='text-sm text-microsoft-text-gray tracking-wider ml-3' style={{color: "black"}}>Continue as a guest</span>
            </div>
        </Button>
  </>)
}