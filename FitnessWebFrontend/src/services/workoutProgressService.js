import api from "./authService"; // adjust path

const BASE_URL = "/workout-progress";

export const addWorkout = (data) =>
  api.post(BASE_URL, data);

export const getAllWorkout = () =>
  api.get(BASE_URL);

export const getVolumeByMuscle = (muscle) =>
  api.get(`${BASE_URL}/progress-chart/muscle/${muscle}`);

export const getWorkoutByMuscle = (muscle) =>
  api.get(`${BASE_URL}/muscle/${muscle}`);

export const updateWorkout = (id, data) =>
  api.put(`${BASE_URL}/${id}`, data);

export const deleteWorkout = (id) =>
  api.delete(`${BASE_URL}/${id}`);