"use client"

import { User, UserRole } from "@/CustomTypes/UserType"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Suspense, useEffect, useRef, useState } from "react"
import z, { input } from "zod"
import AdminTickets from "./AdminTickets"
import UpdateProfile from "./UpdateProfile"

function AdminDashboard() {

  const [admin, setAdmin] = useState<User>()
  const [windowPanel, setWindowPanel] = useState<'dashboard' | 'createuser' | 'viewuser' | 'ticket' | 'update-profile'>('dashboard')
  const router = useRouter()

  useEffect(() => {
    async function fetchAdminProfile() {

      try {
        const response = await axios.get<User>(`${process.env.NEXT_PUBLIC_API_URL}/admin/profile/`, {
          withCredentials: true
        })
        if (response.status == 200) {
          const data = await response.data
          setAdmin(data)
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          router.push('/login')
        }
      }
    }
    fetchAdminProfile()
  }, [])

  return (
    <main className="min-h-screen bg-slate-100 p-1.5">
      <div className="flex min-h-[calc(100vh-3rem)] overflow-hidden bg-white">
        <aside className="w-64 border-r border-slate-200 bg-slate-950 p-6 text-white">
          <h1 className="mb-8 text-2xl font-bold">HelpDesk</h1>

          <nav className="space-y-2">
            <button className="w-full rounded-lg bg-white px-4 py-2 text-left font-medium text-slate-950"
              onClick={() => setWindowPanel('dashboard')}
            >
              Dashboard
            </button>

            <button className="w-full rounded-lg px-4 py-2 text-left text-slate-300 hover:bg-slate-800 hover:text-white"
              onClick={() => setWindowPanel('createuser')}
            >
              Users
            </button>

            <button className="w-full rounded-lg px-4 py-2 text-left text-slate-300 hover:bg-slate-800 hover:text-white"
              onClick={() => setWindowPanel('ticket')}
            >
              Tickets
            </button>

            <button className="w-full rounded-lg px-4 py-2 text-left text-slate-300 hover:bg-slate-800 hover:text-white"
              onClick={() => setWindowPanel('update-profile')}
            >
              Update Profile
            </button>
          </nav>
        </aside>
        <section className="flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Admin Panel</p>
              <h2 className="text-3xl font-bold text-slate-900">
                Welcome, <span className="text-blue-600">{admin?.name}</span>
              </h2>
            </div>

            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              {admin?.role}
            </div>
          </div>
          <Suspense fallback={<p>Loading dashboard...</p>}>

            {windowPanel === 'dashboard' && <DashBoardComponent setWindowPanel={setWindowPanel} />}
            {windowPanel === 'createuser' && <ManageUsers props="create" />}
            {windowPanel === 'viewuser' && <ManageUsers props="view" />}
            { windowPanel === 'ticket' && <AdminTickets  /> }
            { windowPanel === 'update-profile' && <UpdateProfile user={admin} setUser={setAdmin} /> }
          </Suspense>
        </section>

        {/* Main Content */}

      </div>
    </main>
  )
}

function DashBoardComponent({ setWindowPanel }: { setWindowPanel?: (panel: 'dashboard' | 'createuser' | 'viewuser' | 'ticket' | 'update-profile') => void }) {
  const [resourceCount, setResourceCount] = useState<{
    numberOfUser: number,
    numberOfOpenTicket: number,
    numberOfResolvedTicket: number,
    numberOfTicket: number
  } | null>()

  useEffect(() => {
    async function GetAllCounts() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/resource-counts/`, {
          withCredentials: true
        })
        if (response.status == 200) {
          const data = await response.data
          setResourceCount(data)
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setResourceCount(null)
        }
      }
    }
    GetAllCounts()
  }, [])

  return (

    <div>
      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Users</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{resourceCount?.numberOfUser ?? 'N/A'}</h3>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Tickets</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{resourceCount?.numberOfTicket ?? 'N/A'}</h3>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Open Tickets</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{resourceCount?.numberOfOpenTicket ?? 'N/A'}</h3>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Resolved</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{resourceCount?.numberOfResolvedTicket ?? 'N/A'}</h3>
        </div>
      </div>

      {/* Action Sections */}
      <p className="text-lg font-semibold text-slate-900">Quick Actions</p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            User Management
          </h3>

          <div className="space-y-3">
            <button className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              onClick={() => setWindowPanel && setWindowPanel('createuser')}
            >
              Create New User
            </button>

            <button className="w-full rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => setWindowPanel && setWindowPanel('viewuser')}
            >
              View All Users
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Ticket Management
          </h3>

          <div className="space-y-3">
            <button className="w-full rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800"
              onClick={() => setWindowPanel && setWindowPanel('ticket')}
            >
              View All Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const CreateUserSchema = z.object({
  name: z.string("Name is required").min(1, "Name is required"),
  email: z.string("Email is required").email("Invalid email address"),
  role: z.enum(['AGENT', 'EMPLOYEE'], "Role must be either AGENT or EMPLOYEE"),
  password: z.string("Password is required").min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string("Confirm Password is required").min(6, "Confirm Password must be at least 6 characters long")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
})

function ManageUsers({ props }: { props: 'create' | 'view' }) {
  const [viewWindow, setViewWindow] = useState<'create' | 'view'>(props)
  const [formError, setFormError] = useState<{ [key: string]: string[] } | null>(null)
  const [errorBackend, setErrorBackend] = useState<string>()

  const [allUsers, setAllUsers] = useState<User[] | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [debouncherValue, setDebouncherValue] = useState<string>('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [viewResetPassword, setViewResetPassword] = useState<boolean>(false)

  const handleCreateUserFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const userData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string
    }

    const validationResult = CreateUserSchema.safeParse(userData)

    if (!validationResult.success) {
      setFormError(z.flattenError(validationResult.error).fieldErrors)
      return
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/`,
        {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          password: userData.password
        }, {
        withCredentials: true
      })
      if (response.status == 201) {
        const data = await response.data
        if (data != null) {
          alert('User created successfully')
          setFormError(null)
          setErrorBackend('')
          e.currentTarget.reset()
        }

      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorBackend(error.response.data.message)
        setFormError(null)
      }
    }
  }

  useEffect(() => {

    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/`, {
          withCredentials: true
        })
        if (response.status == 200) {
          const data = await response.data
          if (data != null) {
            setAllUsers(data)
            setErrorBackend('')
          }

        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setErrorBackend(error.response.data.message)
        }
      }
    }
    fetchAllUsers()

  }, [viewWindow === "view"])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncherValue(searchTerm)
    },500)

    return ()=>{
      clearTimeout(handler)
    }
  }, [searchTerm])

  useEffect(()=>{
    const fetchSearchedUser = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${debouncherValue}`, {
          withCredentials: true
        })
        if (response.status == 200) {
          const data = await response.data
          if (data != null) {
            setAllUsers(data)
            setErrorBackend('')
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setErrorBackend(error.response.data.message)
        }
      }
    }

    fetchSearchedUser()
  },[debouncherValue])

  const UpdateUserRole = async (role: UserRole.AGENT | UserRole.EMPLOYEE, userId: string) => {

    try {
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/role/${userId}`, { role }, {
        withCredentials: true
      })
      if (response.status == 200) {
        const data: User | null = await response.data
        if (data != null) {
          const updatedUserList: User[] | null = allUsers && allUsers.map((user) => {
            return user.id === data.id ? { ...user, role: data.role } : user
          })
          setAllUsers(updatedUserList)
          setErrorBackend('')
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorBackend(error.response.data.message)
      }
    }
  }

  const UpdateUserStatus = async (status: 'activate' | 'deactivate', userId: string) => {

    try {
      if (status === 'activate') {
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/status/${userId}`,{}, {
          withCredentials: true
        })
        console.log(response.status)
        if (response.status == 200) {
          const data: User | null = await response.data
          if (data != null) {
            const updatedUserList: User[] | null = allUsers && allUsers.map((user) => {
                return user.id === data.id ? { ...user, isActive: data.isActive } : user
              })
              setAllUsers(updatedUserList)
              setErrorBackend('')
          }
        }
      }
      else {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`, {
          withCredentials: true
        })
        if (response.status == 200 && response.data === true) {
          const updatedUserList: User[] | null = allUsers && allUsers.map((user) => user.id === userId ? { ...user, isActive: false } : user)
          setAllUsers(updatedUserList)
          setErrorBackend('')
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorBackend(error.response.data.message)
      }
    }
  }


  return (
    <div>
      <div>

        <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
        <button className={`inline w-[50%] rounded-lg ${viewWindow === 'create' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'} px-4 py-2 font-medium`}
          onClick={() => setViewWindow('create')}
        >
          Create New User
        </button>
        <button className={`inline w-[50%] rounded-lg ${viewWindow === 'view' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'} px-4 py-2 font-medium`}
          onClick={() => setViewWindow('view')}
        >
          View All Users
        </button>
      </div>
      <div>
        {viewWindow === 'create' && <div>
          <form className="mt-4 space-y-4" onSubmit={handleCreateUserFormSubmit}>
            <div className="text-sm text-red-500">{errorBackend}</div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Name</label>
              <span className="text-sm text-red-500">{formError?.name}</span>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                name="name" />
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <span className="text-sm text-red-500">{formError?.email}</span>
              <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" name="email" />
              <label className="block text-sm font-medium text-slate-700">Role</label>
              <span className="text-sm text-red-500">{formError?.role}</span>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                defaultValue={UserRole.EMPLOYEE}
                name="role"
              >
                <option value={UserRole.EMPLOYEE}>Employee</option>
                <option value={UserRole.AGENT}>Agent</option>
              </select>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <span className="text-sm text-red-500">{formError?.password}</span>
              <input type="password" name="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
              <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
              <span className="text-sm text-red-500">{formError?.confirmPassword}</span>
              <input type="password" name="confirmPassword"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <button className="mt-4 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700">
              Create User
            </button>
          </form>
        </div>}
        {viewWindow === 'view' && <div>
          <div>
            <input type="text" 
            placeholder="Search User by Email" 
            onChange={(e) => setSearchTerm(e.target.value.toLocaleLowerCase())} 
            className="block w-[75%] rounded-md border-2 border-blue-300 outline-blue-500 m-2 px-2 py-1  sm:text-sm"
          />
          </div>
          <div className="my-4 bg-slate-200">{errorBackend} </div>
          <table border={2} className="w-full border-collapse border border-slate-200 overflow-auto py-2" cellPadding={10} >
            <thead>
              <tr className="bg-slate-50 text-2xl font-bold text-slate-900 text-center">
              <td>User ID</td>
              <td>Name</td>
              <td>Email</td>
              <td>Role</td>
              <td>Status</td>
              <td colSpan={3}>Actions</td>
              </tr>
            </thead>
            <tbody>
              <Suspense fallback={<tr><td colSpan={7}>Loading users...</td></tr>}>
                {allUsers?.map((user, index) => <tr key={index}>
                  <td className="p-3.5">
                    {user.id}
                  </td>
                  <td className="p-3.5">
                    {user.name}
                  </td>
                  <td className="p-3.5">
                    {user.email}
                  </td>
                  <td className="p-3.5">
                    {user.role}
                  </td>
                  <td>
                    {user.isActive ? 'Active' : 'Deactivated'}
                  </td>
                  <td className="p-3.5">
                    <button className="m-1 rounded-lg bg-yellow-500 px-2 py-1 text-sm font-medium text-white hover:bg-yellow-600"
                    onClick={() => {
                      setSelectedUser(user)
                      setViewResetPassword(true)
                    }}>Reset Password</button>
                    {user.role !== UserRole.ADMIN && <button
                    className="m-1 rounded-lg bg-blue-500 px-2 py-1 text-sm font-medium text-white hover:bg-blue-600"
                      onClick={() => UpdateUserRole(user.role === UserRole.EMPLOYEE ? UserRole.AGENT : UserRole.EMPLOYEE, user.id)}>
                      Change Role To: {user.role === UserRole.EMPLOYEE ? UserRole.AGENT : UserRole.EMPLOYEE}
                    </button>}
                    <button
                      className="m-1 rounded-lg bg-red-500 px-2 py-1 text-sm font-medium text-white hover:bg-red-600"
                      onClick={() => UpdateUserStatus(!user.isActive ? 'activate' : 'deactivate', user.id)}>{!user.isActive ? 'Activate' : 'Deactivate'}</button>
                  </td>
                </tr>)}
              </Suspense>
            </tbody>
          </table>
          {(viewResetPassword && selectedUser) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Reset Password</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Reset password for {selectedUser?.name}
                    </p>
                  </div>
                </div>
                <form
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault()

                    const formData = new FormData(e.currentTarget)
                    const userId = formData.get('userId') as string
                    const password = formData.get('password') as string
                    const confirmPassword = formData.get('confirmPassword') as string

                    if (password !== confirmPassword) {
                      alert("Passwords don't match")
                      return
                    }

                    try {
                      const response = await axios.patch(
                        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/resetpassword/${userId}`,
                        { password },
                        {
                          withCredentials: true,
                        }
                      )

                      if (response.status === 200) {
                        const data: User | null = response.data

                        if (data != null) {
                          alert('Password reset successfully')
                          setViewResetPassword(false)
                          setErrorBackend('')
                          setSelectedUser(null)
                        }
                      }
                    } catch (error) {
                      if (axios.isAxiosError(error) && error.response) {
                        const message = error.response.data?.message

                        setErrorBackend(
                          Array.isArray(message)
                            ? message.join(', ')
                            : message || 'Something went wrong'
                        )
                      }
                    }
                  }}
                >
                  {errorBackend && (
                    <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                      {errorBackend}
                    </div>
                  )}

                  <input
                    type="hidden"
                    name="userId"
                    value={selectedUser?.id ?? ''}
                    readOnly
                  />

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      User Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      disabled
                      value={selectedUser?.name ?? ''}
                      readOnly
                      className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      name="password"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      name="confirmPassword"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      onClick={() => {
                        setViewResetPassword(false)
                        setErrorBackend('')
                        setSelectedUser(null)
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Reset Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>}
      </div>
    </div >
  )
}

export default AdminDashboard