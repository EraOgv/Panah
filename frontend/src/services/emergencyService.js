import api from './api';

export const getEmergencyContacts = async (city) => {
  const response = await api.get('/emergency', { params: city ? { city } : {} });
  return response.data;
};