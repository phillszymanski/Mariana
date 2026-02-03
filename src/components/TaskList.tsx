import { useState, useMemo } from 'react';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onClose: () => void;
}

const statusColors = {
  'planned': 'bg-gray-200 text-gray-800',
  'in progress': 'bg-blue-200 text-blue-800',
  'completed': 'bg-green-200 text-green-800',
  'cancelled': 'bg-red-200 text-red-800',
};

interface TaskRowProps {
  task: Task;
  level: number;
  childrenMap: Map<number, Task[]>;
  expandedTasks: Set<number>;
  onToggleExpand: (taskId: number) => void;
  taskMap: Map<number, Task>;
  isHighlighted: boolean;
  searchTerm: string;
}

function TaskRow({ task, level, childrenMap, expandedTasks, onToggleExpand, taskMap, isHighlighted, searchTerm }: TaskRowProps) {
  const children = childrenMap.get(task.id) || [];
  const hasChildren = children.length > 0;
  const isExpanded = expandedTasks.has(task.id);

  // Get dependencies info
  const dependencies = task.dependsOn.map(id => taskMap?.get(id)).filter(Boolean) as Task[];

  const handleRowClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.stopPropagation();
      onToggleExpand(task.id);
    }
  };

  return (
    <>
      <tr 
        className={`hover:bg-gray-50 ${hasChildren ? 'cursor-pointer' : ''} ${isHighlighted ? 'bg-yellow-100' : ''}`}
        onClick={handleRowClick}
      >
        <td className="px-4 py-2 border-b">
          <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
            {hasChildren && (
              <span className="mr-2 text-gray-600">
                {isExpanded ? '▼' : '▶'}
              </span>
            )}
            {task.id}
          </div>
        </td>
        <td className="px-4 py-2 border-b">{task.name}</td>
        <td className="px-4 py-2 border-b">
          <span className={`px-2 py-1 rounded text-xs ${statusColors[task.status]}`}>
            {task.status}
          </span>
        </td>
        <td className="px-4 py-2 border-b">
          {task.startDate || '-'}
        </td>
        <td className="px-4 py-2 border-b">
          {task.dueDate || '-'}
        </td>
        <td className="px-4 py-2 border-b text-sm">
          {dependencies.length > 0 ? (
            <div className="text-gray-600">
              Depends on: {dependencies.map(d => `#${d.id} ${d.name}`).join(', ')}
            </div>
          ) : hasChildren ? (
            `${children.length} subtask(s)`
          ) : (
            '-'
          )}
        </td>
      </tr>
      {isExpanded && children.map((childTask) => {
        const childMatches = searchTerm && (
          childTask.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          childTask.id.toString().includes(searchTerm)
        );
        return (
          <TaskRow
            key={childTask.id}
            task={childTask}
            level={level + 1}
            childrenMap={childrenMap}
            expandedTasks={expandedTasks}
            onToggleExpand={onToggleExpand}
            taskMap={taskMap}
            isHighlighted={childMatches}
            searchTerm={searchTerm}
          />
        );
      })}
    </>
  );
}

export default function TaskList({ tasks, onClose }: TaskListProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  // Create lookup maps
  const { rootTasks, childrenMap, taskMap } = useMemo(() => {
    const childrenMap = new Map<number, Task[]>();
    const taskMap = new Map<number, Task>();
    const rootTasks: Task[] = [];

    // Build task map
    tasks.forEach(task => {
      taskMap.set(task.id, task);
    });

    // Build parent-child map
    tasks.forEach(task => {
      if (task.parentTaskId === null) {
        rootTasks.push(task);
      } else {
        const siblings = childrenMap.get(task.parentTaskId) || [];
        childrenMap.set(task.parentTaskId, [...siblings, task]);
      }
    });

    return { rootTasks, childrenMap, taskMap };
  }, [tasks]);

  const handleToggleExpand = (taskId: number) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 border border-gray-300 rounded">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold">Tasks ({tasks.length})</h2>
          <p className="text-sm text-gray-600 mt-1">Click on a task to expand and view its subtasks. Dependencies show what tasks lead up to each task.</p>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tasks by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border-b">ID</th>
              <th className="px-4 py-2 text-left border-b">Name</th>
              <th className="px-4 py-2 text-left border-b">Status</th>
              <th className="px-4 py-2 text-left border-b">Start Date</th>
              <th className="px-4 py-2 text-left border-b">Due Date</th>
              <th className="px-4 py-2 text-left border-b">Dependencies / Subtasks</th>
            </tr>
          </thead>
          <tbody>
            {rootTasks.map((task) => {
              const taskMatches = searchTerm && (
                task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.id.toString().includes(searchTerm)
              );
              return (
                <TaskRow
                  key={task.id}
                  task={task}
                  level={0}
                  childrenMap={childrenMap}
                  expandedTasks={expandedTasks}
                  onToggleExpand={handleToggleExpand}
                  taskMap={taskMap}
                  isHighlighted={taskMatches}
                  searchTerm={searchTerm}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
