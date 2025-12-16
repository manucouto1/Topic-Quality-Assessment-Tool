import { NextResponse } from "next/server";
import { BASE_PATH_BACKEND } from "@/utils/constants";

export const dynamic = 'force-dynamic'

export async function POST(request) {
    const body = await request.json();

    try {
        const { _id, topicNum, evaluation, lastIndex} = body;

        console.log(JSON.stringify({
            _id: _id,
            topicNum: topicNum,
            evaluation: evaluation,
        }))
        
        const response = await fetch(`${BASE_PATH_BACKEND}/topics/update`, {
            method :"POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: _id,
                topicNum: topicNum,
                lastIndex: lastIndex,
                evaluation: evaluation,
                
            })
        })
        const result = await response.json()

        return NextResponse.json(result, {status: 200})

    } catch (error) {
        console.log(error)
        NextResponse.json(error, {status: 405});
    }
}
