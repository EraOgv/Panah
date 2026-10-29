import api from './api';

export const createReport = async (targetType, targetId, reason, note) => {
  const response = await api.post('/reports', { targetType, targetId, reason, note });
  return response.data;
};

export const getFlaggedItems = async () => {
  const response = await api.get('/reports/flagged');
  return response.data;
};

export const resolveFlag = async (targetType, targetId) => {
  const response = await api.put('/reports/resolve', { targetType, targetId });
  return response.data;
};

export const removeFlaggedItem = async (targetType, targetId) => {
  const response = await api.put('/reports/remove', { targetType, targetId });
  return response.data;
};