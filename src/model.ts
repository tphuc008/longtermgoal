import { addDays, format, startOfWeek, subDays } from 'date-fns';

export type Status = 'planned' | 'active' | 'paused' | 'completed';
export type TaskStatus = 'todo' | 'in-progress' | 'blocked' | 'done';
export type Priority = 'low' | 'medium' | 'high';
export type Area = 'Personal' | 'Learning' | 'Career' | 'Health' | 'Other';
export type Goal = { id: string; title: string; description: string; area: Area; status: Status; deadline: string; metric: string; current: number; target: number; unit: string; color: string; createdAt: string };
export type Milestone = { id: string; title: string; done: boolean };
export type Project = { id: string; title: string; goalId: string; status: Status; description: string; milestones: Milestone[]; createdAt: string };
export type Task = { id: string; title: string; projectId: string; status: TaskStatus; priority: Priority; dueDate: string; scheduledDate: string; createdAt: string; completedAt: string | null };
export type Review = { id: string; week: string; wins: string; blockers: string; next: string; updatedAt: string };
export type Workspace = { goals: Goal[]; projects: Project[]; tasks: Task[]; reviews: Review[] };
export const uid = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const day = (value = new Date()) => format(value, 'yyyy-MM-dd');
export const monday = (value = new Date()) => format(startOfWeek(value, { weekStartsOn: 1 }), 'yyyy-MM-dd');
export const shortDate = (date: string) => date ? format(new Date(`${date}T12:00:00`), 'MMM d, yyyy') : 'No deadline';
export const goalProgress = (goal: Goal) => goal.target > 0 ? Math.min(100, Math.max(0, Math.round(goal.current / goal.target * 100))) : 0;
export const emptyWorkspace = (): Workspace => ({ goals: [], projects: [], tasks: [], reviews: [] });

export function demoWorkspace(): Workspace {
  const now = new Date();
  const today = day(now);
  const ago = (n: number) => day(subDays(now, n));
  const inDays = (n: number) => day(addDays(now, n));
  const week = monday(now);
  const goals: Goal[] = [
    { id: 'g1', title: 'Launch my learning platform', description: 'Build and publish a polished vocabulary learning experience.', area: 'Career', status: 'active', deadline: inDays(80), metric: 'Lessons published', current: 6, target: 20, unit: 'lessons', color: 'violet', createdAt: ago(40) },
    { id: 'g2', title: 'Strengthen my English fluency', description: 'Practice consistently with clear measurable outcomes.', area: 'Learning', status: 'active', deadline: inDays(115), metric: 'Practice sessions', current: 18, target: 40, unit: 'sessions', color: 'blue', createdAt: ago(22) },
    { id: 'g3', title: 'Build a portfolio website', description: 'Create a personal professional portfolio and publish selected work.', area: 'Personal', status: 'active', deadline: inDays(50), metric: 'Sections completed', current: 2, target: 6, unit: 'sections', color: 'orange', createdAt: ago(15) },
  ];
  const projects: Project[] = [
    { id: 'p1', goalId: 'g1', title: 'Vocabulary Quiz Experience', status: 'active', description: 'A complete quiz workflow with feedback and scoring.', createdAt: ago(30), milestones: [{ id: 'm1', title: 'Define data model', done: true }, { id: 'm2', title: 'Build student interface', done: false }, { id: 'm3', title: 'Ship working prototype', done: false }] },
    { id: 'p2', goalId: 'g2', title: 'Speaking Practice Routine', status: 'active', description: 'Scheduled speaking practice and review.', createdAt: ago(20), milestones: [{ id: 'm4', title: 'Plan practice topics', done: true }, { id: 'm5', title: 'Complete first 20 sessions', done: false }] },
    { id: 'p3', goalId: 'g3', title: 'Portfolio MVP', status: 'planned', description: 'Design and publish my portfolio.', createdAt: ago(12), milestones: [] },
  ];
  const data: [string,string,TaskStatus,Priority,string,string,string|null][] = [
    ['t1','Define quiz data model','done','high',ago(3),ago(1),ago(1)],
    ['t2','Design the quiz interface','in-progress','high',today,inDays(2),null],
    ['t3','Implement answer validation','todo','high',inDays(1),inDays(4),null],
    ['t4','Test the end-to-end flow','todo','medium',inDays(3),inDays(7),null],
    ['t5','Draft speaking practice prompts','done','medium',ago(2),today,ago(2)],
    ['t6','Record a 20-minute speaking session','todo','medium',today,inDays(1),null],
    ['t7','Choose portfolio typography','todo','low',inDays(2),inDays(6),null],
    ['t8','Review lesson content','done','medium',ago(5),ago(4),ago(4)],
    ['t9','Organize next week priorities','todo','low','',inDays(5),null],
  ];
  const tasks: Task[] = data.map(([id,title,status,priority,scheduledDate,dueDate,completedAt]) => ({ id, title, status, priority, scheduledDate, dueDate, completedAt, projectId: ['t5','t6'].includes(id) ? 'p2' : id==='t7' ? 'p3' : id==='t9' ? '' : 'p1', createdAt: ago(8) }));
  return { goals, projects, tasks, reviews: [{ id: 'r-demo', week, wins: '', blockers: '', next: '', updatedAt: today }] };
}

const KEY = 'myplan-os-workspace-v1';
export function loadWorkspace(): { data: Workspace; isDemo: boolean } {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { data: demoWorkspace(), isDemo: true };
    const parsed: unknown = JSON.parse(raw);
    if (!isWorkspace(parsed)) throw new Error('Invalid workspace');
    return { data: parsed, isDemo: localStorage.getItem(`${KEY}-demo`) === 'true' };
  } catch { return { data: demoWorkspace(), isDemo: true }; }
}
export function saveWorkspace(data: Workspace, isDemo: boolean) {
  localStorage.setItem(KEY, JSON.stringify(data));
  localStorage.setItem(`${KEY}-demo`, String(isDemo));
}
export function isWorkspace(value: unknown): value is Workspace {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return ['goals','projects','tasks','reviews'].every(k => Array.isArray(v[k])) &&
    (v.goals as unknown[]).every(x => x && typeof x === 'object' && typeof (x as Goal).id === 'string' && typeof (x as Goal).title === 'string') &&
    (v.projects as unknown[]).every(x => x && typeof x === 'object' && typeof (x as Project).id === 'string') &&
    (v.tasks as unknown[]).every(x => x && typeof x === 'object' && typeof (x as Task).id === 'string' && typeof (x as Task).title === 'string') &&
    (v.reviews as unknown[]).every(x => x && typeof x === 'object' && typeof (x as Review).id === 'string');
}