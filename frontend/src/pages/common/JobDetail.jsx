import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobApi, studentApi } from '../../api';

const JobDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        jobApi.getJobDetail(id)
            .then(res => {
                setJob(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleApply = async () => {
        try {
            const res = await studentApi.applyJob(id);
            setMessage(res.data.message);
            setJob(prev => ({ ...prev, isApplied: true, applied: true }));
        } catch (err) {
            setMessage(err.response?.data?.message || 'Bạn cần đăng nhập để ứng tuyển!');
        }
    };

    const handleCancel = async () => {
        try {
            const res = await studentApi.cancelApplication(id);
            setMessage(res.data.message);
            setJob(prev => ({ ...prev, isApplied: false, applied: false }));
        } catch (err) {
            setMessage(err.response?.data?.message || 'Có lỗi xảy ra khi hủy ứng tuyển');
        }
    };

    if (loading) return (
        <div className="bg-[#f8fafc] min-h-screen flex items-center justify-center font-['Inter',sans-serif]">
            <div className="text-center space-y-3">
                <span className="material-symbols-outlined animate-spin text-4xl text-blue-600">refresh</span>
                <p className="text-slate-500 text-sm">Đang tải thông tin việc làm...</p>
            </div>
        </div>
    );

    if (!job) return (
        <div className="bg-[#f8fafc] min-h-screen flex items-center justify-center font-['Inter',sans-serif]">
            <div className="text-center space-y-3">
                <span className="material-symbols-outlined text-6xl text-slate-300">search_off</span>
                <h2 className="text-xl font-bold text-slate-900">Không tìm thấy công việc</h2>
                <Link to="/jobs" className="text-blue-600 text-sm font-semibold hover:underline">← Quay lại danh sách</Link>
            </div>
        </div>
    );

    const renderActionButtons = () => {
        if (!user) {
            return (
                <>
                    <Link to="/login" className="block w-full text-center bg-blue-600 text-white py-4 rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-blue-600/30 transition-all">
                        Đăng nhập để ứng tuyển
                    </Link>
                </>
            );
        }
        if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_COMPANY') return null;
        if (user.role === 'ROLE_STUDENT') {
            const hasApplied = job.isApplied || job.applied;
            return hasApplied ? (
                <button onClick={handleCancel} className="w-full border-2 border-red-500 text-red-500 py-4 rounded-xl font-bold text-sm hover:bg-red-50 transition-all">
                    Hủy ứng tuyển ↩️
                </button>
            ) : (
                <button onClick={handleApply} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-blue-600/30 transition-all">
                    Ứng tuyển ngay 🚀
                </button>
            );
        }
        return null;
    };

    // Parse description into paragraphs
    const descParagraphs = job.description ? job.description.split('\n').filter(p => p.trim()) : [];

    return (
        <div className="min-h-screen" style={{ background: '#f8fafd', fontFamily: "'Inter', sans-serif" }}>
            <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Sidebar Navigation (Sticky) */}
                <aside className="hidden lg:flex flex-col gap-2 py-8 px-4 h-screen sticky top-16 border-r bg-slate-50 border-slate-100 col-span-2">
                    <div className="mb-6 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl mb-3 shadow-sm bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                            {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <h2 className="font-bold text-sm text-slate-900">{job.companyName}</h2>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Hiring for {job.title?.split(' ').slice(0, 3).join(' ')}</p>
                    </div>
                    <nav className="flex flex-col gap-1">
                        <a className="flex items-center gap-3 py-3 px-4 rounded-lg font-semibold text-xs uppercase tracking-wider text-blue-600 border-r-4 border-blue-600 bg-blue-50/50 transition-all" href="#overview">
                            <span className="material-symbols-outlined text-lg">info</span> Overview
                        </a>
                        <a className="flex items-center gap-3 py-3 px-4 rounded-lg font-semibold text-xs uppercase tracking-wider text-slate-500 hover:bg-slate-100 transition-all" href="#description">
                            <span className="material-symbols-outlined text-lg">description</span> Job Description
                        </a>
                        <a className="flex items-center gap-3 py-3 px-4 rounded-lg font-semibold text-xs uppercase tracking-wider text-slate-500 hover:bg-slate-100 transition-all" href="#requirements">
                            <span className="material-symbols-outlined text-lg">verified</span> Requirements
                        </a>
                        <a className="flex items-center gap-3 py-3 px-4 rounded-lg font-semibold text-xs uppercase tracking-wider text-slate-500 hover:bg-slate-100 transition-all" href="#benefits">
                            <span className="material-symbols-outlined text-lg">card_giftcard</span> Benefits
                        </a>
                        <a className="flex items-center gap-3 py-3 px-4 rounded-lg font-semibold text-xs uppercase tracking-wider text-slate-500 hover:bg-slate-100 transition-all" href="#company">
                            <span className="material-symbols-outlined text-lg">business</span> Company Info
                        </a>
                    </nav>
                    <div className="mt-auto pt-6">
                        {renderActionButtons()}
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="col-span-1 lg:col-span-7 space-y-8">
                    {/* Breadcrumb & Header */}
                    <section className="space-y-4" id="overview">
                        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <Link className="hover:text-blue-600 transition-colors" to="/">Trang chủ</Link>
                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                            <Link className="hover:text-blue-600 transition-colors" to="/jobs">Việc làm</Link>
                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                            <span className="text-slate-900">{job.title}</span>
                        </nav>
                        <div className="flex justify-between items-start gap-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">{job.title}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-lg">location_on</span> {job.location || 'Chưa cập nhật'}
                                    </span>
                                    {job.jobType && (
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-lg">schedule</span> {job.jobType}
                                        </span>
                                    )}
                                    {job.deadline && (
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-lg">event</span> Hạn: {job.deadline}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl font-bold text-lg whitespace-nowrap">
                                {job.salary || 'Thoả thuận'}
                            </div>
                        </div>
                    </section>

                    {/* Message Toast */}
                    {message && (
                        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-semibold text-center">
                            ✨ {message}
                        </div>
                    )}

                    {/* Main Job Sections */}
                    <div className="space-y-8">
                        {/* Job Description */}
                        <article className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:border-blue-600/20 transition-all group" id="description">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-8 bg-blue-600 rounded-full group-hover:h-10 transition-all"></div>
                                <h3 className="text-xl font-bold text-slate-900">Mô tả công việc</h3>
                            </div>
                            <div className="text-slate-600 space-y-4 leading-relaxed text-sm whitespace-pre-wrap">
                                {descParagraphs.length > 0 ? (
                                    descParagraphs.map((p, i) => <p key={i}>{p}</p>)
                                ) : (
                                    <p>{job.description || 'Chưa có mô tả chi tiết.'}</p>
                                )}
                            </div>
                        </article>

                        {/* Requirements */}
                        <article className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:border-blue-600/20 transition-all group" id="requirements">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-8 bg-blue-600 rounded-full group-hover:h-10 transition-all"></div>
                                <h3 className="text-xl font-bold text-slate-900">Yêu cầu ứng viên</h3>
                            </div>
                            <div className="text-slate-600 space-y-4 leading-relaxed text-sm">
                                <ul className="space-y-3">
                                    <li className="flex gap-3">
                                        <span className="material-symbols-outlined text-blue-600 text-xl">check_circle</span>
                                        <span>Có kinh nghiệm hoặc đam mê với lĩnh vực liên quan.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="material-symbols-outlined text-blue-600 text-xl">check_circle</span>
                                        <span>Kỹ năng giao tiếp và làm việc nhóm tốt.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="material-symbols-outlined text-blue-600 text-xl">check_circle</span>
                                        <span>Tinh thần chủ động, ham học hỏi và sáng tạo.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="material-symbols-outlined text-blue-600 text-xl">check_circle</span>
                                        <span>Ưu tiên sinh viên năm cuối hoặc đã tốt nghiệp.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-8">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Loại hình công việc</p>
                                <div className="flex flex-wrap gap-2">
                                    {job.jobType && (
                                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">{job.jobType}</span>
                                    )}
                                    {job.level && (
                                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">{job.level}</span>
                                    )}
                                </div>
                            </div>
                        </article>

                        {/* Benefits */}
                        <article className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:border-blue-600/20 transition-all group" id="benefits">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-8 bg-blue-600 rounded-full group-hover:h-10 transition-all"></div>
                                <h3 className="text-xl font-bold text-slate-900">Quyền lợi</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl flex items-start gap-3">
                                    <span className="material-symbols-outlined text-blue-600" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900">Mức lương cạnh tranh</h4>
                                        <p className="text-xs text-slate-500">{job.salary || 'Thoả thuận theo năng lực'}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl flex items-start gap-3">
                                    <span className="material-symbols-outlined text-blue-600" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900">Bảo hiểm sức khoẻ</h4>
                                        <p className="text-xs text-slate-500">Chăm sóc sức khỏe toàn diện cho nhân viên.</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl flex items-start gap-3">
                                    <span className="material-symbols-outlined text-blue-600" style={{ fontVariationSettings: "'FILL' 1" }}>laptop_mac</span>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900">Thiết bị hiện đại</h4>
                                        <p className="text-xs text-slate-500">Cung cấp thiết bị làm việc tốt nhất.</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl flex items-start gap-3">
                                    <span className="material-symbols-outlined text-blue-600" style={{ fontVariationSettings: "'FILL' 1" }}>home_work</span>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900">Môi trường chuyên nghiệp</h4>
                                        <p className="text-xs text-slate-500">Làm việc linh hoạt, sáng tạo.</p>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>

                {/* Right Sidebar Area */}
                <aside className="col-span-1 lg:col-span-3 space-y-6">
                    {/* Action Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 sticky top-24">
                        {renderActionButtons()}
                        <button className="w-full border border-slate-300 text-slate-900 py-4 rounded-xl font-bold text-sm mt-3 mb-4 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                            <span className="material-symbols-outlined text-xl">bookmark</span> Lưu tin tuyển dụng
                        </button>
                        <Link to="/student/profile" className="block text-center text-blue-600 text-xs font-bold hover:underline">Tải CV mẫu chuẩn Velocity</Link>
                        
                        <hr className="my-6 border-slate-100" />
                        
                        <div className="space-y-4" id="company">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Thông tin công ty</p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-600">
                                    {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-900">{job.companyName}</h4>
                                    <p className="text-xs text-slate-500">Đang tuyển dụng</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-xs text-slate-600">
                                <div className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-lg text-slate-400">location_on</span>
                                    <span>{job.location || 'Chưa cập nhật'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back to Jobs */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 px-2">Khám phá thêm</h4>
                        <Link to="/jobs" className="block bg-white p-4 rounded-xl border border-slate-100 hover:shadow-md transition-all text-center">
                            <span className="text-sm font-bold text-blue-600">← Quay lại danh sách việc làm</span>
                        </Link>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default JobDetail;
