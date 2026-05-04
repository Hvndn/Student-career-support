import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobApi } from '../../api';
import { getImageUrl } from '../../utils/urlUtils';
import '../../assets/css/student/CompanyList.css';

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await jobApi.getCompanies();
                setCompanies(response.data.data);
            } catch (error) {
                console.error('Error fetching companies:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter(company => {
        const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;
        return matchesSearch && matchesIndustry;
    });

    const industries = ['all', ...new Set(companies.map(c => c.industry).filter(Boolean))];

    if (loading) return <div className="cl-loading">Đang tải danh sách doanh nghiệp...</div>;

    return (
        <div className="cl-company-list-wrapper">
            <header className="cl-top-header">
                <div className="cl-breadcrumb">
                    <Link to="/student/dashboard" className="cl-breadcrumb-prev">Fivecore</Link>
                    <span className="cl-breadcrumb-sep">›</span>
                    <span className="cl-breadcrumb-current">Danh sách công ty</span>
                </div>
                {/* User actions would go here, consistent with other pages */}
            </header>

            <div className="cl-content-container">
                <div className="cl-page-header">
                    <div className="cl-header-title">
                        <h1>Danh sách Công ty</h1>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="cl-filter-bar">
                    <div className="cl-search-box">
                        <span className="material-symbols-outlined cl-search-icon">search</span>
                        <input 
                            type="text" 
                            placeholder="Tìm công ty..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="cl-filter-select-wrap">
                        <select 
                            className="cl-filter-select"
                            value={selectedIndustry}
                            onChange={(e) => setSelectedIndustry(e.target.value)}
                        >
                            <option value="all">Ngành nghề</option>
                            {industries.filter(i => i !== 'all').map(ind => (
                                <option key={ind} value={ind}>{ind}</option>
                            ))}
                        </select>
                    </div>

                    <div className="cl-view-toggles">
                        <button 
                            className={`cl-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <span className="material-symbols-outlined">grid_view</span>
                            Lưới
                        </button>
                        <button 
                            className={`cl-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <span className="material-symbols-outlined">list</span>
                            Danh sách
                        </button>
                    </div>
                </div>

                {/* Company Grid */}
                <div className={`cl-company-${viewMode}`}>
                    {filteredCompanies.map(company => (
                        <div key={company.id} className="cl-company-card">
                            <div className="cl-card-header">
                                <button className="cl-chat-btn">
                                    <span className="material-symbols-outlined">chat_bubble</span>
                                </button>
                                {company.verified && (
                                    <span className="cl-verified-badge">
                                        <span className="material-symbols-outlined">verified</span>
                                        Đã xác thực
                                    </span>
                                )}
                            </div>

                            <div className="cl-card-body">
                                <div className="cl-company-logo-box">
                                    {company.logoUrl ? (
                                        <img src={getImageUrl(company.logoUrl)} alt={company.name} />
                                    ) : (
                                        <div className="cl-logo-placeholder">
                                            {company.name.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                <h3 className="cl-company-name">{company.name}</h3>
                                <p className="cl-company-industry">{company.industry || 'Đang cập nhật'}</p>
                                
                                <div className="cl-company-location">
                                    <span className="material-symbols-outlined">location_on</span>
                                    {company.address || 'Hải Châu, Đà Nẵng'}
                                </div>
                            </div>

                            <div className="cl-card-footer">
                                <div className="cl-job-count">
                                    <strong>{company.jobCount}</strong> vị trí
                                </div>
                                <div className="cl-contact-btn">
                                    <span className="material-symbols-outlined">call</span>
                                    {company.phone || 'Chưa cập nhật'}
                                </div>
                            </div>
                            
                            <Link to={`/companies/${company.id}`} className="cl-card-overlay-link"></Link>
                        </div>
                    ))}
                </div>

                {filteredCompanies.length === 0 && (
                    <div className="cl-empty-state">
                        <span className="material-symbols-outlined">business</span>
                        <p>Không tìm thấy doanh nghiệp nào phù hợp.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyList;
