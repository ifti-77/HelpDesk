import { UserRole } from "@/CustomTypes/UserType";
import { cookies } from "next/headers";
import axios from "axios";
import { redirect } from 'next/navigation'

type VerifyUser = {
  id: string;
  role: UserRole;
}

const CheckUserAuthentication = async (): Promise<VerifyUser | null> => {
  const cookie = await cookies()
  const accessToken = cookie.get('accessToken')?.value
  if (!accessToken) {
    return null
  }

    const response = await axios.get<VerifyUser>(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-logged-in-user`, {
      headers: {
        Cookie: `access_token=${accessToken}`
      },
    })
    if (response.status === 200) {
      const user: VerifyUser = response.data
      return user
    }

    return null

}

async function dashboard() {

  const user: VerifyUser | null = await CheckUserAuthentication()

  if (!user) {
    redirect('/login')
  }


  return (
    <div>
      <h1>Dashboard</h1>
      {user.role === UserRole.ADMIN && <p>Welcome, Admin! You have full access to the dashboard.</p>}
      {user.role === UserRole.AGENT && <p>Welcome, Agent! You have access to the dashboard.</p>}
      {user.role === UserRole.EMPLOYEE && <p>Welcome, Employee! You have limited access to the dashboard.</p>}
    </div>
  )
}

export default dashboard