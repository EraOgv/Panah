import api from './api';

export const getApprovedReviews = async () => {
  const response = await api.get('/reviews');
  return response.data;
};

export const createReview = async (formData) => {
  const response = await api.post('/reviews', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};