"use client";

import { FormEvent, useMemo, useState } from "react";

type Task = { id: number; title: string; completed: boolean };

const initialTasks: Task[] = [
  { id: 1, title: "Review product feedback", completed: false },
  { id: 2, title: "Prepare weekly project update", completed: false },
  { id: 3, title: "Book a focus block for tomorrow", completed: true },
];

function CheckIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 fill-none stroke-current stroke-2"><path d="m4 10 4 4 8-8" /></svg>;
}

function PlusIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5 fill-none stroke-current stroke-2"><path d="M10 4v12M4 10h12" /></svg>;
}

function TrashIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 fill-none stroke-current stroke-1.5"><path d="M4 6h12M8 3h4l1 3H7l1-3Zm-2 3 .7 10h6.6L14 6M8.5 9v4.5M11.5 9v4.5" /></svg>;
}

export default function TodoList() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const openCount = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks]);
  const completedCount = tasks.length - openCount;

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setTasks((current) => [...current, { id: Date.now(), title, completed: false }]);
    setNewTitle("");
  }

  function saveTask(id: number) {
    const title = editingTitle.trim();
    if (title) setTasks((current) => current.map((task) => task.id === id ? { ...task, title } : task));
    setEditingId(null);
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5 sm:px-8">
          <div><p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">Focus / Today</p><h1 className="mt-1 text-xl font-semibold tracking-tight">My tasks</h1></div>
          <div className="text-right"><p className="font-mono text-2xl font-semibold tabular-nums text-primary">{openCount}</p><p className="text-xs text-muted-foreground">open tasks</p></div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 sm:px-8 sm:py-14">
        <section aria-labelledby="task-heading">
          <div className="mb-7"><p className="text-sm font-medium text-muted-foreground">A clear space for the work that matters.</p><h2 id="task-heading" className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Make progress, one task at a time.</h2></div>
          <form onSubmit={addTask} className="flex gap-3 border-b border-border pb-8">
            <label htmlFor="new-task" className="sr-only">Add a new task</label>
            <input id="new-task" value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="What needs doing?" className="min-w-0 flex-1 rounded-lg border border-input bg-card px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
            <button type="submit" aria-label="Add task" className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"><PlusIcon /><span className="hidden sm:inline">Add task</span></button>
          </form>

          <div className="mt-7" aria-live="polite">
            {tasks.length === 0 ? <p className="rounded-lg border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">No tasks yet. Add one above to get started.</p> : <ul className="divide-y divide-border border-b border-border">
              {tasks.map((task) => <li key={task.id} className="group flex items-center gap-3 py-4">
                <button type="button" aria-label={task.completed ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`} onClick={() => setTasks((current) => current.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item))} className={`flex size-5 shrink-0 items-center justify-center rounded border transition ${task.completed ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40 text-transparent hover:border-primary"}`}><CheckIcon /></button>
                {editingId === task.id ? <input autoFocus value={editingTitle} onChange={(event) => setEditingTitle(event.target.value)} onBlur={() => saveTask(task.id)} onKeyDown={(event) => { if (event.key === "Enter" && !event.nativeEvent.isComposing && event.keyCode !== 229) saveTask(task.id); if (event.key === "Escape") setEditingId(null); }} aria-label="Edit task" className="min-w-0 flex-1 rounded border border-primary bg-card px-2 py-1 text-sm outline-none" /> : <button type="button" onClick={() => { setEditingId(task.id); setEditingTitle(task.title); }} className={`min-w-0 flex-1 text-left text-sm leading-6 transition ${task.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>{task.title}</button>}
                <div className="flex items-center gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"><button type="button" aria-label={`Edit ${task.title}`} onClick={() => { setEditingId(task.id); setEditingTitle(task.title); }} className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground">Edit</button><button type="button" aria-label={`Delete ${task.title}`} onClick={() => setTasks((current) => current.filter((item) => item.id !== task.id))} className="rounded p-2 text-muted-foreground hover:bg-secondary hover:text-destructive"><TrashIcon /></button></div>
              </li>)}
            </ul>}
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-3xl items-center justify-between border-t border-border px-6 py-5 text-xs text-muted-foreground sm:px-8"><span>{completedCount} completed</span><span>Click a task to edit</span></footer>
    </div>
  );
}
