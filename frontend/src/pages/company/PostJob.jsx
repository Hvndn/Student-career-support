import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import JobForm from '../../components/company/JobForm';
import { companyApi } from '../../api';
import '../../assets/css/company/PostJob.css';
import '../../assets/css/company/PostJobModal.css'; // Reuse modal styles for consistency

const PostJob = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [jobData, setJobData] = useState(null);
    const [loading, setLoading] = useState(!!id);

    useEffect(() => {
        if (id) {
            fetchJobDetails();
        }
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            const res = await companyApi.getJobDetailsForEdit(id);
            if (res.data.status === 'success') {
                setJobData(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching job details", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

    return (
        <div className="cd-layout">
            <CompanySidebar />
            <div className="cd-main">
                <CompanyNavbar />
                <main className="pj-wrapper">
                    <div className="pj-header-container intro-y">
                        <div className="pj-breadcrumb">
                            <Link to="/company/dashboard">DAU CONNECT</Link>
                            <span className="separator">/</span>
                            <Link to="/company/management">TIN TUYỂN DỤNG</Link>
                            <span className="separator">/</span>
                            <span className="active-crumb">{id ? 'CHỈNH SỬA' : 'TẠO MỚI'}</span>
                        </div>
                        <h1 className="pj-title">{id ? 'Chỉnh sửa Tin Tuyển Dụng' : 'Tạo Tin Tuyển Dụng Mới'}</h1>
                        <p className="pj-subtitle">Giao diện đăng tin chuyên nghiệp giúp thu hút ứng viên.</p>
                    </div>

                    <div className="pj-body-standalone intro-y">
                        <JobForm 
                            jobData={jobData} 
                            isPage={true}
                            onSuccess={() => navigate('/company/management')}
                            onCancel={() => navigate('/company/management')}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PostJob;
