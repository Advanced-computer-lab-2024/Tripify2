import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { jwtDecode } from 'jwt-decode'
import { fetcher } from '@/lib/fetch-client'
import { authConfig } from "@/auth.config"

async function refreshAccessToken(token) {
  try {
    console.log(token)
    const response = await fetch(`${process.env.API_SERVER_ENDPOINT}/auth/refresh`, {
      headers: {
        'Authorization': `Bearer ${token.refreshToken}`
      }
    })

    if (!response?.ok) return null

    const newToken = await response.json()

    return {
      ...token,
      accessToken: newToken.accessToken,
      refreshToken: newToken.refreshToken ?? token.refreshToken,
    }
  }
  catch (e) {
    console.error(e)
  }
}
export const authOptions = {
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'UserName', type: 'text', placeholder: 'example@email.com' },
        password: { label: 'Password', type: 'password', placeholder: '*******' },
      },
      async authorize(credentials, req) {
        if (credentials === null) return null

        const response = await fetch(`${process.env.API_SERVER_ENDPOINT}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            UserName: credentials.username,
            Password: credentials.password,
          }),
        })

        if (!response?.ok) {
          const data = await response.json()
          throw new Error(data.message)
        }

        const data = await response.json()

        console.log(data)

        if (!data.user.accepted) throw new Error('User Not Accepted Yet!')

        const accessToken = data.accessToken
        const refreshToken = data.refreshToken

        return {
          id: data.user._id,
          userId: data.user.userId,
          name: data.user.UserName,
          email: data.user.Email,
          role: data.user.Role,
          accessToken,
          refreshToken,
        }

      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (token?.accessToken) {
        const decoded = jwtDecode(token.accessToken)
        token.accessTokenExpires = decoded?.exp * 1000
      }

      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.userId = user.userId;
        token.email = user.email;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      if (Date.now() < token.accessTokenExpires) return token

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.userId = token.userId;
        session.user.name = token.name;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
}

export default NextAuth(authOptions)