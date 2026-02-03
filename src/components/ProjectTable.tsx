import type { Project } from '../types';

interface ProjectTableProps {
  projects: Project[];
  onViewTasks: (projectId: number) => void;
}

export default function ProjectTable({ projects, onViewTasks }: ProjectTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left border-b">ID</th>
            <th className="px-4 py-2 text-left border-b">Name</th>
            <th className="px-4 py-2 text-left border-b">Task Count</th>
            <th className="px-4 py-2 text-left border-b">Earliest Start</th>
            <th className="px-4 py-2 text-left border-b">Latest End</th>
            <th className="px-4 py-2 text-left border-b">Duration (Days)</th>
            <th className="px-4 py-2 text-left border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{project.id}</td>
              <td className="px-4 py-2 border-b font-medium">{project.name}</td>
              <td className="px-4 py-2 border-b">{project.taskCount}</td>
              <td className="px-4 py-2 border-b">
                {project.earliestStartDate || '-'}
              </td>
              <td className="px-4 py-2 border-b">
                {project.latestEndDate || '-'}
              </td>
              <td className="px-4 py-2 border-b">
                {project.durationDays ?? '-'}
              </td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => onViewTasks(project.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View Tasks
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
