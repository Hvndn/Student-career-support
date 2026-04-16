import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: '/api'
});

// ── Request Interceptor: đính JWT vào header ──────────────────────────────
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response Interceptor: bắt lỗi chung ──────────────────────────────────
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại!';
        if (error.response) {
            if (error.response.status === 401) {
                if (!window.location.pathname.includes('/login')) {
                    toast.error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại!');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
            } else if (error.response.status === 403) {
                toast.error('Bạn không có quyền thực hiện hành động này!');
            } else if (error.response.status >= 500) {
                toast.error(message || 'Lỗi hệ thống! Vui lòng liên hệ quản trị viên.');
            } else {
                toast.error(message);
            }
        } else {
            toast.error('Không thể kết nối tới máy chủ!');
        }
        return Promise.reject(error);
    }
);

// ── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return api.post('/auth/logout');
    },
    getCurrentUser: () => api.get('/auth/me'),
    forgotPassword: (email) => api.post('/auth/forgot-password', null, { params: { email } }),
    resetPassword: (token, password) => api.post(`/auth/reset-password?token=${token}&password=${password}`),
    changePassword: (data) => api.post('/auth/change-password', data),
};

// ── Jobs (public) ─────────────────────────────────────────────────────────
export const jobApi = {
    getJobs: (params) => api.get('/jobs', { params }),
    getJobDetail: (id) => api.get(`/jobs/${id}`),
    getCompanies: () => api.get('/companies'),
    getCompanyDetail: (id) => api.get(`/companies/${id}`),
};

// ── Student ───────────────────────────────────────────────────────────────
export const studentApi = {
    // Profile
    getProfile: () => api.get('/student/profile'),
    updateProfile: (data) => api.put('/student/profile', data),
    updateAvatar: (formData, onUploadProgress) => api.post('/student/profile/avatar', formData, {
        onUploadProgress,
    }),
    // Education
    addEducation: (data) => api.post('/student/profile/educations', data),
    updateEducation: (id, data) => api.put(`/student/profile/educations/${id}`, data),
    deleteEducation: (id) => api.delete(`/student/profile/educations/${id}`),
    // Certifications
    addCertification: (data) => api.post('/student/profile/certifications', data),
    updateCertification: (id, data) => api.put(`/student/profile/certifications/${id}`, data),
    deleteCertification: (id) => api.delete(`/student/profile/certifications/${id}`),
    // Jobs
    applyJob: (jobId) => api.post(`/student/jobs/${jobId}/apply`),
    applyJobWithData: (jobId, formData) => api.post(`/student/jobs/${jobId}/apply`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    saveJob: (jobId) => api.post(`/student/jobs/${jobId}/save`),
    getSavedJobs: () => api.get('/student/jobs/saved'),
    cancelApplication: (jobId) => api.delete(`/student/jobs/${jobId}/apply`),
    getMyApplications: () => api.get('/student/applications'),
    // Notifications & Interviews
    getNotifications: () => api.get('/student/notifications'),
    getInterviews: () => api.get('/student/interviews'),
    // AI & Recommendations
    getRecommendations: () => api.get('/student/recommendations'),
    analyzeAiMatch: (jobId) => api.get(`/student/ai/analyze-match/${jobId}`),
    // CV Templates (public endpoint)
    getCvTemplates: (params) => api.get('/cv-templates', { params }),
    // PDF export
    exportProfilePdf: (studentId) => api.get(`/student/profile/${studentId}/pdf`, { responseType: 'blob' }),
};

// ── Company ───────────────────────────────────────────────────────────────
export const companyApi = {
    getDashboard: () => api.get('/company/dashboard'),
    getProfile: () => api.get('/company/profile'),
    updateProfile: (data, onUploadProgress) => {
        if (data instanceof FormData) {
            return api.put('/company/profile', data, {
                onUploadProgress,
            });
        }
        return api.put('/company/profile', data);
    },
    postJob: (jobData) => api.post('/company/jobs', jobData),
    updateJob: (id, jobData) => api.put(`/company/jobs/${id}`, jobData),
    getJobDetailsForEdit: (id) => api.get(`/company/jobs/${id}`),
    getJobs: () => api.get('/company/jobs'),
    deleteJob: (id) => api.delete(`/company/jobs/${id}`),
    duplicateJob: (id) => api.post(`/company/jobs/${id}/duplicate`),
    uploadBanner: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/company/jobs/upload-banner', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    saveCandidate: (studentId) => api.post(`/company/saved-candidates/${studentId}`),
    unsaveCandidate: (studentId) => api.delete(`/company/saved-candidates/${studentId}`),
    getSavedCandidates: () => api.get('/company/saved-candidates'),
    getCandidateDetail: (studentId) => api.get(`/company/saved-candidates/${studentId}/detail`),
    downloadCv: (studentId) => api.get(`/company/saved-candidates/${studentId}/cv`, { responseType: 'blob' }),
};

// ── Recruitment ───────────────────────────────────────────────────────────
export const recruitmentApi = {
    getApplications: () => api.get('/company/management/applications'),
    getApplicants: (jobId) => api.get(`/company/management/jobs/${jobId}/applicants`),
    updateStatus: (appId, status) => api.patch(`/company/management/applications/${appId}/status?status=${status}`),
    searchCandidates: (params) => api.get('/company/management/candidates/search', { params }),
    scheduleInterview: (appId, data) => api.post(`/company/management/applications/${appId}/schedule`, null, { params: data }),
    getInterviews: () => api.get('/company/management/interviews'),
};

// ── Admin ─────────────────────────────────────────────────────────────────
export const adminApi = {
    getStats: () => api.get('/admin/statistics'),
    getUsers: (params) => api.get('/admin/users', { params }),
    createAdmin: (data) => api.post('/admin/create-admin', data),
    getUserDetail: (id) => api.get(`/admin/users/${id}`),
    toggleUserStatus: (userId) => api.post(`/admin/users/${userId}/toggle-status`),
    updateUserRole: (userId, role) => api.patch(`/admin/users/${userId}/role?role=${role}`),
    getSkills: () => api.get('/admin/skills'),
    addSkill: (name, category) => api.post(`/admin/skills?name=${name}&category=${category}`),
    updateSkill: (id, name, category) => api.put(`/admin/skills/${id}?name=${name}&category=${category}`),
    deleteSkill: (id) => api.delete(`/admin/skills/${id}`),
    getJobs: () => api.get('/admin/jobs'),
    updateJobStatus: (id, status) => api.post(`/admin/jobs/${id}/status?status=${status}`),
    getPendingCompanies: () => api.get('/admin/companies/pending'),
    approveCompany: (id) => api.post(`/admin/companies/${id}/approve`),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getReports: () => api.get('/admin/reports'),
    getPasswordRequests: () => api.get('/admin/password-requests'),
    getPasswordRequestStats: () => api.get('/admin/password-requests/stats'),
    approvePasswordRequest: (id) => api.post(`/admin/password-requests/${id}/approve`),
    getInterviews: () => api.get('/admin/interviews'),
    createStudent: (data) => api.post('/admin/create-student', data),
    updateStudent: (id, data) => api.put(`/users/${id}/student`, data),
    updateCompany: (id, data) => api.put(`/users/${id}/company`, data),
    // CV Templates
    getCvTemplates: () => api.get('/admin/cv-templates'),
    createCvTemplate: (formData) => api.post('/admin/cv-templates', formData),
    updateCvTemplate: (id, formData) => api.put(`/admin/cv-templates/${id}`, formData),
    deleteCvTemplate: (id) => api.delete(`/admin/cv-templates/${id}`),
    toggleCvTemplateStatus: (id) => api.post(`/admin/cv-templates/${id}/toggle-status`),
    // Categories
    getCategories: () => api.get('/admin/categories'),
    addCategory: (data) => api.post('/admin/categories', data),
    updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
    deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
};

// ── Chat ──────────────────────────────────────────────────────────────────
export const chatApi = {
    getConversations: () => api.get('/chat/conversations'),
    getMessages: (partnerId) => api.get(`/chat/messages/${partnerId}`),
    sendMessage: (partnerId, data) => api.post(`/chat/messages/${partnerId}`, data),
    getDirectory: () => api.get('/users/directory'),
};

export default api;
