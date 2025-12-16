import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import { BASE_PATH_BACKEND } from "@/utils/constants";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "username" },
                password: { label: "Password", type: "password" }
                
            },
            async authorize(credentials, req) {
                // const client = await clientPromise
                
                if (!credentials.username || !credentials.password){
                    return null;
                }

                console.log("Traying to log!")
                
                const response = await fetch(`${BASE_PATH_BACKEND}/users/${credentials.username}`)

                
                const user = await response.json()

                console.log(user)

                if (!user) {
                    return null;
                }
                const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
                if (!passwordsMatch) {
                    return null;
                }
                user.name = user.username
                user.id = user._id
                
                return user;
            }
        })
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            console.log("********************************")
            console.log(profile)
            console.log(account)
            console.log("********************************")
            if (account) {
              token.accessToken = account.access_token
              token.id = account.providerAccountId
            }
            return token
        },
        async session({ session, token, user}){
            console.log("-------------------------")
            console.log(session)
            console.log(token)
            console.log(user)
            console.log("-------------------------")
            session.accessToken = token.accessToken
            session.user.id = token.id
            session.user.username = token.name
            session.user.name = token.name
            session.user.email = token.email
            return session
        }
        
    },
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/account/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV == "development"
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}