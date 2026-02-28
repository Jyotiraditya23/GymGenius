const BASE_URL = "http://localhost:8080/api/v1.0";

const getAuthHeaders = () => {
  const token = localStorage.getItem("fitness_jwt");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const dietService = {
  getAllDiets: async () => {
    const res = await fetch(`${BASE_URL}/diet`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch diets");
    return res.json();
  },

  getDietById: async (id) => {
    const res = await fetch(`${BASE_URL}/diet/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch diet");
    return res.json();
  },

  createDiet: async (dietData) => {
    const res = await fetch(`${BASE_URL}/diet`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(dietData),
    });
    if (!res.ok) throw new Error("Failed to create diet");
    return res.json();
  },

  updateDiet: async (id, dietData) => {
    const res = await fetch(`${BASE_URL}/diet/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(dietData),
    });
    if (!res.ok) throw new Error("Failed to update diet");
    return res.json();
  },

  deleteDiet: async (id) => {
    const res = await fetch(`${BASE_URL}/diet/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete diet");
  },

  generateDiet: async (profileData) => {
    const res = await fetch(`${BASE_URL}/diet/generate-custom`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    if (!res.ok) throw new Error("Failed to generate diet");
    return res.json();
  },
};
