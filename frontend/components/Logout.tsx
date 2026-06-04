'use client'
import axios from 'axios'
import { useRouter } from 'next/navigation'

function Logout() {

    const router = useRouter()

    const handleLogout = async () =>{
        try{
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, {
                withCredentials: true
            })
            if(response.status === 200) {
                
                router.push('/login')
            }
        }catch(error)
        {
            if (axios.isAxiosError(error) && error.response) {
                alert(`Failed to logout: ${error.response.status} - ${error.response.data.message}`)
            }else
            {
                if (error instanceof Error) {
                    alert(`Failed to logout: ${error.message}`)
                }
            }
        }
    }
  return (
    <div>
        <button className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700" onClick={handleLogout}>
            Logout
        </button>
    </div>
  )
}

export default Logout