import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: '/api',
    // withCredentials: true, // Chuyển sang JWT nên không cần gửi cookie tự động nữa
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor: Đính kèm JWT Token vào Header Authorization
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Xử lý lỗi 401 và các lỗi chung
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const message = error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại!";

        if (error.response) {
            if (error.response.status === 401) {
                // Nếu đang ở trang login thì không cần báo lỗi hết hạn
                if (!window.location.pathname.includes('/login')) {
                    toast.error("Phiên làm việc hết hạn. Vui lòng đăng nhập lại!");
                }
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Chỉ chuyển hướng nếu không phải đang ở trang login
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            } else if (error.response.status === 403) {
                toast.error("Bạn không có quyền thực hiện hành động này!");
            } else if (error.response.status >= 500) {
                toast.error(message || "Lỗi hệ thống! Vui lòng liên hệ quản trị viên.");
            } else {
                toast.error(message);
            }
        } else {
            toast.error("Không thể kết nối tới máy chủ!");
        }
        return Promise.reject(error);
    }
);

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
    changePassword: (data) => api.post('/auth/change-password', data)
};

export const jobApi = {
    getJobs: (params) => api.get('/jobs', { params }),
    getJobDetail: (id) => api.get(`/jobs/${id}`),
    getCompanies: () => api.get('/companies'),
    getCompanyDetail: (id) => api.get(`/companies/${id}`)
};

export const studentApi = {
    getProfile: () => api.get('/student/profile'),
    updateProfile: (data) => api.put('/student/profile', data),
    applyJob: (jobId) => api.post(`/student/jobs/${jobId}/apply`),
    saveJob: (jobId) => api.post(`/student/jobs/${jobId}/save`),
    getSavedJobs: () => api.get('/student/jobs/saved'),
    getMyApplications: () => api.get('/student/applications'),
    cancelApplication: (jobId) => api.delete(`/student/jobs/${jobId}/apply`),
    getNotifications: () => api.get('/student/notifications'),
    addEducation: (data) => api.post('/student/profile/educations', data),
    updateEducation: (id, data) => api.put(`/student/profile/educations/${id}`, data),
    deleteEducation: (id) => api.delete(`/student/profile/educations/${id}`),
    addExperience: (data) => api.post('/student/profile/experiences', data),
    updateExperience: (id, data) => api.put(`/student/profile/experiences/${id}`, data),
    deleteExperience: (id) => api.delete(`/student/profile/experiences/${id}`),
    addSkill: (skillId, level) => api.post(`/student/profile/skills`, { skillId, level }),
    deleteSkill: (skillId) => api.delete(`/student/profile/skills/${skillId}`),
    getSkills: () => api.get('/student/profile/skills/all'),
    updateAvatar: (formData, onUploadProgress) => api.post('/student/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress
    }),
    addLanguage: (data) => api.post('/student/profile/languages', data),
    updateLanguage: (id, data) => api.put(`/student/profile/languages/${id}`, data),
    deleteLanguage: (id) => api.delete(`/student/profile/languages/${id}`),
    addInterest: (data) => api.post('/student/profile/interests', data),
    deleteInterest: (id) => api.delete(`/student/profile/interests/${id}`),
    // Projects
    addProject: (data) => api.post('/student/profile/projects', data),
    updateProject: (id, data) => api.put(`/student/profile/projects/${id}`, data),
    deleteProject: (id) => api.delete(`/student/profile/projects/${id}`),

    addActivity: (data) => api.post('/student/profile/activities', data),
    updateActivity: (id, data) => api.put(`/student/profile/activities/${id}`, data),
    deleteActivity: (id) => api.delete(`/student/profile/activities/${id}`),

    addCertification: (data) => api.post('/student/profile/certifications', data),
    updateCertification: (id, data) => api.put(`/student/profile/certifications/${id}`, data),
    deleteCertification: (id) => api.delete(`/student/profile/certifications/${id}`),
    // Recommendations & Interviews
    getRecommendations: () => api.get('/student/recommendations'),
    getInterviews: () => api.get('/student/interviews'),
    analyzeAiMatch: (jobId) => api.get(`/student/ai/analyze-match/${jobId}`),
    getCvTemplates: (params) => api.get('/cv-templates', { params }),
};


export const companyApi = {
    getDashboard: () => api.get('/company/dashboard'),
    getProfile: () => api.get('/company/profile'),
    updateProfile: (data, onUploadProgress) => {
        if (data instanceof FormData) {
            return api.put('/company/profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress
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
    saveCandidate: (studentId) => api.post(`/company/saved-candidates/${studentId}`),
    unsaveCandidate: (studentId) => api.delete(`/company/saved-candidates/${studentId}`),
    getSavedCandidates: () => api.get('/company/saved-candidates'),
    getCandidateDetail: (studentId) => api.get(`/company/saved-candidates/${studentId}/detail`),
    downloadCv: (studentId) => api.get(`/company/saved-candidates/${studentId}/cv`, { responseType: 'blob' })
};

export const recruitmentApi = {
    getApplications: () => api.get('/company/management/applications'),
    getApplicants: (jobId) => api.get(`/company/management/jobs/${jobId}/applicants`),
    updateStatus: (appId, status) => api.patch(`/company/management/applications/${appId}/status?status=${status}`),
    searchCandidates: (params) => api.get('/company/management/candidates/search', { params }),
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
    
    // CV Templates Management
    getCvTemplates: () => api.get('/admin/cv-templates'),
    createCvTemplate: (formData) => api.post('/admin/cv-templates', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateCvTemplate: (id, formData) => api.put(`/admin/cv-templates/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteCvTemplate: (id) => api.delete(`/admin/cv-templates/${id}`),
    toggleCvTemplateStatus: (id) => api.post(`/admin/cv-templates/${id}/toggle-status`),
};

export default api;
