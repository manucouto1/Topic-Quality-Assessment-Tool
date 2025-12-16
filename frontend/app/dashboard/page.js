"use client";

import React, { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react';
import { map } from 'lodash';
import NiceBox from "@/components/NiceBox"
import { NEXT_URL } from '@/config';

import PoolComponent from '@/components/PoolComponent'

export default function Home() {
    const { data: session, status } = useSession()
    const [topicEval, setTopicEval] = useState([])
    const [selected, setSelected] = useState(undefined)
    
    useEffect(() => {
        if (session?.user?.id){
            fetch(`${NEXT_URL}/api/topic/find/${session.user.id}`, { cache: 'no-store' })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setTopicEval(data)
                setSelected(data[0])
            })
        }   
            
    }, [session, status])


  return (

    <div className='h-full  w-full'>
        {(topicEval==undefined || topicEval?.length == 0)?(
            <h1>Not Evaluation Works Assigned</h1>
        ):(
            <div className='h-full w-full pr-2 flex gap-4'>
                {/* <div className='w-[10%]'> 
                    <NiceBox fromColor={"from-pink-600"} toColor={"to-pink-600"} fromPerc={"from-5%"} toPerc={"from-5%"}>
                        <div className='flex flex-col gap-2 '>
                            {
                                map(topicEval, (x, idx) => {
                                    return (
                                        <button key={idx} className='border p-2 flex justify-between hover:bg-slate-800 rounded-xl' onClick={()=>{setSelected(x)}}> 
                                            <div className='w-fit'>
                                                {x.description}
                                            </div>
                                        </button>
                                    )
                                })
                            }
                        </div> 
                    </NiceBox>
                </div> */}
                <div className='w-full'>
                    <NiceBox fromColor={"from-pink-600"} toColor={"to-purple-600"} fromPerc={"from-5%"} toPerc={"from-5%"}>
                    {(selected!=undefined)&&<PoolComponent work={selected}/>}
                    </NiceBox>
                </div>
            </div>
        )}
    </div>
      
  )
}
