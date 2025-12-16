'use client'

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify';
import { z } from "zod";
import { NEXT_URL } from "@/config";

export default function Login() {
    const router = useRouter()
    const [data, setData] = useState({
        username: '',
        email: '',
        password: ''
    })
    const registrationSchema = z.object({
        username: z.string({required_error:"This field is required"}),
        email: z.string({required_error:"This field is required"}).email({message:"This field should be an email"}),
        password: z.string().refine((val) => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$\.%^&*-]).{8,}$/.test(val), {
            message: "The password must contain at lease one uppercase and one lowercase character, one digit and one special character."
        })
    })

    const [validationErrors, setValidationErrors] = useState({})
    const [error, setError] = useState(undefined)
    const handleChange = (e) => {
        const {name, value} = e.target;
        validationErrors[name] = undefined
        setValidationErrors(validationErrors)

        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }


    const registerUser = async (e) => {
        // https://medium.com/@brianridolcedev/working-with-form-validation-in-next-js-using-zod-ebac59d49904
        e.preventDefault()
        setValidationErrors({})
        setError(undefined)
        try {
            // Validate the form data
            const validatedData = registrationSchema.parse(data);
            // If validation is successful, you can proceed with sending the data to the server
            console.log('Valid form data:', validatedData);

            const response = await fetch(`${NEXT_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data})
            }) 
    
            const res = await response.json()


            if (res?.ok) {
                toast.success(`User ${res.message.username} successfully created!` )
                router.push('/account/login')
            } else {
                setError(res.msg)
                toast.error(res.msg)
            }

        } catch (error) {
            if (error instanceof z.ZodError) {
                // Handle validation errors
                console.log(error.flatten().fieldErrors)
                setValidationErrors(error.flatten().fieldErrors);
            }
        }
    }


    return (
        <div className="w-full h-full flex justify-center">
            <div className='m-auto  w-2/7'>
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur 
                    opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt">
                    </div>
                    <div className="flex flex-col justify-center bg-slate-900 backdrop-blur-2xl
                    border-neutral-800  from-inherit lg:static lg:w-auto  lg:rounded-xl 
                    lg:border gap-2 p-4">
                        <h1 className="text-center text-lg border-b border-slate-600 mb-2 pb-2">Register</h1>

                        <form className="w-full flex flex-col gap-2 px-2 pb-2 text-sm" onSubmit={registerUser}>
                            <div className="w-full flex-none flex">
                                <label className='flex-none w-20 m-auto'>Username:</label>
                                <div className="flex flex-col">
                                    <input name="username" type="text" className='grow border border-slate-800 rounded p-2 bg-slate-800 autofill:transition-colors autofill:duration-[5000000ms]' 
                                    value={data.username}
                                    onChange={handleChange}
                                    />
                                    {validationErrors?.username && (
                                        <div className="error text-xs text-red-600">{validationErrors?.username}</div>
                                    )}
                                </div>
                            </div>
                            <div className="w-full flex-none flex">
                                <label className='flex-none w-20 m-auto'>email:</label>
                                <div className="flex flex-col">
                                    <input name="email" className='grow border border-slate-800 rounded p-2 bg-slate-800 autofill:transition-colors autofill:duration-[5000000ms]'
                                    value={data.email}
                                    onChange={handleChange}
                                    />
                                    {validationErrors?.email && (
                                        < div className="error text-xs text-red-600">{validationErrors?.email}</div>
                                    )}
                                </div>
                            </div>
                            <div className="w-full flex-none flex">
                                <label className='flex-none w-20 m-auto'>Password:</label>
                                <div className="flex flex-col">
                                    <input name="password" type="password" className='
                                        grow border border-slate-800 rounded p-2 bg-slate-800 autofill:transition-colors autofill:duration-[5000000ms]' 
                                    value={data.password}
                                    onChange={handleChange}
                                    />
                                    {validationErrors?.password && (
                                        <div className="w-48 error text-xs text-red-600">{validationErrors.password}</div>
                                    )}
                                </div>
                            </div>
                            {error && <div style={{ color: 'red' }}>{error}</div>}
                            <div className='w-full flex gap-2 justify-center border-t border-slate-600 mt-2 pt-2'>
                                <button className="w-full border border-slate-600 p-2 rounded">
                                    Register
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}