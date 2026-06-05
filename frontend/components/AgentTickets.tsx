"use client"
import React, { useEffect } from 'react'
import { Ticket, TicketStatus } from '@/CustomTypes/TicketType'
import { UserRole } from '@/CustomTypes/UserType'
import axios from 'axios'
import ViewTicketDetails from './ViewTicketDetails'

function AgentTickets({agentId}:{agentId:string}) {
    const [viewWindow, setViewWindow] = React.useState<TicketStatus.IN_PROGRESS | TicketStatus.REJECTED | TicketStatus.RESOLVED >(TicketStatus.IN_PROGRESS)
    const [tickets, setTickets] = React.useState<Ticket[] | null>(null)
    const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null)
    const [viewTicketDetails, setViewTicketDetails] = React.useState(false)



    const FetchSelfTickets = async (viewWindow: TicketStatus.IN_PROGRESS | TicketStatus.REJECTED | TicketStatus.RESOLVED) => {
        
        try {
                const response = await axios.get<Ticket[] | null>(`${process.env.NEXT_PUBLIC_API_URL}/agent/tickets/status/${viewWindow}`, {
                    withCredentials: true
                })




            if (response && response.status === 200) {
                const data = await response.data
                setTickets(data)
            } else {
                throw new Error('Failed to fetch tickets')
            }
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert(error.response.data?.message)
            }
            alert('Failed to fetch tickets, try again later')
        }
    }

    useEffect(() => {
            FetchSelfTickets(viewWindow)
    }, [viewWindow])


    return (
        <div>
            <div>

                <h1 className="text-3xl font-bold text-slate-900">Manage Tickets</h1>

                <button className={`inline w-[50%] rounded-lg ${viewWindow === TicketStatus.IN_PROGRESS ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'} px-4 py-2 font-medium`}
                    onClick={() => setViewWindow(TicketStatus.IN_PROGRESS)}
                >
                    Assigned Tickets
                </button>
                <button className={`inline w-[50%] rounded-lg ${viewWindow === TicketStatus.RESOLVED? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'} px-4 py-2 font-medium`}
                    onClick={() => setViewWindow(TicketStatus.RESOLVED)}
                >
                    Resolved Tickets
                </button>
                <button className={`inline w-[50%] rounded-lg ${viewWindow === TicketStatus.REJECTED? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'} px-4 py-2 font-medium`}
                    onClick={() => setViewWindow(TicketStatus.REJECTED)}
                >
                    Rejected Tickets
                </button>
            </div>
            <div>
                    <div>
                        {Array.isArray(tickets) && tickets.length > 0 ? (
                            <div className="my-4 space-y-4 flex-1 rounded-lg bg-slate-100 p-4">
                                {tickets?.map((ticket) => (
                            <div key={ticket.id}>
                                <h2>{ticket.title}</h2>
                                <p><span>{ticket.priority}</span></p>
                                <p>{ticket.description}</p>
                                <button onClick={() => {
                                    setSelectedTicket(ticket);
                                    setViewTicketDetails(true);
                                }} className="text-blue-600 hover:underline">
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>) : (<div className="my-4 space-y-4 rounded-lg bg-slate-100 p-4"> <p>No {viewWindow} Ticket Available</p></div>)}
                </div>
            </div>

            {(viewTicketDetails && selectedTicket) && (<ViewTicketDetails userRole={UserRole.AGENT} userId={agentId}
                setTickets={setTickets}
                selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket}
                viewTicketDetails={viewTicketDetails} setViewTicketDetails={setViewTicketDetails} />)}
        </div>
    )

}

export default AgentTickets
