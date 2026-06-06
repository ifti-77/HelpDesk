"use client"

import { Ticket } from "@/CustomTypes/TicketType"
import { UserRole } from "@/CustomTypes/UserType"
import axios from "axios"
import { useEffect, useState } from "react"

//tickets/:ticketId


function SearchTicket({ userRole, setTickets }: { userRole: UserRole, setTickets: React.Dispatch<React.SetStateAction<Ticket[] | null>> }) {

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [debouncherValue, setDebouncherValue] = useState<string>('')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncherValue(searchTerm)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm])

  useEffect(() => {
    const fetchSearchedTickets = async () => {

      if (userRole === UserRole.AGENT && !debouncherValue.trim()) {
        return
      }

      let url = ''
      if (userRole === UserRole.ADMIN) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/admin`
      }
      else if (userRole === UserRole.AGENT) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/agent`
      }
      else if (userRole === UserRole.EMPLOYEE) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/employee`
      } else {
        alert('Invalid user role detected')
        return
      }

      try {
        const response = await axios.get(`${url}/tickets/${debouncherValue}`, {
          withCredentials: true
        })
        if (response.status == 200) {
          const data = await response.data
          if (data != null) {
            setTickets(data)
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          alert(error.response.data.message)
        }
      }
    }

    fetchSearchedTickets()
  }, [debouncherValue])

  return (

    <input type="text"
      placeholder="Search by Ticket ID"
      value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="inline w-full rounded-sm border p-2 mb-4" />

  )
}

export default SearchTicket