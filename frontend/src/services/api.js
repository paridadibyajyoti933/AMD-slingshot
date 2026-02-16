/**
 * API Service Layer
 * Centralized HTTP client for backend communication
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Research Copilot API
export const researchAPI = {
    uploadPDF: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/research/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    processPaper: async (paperId) => {
        const response = await api.post(`/research/${paperId}/process`);
        return response.data;
    },

    getPaper: async (paperId) => {
        const response = await api.get(`/research/${paperId}`);
        return response.data;
    },

    listPapers: async (skip = 0, limit = 20) => {
        const response = await api.get('/research/', { params: { skip, limit } });
        return response.data;
    },

    generateLiteratureReview: async (paperId) => {
        const response = await api.post(`/research/${paperId}/literature-review`);
        return response.data;
    },
};

// Weekly Planner API
export const plannerAPI = {
    createTask: async (taskData) => {
        const response = await api.post('/planner/tasks', taskData);
        return response.data;
    },

    listTasks: async (status = null, skip = 0, limit = 50) => {
        const params = { skip, limit };
        if (status) params.status = status;
        const response = await api.get('/planner/tasks', { params });
        return response.data;
    },

    getTask: async (taskId) => {
        const response = await api.get(`/planner/tasks/${taskId}`);
        return response.data;
    },

    updateTask: async (taskId, updates) => {
        const response = await api.patch(`/planner/tasks/${taskId}`, updates);
        return response.data;
    },

    optimizeSchedule: async (startDate = null, days = 7) => {
        const params = { days };
        if (startDate) params.start_date = startDate;
        const response = await api.post('/planner/optimize-schedule', null, { params });
        return response.data;
    },

    getDeadlineRisks: async () => {
        const response = await api.get('/planner/deadline-risks');
        return response.data;
    },

    createDeepWorkBlock: async (blockData) => {
        const response = await api.post('/planner/deep-work-blocks', blockData);
        return response.data;
    },
};

// Meeting Summarizer API
export const meetingsAPI = {
    createMeeting: async (meetingData) => {
        const response = await api.post('/meetings/', meetingData);
        return response.data;
    },

    uploadTranscript: async (title, file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/meetings/upload?title=${encodeURIComponent(title)}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    processMeeting: async (meetingId) => {
        const response = await api.post(`/meetings/${meetingId}/process`);
        return response.data;
    },

    getMeeting: async (meetingId) => {
        const response = await api.get(`/meetings/${meetingId}`);
        return response.data;
    },

    listMeetings: async (skip = 0, limit = 20) => {
        const response = await api.get('/meetings/', { params: { skip, limit } });
        return response.data;
    },

    createNote: async (noteData) => {
        const response = await api.post('/meetings/notes', noteData);
        return response.data;
    },

    listNotes: async (skip = 0, limit = 20) => {
        const response = await api.get('/meetings/notes', { params: { skip, limit } });
        return response.data;
    },
};

// Knowledge Hub API
export const knowledgeAPI = {
    search: async (query, topK = 5, sourceTypes = null) => {
        const data = { query, top_k: topK };
        if (sourceTypes) data.source_types = sourceTypes;
        const response = await api.post('/knowledge/search', data);
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/knowledge/stats');
        return response.data;
    },

    indexAll: async () => {
        const response = await api.post('/knowledge/index-all');
        return response.data;
    },
};

// Health check
export const healthCheck = async () => {
    const response = await api.get('/health');
    return response.data;
};

export default api;
