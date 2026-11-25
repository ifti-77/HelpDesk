"use client"
import { useActionState, useState } from "react"
import { createOrganization } from "../_Action/createOrganizationAction"

export default function CreateOrganization() {



    const [organizationName, setOrganizationName] = useState("")
    const [organizationDomain, setOrganizationDomain] = useState("")

    const [state, action, pending] = useActionState(createOrganization, null)


    return (
        <div>
            <span className="text-2xl font-semibold text-gray-900">
                Create Organization
            </span>
            <span className="text-sm text-gray-500">
                Please fill in the details below to create your organization and register an admin account.
            </span>
            <span className="text-sm text-red-500">
                {state?.error}
            </span>
            <span className="text-sm text-green-500">
                {state?.success && "Organization created successfully!"}
            </span>
            <form
                action={action}
                className="mx-auto max-w-md space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
                <fieldset className="space-y-4">
                    <legend className="text-base font-semibold text-gray-900">
                        Organization Details
                    </legend>

                    <div>
                        <label
                            htmlFor="organizationName"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Organization Name
                        </label>
                        <input
                            type="text"
                            id="organizationName"
                            name="organizationName"
                            value={organizationName || state?.organizationName || ""}
                            onChange={(e) => setOrganizationName(e.target.value)}
                            placeholder="Acme Inc."
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="organizationDomain"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Organization Domain
                        </label>
                        <input
                            type="text"
                            id="organizationDomain"
                            name="organizationDomain"
                            value={organizationDomain || state?.organizationDomain || ""}
                            onChange={(e) => setOrganizationDomain(e.target.value)}
                            placeholder="acme.com"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </fieldset>

                <fieldset className="space-y-4 border-t border-gray-200 pt-5">
                    <legend className="text-base font-semibold text-gray-900">
                        Organization Admin Registration
                    </legend>

                    <div>
                        <label
                            htmlFor="adminName"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Admin Name
                        </label>
                        <input
                            type="text"
                            id="adminName"
                            name="adminName"
                            defaultValue={state?.adminName || ""}
                            placeholder="Alice Smith"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="adminEmail"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Admin Email
                        </label>
                        <div className="flex rounded-md shadow-xs">
                            <input
                                type="text"
                                id="adminEmail"
                                name="adminEmail"
                                defaultValue={state?.adminEmail || ""}
                                placeholder="alice"
                                className="w-full rounded-l-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-100 px-3 text-sm text-gray-500">
                                @{organizationDomain || ""}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="adminPassword"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Admin Password
                        </label>
                        <input
                            type="password"
                            id="adminPassword"
                            name="adminPassword"
                            defaultValue={state?.adminPassword || ""}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </fieldset>

                <button
                    type="submit"
                    disabled={pending}
                    className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {pending ? "Creating..." : "Create Organization"}
                </button>
            </form>

        </div>
    )
}