import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Project, Task } from '../types';

const API_BASE_URL = 'https://b8b9-73-172-108-123.ngrok-free.app';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useProjects(): UseApiResult<Project[]> {
  const [data, setData] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Project[]>(`${API_BASE_URL}/projects`);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { data, loading, error };
}

export function useTasks(projectId: number | null): UseApiResult<Task[]> {
  const [data, setData] = useState<Task[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId === null) {
      setData(null);
      return;
    }

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Task[]>(
          `${API_BASE_URL}/projects/${projectId}/tasks`
        );
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  return { data, loading, error };
}
