"use client"
import axios from 'axios'
import { Suspense, useState, useEffect } from 'react'
import { User } from '@/CustomTypes/UserType'
import { useRouter } from 'next/navigation'
import UpdateProfile from './UpdateProfile'
import EmployeeTickets from './EmployeeTickets'
import Logout from './Logout'


function EmployeeDashboard() {

  const [employee, setEmployee] = useState<User>()
  const [windowPanel, setWindowPanel] = useState<'dashboard' | 'ticket' | 'update-profile'>('dashboard')
  const router = useRouter()

  useEffect(() => {
    async function fetchEmployeeProfile() {

      try {
        const response = await axios.get<User>(`${process.env.NEXT_PUBLIC_API_URL}/employee/profile/`, {
          withCredentials: true
        })
        if (response.status == 200) {
          const data = await response.data
          setEmployee(data)
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          router.push('/login')
        }
      }
    }
    fetchEmployeeProfile()
  }, [])

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="flex min-h-[calc(100vh)] overflow-hidden bg-white">
        <aside className="w-64 min-h-[calc(100vh)] border-r border-slate-200 bg-slate-950 p-6 text-white">
          <h1 className="mb-8 text-2xl font-bold">HelpDesk</h1>

          <nav className="space-y-2">
            <button className={`w-full rounded-sm ${windowPanel === 'dashboard'? 'bg-white text-slate-950' : 'border border-slate-300 hover:bg-slate-800 hover:text-white text-slate-300'} px-4 py-2 text-left font-medium `}
              onClick={() => setWindowPanel('dashboard')}
            >
              Dashboard
            </button>

            <button className={`w-full rounded-sm px-4 py-2 text-left ${windowPanel === 'ticket'? 'bg-white text-slate-950' : 'border border-slate-300 hover:bg-slate-800 hover:text-white text-slate-300'}  font-medium`}
              onClick={() => setWindowPanel('ticket')}
            >
              Tickets
            </button>

            <button className={`w-full rounded-sm px-4 py-2 text-left ${windowPanel === 'update-profile'? 'bg-white text-slate-950' : 'border border-slate-300 hover:bg-slate-800 hover:text-white text-slate-300'}  font-medium`}
              onClick={() => setWindowPanel('update-profile')}
            >
              Update Profile
            </button>
            <Logout />
          </nav>
        </aside>
        <section className="flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Employee Panel</p>
              <h2 className="text-3xl font-bold text-slate-900">
                Welcome, <span className="text-blue-600">{employee?.name}</span>
              </h2>
            </div>

            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              {employee?.role}
            </div>
          </div>
          <Suspense fallback={<p>Loading dashboard...</p>}>

            {windowPanel === 'dashboard' && <DashBoardComponent />}
            {windowPanel === 'ticket' && <EmployeeTickets employeeId={employee?.id ?? ''} />}
            {windowPanel === 'update-profile' && <UpdateProfile user={employee} setUser={setEmployee} />}
          </Suspense>
        </section>

        {/* Main Content */}

      </div>
    </main>

  )
}

export default EmployeeDashboard
//tickets/totalcounts


function DashBoardComponent() {
  const [ticketCounts, setTicketCounts] = useState<{ total: number, open: number, inProgress: number, resolved: number, closed: number }>()

  useEffect(() => {
    async function fetchTicketCounts() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/employee/resources/totalcounts`, {
          withCredentials: true
        })
        if (response.status === 200) {
          const data = await response.data
          if(data)
          {
            setTicketCounts(data)
          }
        }
      } catch (error) {
        if(axios.isAxiosError(error) && error.response) {
          alert( error.response.data?.message + ',\nwhile fetching ticket counts')
        }
      }
    }

    fetchTicketCounts()
  }, [])

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-sm bg-blue-600 p-6 text-white">
        <p className="text-sm font-medium">Total Tickets</p>
        <p className="mt-2 text-3xl font-bold">{ticketCounts?.total ?? 'N/A'}</p>
      </div>

      <div className="rounded-sm bg-indigo-400 p-6 text-white">
        <p className="text-sm font-medium">Open</p>
        <p className="mt-2 text-3xl font-bold">{ticketCounts?.open ?? 'N/A'}</p>
      </div>


      <div className="rounded-sm bg-yellow-500 p-6 text-white">
        <p className="text-sm font-medium">In Progress</p>
        <p className="mt-2 text-3xl font-bold">{ticketCounts?.inProgress ?? 'N/A'}</p>
      </div>

      <div className="rounded-sm bg-green-500 p-6 text-white">
        <p className="text-sm font-medium">Resolved</p>
        <p className="mt-2 text-3xl font-bold">{ticketCounts?.resolved ?? 'N/A'}</p>
      </div>

      <div className="rounded-sm bg-red-500 p-6 text-white">
        <p className="text-sm font-medium">Closed</p>
        <p className="mt-2 text-3xl font-bold">{ticketCounts?.closed ?? 'N/A'}</p>
      </div>

    </div>
  )
}
