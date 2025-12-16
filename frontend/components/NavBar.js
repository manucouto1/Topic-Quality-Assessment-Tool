'use client'
import Image from "next/image"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
import Link from 'next/link'
import { NEXT_URL } from "@/config"
import { useRouter } from 'next/navigation'


export default function NavBar(){
    const { data: session, status } = useSession()
    const router = useRouter();

    return (
        <nav className="relative group/nav py-1 pr-1.5 ml-1">
                <div className="w-full absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur 
                opacity-75 group-hover/nav:opacity-100 transition duration-1000 group-hover/nav:duration-200 animate-tilt my-1.5">
                </div>
                <div className="flex justify-between bg-slate-950 backdrop-blur-2xl
            border-neutral-800  static w-auto rounded-xl 
            border gap-2 py-2 px-4">
                    <div className="block">
                        <div className="mb-1">
                        <Image
                            src={`${NEXT_URL}/citius_logo_white.svg`}
                            width={300}
                            height={40}
                            alt="Picture of the author"
                            priority
                        />
                        </div>
                    </div>
                    <div className="block my-auto">
                    {    
                        (status === "authenticated")?(
                            <div className="flex gap-2">
                                <div className="m-auto">{session.user.name}</div>
                                <button onClick={()=>{
                                    signOut({ redirect: false }).then( () => {
                                        router.push("/");
                                    })
                                }}>
                                    <svg className="w-8 h-8 border-2 rounded-full text-white m-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeWidth="2" d="M7 17v1c0 .6.4 1 1 1h8c.6 0 1-.4 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                    </svg>
                                </button>
                            </div>
                        ):(
                            <div className="flex gap-2">
                                <div className="m-auto">Login</div>
                                <Link href={`${NEXT_URL}/account/login`}>
                                <svg className="h-8 w-8 ext-white m-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 12C20 7.58172 16.4183 4 12 4M12 20C14.5264 20 16.7792 18.8289 18.2454 17" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M4 12H14M14 12L11 9M14 12L11 15" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                </Link>
                            </div>
                        )
                    }
                    </div>
                </div>
                
        </nav>
    )
}