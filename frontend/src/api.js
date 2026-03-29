import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout')
};

export const jobApi = {
    getJobs: (params) => api.get('/jobs', { params }),
    getJobDetail: (id) => api.get(`/jobs/${id}`)
};

export const studentApi = {
    getProfile: () => api.get('/student/profile'),
    updateProfile: (data) => api.put('/student/profile', data),
    applyJob: (jobId) => api.post(`/student/jobs/${jobId}/apply`),
    saveJob: (jobId) => api.post(`/student/jobs/${jobId}/save`),
    getSavedJobs: () => api.get('/student/jobs/saved'),
    getMyApplications: () => api.get('/student/applications'),
    getNotifications: () => api.get('/student/notifications'),
    addEducation: (data) => api.post('/student/profile/educations', data),
    updateEducation: (id, data) => api.put(`/student/profile/educations/${id}`, data),
    deleteEducation: (id) => api.delete(`/student/profile/educations/${id}`),
    addExperience: (data) => api.post('/student/profile/experiences', data),
    updateExperience: (id, data) => api.put(`/student/profile/experiences/${id}`, data),
    deleteExperience: (id) => api.delete(`/student/profile/experiences/${id}`),
    addSkill: (skillId, level) => api.post(`/student/profile/skills`, { skillId, level }),
    deleteSkill: (skillId) => api.delete(`/student/profile/skills/${skillId}`)
};


export const companyApi = {
    getDashboard: () => api.get('/company/dashboard'),
    getProfile: () => api.get('/company/profile'),
    updateProfile: (data) => api.put('/company/profile', data),
    postJob: (jobData) => api.post('/company/jobs', jobData)
};

export const recruitmentApi = {
    getApplicants: (jobId) => api.get(`/company/management/jobs/${jobId}/applicants`),
    updateStatus: (appId, status) => api.patch(`/company/management/applications/${appId}/status?status=${status}`),
    searchCandidates: (skill) => api.get('/company/management/candidates/search', { params: { skill } }),
    scheduleInterview: (appId, data) => api.post(`/company/management/applications/${appId}/schedule`, null, { params: data })
};

export const adminApi = {
    getStats: () => api.get('/admin/statistics'),
    getUsers: (params) => api.get('/admin/users', { params }),
    getUserDetail: (id) => api.get(`/admin/users/${id}`),
    toggleUserStatus: (userId) => api.post(`/admin/users/${userId}/toggle-status`),
    updateUserRole: (userId, role) => api.patch(`/admin/users/${userId}/role?role=${role}`),
    getSkills: () => api.get('/admin/skills'),
    addSkill: (name, category) => api.post(`/admin/skills?name=${name}&category=${category}`),
    updateSkill: (id, name, category) => api.put(`/admin/skills/${id}?name=${name}&category=${category}`),
    deleteSkill: (id) => api.delete(`/admin/skills/${id}`)
};

export default api;


