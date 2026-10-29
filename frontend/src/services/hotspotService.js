import api from './api';

export const getHotspots = async (city) => {
  const response = await api.get('/hotspots', { params: city ? { city } : {} });
  return response.data;
};