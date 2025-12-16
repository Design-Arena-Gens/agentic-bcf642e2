/* eslint-disable @next/next/no-img-element */
"use client";

import { Fragment, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Tab } from "@headlessui/react";
import {
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import {
  agents as mockAgents,
  dealers as mockDealers,
  knowledgeBase,
  timeline,
  onboardingStages
} from "@/lib/mock-data";
import { calculateStageDistribution, classNames, formatDate, formatDateTime } from "@/lib/utils";
import type { DealerEngagement, OnboardingTask } from "@/lib/types";

const statusAccent: Record<string, string> = {
  New: "from-blue-500/40 via-blue-500/10 to-blue-500/0 border-blue-400/40",
  Discovery: "from-purple-500/40 via-purple-500/10 to-purple-500/0 border-purple-400/40",
  Contracting: "from-amber-500/40 via-amber-500/10 to-amber-500/0 border-amber-400/40",
  Training: "from-emerald-500/40 via-emerald-500/10 to-emerald-500/0 border-emerald-400/40",
  Compliance: "from-sky-500/40 via-sky-500/10 to-sky-500/0 border-sky-400/40",
  Live: "from-rose-500/40 via-rose-500/10 to-rose-500/0 border-rose-400/40"
};

const riskBadge: Record<DealerEngagement["risk"], string> = {
  low: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
  medium: "bg-amber-500/10 text-amber-300 border border-amber-500/30",
  high: "bg-rose-500/10 text-rose-300 border border-rose-500/30"
};

const categoryBadge: Record<
  (typeof timeline)[number]["category"],
  { label: string; className: string }
> = {
  milestone: { label: "Milestone", className: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30" },
  risk: { label: "Risk", className: "bg-rose-500/10 text-rose-300 border border-rose-500/30" },
  signal: { label: "Signal", className: "bg-sky-500/10 text-sky-300 border border-sky-500/30" },
  action: { label: "Action", className: "bg-amber-500/10 text-amber-300 border border-amber-500/30" }
};

const taskStates: Record<OnboardingTask["status"], string> = {
  pending: "text-slate-300 bg-slate-800/60 border border-slate-700/40",
  "in-progress": "text-sky-200 bg-sky-500/10 border border-sky-500/40",
  completed: "text-emerald-200 bg-emerald-500/10 border border-emerald-500/40"
};

export function OnboardingDashboard() {
  const [dealers, setDealers] = useState(mockDealers);
  const [selectedDealerId, setSelectedDealerId] = useState(dealers[0]?.id ?? "");
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const selectedDealer = useMemo(
    () => dealers.find((dealer) => dealer.id === selectedDealerId) ?? dealers[0],
    [selectedDealerId, dealers]
  );

  const velocity = calculateStageDistribution(dealers.map((dealer) => dealer.progress));
  const pipelineByStage = onboardingStages.map((stage) => ({
    stage,
    dealers: dealers.filter((dealer) => dealer.status === stage.key)
  }));

  function markTaskComplete(taskId: string) {
    setDealers((prev) =>
      prev.map((dealer) => {
        if (dealer.id !== selectedDealer?.id) {
          return dealer;
        }

        const tasks = dealer.tasks.map((task) => {
          if (task.id !== taskId) {
            return task;
          }

          const nextStatus: OnboardingTask["status"] =
            task.status === "completed" ? "in-progress" : task.status === "in-progress" ? "completed" : "completed";

          return {
            ...task,
            status: nextStatus
          };
        });

        return {
          ...dealer,
          tasks,
          progress: Math.min(100, dealer.progress + (tasks.every((task) => task.status === "completed") ? 8 : 0))
        };
      })
    );
  }

  function advanceStage(dealerId: string) {
    setDealers((prev) =>
      prev.map((dealer) => {
        if (dealer.id !== dealerId) {
          return dealer;
        }

        const currentIndex = onboardingStages.findIndex((stage) => stage.key === dealer.status);
        const nextStage = onboardingStages[Math.min(onboardingStages.length - 1, currentIndex + 1)];

        return {
          ...dealer,
          status: nextStage.key,
          progress: Math.min(95, dealer.progress + 12),
          notes: [
            `Advanced from ${dealer.status} to ${nextStage.label} with automated readiness validation.`,
            ...dealer.notes
          ].slice(0, 4)
        };
      })
    );
  }

  const aiAssistants = [
    {
      title: "Dealership Intake Triager",
      description:
        "Routes new dealer submissions to the right agent using intent detection, product fit heuristics, and capacity balancing.",
      outcomes: ["Auto-assigns agent", "Generates kickoff brief", "Schedules welcome call"],
      icon: "/icons/triage.svg"
    },
    {
      title: "Launch Navigator",
      description:
        "Analyzes task velocity vs. launch target, proposes mitigation paths, and syncs cross-team dependencies.",
      outcomes: ["Predicts launch risk", "Produces action queue", "Escalates blockers"],
      icon: "/icons/launch.svg"
    },
    {
      title: "Compliance Sentry",
      description:
        "Monitors regulatory checkpoints, confirms evidence packages, and keeps legal teams in the loop automatically.",
      outcomes: ["Validates artifacts", "Highlights gaps", "Updates dashboards"],
      icon: "/icons/compliance.svg"
    }
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10">
      <header className="rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900/80 via-slate-900/30 to-slate-900/10 p-8 shadow-soft ring-1 ring-white/5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur">
              <SparklesIcon className="h-5 w-5 text-brand-300" />
              Agentic onboarding control center
            </div>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">
              Dealer onboarding orchestrated by autonomous teammates
            </h1>
            <p className="max-w-3xl text-lg text-slate-300">
              Track readiness, balance agent capacity, and let AI copilots automate intake, contracting, and launch
              rituals. Every dealer gets a white-glove path to go-live without losing operational rigor.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-slate-700/60 bg-slate-900/80 px-4 py-1.5">
                3 active agents
              </span>
              <span className="rounded-full border border-slate-700/60 bg-slate-900/80 px-4 py-1.5">
                3 onboarding programs in-flight
              </span>
              <span className="rounded-full border border-slate-700/60 bg-slate-900/80 px-4 py-1.5">
                Live insights & risk radar
              </span>
            </div>
          </div>
          <div className="relative flex w-full max-w-sm flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200 backdrop-blur">
            <div className="absolute inset-x-10 top-0 -translate-y-1/2 rounded-full bg-brand-500/30 px-4 py-1 text-xs uppercase tracking-[0.2em] text-brand-100 ring-1 ring-brand-200/40">
              Live Pulse
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-slate-400">Average time-to-live</span>
              <span className="text-xl font-semibold text-white">57 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Pipeline health</span>
              <span className="text-xl font-semibold text-emerald-300">Stable</span>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-slate-400">
                <span>Weekly velocity</span>
                <span>{velocity}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-200" style={{ width: `${velocity}%` }} />
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Intelligent orchestration layers combine human onboarding specialists with autonomous playbooks to keep
              every dealer on track.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Launch runway",
            value: "3",
            subtitle: "active dealer activations",
            icon: ArrowTrendingUpIcon,
            accent: "from-brand-500/20 to-brand-400/5",
            detail: "Neo Motors runs live simulation Friday; Summit risk flagged."
          },
          {
            title: "Automation lift",
            value: "47%",
            subtitle: "of onboarding tasks handled by agents",
            icon: SparklesIcon,
            accent: "from-purple-500/20 to-purple-400/5",
            detail: "AI copilots draft briefs, chase docs, and validate compliance packages."
          },
          {
            title: "Risk radar",
            value: "1",
            subtitle: "engagement in escalation path",
            icon: ExclamationTriangleIcon,
            accent: "from-amber-500/20 to-amber-400/5",
            detail: "Summit Auto flagged for contracting renegotiation."
          }
        ].map((metric) => (
          <div
            key={metric.title}
            className={classNames(
              "relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/60 px-6 py-8 shadow-soft backdrop-blur",
              "before:absolute before:inset-0 before:bg-gradient-to-br",
              `before:${metric.accent} before:opacity-80`
            )}
          >
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{metric.title}</p>
                <metric.icon className="h-6 w-6 text-slate-300" />
              </div>
              <h2 className="text-4xl font-semibold text-white">{metric.value}</h2>
              <p className="text-sm text-slate-300">{metric.subtitle}</p>
              <p className="text-sm text-slate-400">{metric.detail}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="space-y-4 rounded-3xl border border-white/5 bg-slate-900/60 p-6 shadow-soft backdrop-blur">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Pipeline command deck</h2>
                <p className="text-sm text-slate-400">
                  Monitor every dealer&apos;s progress across stages, reassign agents, and advance programs.
                </p>
              </div>
            </header>
            <div className="flex flex-col gap-4">
              {pipelineByStage.map(({ stage, dealers: stageDealers }) => (
                <div key={stage.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300">{stage.label}</span>
                    <span className="text-xs text-slate-400">{stageDealers.length} in stage</span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {stageDealers.map((dealer) => (
                      <motion.button
                        key={dealer.id}
                        layout
                        onClick={() => setSelectedDealerId(dealer.id)}
                        className={classNames(
                          "w-full rounded-2xl border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300/60",
                          selectedDealerId === dealer.id
                            ? "border-brand-400/50 bg-brand-500/10 shadow-lg"
                            : "border-white/5 bg-slate-900/70 hover:border-brand-300/30 hover:bg-brand-400/5"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <p className="text-sm uppercase tracking-wider text-slate-400">{dealer.region}</p>
                            <h3 className="text-lg font-semibold text-white">{dealer.name}</h3>
                            <p className="text-sm text-slate-400">
                              Assigned to <span className="text-slate-200">{dealer.assignedAgent}</span>
                            </p>
                          </div>
                          <span className={classNames("rounded-full px-3 py-1 text-xs", riskBadge[dealer.risk])}>
                            {dealer.risk.toUpperCase()} risk
                          </span>
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                          <div className="h-2 flex-1 rounded-full bg-slate-800">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-brand-400 via-brand-300 to-brand-200"
                              style={{ width: `${dealer.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-slate-300">{dealer.progress}%</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                          <span>Go-live target {formatDate(dealer.goLiveTarget, true)}</span>
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-3 py-1 text-xs text-slate-200 transition hover:border-brand-300/40 hover:text-brand-100"
                            onClick={(event) => {
                              event.stopPropagation();
                              advanceStage(dealer.id);
                            }}
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                            Advance stage
                          </button>
                        </div>
                      </motion.button>
                    ))}
                    {!stageDealers.length && (
                      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-6 text-sm text-slate-400">
                        No dealers currently in this stage.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="space-y-4 lg:col-span-2">
          <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-6 shadow-soft backdrop-blur">
            <header className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Agent workload matrix</h2>
                <p className="text-sm text-slate-400">Balance coverage with live capacity signals.</p>
              </div>
            </header>
            <div className="mt-6 space-y-5">
              {mockAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="rounded-2xl border border-slate-800/70 bg-slate-900/70 px-4 py-4 transition hover:border-brand-300/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-wider text-slate-400">{agent.role}</p>
                      <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                      <p className="text-sm text-slate-400">{agent.focus}</p>
                    </div>
                    <span
                      className={classNames(
                        "rounded-full px-3 py-1 text-xs",
                        agent.availability === "available" && "bg-emerald-500/10 text-emerald-200 border border-emerald-500/30",
                        agent.availability === "near-capacity" &&
                          "bg-amber-500/10 text-amber-200 border border-amber-500/30",
                        agent.availability === "at-capacity" &&
                          "bg-rose-500/10 text-rose-200 border border-rose-500/30"
                      )}
                    >
                      {agent.availability.replace("-", " ")}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Capacity</span>
                      <span>{agent.load}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-slate-800">
                      <div
                        className={classNames(
                          "h-full rounded-full",
                          agent.load > 80 ? "bg-rose-400" : agent.load > 65 ? "bg-amber-400" : "bg-emerald-400"
                        )}
                        style={{ width: `${agent.load}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                    {agent.strengths.map((strength) => (
                      <span key={strength} className="rounded-full border border-slate-700/60 px-3 py-1">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-6 shadow-soft backdrop-blur">
            <header className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Agentic playbooks</h2>
                <p className="text-sm text-slate-400">Autonomous teammates operating in the background.</p>
              </div>
            </header>
            <div className="mt-6 space-y-4">
              {aiAssistants.map((assistant) => (
                <div
                  key={assistant.title}
                  className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4 text-sm text-slate-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 h-10 w-10 rounded-2xl bg-brand-400/10 ring-1 ring-brand-400/30" />
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-white">{assistant.title}</h3>
                      <p>{assistant.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {assistant.outcomes.map((outcome) => (
                          <span key={outcome} className="rounded-full border border-slate-700/50 bg-slate-900/70 px-3 py-1">
                            {outcome}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {selectedDealer && (
        <section className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className={classNames("rounded-3xl border bg-slate-900/60 p-6 shadow-soft backdrop-blur", statusAccent[selectedDealer.status])}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-300">{selectedDealer.segment} Segment</p>
                  <h2 className="text-2xl font-semibold text-white">{selectedDealer.name}</h2>
                  <p className="text-sm text-slate-300">
                    Orchestrated by <span className="text-white">{selectedDealer.assignedAgent}</span> &middot; Go-live{" "}
                    {formatDate(selectedDealer.goLiveTarget)}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Current Stage</p>
                    <p className="font-medium text-white">{selectedDealer.status}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Progress</p>
                    <p className="font-medium text-white">{selectedDealer.progress}%</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Last signal</p>
                    <p className="font-medium text-white">{formatDateTime(selectedDealer.lastActivity)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Risk posture</p>
                    <p className="font-medium text-white capitalize">{selectedDealer.risk}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Insights</h3>
                  <ul className="mt-3 space-y-3 text-sm text-slate-300">
                    {selectedDealer.insights.map((insight) => (
                      <li key={insight} className="rounded-xl border border-slate-800/60 bg-slate-900/60 px-3 py-2">
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Next moves</h3>
                  <ul className="mt-3 space-y-3 text-sm text-slate-300">
                    {selectedDealer.nextSteps.map((step) => (
                      <li key={step} className="rounded-xl border border-slate-800/60 bg-slate-900/60 px-3 py-2">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <Tab.Group selectedIndex={activeTabIndex} onChange={setActiveTabIndex}>
                  <Tab.List className="flex gap-2 rounded-2xl border border-slate-800/60 bg-slate-900/70 p-1 text-sm text-slate-300">
                    {["Execution queue", "Notes"].map((tab) => (
                      <Tab
                        key={tab}
                        className={({ selected }) =>
                          classNames(
                            "flex-1 rounded-xl px-4 py-2 transition focus-visible:outline-none",
                            selected ? "bg-brand-400/20 text-white shadow" : "hover:text-white"
                          )
                        }
                      >
                        {tab}
                      </Tab>
                    ))}
                  </Tab.List>
                  <Tab.Panels className="mt-4">
                    <Tab.Panel className="space-y-3">
                      {selectedDealer.tasks.map((task) => (
                        <motion.div
                          layout
                          key={task.id}
                          className={classNames("rounded-2xl border px-4 py-3 text-sm", taskStates[task.status])}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs uppercase tracking-widest text-slate-400">{task.stage}</p>
                              <h4 className="text-base font-semibold text-white">{task.title}</h4>
                              <p className="text-xs text-slate-300">
                                Owner <span className="text-white">{task.owner}</span> &middot; Due{" "}
                                {formatDate(task.dueDate, true)}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                {task.dependencies?.map((dependency) => (
                                  <span
                                    key={dependency}
                                    className="rounded-full border border-slate-700/50 bg-slate-900/60 px-2 py-1 text-slate-300"
                                  >
                                    Needs {dependency}
                                  </span>
                                ))}
                                {task.blockers?.map((blocker) => (
                                  <span
                                    key={blocker}
                                    className="rounded-full border border-rose-500/50 bg-rose-500/10 px-2 py-1 text-rose-200"
                                  >
                                    Blocked by {blocker}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <button
                              type="button"
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white transition hover:border-emerald-400/50 hover:bg-emerald-400/20 hover:text-emerald-50"
                              onClick={() => markTaskComplete(task.id)}
                            >
                              {task.status === "completed" ? "Reset" : "Mark done"}
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </Tab.Panel>
                    <Tab.Panel className="space-y-3 text-sm text-slate-300">
                      {selectedDealer.notes.map((note) => (
                        <div key={note} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 px-4 py-3">
                          {note}
                        </div>
                      ))}
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:col-span-2">
            <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-6 shadow-soft backdrop-blur">
              <header className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Timeline intelligence</h2>
                  <p className="text-sm text-slate-400">Signals, escalations, and achievements.</p>
                </div>
              </header>
              <ul className="mt-6 space-y-4">
                {timeline
                  .filter((event) => event.dealerId === selectedDealer.id)
                  .map((event) => (
                    <li key={event.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4">
                      <div className="flex items-start justify-between gap-3 text-sm">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-slate-400">
                            {formatDateTime(event.timestamp)}
                          </p>
                          <h3 className="mt-1 text-base font-semibold text-white">{event.title}</h3>
                          <p className="text-slate-300">{event.description}</p>
                          <p className="mt-2 text-xs text-slate-400">Owner {event.owner}</p>
                        </div>
                        <span className={classNames("rounded-full px-3 py-1 text-xs", categoryBadge[event.category].className)}>
                          {categoryBadge[event.category].label}
                        </span>
                      </div>
                    </li>
                  ))}
                {!timeline.some((event) => event.dealerId === selectedDealer.id) && (
                  <li className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">
                    No timeline entries captured yet for this dealer.
                  </li>
                )}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-6 shadow-soft backdrop-blur">
              <header className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Knowledge boosters</h2>
                  <p className="text-sm text-slate-400">Surface playbooks matched to onboarding stage.</p>
                </div>
              </header>
              <div className="mt-6 space-y-4">
                {knowledgeBase.map((article) => (
                  <article
                    key={article.id}
                    className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4 text-sm text-slate-300"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{article.category}</p>
                        <h3 className="text-base font-semibold text-white">{article.title}</h3>
                      </div>
                      <span className="text-xs text-slate-500">Updated {formatDate(article.updatedAt, true)}</span>
                    </div>
                    <p className="mt-3">{article.description}</p>
                    <button
                      type="button"
                      className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-brand-200 hover:text-brand-100"
                    >
                      Open in workspace →
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </section>
      )}

      <section className="rounded-3xl border border-white/5 bg-slate-900/60 p-6 shadow-soft backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="lg:max-w-xl">
            <h2 className="text-2xl font-semibold text-white">Runbook designer & automation bench</h2>
            <p className="mt-2 text-sm text-slate-300">
              Launch bespoke onboarding journeys with reusable templates, AI-drafted collateral, and automated guardrails
              across compliance, data, and enablement tracks.
            </p>
            <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Signals</p>
                <p className="mt-2 text-white">Realtime detection of risk, velocity, and sentiment changes</p>
              </div>
              <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Autopilot</p>
                <p className="mt-2 text-white">Automate intake, contracting, training, and compliance loops</p>
              </div>
            </div>
          </div>
          <div className="flex-1 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Latest automations</h3>
            <ul className="mt-3 space-y-3 text-sm text-slate-300">
              <li className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
                Compliance Sentry closed 4 outstanding document requests for Summit Auto.
              </li>
              <li className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-2">
                Launch Navigator proposed phased go-live sequencing to protect Summit&apos;s revenue timeline.
              </li>
              <li className="rounded-xl border border-brand-500/30 bg-brand-500/10 px-3 py-2">
                Intake Triager routed two new leads to Maya with generated executive briefs.
              </li>
            </ul>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-300/40 bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-50 transition hover:border-brand-200/60 hover:bg-brand-500/20"
            >
              Compose new automation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
