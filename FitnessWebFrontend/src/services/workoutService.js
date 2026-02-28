import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1.0/workoutPlan";

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