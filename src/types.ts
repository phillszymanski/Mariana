export interface Project {
  id: number;
  name: string;
  taskCount: number;
  earliestStartDate: string | null;
  latestEndDate: string | null;
  durationDays: number | null;
}

export type TaskStatus = 'planned' | 'in progress' | 'completed' | 'cancelled';

export interface Task {
  id: number;
  projectId: number;
  name: string;
  status: TaskStatus;
  parentTaskId: number | null;
  dependsOn: number[];
  startDate: string | null;
  dueDate: string | null;
}
