import api, { getStoredToken } from './authService';

const getAuthHeaders = () => {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getProfile = async () => {
  const response = await api.get('/fitnessProfile', {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const createProfile = async (profileData) => {
  const response = await api.post('/fitnessProfile', profileData, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/fitnessProfile', profileData, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const deleteProfile = async () => {
  const response = await api.delete('/fitnessProfile', {
    headers: getAuthHeaders()
  });
  return response.data;
};
