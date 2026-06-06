"use client"
import React, { useEffect } from 'react'
import { Ticket, TicketStatus } from '@/CustomTypes/TicketType'
import { UserRole } from '@/CustomTypes/UserType'
import axios from 'axios'
import ViewTicketDetails from './ViewTicketDetails'
import SearchTicket from './SearchTicket'
function AdminTickets({ adminId }: { adminId: string }) {
    const [viewWindow, setViewWindow] = React.useState<TicketStatus.OPEN | TicketStatus.IN_PROGRESS | TicketStatus.REJECTED>(TicketStatus.OPEN)
    const [tickets, setTickets] = React.useState<Ticket[] | null>(null)
    const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null)
    const [viewTicketDetails, setViewTicketDetails] = React.useState(false)



    const FetchStatusBaseTickets = async (status: TicketStatus) => {
        try {

            const response = await axios.get<Ticket[] | null>(`${process.env.NEXT_PUBLIC_API_URL}/admin/tickets/status/${status}`, {
                withCredentials: true
            })

            if (response.status === 200) {
                const data = await response.data
                setTickets(data)
            }
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert(error.response.data?.message)
            }
        }
    }

    useEffect(() => {
        FetchStatusBaseTickets(viewWindow)
    }, [viewWindow])




    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Manage Tickets</h1>
            <div className="flex justify-start gap-1 w-full mt-1">
                <div className="flex flex-col items-center justify-start gap-1 w-full">

                    <button className={`inline w-full rounded-lg ${viewWindow === TicketStatus.OPEN ? 'bg-indigo-900 text-white hover:bg-indigo-950' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'} px-4 py-2 font-medium`}
                        onClick={() => setViewWindow(TicketStatus.OPEN)}
                    >
                        Newly Opened Tickets
                    </button>
                    <button className={`inline w-full rounded-lg ${viewWindow === TicketStatus.IN_PROGRESS ? 'bg-indigo-900 text-white hover:bg-indigo-950' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'} px-4 py-2 font-medium`}
                        onClick={() => setViewWindow(TicketStatus.IN_PROGRESS)}
                    >
                        In-Progress Tickets
                    </button>
                </div>
                <div className="flex flex-col items-center justify-start gap-1 w-full">

                    <button className={`inline w-full rounded-lg ${viewWindow === TicketStatus.REJECTED ? 'bg-indigo-900 text-white hover:bg-indigo-950' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'} px-4 py-2 font-medium`}
                        onClick={() => setViewWindow(TicketStatus.REJECTED)}
                    >
                        Rejected Tickets
                    </button>
                    <SearchTicket userRole={UserRole.ADMIN} setTickets={setTickets} />
                </div>
            </div>
            {Array.isArray(tickets) && tickets.length > 0 ? (
                <div className="my-4 space-y-4 flex flex-wrap gap-2 rounded-sm bg-slate-100 p-4 overflow-auto">
                {tickets?.map((ticket) => (
                    <div key={ticket.id} className="rounded-sm bg-white p-2 border border-slate-400 min-w-62.5 h-48">
                                        <h2 className='font-medium italic text-indigo-950'>{ticket.title}</h2>
                                        <p className='mt-2 text-sm text-slate-800'>
                                            <span className='rounded-xs px-1 bg-purple-100 text-sm text-slate-700'>Priority:</span>
                                            {' '+ticket.priority+' '}<span className=' border border-purple-400 rounded-sm ml-4 px-1 bg-transparent text-sm text-slate-700'>{ticket.status}</span>
                                        </p>
                                        <p className='mt-2 text-sm text-slate-800'>
                                            <span className='rounded-xs px-1 bg-mauve-100 text-sm text-slate-700'>Category:</span>
                                            {' '+ticket.category}
                                        </p>
                                        <p className='mt-2 text-sm text-slate-800'>
                                            <span className='rounded-xs px-1 bg-mauve-100 text-sm text-slate-700'>Created:</span>
                                            {' '+new Date(ticket.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className='mt-2 text-sm text-slate-800'>
                                            <span className='rounded-xs px-1 bg-mauve-100 text-sm text-slate-700'>Updated:</span>
                                            {new Date(ticket.updatedAt).toLocaleDateString() ?? 'Not yet'}
                                        </p>
                        <button onClick={() => {
                            setSelectedTicket(ticket);
                            setViewTicketDetails(true);
                        }} className="text-blue-600 hover:underline">
                            View Details
                        </button>
                    </div>
                ))}
            </div>) : (<div className="my-4 space-y-4 rounded-lg bg-slate-100 p-4"> <p>No {viewWindow} Ticket Available</p></div>)}


            {(viewTicketDetails && selectedTicket) && (<ViewTicketDetails userRole={UserRole.ADMIN} userId={adminId}
                setTickets={setTickets}
                selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket}
                viewTicketDetails={viewTicketDetails} setViewTicketDetails={setViewTicketDetails} />)}
        </div>
    )
}

export default AdminTickets


