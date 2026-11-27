"use client"
import { useActionState, useState } from "react"
import { createOrganization } from "../_Action/createOrganizationAction"

export default function CreateOrganization() {



    const [organizationName, setOrganizationName] = useState("")
    const [organizationDomain, setOrganizationDomain] = useState("")

    const [state, action, pending] = useActionState(createOrganization, null)


    return (
        <div className="mx-2 my-2 overflow-hidden rounded-md border border-slate-200 bg-white sm:mx-2">
    <header className="bg-emerald-950 px-4 py-6 text-white">
        <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5 text-base font-bold tracking-tight">
                <svg viewBox="0 0 36 36" className="h-7 w-7 shrink-0">
                    <rect width="36" height="36" rx="6" fill="#10B981" />
                    <path
                        d="M18 6A12 12 0 1 0 30 18H23A5 5 0 1 1 18 13V6Z"
                        fill="#ECFDF5"
                    />
                    <circle cx="25" cy="11" r="4" fill="#FBBF24" />
                </svg>
                <span>HelpDesk</span>
            </a>
            <a
                href="/"
                className="text-xs font-medium text-emerald-200 hover:text-white transition"
            >
                Back to Home
            </a>
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight">
            Create Organization
        </h1>
        <p className="mt-1 text-xs leading-relaxed text-emerald-100/80">
            Set up your workspace domain and register the primary admin account.
        </p>
    </header>

    <form action={action} className="space-y-6 p-6 sm:p-8">
        {state?.error && (
            <p className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                {state.error}
            </p>
        )}

        {state?.success && (
            <p className="rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800">
                Organization created successfully!
            </p>
        )}

        <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-slate-900">
                Organization Details
            </legend>

            <div>
                <label
                    htmlFor="organizationName"
                    className="mb-1.5 block text-xs font-semibold text-slate-700"
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
                    className="w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
            </div>

            <div>
                <label
                    htmlFor="organizationDomain"
                    className="mb-1.5 block text-xs font-semibold text-slate-700"
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
                    className="w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
            </div>
        </fieldset>

        <fieldset className="space-y-4 border-t border-slate-200 pt-5">
            <legend className="text-sm font-bold text-slate-900">
                Organization Admin Registration
            </legend>

            <div>
                <label
                    htmlFor="adminName"
                    className="mb-1.5 block text-xs font-semibold text-slate-700"
                >
                    Admin Name
                </label>
                <input
                    type="text"
                    id="adminName"
                    name="adminName"
                    defaultValue={state?.adminName || ""}
                    placeholder="Alice Smith"
                    className="w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
            </div>

            <div>
                <label
                    htmlFor="adminEmail"
                    className="mb-1.5 block text-xs font-semibold text-slate-700"
                >
                    Admin Email
                </label>
                <div className="flex rounded-sm">
                    <input
                        type="text"
                        id="adminEmail"
                        name="adminEmail"
                        defaultValue={state?.adminEmail || ""}
                        placeholder="alice"
                        className="w-full rounded-l-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:z-10 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                    <span className="inline-flex items-center rounded-r-sm border border-l-0 border-slate-300 bg-emerald-50 px-3 text-xs font-medium text-emerald-900">
                        @{organizationDomain || state?.organizationDomain || "domain.com"}
                    </span>
                </div>
            </div>

            <div>
                <label
                    htmlFor="adminPassword"
                    className="mb-1.5 block text-xs font-semibold text-slate-700"
                >
                    Admin Password
                </label>
                <input
                    type="password"
                    id="adminPassword"
                    name="adminPassword"
                    defaultValue={state?.adminPassword || ""}
                    placeholder="••••••••"
                    className="w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
            </div>
        </fieldset>

        <button
            type="submit"
            disabled={pending}
            className="w-full rounded-sm bg-emerald-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition cursor-pointer"
        >
            {pending ? "Creating..." : "Create Organization"}
        </button>

        <p className="text-center text-xs text-slate-500">
            Already have an organization workspace?{" "}
            <a
                href="/login"
                className="font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-4"
            >
                Sign in
            </a>
        </p>
    </form>
</div>
    )
}