"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  Archive,
  ArrowBendDownRight,
  ArrowRight,
  ArrowsOutSimple,
  Bell,
  CaretDown,
  CaretRight,
  Check,
  CheckCircle,
  Clock,
  Command,
  FileCode,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  GitBranch,
  ListDashes,
  MagnifyingGlass,
  PaperPlaneTilt,
  Play,
  ShieldCheck,
  SidebarSimple,
  TerminalWindow,
  X,
} from "@phosphor-icons/react";

import { AnimatedLogo } from "@/components/Logo";
import styles from "@/components/home/VectantHome.module.css";

const INITIAL_FOLDERS = [
  { id: "production", name: "Production", open: true },
  { id: "gpu-lab", name: "GPU lab", open: true },
  { id: "experiments", name: "Experiments", open: false },
];

const INITIAL_PROJECTS = [
  {
    id: "inference-gateway",
    folderId: "production",
    title: "Inference gateway",
    repo: "torch-router",
    status: "Needs review",
    tone: "coral",
    branch: "agent/lease-guard",
  },
  {
    id: "checkout-recovery",
    folderId: "production",
    title: "Checkout recovery",
    repo: "payment-runtime",
    status: "Running",
    tone: "cyan",
    branch: "agent/replay-fix",
  },
  {
    id: "cuda-graphs",
    folderId: "gpu-lab",
    title: "CUDA graph migration",
    repo: "render-kernel",
    status: "Validating",
    tone: "violet",
    branch: "agent/graph-capture",
  },
  {
    id: "browser-bridge",
    folderId: "gpu-lab",
    title: "Browser replay bridge",
    repo: "codesite-mcp",
    status: "Planning",
    tone: "pink",
    branch: "agent/replay-bridge",
  },
  {
    id: "memory-policy",
    folderId: "experiments",
    title: "Near-miss memory",
    repo: "proof-ledger",
    status: "Queued",
    tone: "muted",
    branch: "agent/memory-index",
  },
];

const SMART_VIEWS = [
  { label: "Needs you", count: 1, icon: Bell },
  { label: "Running", count: 1, icon: Play },
  { label: "Ready for review", count: 1, icon: CheckCircle },
];

const TIMELINE = [
  {
    icon: ShieldCheck,
    title: "Authority narrowed",
    copy: "Mutation lease limited to runtime policy and gateway tests.",
    meta: "Lease",
    tone: "coral",
  },
  {
    icon: TerminalWindow,
    title: "Validation grouped",
    copy: "Build, tests, browser replay, and console checks passed as one event.",
    meta: "Validate",
    tone: "cyan",
  },
  {
    icon: GitBranch,
    title: "Change ready",
    copy: "Three files changed with line provenance and rollback context attached.",
    meta: "Review",
    tone: "violet",
  },
];

const CHANGES = [
  ["runtime/lease.ts", "+18", "Policy boundary"],
  ["gateway/route.ts", "+11", "Scoped retry"],
  ["tests/lease.spec.ts", "+27", "Negative cases"],
];

const ARTIFACTS = [
  ["Replay ledger", "Session route and grouped tool calls", FileText],
  ["Proof capsule", "Build, test, browser, and source evidence", ShieldCheck],
  ["Rollback point", "Preserved state before the mutation", GitBranch],
];

const STATUS_TONES = {
  coral: "text-[#ff8d73] bg-[#ff7757]/10 border-[#ff7757]/20",
  cyan: "text-[#79dfeb] bg-[#55d8e8]/10 border-[#55d8e8]/20",
  violet: "text-[#a99dff] bg-[#8d7cff]/10 border-[#8d7cff]/20",
  pink: "text-[#ff7fba] bg-[#ff4da3]/10 border-[#ff4da3]/20",
  muted: "text-white/45 bg-white/[0.035] border-white/[0.08]",
};

const spring = { type: "spring", stiffness: 330, damping: 34, mass: 0.8 };

export function PilotArrow() {
  return <ArrowRight size={16} weight="bold" />;
}

function IconButton({ label, children, className = "", ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`${styles.focusRing} grid min-h-11 min-w-11 place-items-center rounded-[10px] border border-white/[0.08] text-white/55 transition-[color,background-color,border-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.055] hover:text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function StatusPill({ project }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-medium ${STATUS_TONES[project.tone]}`}>
      {project.status}
    </span>
  );
}

function SmartViews({ compact }) {
  return (
    <div className="grid gap-1 px-2">
      {SMART_VIEWS.map(({ label, count, icon: Icon }) => (
        <button
          key={label}
          type="button"
          className={`${styles.focusRing} group flex min-h-10 items-center gap-2.5 rounded-[10px] px-2.5 text-left text-[12px] text-white/55 transition-[color,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/[0.045] hover:text-white`}
          title={compact ? label : undefined}
        >
          <Icon size={15} weight="regular" className="shrink-0" />
          {!compact && <span className="min-w-0 flex-1 truncate">{label}</span>}
          {!compact && <span className="font-mono text-[10px] text-white/28">{count}</span>}
        </button>
      ))}
    </div>
  );
}

function MoveMenu({ project, folders, onMove, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) onClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [onClose]);

  return (
    <motion.div
      ref={menuRef}
      role="menu"
      aria-label={`Move ${project.title}`}
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="absolute right-1 top-10 z-20 min-w-44 rounded-[12px] border border-white/[0.12] bg-[#151820] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.48)]"
    >
      <p className="px-2 pb-1.5 pt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-white/35">Move to</p>
      {folders.map((folder) => (
        <button
          key={folder.id}
          type="button"
          role="menuitem"
          disabled={folder.id === project.folderId}
          onClick={() => onMove(project.id, folder.id)}
          className={`${styles.focusRing} flex w-full items-center gap-2 rounded-[8px] px-2 py-2 text-left text-[11px] text-white/65 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-30`}
        >
          <Folder size={13} />
          <span className="flex-1 truncate">{folder.name}</span>
          {folder.id === project.folderId && <Check size={12} />}
        </button>
      ))}
    </motion.div>
  );
}

function FolderRail({
  compact,
  folders,
  projects,
  selectedId,
  moveMenuFor,
  onSelect,
  onToggleFolder,
  onToggleCompact,
  onStartFolder,
  onArchive,
  onMove,
  onOpenMove,
  addingFolder,
  folderName,
  onFolderName,
  onAddFolder,
  onCancelFolder,
}) {
  return (
    <motion.aside
      layout
      transition={spring}
      className="relative z-[2] flex min-h-0 flex-col border-r border-white/[0.07] bg-[#0d0f13]"
    >
      <div className="flex h-14 items-center justify-between border-b border-white/[0.07] px-3">
        <button
          type="button"
          onClick={onToggleCompact}
          aria-label={compact ? "Expand workspace sidebar" : "Collapse workspace sidebar"}
          className={`${styles.focusRing} flex min-h-11 items-center overflow-hidden rounded-[10px] text-white transition-opacity hover:opacity-80`}
        >
          <AnimatedLogo expanded={!compact} className="origin-left scale-[0.82]" />
        </button>
        {!compact && (
          <IconButton label="Collapse workspace sidebar" onClick={onToggleCompact} className="min-h-9 min-w-9 border-0">
            <SidebarSimple size={16} />
          </IconButton>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-3 [scrollbar-width:none]">
        <SmartViews compact={compact} />

        <div className="mx-3 my-3 h-px bg-white/[0.07]" />

        <div className="mb-2 flex min-h-9 items-center justify-between px-3">
          {!compact && <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-white/32">Folders</span>}
          <IconButton
            label="Create folder"
            onClick={onStartFolder}
            className={`min-h-9 min-w-9 border-0 ${compact ? "mx-auto" : ""}`}
          >
            <FolderPlus size={15} />
          </IconButton>
        </div>

        <AnimatePresence initial={false}>
          {addingFolder && !compact && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={onAddFolder}
              className="mx-2 mb-2 overflow-hidden"
            >
              <div className="flex items-center gap-1 rounded-[10px] border border-[#55d8e8]/25 bg-[#55d8e8]/[0.055] p-1">
                <Folder size={13} className="ml-1.5 shrink-0 text-[#79dfeb]" />
                <input
                  autoFocus
                  value={folderName}
                  onChange={(event) => onFolderName(event.target.value)}
                  placeholder="Folder name"
                  aria-label="Folder name"
                  className="min-w-0 flex-1 bg-transparent px-1.5 py-1.5 text-[11px] text-white outline-none placeholder:text-white/28"
                />
                <button type="submit" aria-label="Save folder" className={`${styles.focusRing} grid h-7 w-7 place-items-center rounded-[7px] text-[#79dfeb] hover:bg-white/[0.06]`}>
                  <Check size={13} />
                </button>
                <button type="button" onClick={onCancelFolder} aria-label="Cancel folder" className={`${styles.focusRing} grid h-7 w-7 place-items-center rounded-[7px] text-white/45 hover:bg-white/[0.06]`}>
                  <X size={13} />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <LayoutGroup id="workspace-folders">
          <motion.div layout className="grid gap-1 px-2">
            {folders.map((folder) => {
              const folderProjects = projects.filter((project) => project.folderId === folder.id);
              return (
                <motion.div layout key={folder.id} transition={spring}>
                  <button
                    type="button"
                    onClick={() => onToggleFolder(folder.id)}
                    title={compact ? folder.name : undefined}
                    aria-expanded={folder.open}
                    className={`${styles.focusRing} flex min-h-10 w-full items-center gap-2 rounded-[10px] px-2 text-left text-[11px] text-white/55 transition-colors hover:bg-white/[0.04] hover:text-white`}
                  >
                    {folder.open ? <FolderOpen size={15} weight="duotone" /> : <Folder size={15} weight="duotone" />}
                    {!compact && (
                      <>
                        <span className="min-w-0 flex-1 truncate">{folder.name}</span>
                        <span className="font-mono text-[9px] text-white/28">{folderProjects.length}</span>
                        {folder.open ? <CaretDown size={11} /> : <CaretRight size={11} />}
                      </>
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {folder.open && !compact && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-visible pl-3"
                      >
                        {folderProjects.length === 0 ? (
                          <div className="ml-3 rounded-[10px] border border-dashed border-white/[0.08] px-3 py-2.5 text-[10px] text-white/28">
                            Move a run here
                          </div>
                        ) : (
                          folderProjects.map((project) => (
                            <motion.div layout key={project.id} className="relative group/project">
                              <button
                                type="button"
                                onClick={() => onSelect(project.id)}
                                className={`${styles.focusRing} relative flex min-h-11 w-full items-center gap-2 rounded-[10px] px-2.5 pr-[4.4rem] text-left transition-colors ${
                                  selectedId === project.id ? "bg-white/[0.07] text-white" : "text-white/48 hover:bg-white/[0.035] hover:text-white/78"
                                }`}
                              >
                                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${project.tone === "cyan" ? "bg-[#55d8e8]" : project.tone === "violet" ? "bg-[#8d7cff]" : project.tone === "pink" ? "bg-[#ff4da3]" : project.tone === "coral" ? "bg-[#ff7757]" : "bg-white/25"}`} />
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-[11px]">{project.title}</span>
                                  <span className="mt-0.5 block truncate font-mono text-[8.5px] text-white/28">{project.repo}</span>
                                </span>
                              </button>
                              <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-0.5 opacity-0 transition-opacity group-hover/project:opacity-100 group-focus-within/project:opacity-100">
                                <button
                                  type="button"
                                  onClick={() => onOpenMove(project.id)}
                                  aria-label={`Move ${project.title}`}
                                  title="Move to folder"
                                  className={`${styles.focusRing} grid h-8 w-8 place-items-center rounded-[8px] bg-[#111319] text-white/45 hover:text-white`}
                                >
                                  <ArrowBendDownRight size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onArchive(project.id)}
                                  aria-label={`Archive ${project.title}`}
                                  title="Archive from sidebar"
                                  className={`${styles.focusRing} grid h-8 w-8 place-items-center rounded-[8px] bg-[#111319] text-white/45 hover:text-[#ff8d73]`}
                                >
                                  <Archive size={12} />
                                </button>
                              </div>
                              <AnimatePresence>
                                {moveMenuFor === project.id && (
                                  <MoveMenu
                                    project={project}
                                    folders={folders}
                                    onMove={onMove}
                                    onClose={() => onOpenMove(null)}
                                  />
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </LayoutGroup>
      </div>

      {!compact && (
        <div className="border-t border-white/[0.07] p-3">
          <button type="button" className={`${styles.focusRing} flex min-h-11 w-full items-center gap-2 rounded-[10px] px-2.5 text-left text-[11px] text-white/42 hover:bg-white/[0.04] hover:text-white`}>
            <Archive size={14} />
            <span className="flex-1">Archive</span>
            <span className="font-mono text-[9px] text-white/24">1</span>
          </button>
        </div>
      )}
    </motion.aside>
  );
}

function TimelineView() {
  return (
    <motion.div
      key="timeline"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="grid gap-3"
    >
      {TIMELINE.map(({ icon: Icon, title, copy, meta, tone }) => (
        <article key={title} className="group grid grid-cols-[40px_minmax(0,1fr)_auto] gap-3 rounded-[14px] border border-white/[0.075] bg-white/[0.025] p-3.5 transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-white/[0.13] hover:bg-white/[0.045]">
          <span className={`grid h-10 w-10 place-items-center rounded-[10px] border ${STATUS_TONES[tone]}`}>
            <Icon size={17} weight="duotone" />
          </span>
          <div className="min-w-0">
            <h4 className="text-[12px] font-medium text-white/86">{title}</h4>
            <p className="mt-1 max-w-md text-[10.5px] leading-5 text-white/42">{copy}</p>
          </div>
          <span className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-white/24">{meta}</span>
        </article>
      ))}
    </motion.div>
  );
}

function ChangesView() {
  return (
    <motion.div
      key="changes"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-[14px] border border-white/[0.075] bg-white/[0.02]"
    >
      {CHANGES.map(([file, diff, purpose]) => (
        <div key={file} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-white/[0.06] px-4 py-4 last:border-0">
          <div className="flex min-w-0 items-center gap-3">
            <FileCode size={16} className="shrink-0 text-[#79dfeb]" />
            <div className="min-w-0">
              <span className="block truncate font-mono text-[10.5px] text-white/72">{file}</span>
              <span className="mt-1 block text-[10px] text-white/34">{purpose}</span>
            </div>
          </div>
          <span className="font-mono text-[10px] text-[#66d7a0]">{diff}</span>
        </div>
      ))}
    </motion.div>
  );
}

function ArtifactsView() {
  return (
    <motion.div
      key="artifacts"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="grid gap-2.5 sm:grid-cols-3"
    >
      {ARTIFACTS.map(([title, copy, Icon]) => (
        <button key={title} type="button" className={`${styles.focusRing} group min-h-36 rounded-[14px] border border-white/[0.075] bg-white/[0.025] p-3.5 text-left transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.045]`}>
          <Icon size={20} weight="duotone" className="text-[#a99dff]" />
          <h4 className="mt-5 text-[11px] font-medium text-white/82">{title}</h4>
          <p className="mt-1.5 text-[9.5px] leading-4 text-white/34">{copy}</p>
        </button>
      ))}
    </motion.div>
  );
}

function RunCanvas({ project, tab, onTab, onFocus }) {
  const tabs = ["Timeline", "Changes", "Artifacts"];

  return (
    <motion.section layout transition={spring} className="relative z-[1] flex min-h-0 flex-col bg-[#0b0d11]">
      <div className="flex min-h-14 flex-wrap items-center gap-2 border-b border-white/[0.07] px-3 sm:px-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[12px] font-medium text-white/88">{project.title}</h3>
            <StatusPill project={project} />
          </div>
          <p className="mt-0.5 truncate font-mono text-[8.5px] text-white/28">{project.repo} / {project.branch}</p>
        </div>
        <button type="button" onClick={onFocus} className={`${styles.focusRing} hidden min-h-9 items-center gap-2 rounded-[9px] border border-white/[0.08] px-2.5 text-[10px] text-white/45 transition-colors hover:border-white/[0.14] hover:text-white sm:inline-flex`}>
          <ArrowsOutSimple size={13} />
          Focus
        </button>
        <IconButton label="Run follow-up" className="min-h-9 min-w-9 text-[#ff8d73]">
          <Play size={13} weight="fill" />
        </IconButton>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-[16%] top-8 h-64 bg-[radial-gradient(circle,rgba(255,119,87,0.12),transparent_64%)]" />
        <div className="relative flex h-full min-h-[430px] flex-col px-3 pb-3 pt-4 sm:px-4 sm:pb-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="inline-flex rounded-[10px] border border-white/[0.075] bg-white/[0.025] p-1">
              {tabs.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => onTab(label.toLowerCase())}
                  className={`${styles.focusRing} relative min-h-8 rounded-[7px] px-2.5 text-[10px] transition-colors ${tab === label.toLowerCase() ? "text-white" : "text-white/36 hover:text-white/68"}`}
                >
                  {tab === label.toLowerCase() && <motion.span layoutId="active-workbench-tab" className="absolute inset-0 -z-10 rounded-[7px] bg-white/[0.075]" transition={spring} />}
                  {label}
                </button>
              ))}
            </div>
            <button type="button" className={`${styles.focusRing} inline-flex min-h-9 items-center gap-2 rounded-[9px] px-2 text-[9.5px] text-white/34 hover:bg-white/[0.04] hover:text-white/68`}>
              <ListDashes size={13} />
              Grouped events
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-color:rgba(255,255,255,0.12)_transparent]">
            <AnimatePresence mode="wait">
              {tab === "timeline" && <TimelineView />}
              {tab === "changes" && <ChangesView />}
              {tab === "artifacts" && <ArtifactsView />}
            </AnimatePresence>
          </div>

          <div className="mt-3 flex min-h-12 items-center gap-2 rounded-[12px] border border-white/[0.09] bg-[#111319] px-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <span className="font-mono text-[10px] text-[#ff8d73]">/</span>
            <span className="font-mono text-[10px] text-[#a99dff]">@</span>
            <span className="font-mono text-[10px] text-[#79dfeb]">!</span>
            <span className="min-w-0 flex-1 truncate text-[10px] text-white/28">Queue a follow-up, attach context, or run a guarded action</span>
            <button type="button" aria-label="Send follow-up" className={`${styles.focusRing} grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-[#ff7757] text-[#16100e] transition-transform hover:-translate-y-0.5 active:scale-95`}>
              <PaperPlaneTilt size={13} weight="fill" />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function ActivityRail({ project }) {
  return (
    <aside className="min-h-0 border-b border-l border-white/[0.07] bg-[#0f1116] p-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-medium text-white/62">Authority</h3>
        <ShieldCheck size={15} className="text-[#79dfeb]" />
      </div>
      <div className="mt-3 rounded-[12px] border border-white/[0.075] bg-white/[0.022] p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-white/28">Mutation lease</span>
          <span className="font-mono text-[8.5px] text-[#66d7a0]">Scoped</span>
        </div>
        <p className="mt-3 text-[10.5px] leading-5 text-white/52">Gateway runtime and its negative tests. Protected paths stay read-only.</p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[['Files', '3'], ['Checks', '4'], ['Conflicts', '0'], ['Proof', 'Ready']].map(([label, value]) => (
          <div key={label} className="rounded-[10px] border border-white/[0.065] bg-white/[0.018] px-2.5 py-2">
            <span className="block font-mono text-[8px] uppercase tracking-[0.08em] text-white/24">{label}</span>
            <strong className="mt-1 block text-[11px] font-medium text-white/66">{value}</strong>
          </div>
        ))}
      </div>
      <p className="mt-3 truncate font-mono text-[8.5px] text-white/26">{project.repo}</p>
    </aside>
  );
}

function QueueRail() {
  const steps = [
    ["Observe", "complete", Check],
    ["Constrain", "complete", Check],
    ["Validate", "active", Clock],
    ["Promote", "waiting", ArrowRight],
  ];

  return (
    <aside className="min-h-0 border-l border-white/[0.07] bg-[#0f1116] p-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-medium text-white/62">Landing queue</h3>
        <span className="font-mono text-[8px] text-white/28">1 active</span>
      </div>
      <div className="mt-3 grid gap-1.5">
        {steps.map(([label, state, Icon]) => (
          <div key={label} className={`flex min-h-10 items-center gap-2.5 rounded-[10px] px-2.5 ${state === "active" ? "bg-[#8d7cff]/[0.09] text-[#b3a8ff]" : "text-white/38"}`}>
            <span className={`grid h-6 w-6 place-items-center rounded-[7px] border ${state === "complete" ? "border-[#55d8e8]/20 bg-[#55d8e8]/[0.08] text-[#79dfeb]" : state === "active" ? "border-[#8d7cff]/25 bg-[#8d7cff]/[0.1]" : "border-white/[0.07]"}`}>
              <Icon size={11} />
            </span>
            <span className="flex-1 text-[10px]">{label}</span>
            <span className="font-mono text-[7.5px] uppercase tracking-[0.08em] opacity-60">{state}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function CommandPalette({ open, query, onQuery, onClose, onSelect }) {
  const actions = useMemo(
    () => [
      ["Start guarded run", "Action", Play],
      ["Create workspace folder", "Folder", FolderPlus],
      ["Open proof capsule", "Artifact", ShieldCheck],
      ["Inspect runtime logs", "Tool", TerminalWindow],
      ["Search run history", "History", MagnifyingGlass],
    ],
    []
  );
  const filtered = actions.filter(([label]) => label.toLowerCase().includes(query.toLowerCase()));

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-0 z-20 grid place-items-start bg-black/58 p-3 pt-20 sm:p-8 sm:pt-24"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.985 }}
        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto w-full max-w-xl overflow-hidden rounded-[16px] border border-white/[0.13] bg-[#151820] shadow-[0_34px_90px_rgba(0,0,0,0.58)]"
      >
        <div className="flex items-center gap-3 border-b border-white/[0.08] px-4">
          <MagnifyingGlass size={17} className="text-white/38" />
          <input
            autoFocus
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search actions, agents, folders, tools"
            aria-label="Search commands"
            className="min-h-14 min-w-0 flex-1 bg-transparent text-[12px] text-white outline-none placeholder:text-white/28"
          />
          <button type="button" onClick={onClose} className={`${styles.focusRing} rounded-[7px] border border-white/[0.08] px-2 py-1 font-mono text-[9px] text-white/35 hover:text-white`}>Esc</button>
        </div>
        <div className="p-2">
          {filtered.length ? filtered.map(([label, category, Icon]) => (
            <button
              key={label}
              type="button"
              onClick={() => onSelect(label)}
              className={`${styles.focusRing} flex min-h-12 w-full items-center gap-3 rounded-[10px] px-3 text-left text-white/58 transition-colors hover:bg-white/[0.055] hover:text-white`}
            >
              <span className="grid h-8 w-8 place-items-center rounded-[9px] border border-white/[0.08] bg-white/[0.025]">
                <Icon size={14} />
              </span>
              <span className="flex-1 text-[11px]">{label}</span>
              <span className="font-mono text-[8px] uppercase tracking-[0.08em] text-white/24">{category}</span>
            </button>
          )) : (
            <p className="px-3 py-8 text-center text-[11px] text-white/32">No matching command</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function AgentWorkbench() {
  const reducedMotion = useReducedMotion();
  const [folders, setFolders] = useState(INITIAL_FOLDERS);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [selectedId, setSelectedId] = useState(INITIAL_PROJECTS[0].id);
  const [compact, setCompact] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [tab, setTab] = useState("timeline");
  const [addingFolder, setAddingFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [moveMenuFor, setMoveMenuFor] = useState(null);
  const [archived, setArchived] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [announcement, setAnnouncement] = useState("");

  const selectedProject = projects.find((project) => project.id === selectedId) || projects[0] || INITIAL_PROJECTS[0];

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
      if (event.key === "Escape") {
        setPaletteOpen(false);
        setMoveMenuFor(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleFolder = (folderId) => {
    setFolders((current) => current.map((folder) => (folder.id === folderId ? { ...folder, open: !folder.open } : folder)));
  };

  const addFolder = (event) => {
    event.preventDefault();
    const name = folderName.trim();
    if (!name) return;
    const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    setFolders((current) => [...current, { id, name, open: true }]);
    setFolderName("");
    setAddingFolder(false);
    setAnnouncement(`${name} folder created`);
  };

  const archiveProject = (projectId) => {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;
    const index = projects.findIndex((item) => item.id === projectId);
    setArchived({ project, index });
    const remaining = projects.filter((item) => item.id !== projectId);
    setProjects(remaining);
    if (selectedId === projectId && remaining.length) setSelectedId(remaining[0].id);
    setMoveMenuFor(null);
    setAnnouncement(`${project.title} archived from the sidebar`);
  };

  const undoArchive = () => {
    if (!archived) return;
    setProjects((current) => {
      const next = [...current];
      next.splice(Math.min(archived.index, next.length), 0, archived.project);
      return next;
    });
    setSelectedId(archived.project.id);
    setAnnouncement(`${archived.project.title} restored`);
    setArchived(null);
  };

  const moveProject = (projectId, folderId) => {
    const project = projects.find((item) => item.id === projectId);
    const folder = folders.find((item) => item.id === folderId);
    if (!project || !folder) return;
    setProjects((current) => current.map((item) => (item.id === projectId ? { ...item, folderId } : item)));
    setFolders((current) => current.map((item) => (item.id === folderId ? { ...item, open: true } : item)));
    setMoveMenuFor(null);
    setAnnouncement(`${project.title} moved to ${folder.name}`);
  };

  const selectCommand = (label) => {
    setPaletteOpen(false);
    setQuery("");
    if (label === "Create workspace folder") setAddingFolder(true);
    if (label === "Open proof capsule") setTab("artifacts");
    if (label === "Inspect runtime logs") setTab("timeline");
    setAnnouncement(`${label} selected`);
  };

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 26, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.85, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      className={styles.workbenchOuter}
    >
      <div className={styles.workbench} aria-label="Interactive Vectant orchestration workspace using sample data">
        <div className={styles.workbenchGlow} aria-hidden="true" />

        <div className="relative z-[2] flex h-12 items-center justify-between border-b border-white/[0.07] bg-[#0d0f13] px-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="font-mono text-[9px] text-white/32">vectant</span>
            <CaretRight size={10} className="text-white/18" />
            <span className="truncate font-mono text-[9px] text-white/54">production room</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className={`${styles.focusRing} hidden min-h-9 items-center gap-2 rounded-[9px] border border-white/[0.08] px-2.5 text-[9px] text-white/36 transition-colors hover:border-white/[0.14] hover:text-white sm:inline-flex`}
            >
              <Command size={12} />
              Commands
              <kbd className="rounded-[5px] bg-white/[0.05] px-1.5 py-0.5 font-mono text-[8px] text-white/32">⌘K</kbd>
            </button>
            <IconButton label="Open command palette" onClick={() => setPaletteOpen(true)} className="min-h-9 min-w-9 sm:hidden">
              <Command size={13} />
            </IconButton>
            <IconButton label="Workspace notifications" className="min-h-9 min-w-9">
              <Bell size={13} />
            </IconButton>
          </div>
        </div>

        <motion.div
          layout
          transition={spring}
          className={`${styles.workbenchGrid} relative z-[1] grid min-h-[612px] grid-flow-dense overflow-hidden`}
          style={{
            "--workbench-columns": focusMode ? "minmax(0, 1fr)" : compact ? "72px minmax(0, 1fr) 220px" : "3fr 6fr 3fr",
            "--workbench-rows": focusMode ? "minmax(0, 1fr)" : "1fr 1fr",
          }}
        >
          <AnimatePresence initial={false}>
            {!focusMode && (
              <motion.div
                key="folder-rail"
                layout
                initial={reducedMotion ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={spring}
                className="row-span-2 min-h-0 max-md:row-span-1 max-md:max-h-64"
              >
                <FolderRail
                  compact={compact}
                  folders={folders}
                  projects={projects}
                  selectedId={selectedId}
                  moveMenuFor={moveMenuFor}
                  onSelect={setSelectedId}
                  onToggleFolder={toggleFolder}
                  onToggleCompact={() => setCompact((value) => !value)}
                  onStartFolder={() => {
                    setCompact(false);
                    setAddingFolder(true);
                  }}
                  onArchive={archiveProject}
                  onMove={moveProject}
                  onOpenMove={setMoveMenuFor}
                  addingFolder={addingFolder}
                  folderName={folderName}
                  onFolderName={setFolderName}
                  onAddFolder={addFolder}
                  onCancelFolder={() => {
                    setAddingFolder(false);
                    setFolderName("");
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`${focusMode ? "min-h-[612px]" : "row-span-2 min-h-0 max-md:row-span-1"}`}>
            <RunCanvas project={selectedProject} tab={tab} onTab={setTab} onFocus={() => setFocusMode((value) => !value)} />
          </div>

          <AnimatePresence initial={false}>
            {!focusMode && (
              <motion.div
                key="inspector-rails"
                layout
                initial={reducedMotion ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }}
                transition={spring}
                className="contents max-md:block"
              >
                <ActivityRail project={selectedProject} />
                <QueueRail />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {focusMode && (
          <button
            type="button"
            onClick={() => setFocusMode(false)}
            className={`${styles.focusRing} absolute bottom-4 right-4 z-10 inline-flex min-h-10 items-center gap-2 rounded-full border border-white/[0.12] bg-[#151820] px-3 text-[10px] text-white/58 shadow-[0_14px_36px_rgba(0,0,0,0.4)] hover:text-white`}
          >
            <SidebarSimple size={13} />
            Restore chrome
          </button>
        )}

        <AnimatePresence>
          {archived && (
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={spring}
              className="absolute bottom-4 left-1/2 z-20 flex min-h-11 -translate-x-1/2 items-center gap-3 rounded-full border border-white/[0.12] bg-[#181b22] px-4 text-[10px] text-white/58 shadow-[0_16px_44px_rgba(0,0,0,0.48)]"
            >
              <Archive size={13} />
              <span className="whitespace-nowrap">Archived {archived.project.title}</span>
              <button type="button" onClick={undoArchive} className={`${styles.focusRing} rounded-full px-2 py-1 font-medium text-[#79dfeb] hover:bg-white/[0.05]`}>Undo</button>
              <button type="button" onClick={() => setArchived(null)} aria-label="Dismiss archive message" className={`${styles.focusRing} grid h-7 w-7 place-items-center rounded-full text-white/32 hover:bg-white/[0.05] hover:text-white`}>
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          <CommandPalette
            open={paletteOpen}
            query={query}
            onQuery={setQuery}
            onClose={() => {
              setPaletteOpen(false);
              setQuery("");
            }}
            onSelect={selectCommand}
          />
        </AnimatePresence>

        <div className="sr-only" aria-live="polite">{announcement}</div>
      </div>
    </motion.div>
  );
}
