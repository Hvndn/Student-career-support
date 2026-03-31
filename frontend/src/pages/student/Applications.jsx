import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../../api';

const Applications = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        studentApi.getMyApplications()
            .then(res => {
                setApps(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'REVIEWING': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', icon: 'hourglass_top', label: 'Đang xem xét' };
            case 'ACCEPTED': return { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', icon: 'check_circle', label: 'Đã chấp nhận' };
            case 'REJECTED': return { bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-200', icon: 'cancel', label: 'Đã từ chối' };
            default: return { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200', icon: 'pending', label: status || 'Chờ xử lý' };
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafd', fontFamily: "'Inter', sans-serif" }}>
            <div className="text-center space-y-3">
                <span className="material-symbols-outlined animate-spin text-4xl text-blue-600">refresh</span>
                <p className="text-slate-500 text-sm">Đang tải danh sách đơn ứng tuyển...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen" style={{ background: '#f8fafd', fontFamily: "'Inter', sans-serif" }}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <div className="mb-8">
                    <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-4">
                        <Link className="hover:text-blue-600 transition-colors" to="/">Trang chủ</Link>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <span className="text-slate-900 font-semibold">Đơn ứng tuyển</span>
                    </nav>
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Đơn ứng tuyển của tôi</h1>
                            <p className="text-slate-500 text-sm mt-1">Theo dõi trạng thái tất cả các đơn ứng tuyển bạn đã gửi.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                                {apps.length} đơn
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-600">description</span>
                            </div>
                            <div>
                                <p className="text-xl font-extrabold text-slate-900">{apps.length}</p>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tổng đơn</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-amber-500">hourglass_top</span>
                            </div>
                            <div>
                                <p className="text-xl font-extrabold text-slate-900">{apps.filter(a => a.status === 'REVIEWING').length}</p>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Đang xét</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-green-600">check_circle</span>
                            </div>
                            <div>
                                <p className="text-xl font-extrabold text-slate-900">{apps.filter(a => a.status === 'ACCEPTED').length}</p>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Chấp nhận</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-red-500">cancel</span>
                            </div>
                            <div>
                                <p className="text-xl font-extrabold text-slate-900">{apps.filter(a => a.status === 'REJECTED').length}</p>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Từ chối</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applications List */}
                {apps.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
                        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">inbox</span>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Chưa có đơn ứng tuyển</h3>
                        <p className="text-slate-500 text-sm mb-6">Bạn chưa nộp đơn ứng tuyển nào. Hãy khám phá các cơ hội việc làm ngay!</p>
                        <Link to="/jobs" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20">
                            <span className="material-symbols-outlined text-lg">search</span>
                            Tìm việc làm
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {apps.map(app => {
                            const status = getStatusConfig(app.status);
                            return (
                                <div key={app.id} className="group bg-white rounded-xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        {/* Company Icon */}
                                        <div className="w-12 h-12 shrink-0 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-lg font-bold text-blue-600">
                                            {app.companyName ? app.companyName.charAt(0).toUpperCase() : 'C'}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                                        {app.jobTitle}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 mt-0.5">{app.companyName}</p>
                                                </div>
                                                {/* Status Badge */}
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border shrink-0 ${status.bg} ${status.text} ${status.border}`}>
                                                    <span className="material-symbols-outlined text-sm">{status.icon}</span>
                                                    {status.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                    Ứng tuyển: {app.appliedDate}
                                                </span>
                                                {app.jobId && (
                                                    <Link to={`/jobs/${app.jobId}`} className="flex items-center gap-1 text-blue-600 font-semibold hover:underline">
                                                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                                                        Xem việc làm
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Applications;
