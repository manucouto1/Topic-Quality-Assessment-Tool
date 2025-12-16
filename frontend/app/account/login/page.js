'use client'

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { signIn } from "next-auth/react"
import { toast } from 'react-toastify';
import { NEXT_URL } from "@/config";
import Link from "next/link";

export default function Login() {
    const router = useRouter()
    const [data, setData] = useState({
        username: '',
        password: ''
    })

    const [loading, setLoading] = useState(false)
    
    const loginUser = async (e) => {
        e.preventDefault()
        setLoading(true)
        const signedIn = await signIn('credentials', {
            ...data,
            redirect: false,
        })
        setLoading(false)
        if (signedIn?.ok) {
            toast.success("Succesfully loged in!");
            router.push('/dashboard')
        } else {
            toast.error("Wrong login informaition!");

        }
        
    }
    
    return (
        <div className="w-full h-full flex justify-center">
            <div className='m-auto'>
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur 
                    opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt">
                    </div>
                    <div className="flex flex-col border-neutral-800 justify-center  bg-slate-900 backdrop-blur-2xl
                    dark:from-inherit lg:static lg:w-auto  lg:rounded-xl 
                    lg:border gap-2 p-4">
                        <h1 className="text-center text-lg border-b border-slate-600 mb-2 pb-2">Login</h1>

                        <form className="w-full flex flex-col gap-2 px-2 pb-2 text-sm" onSubmit={loginUser}>
                            <div className="w-full flex-none flex">
                                <label className='flex-none w-20 m-auto'>username:</label>
                                <input name="username" type="text" className='grow border border-slate-800 rounded p-2 bg-slate-800 autofill:transition-colors autofill:duration-[5000000ms]' 
                                required
                                value={data.username}
                                onChange={(e) => {setData({...data, username:e.target.value})}}
                                />
                            </div>
                            <div className="w-full flex-none flex">
                                <label className='flex-none w-20 m-auto'>Password:</label>
                                <input name="password" type="password" className='grow border border-slate-800 rounded p-2 bg-slate-800 autofill:transition-colors autofill:duration-[5000000ms]' 
                                required
                                value={data.password}
                                onChange={(e) => {setData({...data, password:e.target.value})}}
                                />
                            </div>
                            {
                                (loading)?(
                                    <div className="w-full flex">
                                    <div className="m-auto" role="status">
                                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    </div>
                                ):(
                                    <div className='w-full flex flex-col gap-2 justify-center border-t border-slate-600 mt-2 pt-2'>
                                        <div className="flex gap-2">Don't have an account? go to <div className="text-violet-500"><Link href={`${NEXT_URL}/account/register`}>register.</Link></div></div>
                                        <button className="w-full border border-slate-600 p-2 rounded">
                                            Login
                                        </button>
                                    </div>
                                )
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}