import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Thêm interceptor để xử lý lỗi 401 (Thần thêm vào để tự động điều hướng khi hết hạn phiên làm việc)
api.interceptors.response.use(
    (response) => {
        // Có thể thêm NProgress.done() ở đây nếu muốn theo dõi từng request
        return response;
    },
    (error) => {
        const message = error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại!";
        
        if (error.response) {
            if (error.response.status === 401) {
                toast.error("Phiên làm việc hết hạn. Vui lòng đăng nhập lại!");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            } else if (error.response.status === 403) {
                toast.error("Bạn không có quyền thực hiện hành động này!");
            } else if (error.response.status >= 500) {
                toast.error("Lỗi hệ thống! Vui lòng liên hệ quản trị viên.");
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
    cancelApplication: (jobId) => api.delete(`/student/jobs/${jobId}/apply`),
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
    deleteSkill: (skillId) => api.delete(`/student/profile/skills/${skillId}`),
    getSkills: () => api.get('/student/profile/skills/all'),
    updateAvatar: (formData) => api.post('/student/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
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
};


export const companyApi = {
    getDashboard: () => api.get('/company/dashboard'),
    getProfile: () => api.get('/company/profile'),
    updateProfile: (data) => {
        if (data instanceof FormData) {
            return api.put('/company/profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
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
    getUsers: () => api.get('/admin/users'),
    toggleUserStatus: (userId) => api.post(`/admin/users/${userId}/toggle-status`),
    getSkills: () => api.get('/admin/skills'),
    addSkill: (name) => api.post(`/admin/skills?name=${name}`),
    deleteSkill: (id) => api.delete(`/admin/skills/${id}`),
    getJobs: () => api.get('/admin/jobs'),
    updateJobStatus: (id, status) => api.post(`/admin/jobs/${id}/status?status=${status}`),
    getPendingCompanies: () => api.get('/admin/companies/pending'),
    approveCompany: (id) => api.post(`/admin/companies/${id}/approve`)
};

export default api;


