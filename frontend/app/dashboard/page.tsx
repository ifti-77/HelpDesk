import { UserRole } from "@/CustomTypes/UserType";
import { cookies } from "next/headers";
import axios from "axios";
import { redirect } from 'next/navigation'
import AdminDashboard from "@/components/AdminDashboard";
import EmployeeDashboard from "@/components/EmployeeDashboard";

type VerifyUser = {
  id: string;
  role: UserRole;
}

const CheckUserAuthentication = async (): Promise<VerifyUser | null> => {
  const cookie = await cookies()
  const accessToken = cookie.get('access_token')?.value
  if (!accessToken) {
    return null
  }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-logged-in-user`, {
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
      {user?.role === UserRole.ADMIN && <AdminDashboard/>}
      {user?.role === UserRole.AGENT && <p>Welcome, Agent! You have access to the dashboard.</p>}
      {user?.role === UserRole.EMPLOYEE && <EmployeeDashboard/>}
    </div>
  )
}

export default dashboard