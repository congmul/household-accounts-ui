'use client'

import React, { useState } from 'react';
import { SlideMenu } from '..'
import { Button, Input } from 'react-component-tailwindcss';
import { useForm, Controller } from "react-hook-form"
import { useDispatch } from 'react-redux';
import { accountBookActions } from '@/app/lib/redux';
import { accountBookService } from '@/app/lib/api-services/accountBook.server';
import { useSessionStorageState } from '@/app/lib/custom-hook';

interface AccountBookFormProps {
    isFirstTime?: boolean
    isOpen: boolean
    close: () => void
}

type AccountBookValues = {
    name: string,
    description: string,
};

const AccountBookForm: React.FC<AccountBookFormProps> = ({ isFirstTime, isOpen, close }) => {
    const [ userInfo, _ ] = useSessionStorageState("userInfo");
    const dispatch = useDispatch();
    const {
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm<AccountBookValues>()
    const [ isLoading, setIsLoading ] = useState(false); 

    async function onSubmit(inputData: AccountBookValues) {
        try{
            setIsLoading(true);
            const payload = {
                ...inputData,
                userId: userInfo._id
            }
            await accountBookService.create(payload);
            getAccountBooks();
        }catch(err){
            console.log(err)
        }finally{
            setIsLoading(false);
        }
        console.log(inputData)
    }

    async function getAccountBooks(){
        const accountBooks = await accountBookService.getByUserId(userInfo._id);
        dispatch(accountBookActions.setAccountBooks(accountBooks || []));
        const accountBook = accountBooks?.find((ab) => ab.isDefault === true) || null;
        dispatch(accountBookActions.setDefaultAccountBook(accountBook));
    }
    return (
        <SlideMenu isOpen={isOpen} close={close} position="bottom">
            <div className="p-4">
                {
                    isFirstTime 
                    ? <h1 className="text-3xl font-bold mb-4">👋 Welcome to <span className="text-indigo-600">KJmoney</span></h1>
                    : <h1 className="text-2xl font-bold mb-4">Create AccountBook</h1>
                }
                <p className="text-gray-600 mb-6">
                    KJmoney helps you manage your finances with ease.  
                    Create your <strong>AccountBook</strong> to start tracking income, expenses, and budgets.  
                </p>

                <ul className="text-left text-gray-700 space-y-2 mb-6">
                    <li>✅ Manage multiple account books (Personal, Family, Business)</li>
                    <li>✅ Set one default book for quick access</li>
                    <li>✅ Share with collaborators (owner, editor, viewer)</li>
                </ul>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <Input {...field} placeholder="AccountBook Name" className="mb-4" />}
                        />

                        <Controller
                            name="description"
                            control={control}
                            defaultValue=""
                            render={({ field }) => {
                                return <Input 
                                    {...field} 
                                    placeholder="AccountBook Description"
                                    className="mb-4"
                                />
                            }}
                        />
                        {/* errors will return when field validation fails  */}
                        {errors.name && <span>This field is required</span>}
                        <Button type="submit" color="pink" loading={isLoading} className="mt-4 p-2 text-white rounded" >Create</Button>
                    </form>
                </div>
            </div>
        </SlideMenu>
    );
}

export { AccountBookForm };