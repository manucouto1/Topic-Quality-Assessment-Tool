import { BASE_PATH_BACKEND } from "@/utils/constants"
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request, context) {
    const { params } = context
    try {
        const { user_id } = params;
        const response = await fetch(`${BASE_PATH_BACKEND}/topics/one/${user_id}`, {method: "GET"})
        const result = await response.json()
        return NextResponse.json(result, {status: 200})

    } catch (error) {
        return NextResponse.json(error, {status: 405});
    }
}