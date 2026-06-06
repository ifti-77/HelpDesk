"use client"
import { User, UserRole } from "@/CustomTypes/UserType"
import axios from "axios"

import { useState } from "react"
import * as zod from 'zod'

const updateProfileSchema = zod.object({
    name: zod.string("name cannnot be empyt").min(2, { message: "must be 2 character long" }),
    email: zod.string("email cannnot be empyt").email({ message: 'Invalid email address' }),
    password: zod.string().optional(),
    confirmPassword: zod.string().optional()
}).superRefine((data, ctx) => {
    const password = data.password || "";
    const confirmPassword = data.confirmPassword || "";

    if (password && password.length < 6) {
        ctx.addIssue({
            code: "custom",
            path: ["password"],
            message: "Password must be at least 6 characters",
        });
    }

    if (password && password !== confirmPassword) {
        ctx.addIssue({
            code: "custom",
            path: ["confirmPassword"],
            message: "Passwords do not match",
        });
    }
})

interface ErrorFrontendType {
    name?: string[]
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
}

function UpdateProfile({ user, setUser }: { user: User | undefined, setUser: React.Dispatch<React.SetStateAction<User | undefined>> }) {

    const [name, setName] = useState<string>(user?.name || "")
    const [email, setEmail] = useState<string>(user?.email || "")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")

    const [errorFrontend, setErrorFrontend] = useState<ErrorFrontendType | null>(null)
    const [errorBackend, setErrorBackend] = useState<string | null>(null)
    const [makeRequest, setMakeRequest] = useState<boolean>(false)

    const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrorFrontend(null)
        setErrorBackend(null)
        setMakeRequest(true)

        const validationCheck = await updateProfileSchema.safeParseAsync({ name, email, password, confirmPassword })

        if (!validationCheck.success) {
            setErrorFrontend(zod.flattenError(validationCheck.error).fieldErrors)
            setMakeRequest(false)
            return
        }
        let Url = ''
        if(user?.role === UserRole.ADMIN) {
            Url = `${process.env.NEXT_PUBLIC_API_URL}/admin/`
        } else if(user?.role === UserRole.AGENT) {
            Url = `${process.env.NEXT_PUBLIC_API_URL}/agent/`
        } else if(user?.role === UserRole.EMPLOYEE) {
            Url = `${process.env.NEXT_PUBLIC_API_URL}/employee/`
        }else{
            setErrorBackend("Invalid user role")
            setMakeRequest(false)
            return
        }

        try {

            const resUpdateNameEmail = await axios.put(`${Url}profile`, {
                name,
                email
            }, {
                withCredentials: true
            })
            if (resUpdateNameEmail.status === 200) {
                let updatedUser = resUpdateNameEmail.data
                if (password) {
                    const resUpdatePassword = await axios.patch(`${Url}profile/password`, {
                        password
                    }, {
                        withCredentials: true
                    })

                    if (resUpdatePassword.status === 200) {
                        updatedUser = resUpdatePassword.data
                    }
                }
                updatedUser && setUser(updatedUser)
                updatedUser && setName(updatedUser.name)
                updatedUser && setEmail(updatedUser.email)
                updatedUser && setPassword("")
                updatedUser && setConfirmPassword("")
                setErrorBackend(null)
                alert("Profile Updated Successfully")
                setMakeRequest(false)
            }

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setErrorBackend(error.response.data?.message)
            }

            setErrorBackend("Failed to Update Profile, Try again later")
            setMakeRequest(false)
        }
    }

    return (
        <div>
            <h1 className="font-medium text-xl text-center">Update Profile</h1>
            <hr className="border-t border-gray-300 my-3"/>
            {errorBackend && (
                <div className="bg-red-100 border border-red-700 text-red-700 px-4 py-3 rounded-sm">
                    {errorBackend}
                </div>
            )}
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                <div>
                    <label htmlFor="name" className="block text-md font-medium text-gray-700">Name</label> <span className="text-red-500">{errorFrontend?.name}</span>
                    <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.currentTarget.value.trimStart())} 
                    className="border border-gray-600 outline-blue-800 px-4 py-1.5 rounded-xs"/>
                </div>
                <div>

                    <label htmlFor="email" className="block text-md font-medium text-gray-700">Email</label><span className="text-red-500">{errorFrontend?.email}</span>
                    <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.currentTarget.value.trim())} 
                    className="border border-gray-600 outline-blue-800 px-4 py-1.5 rounded-xs"/>
                </div>
                <div>

                    <label htmlFor="password" className="block text-md font-medium text-gray-700">Password</label><span className="text-red-500">{errorFrontend?.password}</span>
                    <input type="password" id="password" name="password"
                        placeholder="Leave empty if no change of password" value={password} onChange={(e) => setPassword(e.currentTarget.value.trim())} 
                        className="border border-gray-600 outline-blue-800 px-4 py-1.5 rounded-xs"/>
                </div>
                <div>

                    <label htmlFor="confirmPassword" className="block text-md font-medium text-gray-700">Confirm Password</label><span className="text-red-500">{errorFrontend?.confirmPassword}</span>
                    <input type="password" id="confirmPassword" name="confirmPassword"
                        placeholder="Leave empty if no change of password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.currentTarget.value.trim())} 
                        className="border border-gray-600 outline-blue-800 px-4 py-1.5 rounded-xs"/>
                </div>
                <button type="submit" disabled={makeRequest}
                className={`w-[30%] bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded ${makeRequest ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
                    {makeRequest ? "Updating..." : "Update Profile"}
                </button>
            </form>
        </div>
    )
}

export default UpdateProfile