import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/workoutPlan`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("fitness_jwt");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllPlans = () =>
  axios.get(BASE_URL, getAuthHeaders());

export const addPlan = (data) =>
  axios.post(BASE_URL, data, getAuthHeaders());

export const updatePlan = (id, data) =>
  axios.put(`${BASE_URL}/${id}`, data, getAuthHeaders());

export const deletePlan = (id) =>
  axios.delete(`${BASE_URL}/${id}`, getAuthHeaders());

export const generateWorkout = (id) =>
  axios.post(`${BASE_URL}/generate/${id}`, {}, getAuthHeaders());