import Login from "@/components/Login";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function () {
    const cookie = await cookies()
    const accessToken = cookie.get('access_token')?.value
    if (accessToken) {
        redirect('/dashboard')
    }



    return (
        <Login />
    )
}
