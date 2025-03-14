import { useState, useEffect } from 'react';
import api from '../services/api';

export const useChangelog = () => {
  const [changelogs, setChangelogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChangelogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/');
      if (response.status === 200 && Array.isArray(response.data.changelogs)) {
        setChangelogs(response.data.changelogs);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch changelogs');
      setChangelogs([]);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteChangelog = async (version, repositoryUrl) => {
    try {
      const response = await api.delete(`/${version}`, {
        params: { repositoryUrl }
      });
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete changelog');
      }
      return true;
    } catch (err) {
      console.error('Delete Error:', err);
      throw new Error(err.message || 'Failed to delete changelog');
    }
  };

  useEffect(() => {
    fetchChangelogs();
  }, []);

  return { changelogs, loading, error, fetchChangelogs, deleteChangelog };
};