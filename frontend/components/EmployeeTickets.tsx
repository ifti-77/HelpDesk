"use client"
import React, { useEffect } from 'react'
import { Ticket, TicketStatus } from '@/CustomTypes/TicketType'
import { UserRole } from '@/CustomTypes/UserType'
import axios from 'axios'
import ViewTicketDetails from './ViewTicketDetails'
import CreateTicket from './CreateTicket'
function EmployeeTickets() {
    const [viewWindow, setViewWindow] = React.useState<'create-tickets' | 'view-tickets' | TicketStatus.CLOSED>('create-tickets')
    const [tickets, setTickets] = React.useState<Ticket[] | null>([{
        id: '1', title: 'Sample Ticket',
        priority: 'MEDIUM' as any,
        status: TicketStatus.OPEN as any,
        description: 'This is a sample ticket.',
        createdBy: { name: 'John Doe' } as any,
        assignedTo: null,
        category: 'Bug Report' as any,
        comments: [{ user: { name: 'John Doe' }, message: 'This is a sample comment.', createdAt: new Date() },
        { user: { name: 'Jane Smith' }, message: 'This is another comment.', createdAt: new Date() },
        { user: { name: 'Jane Doe' }, message: 'This is another 2nd comment.', createdAt: new Date() }] as any[],
        createdAt: new Date() as any,
        updatedAt: new Date() as any
    } as Ticket])
    const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null)
    const [viewTicketDetails, setViewTicketDetails] = React.useState(false)



    const FetchSelfTickets = async (viewWindow: 'view-tickets' | TicketStatus.CLOSED) => {
        try {
            let response
            if (viewWindow === TicketStatus.CLOSED) {
                response = await axios.get<Ticket[] | null>(`${process.env.NEXT_PUBLIC_API_URL}/employee/tickets/status/${viewWindow}`, {
                    withCredentials: true
                })

            } else {
                response = await axios.get<Ticket[] | null>(`${process.env.NEXT_PUBLIC_API_URL}/employee/tickets`, {
                    withCredentials: true
                })
            }

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
        if (viewWindow !== 'create-tickets') {
            FetchSelfTickets(viewWindow)
        }
    }, [viewWindow === TicketStatus.CLOSED, viewWindow === 'view-tickets'])


    return (
        <div>
            <div>

                <h1 className="text-3xl font-bold text-slate-900">Manage Tickets</h1>
                <button className={`inline w-[50%] rounded-lg ${viewWindow === 'create-tickets' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'} px-4 py-2 font-medium`}
                    onClick={() => setViewWindow('create-tickets')}
                >
                    Create Tickets
                </button>
                <button className={`inline w-[50%] rounded-lg ${viewWindow === 'view-tickets' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'} px-4 py-2 font-medium`}
                    onClick={() => setViewWindow('view-tickets')}
                >
                    View Tickets
                </button>
                <button className={`inline w-[50%] rounded-lg ${viewWindow === TicketStatus.CLOSED ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'} px-4 py-2 font-medium`}
                    onClick={() => setViewWindow(TicketStatus.CLOSED)}
                >
                    Closed Tickets
                </button>
            </div>
            <div>
                {viewWindow === 'create-tickets' ? (
                    <div className="my-4 space-y-4 flex-1 rounded-lg bg-slate-100 p-4">
                        <CreateTicket />
                    </div>
                ) : (
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
                </div>)}
            </div>

            {(viewTicketDetails && selectedTicket) && (<ViewTicketDetails userRole={UserRole.EMPLOYEE}
                setTickets={setTickets}
                selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket}
                viewTicketDetails={viewTicketDetails} setViewTicketDetails={setViewTicketDetails} />)}
        </div>
    )

}

export default EmployeeTickets
