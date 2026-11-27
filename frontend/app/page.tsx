"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function GeometricHeroCluster() {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-5 grid-rows-2 w-[300px] sm:w-[380px] md:w-[440px] h-[120px] sm:h-[152px] md:h-[176px]"
    >
      {/* Row 1, Col 1: Empty spacer for staggered edge */}
      <div />
      {/* Row 1, Col 2: Quarter circle teal */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect width="100" height="100" fill="#065F46" />
        <path d="M0,100 A100,100 0 0,1 100,0 L100,100 Z" fill="#34D399" />
      </svg>
      {/* Row 1, Col 3: Diagonal split amber & mint */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polygon points="0,0 100,0 0,100" fill="#A7F3D0" />
        <polygon points="100,0 100,100 0,100" fill="#10B981" />
      </svg>
      {/* Row 1, Col 4: Circle inside dark emerald */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect width="100" height="100" fill="#047857" />
        <circle cx="50" cy="50" r="46" fill="#6EE7B7" />
      </svg>
      {/* Row 1, Col 5: Split semicircle */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect width="100" height="100" fill="#064E3B" />
        <path d="M0,0 A50,50 0 0,1 0,100 Z" fill="#FBBF24" />
        <path d="M100,0 A50,50 0 0,0 100,100 Z" fill="#10B981" />
      </svg>

      {/* Row 2, Col 1: Half triangle */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polygon points="0,100 100,0 100,100" fill="#34D399" />
      </svg>
      {/* Row 2, Col 2: Hourglass triangles */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect width="100" height="100" fill="#064E3B" />
        <polygon points="0,0 50,50 0,100" fill="#FBBF24" />
        <polygon points="100,0 50,50 100,100" fill="#A7F3D0" />
      </svg>
      {/* Row 2, Col 3: Opposing quarter arcs */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect width="100" height="100" fill="#10B981" />
        <path d="M0,0 L100,0 A100,100 0 0,1 0,100 Z" fill="#065F46" />
      </svg>
      {/* Row 2, Col 4: Full mint circle */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect width="100" height="100" fill="#059669" />
        <circle cx="50" cy="50" r="48" fill="#D1FAE5" />
      </svg>
      {/* Row 2, Col 5: Diagonal emerald & amber */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polygon points="0,0 100,0 100,100" fill="#34D399" />
        <polygon points="0,0 100,100 0,100" fill="#065F46" />
      </svg>
    </div>
  );
}

function BrandLogo({ light = true }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group">
      <svg viewBox="0 0 36 36" className="h-8 w-8 shrink-0">
        <rect
          width="36"
          height="36"
          rx="6"
          fill={light ? "#10B981" : "#064E3B"}
        />
        <path
          d="M18 6A12 12 0 1 0 30 18H23A5 5 0 1 1 18 13V6Z"
          fill={light ? "#ECFDF5" : "#34D399"}
        />
        <circle cx="25" cy="11" r="4" fill="#FBBF24" />
      </svg>
      <span
        className={`text-lg font-bold tracking-tight ${
          light ? "text-white" : "text-emerald-950"
        }`}
      >
        HelpDesk
      </span>
    </Link>
  );
}

export default function LandingPage() {
  const router = useRouter();



  const partnerOrgs = [
    "MedCore",
    "FinBridge",
    "Veloce",
    "CloudGrid",
    "NorthStar",
    "Kinetix",
    "ApexLab",
    "PulseOps",
    "Strata",
    "MetroHealth",
    "NexGen",
    "ClearDesk",
  ];

  const capabilities = [
    {
      title: "Domain Onboarding",
      description:
        "Register your organization once and automatically scope every employee and agent under @yourdomain.com.",
      icon: (
        <svg viewBox="0 0 48 48" className="h-12 w-12">
          <rect width="48" height="48" fill="#10B981" />
          <polygon points="0,0 24,24 0,48" fill="#064E3B" />
          <polygon points="48,0 24,24 48,48" fill="#A7F3D0" />
        </svg>
      ),
    },
    {
      title: "Role-Based Access",
      description:
        "Separate permissions for Admins, Support Agents, and Employees with encrypted credentials and active status controls.",
      icon: (
        <svg viewBox="0 0 48 48" className="h-12 w-12">
          <rect width="48" height="48" fill="#059669" />
          <circle cx="24" cy="24" r="18" fill="#6EE7B7" />
        </svg>
      ),
    },
    {
      title: "Ticket Assignment",
      description:
        "Track every issue from creation to resolution with clear creator ownership and dedicated agent assignment.",
      icon: (
        <svg viewBox="0 0 48 48" className="h-12 w-12">
          <rect width="48" height="48" fill="#D1FAE5" />
          <path d="M0,48 A48,48 0 0,1 48,0 L48,48 Z" fill="#10B981" />
        </svg>
      ),
    },
    {
      title: "Threaded Comments",
      description:
        "Keep troubleshooting steps, status updates, and internal context attached directly to each ticket timeline.",
      icon: (
        <svg viewBox="0 0 48 48" className="h-12 w-12">
          <rect width="48" height="48" fill="#FBBF24" />
          <path d="M0,0 L48,0 A48,48 0 0,1 0,48 Z" fill="#065F46" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-emerald-300 selection:text-emerald-950">
      {/* ================= HERO & NAVBAR ================= */}
        {/* Top Navigation */}
        <nav className=" sticky top-0 z-50 bg-emerald-800 border border-emerald-300 w-full mx-auto flex items-center justify-between px-6 py-6">
          <BrandLogo light />

          <div className="hidden md:flex items-center gap-8 text-xs font-medium tracking-wide text-emerald-100/80">
            <a href="#metrics" className="hover:text-white transition">
              Impact
            </a>
            <a href="#workflows" className="hover:text-white transition">
              Workflows
            </a>
            <a href="#guides" className="hover:text-white transition">
              Guides
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-medium text-emerald-100 hover:text-white transition"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
              Agent &amp; Staff Login
            </Link>
            <Link
              href="/create-organization"
              className="rounded-sm bg-emerald-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-emerald-950 hover:bg-emerald-400 transition"
            >
              Create Org
            </Link>
          </div>
        </nav>
      <header className="relative bg-emerald-950 text-white overflow-hidden">

        {/* Hero Main Content */}
        <div className="mx-auto max-w-6xl px-6 pt-14 pb-28 md:pt-20 md:pb-36 relative">
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl font-bold leading-[1.15] tracking-tight text-white">
              We Power Fast,
              <br />
              Structured Internal
              <br />
              HelpDesk Teams.
            </h1>
            <p className="mt-5 text-sm sm:text-base text-emerald-100/80 max-w-md leading-relaxed">
              Domain-isolated workspaces where employees raise tickets, agents
              resolve bottlenecks, and admins keep full visibility.
            </p>
          </div>

          {/* Bottom-Right Bauhaus Geometric Cluster */}
          <div className="mt-12 md:mt-0 md:absolute md:right-0 md:bottom-0 flex justify-end">
            <GeometricHeroCluster />
          </div>
        </div>

        {/* Split Bar Strip (White Left + Deep Emerald Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-t border-emerald-900">
          <div className="md:col-span-5 bg-white px-6 py-5 flex items-center justify-between md:justify-end md:gap-10 md:pr-10">
            <span className="text-xs font-medium text-slate-500">
              Built for multi-tenant organizations
            </span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
              ✓
            </span>
          </div>
          <div className="md:col-span-7 bg-emerald-900/90 px-6 py-5 flex flex-wrap items-center justify-around gap-6 text-emerald-100/75 text-xs font-semibold tracking-widest uppercase">
            <span>MedCore</span>
            <span>FinBridge</span>
            <span>CloudGrid</span>
            <span>PulseOps</span>
          </div>
        </div>
      </header>

      {/* ================= METRICS BENTO GRID ================= */}
      <section id="metrics" className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {/* Cell 1: Editorial Heading */}
          <div className="flex flex-col justify-center pr-4 py-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Lean &amp;{" "}
              <span className="underline decoration-emerald-500 decoration-2 underline-offset-8">
                Reliable
              </span>
            </h2>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Every organization gets isolated user directories, role-gated
              queues, and real-time ticket accountability out of the box.
            </p>
          </div>

          {/* Cell 2: Emerald Metric */}
          <div className="rounded-sm bg-emerald-600 p-8 text-white flex flex-col justify-between min-h-[156px]">
            <div className="text-4xl font-bold tracking-tight">94%</div>
            <div className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-emerald-100">
              First-Contact Ticket Resolution
            </div>
          </div>

          {/* Cell 3: Slate Metric */}
          <div className="rounded-sm bg-slate-700 p-8 text-white flex flex-col justify-between min-h-[156px]">
            <div className="text-4xl font-bold tracking-tight">-68%</div>
            <div className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-slate-200">
              Average Triage &amp; Routing Time
            </div>
          </div>

          {/* Cell 4: Muted Stone Metric */}
          <div className="rounded-sm bg-stone-400 p-8 text-white flex flex-col justify-between min-h-[156px]">
            <div className="text-4xl font-bold tracking-tight">3 Roles</div>
            <div className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-stone-100">
              Admin · Agent · Employee Access
            </div>
          </div>

          {/* Cell 5: Deep Forest Metric */}
          <div className="rounded-sm bg-emerald-950 p-8 text-white flex flex-col justify-between min-h-[156px]">
            <div className="text-4xl font-bold tracking-tight">100%</div>
            <div className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-emerald-200">
              Domain-Scoped Tenant Isolation
            </div>
          </div>

          {/* Cell 6: Warm Amber Metric */}
          <div className="rounded-sm bg-amber-500 p-8 text-emerald-950 flex flex-col justify-between min-h-[156px]">
            <div className="text-4xl font-bold tracking-tight">&lt; 2m</div>
            <div className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-emerald-950/80">
              Workspace &amp; Admin Provisioning
            </div>
          </div>
        </div>
      </section>

      {/* ================= PARTNER / ORG LOGOS GRID ================= */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="border-t border-slate-200 pt-12">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Teams Running On HelpDesk
          </p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-y-10 gap-x-8 items-center">
            {partnerOrgs.map((org, idx) => (
              <div
                key={org}
                className="flex items-center gap-2.5 text-slate-700 font-bold text-base tracking-tight"
              >
                <span
                  className={`h-3 w-3 rounded-xs ${
                    idx % 3 === 0
                      ? "bg-emerald-600"
                      : idx % 3 === 1
                      ? "bg-amber-500"
                      : "bg-slate-800"
                  }`}
                />
                <span>{org}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GUIDES & KNOWLEDGE BASE ================= */}
      <section id="guides" className="relative bg-stone-100 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-stretch">
            {/* Left Intro Column */}
            <div className="flex flex-col justify-between py-2">
              <div>
                <h2 className="text-2xl font-bold leading-snug text-slate-900">
                  Read Our Guides for{" "}
                  <span className="underline decoration-emerald-500 decoration-2 underline-offset-4">
                    Ticket Triage
                  </span>{" "}
                  &amp; Support Ops
                </h2>
                <p className="mt-4 text-xs leading-relaxed text-slate-500">
                  Practical playbooks on structuring internal IT queues,
                  assigning agents cleanly, and cutting repeat employee requests.
                </p>
              </div>
            </div>

            {/* Middle Dark Emerald Card */}
            <article className="rounded-sm bg-emerald-950 p-8 text-white flex flex-col justify-between min-h-[280px] shadow-sm">
              <h3 className="text-xl font-bold leading-snug">
                Multi-tenant HelpDesk 101: setting up domain-based employee
                onboarding
              </h3>
              <div className="mt-8 border-t border-emerald-800 pt-4 text-[11px] text-emerald-300">
                Workspace Architecture · 4 min read
              </div>
            </article>

            {/* Right Teal/Amber Accent Card */}
            <article className="rounded-sm bg-teal-600 p-8 text-white flex flex-col justify-between min-h-[280px] shadow-sm">
              <h3 className="text-xl font-bold leading-snug">
                How structured agent assignment &amp; ticket threads cut
                internal backlog in half
              </h3>
              <div className="mt-8 border-t border-teal-500 pt-4 text-[11px] text-teal-100">
                Support Operations · 5 min read
              </div>
            </article>
          </div>
        </div>

        {/* Overlapping Geometric Corner Accent */}
        <div
          aria-hidden="true"
          className="hidden md:grid grid-cols-2 grid-rows-2 w-24 h-24 absolute right-8 -bottom-12 z-10"
        >
          <svg viewBox="0 0 50 50">
            <rect width="50" height="50" fill="#10B981" />
            <circle cx="25" cy="25" r="20" fill="#A7F3D0" />
          </svg>
          <svg viewBox="0 0 50 50">
            <polygon points="0,0 50,0 0,50" fill="#FBBF24" />
            <polygon points="50,0 50,50 0,50" fill="#064E3B" />
          </svg>
          <svg viewBox="0 0 50 50">
            <polygon points="0,0 50,50 0,50" fill="#34D399" />
          </svg>
          <svg viewBox="0 0 50 50">
            <rect width="50" height="50" fill="#065F46" />
            <path d="M0,50 A50,50 0 0,1 50,0 L50,50 Z" fill="#6EE7B7" />
          </svg>
        </div>
      </section>

      {/* ================= WORKFLOWS THAT RESOLVE (DARK SECTION) ================= */}
      <section
        id="workflows"
        className="relative bg-emerald-950 text-white pt-24 pb-28"
      >
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold">
            Workflows That{" "}
            <span className="underline decoration-amber-400 decoration-2 underline-offset-8">
              Resolve
            </span>
          </h2>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {capabilities.map((item) => (
              <div key={item.title} className="space-y-4">
                <div>{item.icon}</div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs leading-relaxed text-emerald-100/75">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-end">
            <Link
              href="/create-organization"
              className="rounded-sm bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-emerald-950 hover:bg-emerald-100 transition"
            >
              Register Organization →
            </Link>
          </div>
        </div>

        {/* Bottom-Left Asymmetric Cutout Bridge */}
        <div
          aria-hidden="true"
          className="hidden md:flex items-end absolute left-0 bottom-0"
        >
          <div className="h-12 w-[36vw] bg-white" />
          <svg viewBox="0 0 48 48" className="h-12 w-12">
            <polygon points="0,0 48,48 0,48" fill="#10B981" />
          </svg>
        </div>
      </section>

      {/* ================= TESTIMONIALS + ORG MATRIX ================= */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-2xl font-bold text-slate-900">
          Our{" "}
          <span className="underline decoration-emerald-500 decoration-2 underline-offset-8">
            Happy Teams
          </span>
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Quote Box */}
          <div className="md:col-span-6 bg-stone-100 p-8 sm:p-10 rounded-sm">
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
              “Onboarding our organization took less than two minutes. Having
              all employee emails automatically mapped to our company domain and
              routed straight to assigned support agents eliminated lost Slack
              requests completely.”
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold">
                AR
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Arif Rahman
                </div>
                <div className="text-[11px] text-slate-500">
                  IT Operations Lead, MedCore
                </div>
              </div>
            </div>
          </div>

          {/* Right 3x4 Mini Org Grid with Elevated Active Card */}
          <div className="md:col-span-6 grid grid-cols-3 gap-3">
            {partnerOrgs.slice(0, 9).map((org, i) => (
              <div
                key={org}
                className={`flex items-center justify-center py-6 px-3 text-xs font-bold tracking-tight transition ${
                  i === 3
                    ? "bg-white shadow-lg ring-1 ring-slate-200/80 text-emerald-900 scale-105"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {org}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRE-FOOTER CTA BAND ================= */}
      <section className="bg-teal-600 text-white">
        <div className="mx-auto max-w-5xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 44 44" className="h-11 w-11 shrink-0">
              <rect width="44" height="44" fill="#064E3B" />
              <polygon points="0,0 22,22 0,44" fill="#FBBF24" />
              <polygon points="44,0 22,22 44,44" fill="#34D399" />
            </svg>
            <h2 className="text-lg sm:text-xl font-bold leading-snug">
              Let’s Organize Your Team’s
              <br />
              Support Tickets
            </h2>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-emerald-950 text-emerald-200/70 py-12">
        <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <BrandLogo light />
            <p className="text-[11px] leading-relaxed">
              A portfolio project by{" "} <Link href="https://eshraquejabidifti.vercel.app" 
              target="_blank" 
              rel="noreferrer" 
              className="underline hover:text-white transition">Eshraque Jabid Ifti</Link>.<br />
              Built with Next.js, NestJS, Tailwind CSS, PostgreSQL, and NeonDB.
              <br />
              © {new Date().getFullYear()} HelpDesk. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <Link href="/create-organization" className="hover:text-white transition">
              Register
            </Link>
            <Link href="/login" className="hover:text-white transition">
              Login
            </Link>
            <a
              href="https://github.com/ifti-77/HelpDesk"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-800 text-emerald-200 hover:border-emerald-500 hover:text-white transition"
              aria-label="GitHub Repository"
            >
              GH
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}