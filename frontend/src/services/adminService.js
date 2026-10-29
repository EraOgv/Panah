import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getAllComplaints = async (status) => {
  const response = await api.get('/admin/complaints', { params: status ? { status } : {} });
  return response.data;
};

export const updateComplaintStatus = async (id, status, adminNote) => {
  const response = await api.put(`/admin/complaints/${id}`, { status, adminNote });
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const toggleSuspendUser = async (id) => {
  const response = await api.put(`/admin/users/${id}/suspend`);
  return response.data;
};

export const toggleVerifiedTraveler = async (id) => {
  const response = await api.put(`/admin/users/${id}/verify`);
  return response.data;
};