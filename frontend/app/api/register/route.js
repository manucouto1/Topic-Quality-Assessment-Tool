import bcrypt from "bcryptjs";
// import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { BASE_PATH_BACKEND } from "@/utils/constants";

export async function POST(request) {
    const body = await request.json();

    try {
        const { username, email, password } = body.data;
        const hashedPassword = await bcrypt.hash(password, 10);

        const response = await fetch(`${BASE_PATH_BACKEND}/users/new`, {
            method :"POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                'username': username,
                'email': email,
                'password': hashedPassword
            })
        })
        const result = await response.json()
        return NextResponse.json(result, {status: 200})

    } catch (error) {
        console.log(error)
        return NextResponse.json(error, {status: 405});
    }
}