"use server"

import axios, { AxiosError } from "axios"
import * as z from "zod"

const createOrganizationSchema = z.object({
    organizationName: z.string().min(1, { message: "Organization name is required" }),
    organizationDomain: z.string()
        .nonempty({ message: "Organization domain is required" })
        .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: "Invalid domain format" }),
    adminName: z.string().min(1, { message: "Admin name is required" }),
    adminEmail: z.string()
        .nonempty({ message: "Admin email is required" })
        .regex(/^[a-zA-Z0-9._%+-]+$/, { message: "Admin email should only contain the username part before @" }),
    adminPassword: z.string().min(6, { message: "Password must be at least 6 characters long" }),
})

export async function createOrganization(prevState: any, formData: FormData) {

    const organizationName = formData.get("organizationName") as string
    const organizationDomain = formData.get("organizationDomain") as string
    const adminName = formData.get("adminName") as string
    const adminEmail = formData.get("adminEmail") as string
    const adminPassword = formData.get("adminPassword") as string

    const validatedData = createOrganizationSchema.safeParse({
        organizationName,
        organizationDomain,
        adminName,
        adminEmail,
        adminPassword
    })

    if (!validatedData.success) {
        return { ...prevState, error: validatedData.error.issues[0].message }
    }

    try {

        const response = await axios.post<Boolean>(`${process.env.NEXT_PUBLIC_API_URL}/organization/create`, {
            organizationName,
            organizationDomain,
            adminName,
            adminEmail,
            adminPassword
        })

        if (response.status === 201) {
            return { ...prevState, success: true, error: null }
        }

    } catch (error) {

        if (error instanceof AxiosError && error.response) {
            return { ...prevState, error: error.response.data.message || 'An error occurred while creating the organization' }
        }

        return { ...prevState, error: 'An unexpected error occurred while creating the organization' }
    }

}