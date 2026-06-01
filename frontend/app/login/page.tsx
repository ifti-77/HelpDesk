"use client"
import { useState } from 'react'
import { z } from 'zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const loginSchema = z.object({
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message: 'Password must be at least 6 characters long'})
})

interface loginError {
    email?: string[]
    password?: string[]
}

export default function () {

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<loginError>()
    const [backendError, setBackendError] = useState<string>('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrorMessage(undefined)
        setBackendError('')
        const result = loginSchema.safeParse({ email, password })

        if (!result.success) {
            setErrorMessage(z.flattenError(result.error).fieldErrors)
            return
        }

        try {

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password }, { withCredentials: true })

            if (response.status === 200) {
                
                router.push('/dashboard')
            }
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setBackendError(error.response.data.message)
            }
            else {
                setBackendError('An error occurred while logging in')
                console.error(error)
            }
        }
    }


    return (
        <div className=' flex flex-col items-center justify-center h-screen bg-slate-200 m-4'>
            <form onSubmit={handleSubmit}>

                {backendError && (
                    <div className='mb-4 p-2 text-red-500 bg-transparent border border-red-500 rounded-lg'>
                        {backendError}
                    </div>
                )}
                <div className='mb-4'>

                    <label htmlFor="email">Email</label> <span className='text-red-500'>{errorMessage?.email}</span><br />
                    <input className='border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-200' 
                    type="text" name="email" 
                    placeholder='email' 
                    onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="password">Password</label> <span className='text-red-500'>{errorMessage?.password}</span><br />
                    <input className='border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-200' 
                    type="password" name="password" 
                    placeholder='Password' 
                    onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type='submit' className='bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded'>
                    Login
                </button>
            </form>
        </div>
    )
}
