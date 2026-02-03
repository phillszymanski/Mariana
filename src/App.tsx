import { useState } from 'react';
import './App.css';
import { useProjects, useTasks } from './hooks/useApi';
import ProjectTable from './components/ProjectTable';
import TaskList from './components/TaskList';

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const { data: projects, loading: projectsLoading, error: projectsError } = useProjects();
  const { data: tasks, loading: tasksLoading, error: tasksError } = useTasks(selectedProjectId);

  const handleViewTasks = (projectId: number) => {
    setSelectedProjectId(projectId);
  };

  const handleCloseTasks = () => {
    setSelectedProjectId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Project Management Dashboard</h1>

        {projectsError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error loading projects: {projectsError}
          </div>
        )}

        {projectsLoading ? (
          <div className="text-center py-8">Loading projects...</div>
        ) : projects && projects.length > 0 ? (
          <>
            <ProjectTable projects={projects} onViewTasks={handleViewTasks} />

            {selectedProjectId && (
              <>
                {tasksError && (
                  <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error loading tasks: {tasksError}
                  </div>
                )}

                {tasksLoading ? (
                  <div className="mt-6 text-center py-8">Loading tasks...</div>
                ) : tasks && tasks.length > 0 ? (
                  <TaskList tasks={tasks} onClose={handleCloseTasks} />
                ) : (
                  <div className="mt-6 p-4 bg-gray-50 border border-gray-300 rounded">
                    <div className="flex justify-between items-center">
                      <p>No tasks found for this project.</p>
                      <button
                        onClick={handleCloseTasks}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="text-center py-8">No projects found.</div>
        )}
      </div>
    </div>
  );
}

export default App;
