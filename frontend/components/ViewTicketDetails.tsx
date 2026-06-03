
import { Ticket, TicketStatus } from '@/CustomTypes/TicketType'
import { User, UserRole } from '@/CustomTypes/UserType'
import axios from 'axios'


import { useState, useEffect, useRef, useLayoutEffect } from 'react'

const ViewTicketDetails = ({ userRole,
    setTickets,
    selectedTicket, setSelectedTicket,
    viewTicketDetails, setViewTicketDetails }: {
        userRole: UserRole | null,
        setTickets: React.Dispatch<React.SetStateAction<Ticket[] | null>>,
        selectedTicket: Ticket | null,
        setSelectedTicket: React.Dispatch<React.SetStateAction<Ticket | null>>,
        viewTicketDetails: boolean, setViewTicketDetails: React.Dispatch<React.SetStateAction<boolean>>
    }) => {

    const [assignAbleAgents, setAssignAbleAgents] = useState<User[] | null>(null)

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [value, setValue] = useState("")

    useEffect(() => {
        if (userRole === UserRole.ADMIN && selectedTicket?.status === TicketStatus.OPEN) {
            const fetchAssignAbleAgents = async () => {
                try {

                    const response = await axios.get<User[] | null>(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/role/${UserRole.AGENT}`, {
                        withCredentials: true
                    })

                    console.log(response.status)
                    if (response.status === 200) {
                        const data = await response.data
                        setAssignAbleAgents(data)
                        console.log(assignAbleAgents)
                        console.log(data)
                    }
                }
                catch (error) {
                    if (axios.isAxiosError(error) && error.response) {
                        alert(error.response.data?.message)
                    }
                }
            }
            fetchAssignAbleAgents()
        }
    }, [selectedTicket])

    useLayoutEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = textareaRef.current?.scrollHeight + "px"
        }
    }, [value])

    const handlePostComment = async () => {
        if (value.trim().length === 0) {
            alert('Comment cannot be empty')
            return
        }
        try {
            let response

            if (userRole === UserRole.ADMIN) {
                response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/tickets/comments/${selectedTicket?.id}`, {
                    comment: value
                }, {
                    withCredentials: true
                })
            }
            else if (userRole === UserRole.AGENT) {
                response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/agent/tickets/comments/${selectedTicket?.id}`, {
                    comment: value
                }, {
                    withCredentials: true
                })
            }
            else if (userRole === UserRole.EMPLOYEE) {

                response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/employee/tickets/comments/${selectedTicket?.id}`, {
                    comment: value
                }, {
                    withCredentials: true
                })
            } else {
                alert('Invalid user role')
                return
            }

            if (response?.status === 201) {
                alert('Comment posted successfully')
                setValue("")
                setSelectedTicket((prev) => {
                    if (!prev) return prev
                    const updatedComments = [...prev.comments, response.data]
                    return { ...prev, comments: updatedComments }
                })
                setTickets((prev) => {
                    if (!prev) return prev
                    const updatedTickets = prev.map((ticket) => {
                        if (ticket.id === selectedTicket?.id) {
                            const updatedComments = [...ticket.comments, response.data]
                            return { ...ticket, comments: updatedComments }
                        }
                        return ticket
                    })
                    return updatedTickets
                })
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert(error.response.data?.message)
            }
        }
    }

    const DeleteTicket = async () => {
        if(userRole !== UserRole.EMPLOYEE) {
            alert('Only Employees can delete tickets')
            return
        }
        if (selectedTicket?.status !== TicketStatus.OPEN) {
            alert('Only OPEN tickets can be deleted')
            return
        }

        const confirmDelete = confirm(`Delete '${selectedTicket?.title}' this ticket?`)
        if (!confirmDelete) return

        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/employee/tickets/${selectedTicket?.id}`, {
                withCredentials: true
            })
            if (response.status === 200) {
                alert('Ticket deleted successfully')
                setViewTicketDetails(false)
                setSelectedTicket(null)
                setTickets((prev) => {
                    if (!prev) return prev
                    const updatedTickets = prev.filter((ticket) => ticket.id !== selectedTicket?.id)
                    return updatedTickets
                })
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert(error.response.data?.message)
            }
        }
    }
    const CloseTicket = async () => {

        if(userRole !== UserRole.EMPLOYEE) {
            alert('Only Employees can Close tickets')
            return
        }

        if (selectedTicket?.status !== TicketStatus.RESOLVED) {
            alert('Only RESOLVED tickets can be closed')
            return
        }

        const confirmDelete = confirm(`Close '${selectedTicket?.title}' this ticket?`)
        if (!confirmDelete) return

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/employee/tickets/status/${selectedTicket?.id}`, {
                status: TicketStatus.CLOSED
            }, {
                withCredentials: true
            })
            if (response.status === 200) {
                alert('Ticket closed successfully')
                setViewTicketDetails(false)
                setSelectedTicket(null)
                setTickets((prev) => {
                    if (!prev) return prev
                    const updatedTickets = prev.filter((ticket) => ticket.id !== selectedTicket?.id)
                    return updatedTickets
                })
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert(error.response.data?.message)
            }
        }
    }
    const ResolveTicket = async () => {

        if(userRole !== UserRole.AGENT) {
            alert('Only Agents can resolve tickets')
            return
        }

        if (selectedTicket?.status !== TicketStatus.IN_PROGRESS) {
            alert('Only IN_PROGRESS tickets can be resolved')
            return
        }

        const confirmDelete = confirm(`Resolve '${selectedTicket?.title}' this ticket?`)
        if (!confirmDelete) return

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/agent/tickets/status/${selectedTicket?.id}`, {
                status: TicketStatus.RESOLVED
            }, {
                withCredentials: true
            })
            if (response.status === 200) {
                alert('Ticket resolved successfully')
                setViewTicketDetails(false)
                setSelectedTicket(null)
                setTickets((prev) => {
                    if (!prev) return prev
                    const updatedTickets = prev.filter((ticket) => ticket.id !== selectedTicket?.id)
                    return updatedTickets
                })
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert(error.response.data?.message)
            }
        }
    }
    const RejectTicket = async () => {

        if(userRole !== UserRole.AGENT) {
            alert('Only Agents can reject tickets')
            return
        }

        if (selectedTicket?.status !== TicketStatus.IN_PROGRESS) {
            alert('Only IN_PROGRESS tickets can be rejected')
            return
        }

        const confirmDelete = confirm(`Reject '${selectedTicket?.title}' this ticket?`)
        if (!confirmDelete) return

        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/agent/tickets/${selectedTicket?.id}`, {
                withCredentials: true
            })
            if (response.status === 200) {
                alert('Ticket rejected successfully')
                setViewTicketDetails(false)
                setSelectedTicket(null)
                setTickets((prev) => {
                    if (!prev) return prev
                    const updatedTickets = prev.filter((ticket) => ticket.id !== selectedTicket?.id)
                    return updatedTickets
                })
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                alert(error.response.data?.message)
            }
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
            <div className="w-full max-w-[90%] rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mb-5 flex flex-col items-start justify-between">
                    <div className="flex w-full items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Ticket Details</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {selectedTicket?.title}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${selectedTicket?.priority === 'HIGH' ? 'bg-red-100 text-red-800' : selectedTicket?.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {selectedTicket?.priority}
                        </span>
                        <div>
                            {ReturnStatusStyle(selectedTicket?.status)}
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <span className="text-sm text-slate-500">Created by: {selectedTicket?.createdBy?.name}</span>
                        <span className="text-sm text-slate-500">Assigned to: {selectedTicket?.assignedTo ? selectedTicket?.assignedTo.name : 'Unassigned'}</span>
                        {userRole === UserRole.ADMIN && selectedTicket?.assignedTo === null && <div>
                            <select className='border-2 border-slate-500 outline-slate-700'>
                                <option value="" selected hidden>Assign to Agent</option>
                                {assignAbleAgents ? (
                                    assignAbleAgents.map((agents, index) => agents.id !== selectedTicket?.assignedTo?.id && (<option key={index}>{agents.name}-{agents.email}</option>))
                                ) : (<option disabled>No Agent availabe</option>)}
                            </select>
                            <button className='bg-green-300 hover:bg-green-500 px-4 py-1.5 m-2 rounded-md text-white'>Assign</button>
                        </div>}
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-slate-700">{selectedTicket?.description}</p>
                    </div>

                    <div className="w-full flex justify-between gap-2 mt-4 overflow-auto max-h-60 rounded-lg bg-slate-50 p-4">
                        <div>

                            <h3 className="text-lg font-semibold text-slate-900">Comments</h3>
                            {selectedTicket?.comments.length === 0 ? (
                                <p className="text-sm text-slate-500">No comments yet.</p>
                            ) : (
                                <ul className="space-y-2 ">
                                    {selectedTicket?.comments.map((comment, index) => (
                                        <li key={index} className="text-sm text-slate-700 bg-slate-100 p-3 rounded-lg">
                                            <span className="font-medium bg-slate-200 p-1 rounded">
                                                {comment.user.name}:
                                            </span> {comment.message} - <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {selectedTicket?.status !== TicketStatus.CLOSED && (
                            <div className="flex w-[45%] flex-col items-end gap-2">
                                <textarea wrap='soft' className="w-full rounded-lg border border-slate-300 p-2 
                                        text-sm text-slate-700 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 resize-none"
                                    ref={textareaRef}
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="Add a comment...">

                                </textarea>
                                <button className='block bg-transparent border-b rounded-md px-3 py-1 hover:text-blue-700 border-b-blue-500 hover:border-2
                                         hover:border-blue-600 transition-all delay-25 duration-50 ease-in-out cursor-pointer'
                                    onClick={handlePostComment}>
                                    Post Comment
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between gap-3 pt-3 w-full">
                        <button
                            type="button"
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            onClick={() => {
                                setViewTicketDetails(false)
                                setSelectedTicket(null)
                            }}
                        >
                            Close
                        </button>
                        <div className="flex gap-2">

                            {userRole === UserRole.EMPLOYEE && selectedTicket?.status === TicketStatus.OPEN && (
                                <button
                                    type="button"
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    onClick={() => DeleteTicket()}
                                >
                                    Delete Ticket
                                </button>)}

                            {userRole === UserRole.EMPLOYEE && selectedTicket?.status === TicketStatus.RESOLVED && (
                                <button
                                    type="button"
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    onClick={() => CloseTicket()}
                                >
                                    Close Ticket
                                </button>)}

                            {userRole === UserRole.AGENT && selectedTicket?.status === TicketStatus.IN_PROGRESS && (
                                <button
                                    type="button"
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    onClick={() => ResolveTicket()}
                                >
                                    Resolve Ticket
                                </button>)}

                            {userRole === UserRole.AGENT && selectedTicket?.status === TicketStatus.IN_PROGRESS && (
                                <button
                                    type="button"
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    onClick={() => RejectTicket()}
                                >
                                    Reject Ticket
                                </button>)}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewTicketDetails



function ReturnStatusStyle(status: TicketStatus | undefined) {
    if (status === TicketStatus.OPEN) {

        return (
            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-bold bg-transparent border-2 border-blue-100 text-blue-800">{status}</span>
        )

    }
    else if (status === TicketStatus.IN_PROGRESS) {
        return (
            <>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800">{TicketStatus.OPEN}</span>——
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-bold bg-transparent border-2 border-yellow-100 text-yellow-800">{status}</span>
            </>
        )
    }
    else if (status === TicketStatus.REJECTED) {
        return (
            <>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800">{TicketStatus.OPEN}</span>——
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800">{TicketStatus.IN_PROGRESS}</span>——
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-bold bg-transparent border-2 border-red-100 text-red-800">{status}</span>
            </>
        )
    }
    else if (status === TicketStatus.RESOLVED) {
        return (
            <>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800">{TicketStatus.OPEN}</span>——
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800">{TicketStatus.IN_PROGRESS}</span>——
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-bold bg-transparent border-2 border-green-100 text-green-800">{status}</span>
            </>
        )
    }
    else {
        return (
            <>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800">{TicketStatus.OPEN}</span>——
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800">{TicketStatus.IN_PROGRESS}</span>——
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-red-100 text-red-800">{TicketStatus.RESOLVED}</span>——
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-bold bg-transparent border-2 border-gray-100 text-gray-800">{status}</span>
            </>
        )
    }
}