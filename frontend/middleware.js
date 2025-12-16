export { default } from "next-auth/middleware"

export const config = { 
    matcher: ['/dashboard', '/dashboard/:path*'],
    pages: {
        signIn: "/account/login",
    }
}