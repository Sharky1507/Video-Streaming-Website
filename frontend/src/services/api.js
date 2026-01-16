import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Overlay API
export const overlayService = {
    // Get all overlays
    getAll: async () => {
        const response = await api.get('/overlays');
        return response.data;
    },

    // Get overlay by ID
    getById: async (id) => {
        const response = await api.get(`/overlays/${id}`);
        return response.data;
    },

    // Create new overlay
    create: async (overlayData) => {
        const response = await api.post('/overlays', overlayData);
        return response.data;
    },

    // Update overlay
    update: async (id, overlayData) => {
        const response = await api.put(`/overlays/${id}`, overlayData);
        return response.data;
    },

    // Delete overlay
    delete: async (id) => {
        const response = await api.delete(`/overlays/${id}`);
        return response.data;
    }
};

// Settings API
export const settingsService = {
    // Get settings
    get: async () => {
        const response = await api.get('/settings');
        return response.data;
    },

    // Update settings
    update: async (settingsData) => {
        const response = await api.put('/settings', settingsData);
        return response.data;
    }
};

// Health check
export const healthCheck = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export default api;
