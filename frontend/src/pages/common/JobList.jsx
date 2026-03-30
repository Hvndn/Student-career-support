import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobApi, studentApi } from '../../api';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [locationSearch, setLocationSearch] = useState('');
    
    // User profile state
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        setUser(savedUser);
        if (savedUser?.role === 'ROLE_STUDENT') {
            studentApi.getProfile()
                .then(res => setProfile(res.data.data))
                .catch(console.error);
        }

        jobApi.getJobs()
            .then(res => {
                setJobs(res.data.data);
                setFiltered(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        const loc = locationSearch.toLowerCase();
        setFiltered(
            jobs.filter(j =>
                (j.title?.toLowerCase().includes(q) || j.companyName?.toLowerCase().includes(q)) &&
                j.location?.toLowerCase().includes(loc)
            )
        );
    }, [search, locationSearch, jobs]);

    const displayAvatar = profile?.avatarUrl || user?.avatar || "https://vectorified.com/images/default-avatar-icon-33.png";

    return (
        <div className="min-h-screen" style={{ background: '#f8fafd', fontFamily: "'Inter', sans-serif" }}>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs & Header */}
                <div className="mb-8">
                    <nav aria-label="Breadcrumb" className="flex text-sm text-slate-500 dark:text-slate-400 mb-4">
                        <ol className="flex items-center space-x-2">
                            <li><Link className="hover:text-blue-600 transition-colors" to="/">Trang chủ</Link></li>
                            <li><span className="material-symbols-outlined text-xs">chevron_right</span></li>
                            <li className="text-slate-900 dark:text-slate-200 font-medium">Tìm kiếm việc làm</li>
                        </ol>
                    </nav>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Việc làm dành cho Sinh viên</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Khám phá hơn {Math.max(1200, jobs.length)}+ cơ hội thực tập và việc làm part-time/full-time mới nhất.</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                            <button className="px-4 py-1.5 text-xs font-semibold rounded bg-blue-600 text-white">Mới nhất</button>
                            <button className="px-4 py-1.5 text-xs font-semibold rounded text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Lương cao</button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar: Filters */}
                    <aside className="w-full lg:w-72 shrink-0 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                    <span className="material-symbols-outlined text-blue-600">tune</span>
                                    Bộ lọc chi tiết
                                </h2>
                                <button 
                                    className="text-xs text-blue-600 font-medium hover:underline"
                                    onClick={() => { setSearch(''); setLocationSearch(''); }}
                                >
                                    Xoá lọc
                                </button>
                            </div>
                            
                            {/* Filter Group: Industry */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">Ngành nghề</label>
                                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm focus:ring-blue-600 focus:border-blue-600 outline-none text-slate-700 dark:text-slate-300">
                                    <option>Công nghệ thông tin</option>
                                    <option>Marketing / Truyền thông</option>
                                    <option>Thiết kế đồ họa</option>
                                    <option>Kinh doanh / Bán hàng</option>
                                    <option>Nhân sự</option>
                                </select>
                            </div>

                            {/* Filter Group: Salary */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">Mức lương (VNĐ)</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" type="checkbox" />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">Dưới 5 triệu</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" type="checkbox" />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">5 - 10 triệu</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" type="checkbox" />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">Trên 10 triệu</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" type="checkbox" />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">Thoả thuận</span>
                                    </label>
                                </div>
                            </div>

                            {/* Filter Group: Job Type */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">Loại hình</label>
                                <div className="flex flex-wrap gap-2">
                                    <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-blue-600/10 text-blue-600 border border-blue-600/20">Full-time</button>
                                    <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-transparent hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Internship</button>
                                    <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-transparent hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Part-time</button>
                                </div>
                            </div>

                            {/* Filter Group: City */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">Thành phố</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">location_on</span>
                                    <input 
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm focus:ring-blue-600 outline-none text-slate-700 dark:text-slate-300" 
                                        placeholder="Hồ Chí Minh, Hà Nội..." 
                                        type="text" 
                                        value={locationSearch}
                                        onChange={e => setLocationSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Filter Group: Skills */}
                            <div>
                                <label className="block text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">Kỹ năng yêu cầu</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" type="checkbox" />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">English Communication</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" type="checkbox" />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">UI/UX Design</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" type="checkbox" />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">Critical Thinking</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Ad/Promo Card */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/20">
                            <span className="material-symbols-outlined mb-2 text-2xl">auto_awesome</span>
                            <h3 className="font-bold mb-2">CV của bạn đã sẵn sàng?</h3>
                            <p className="text-xs opacity-90 mb-4 leading-relaxed">Tối ưu CV bằng AI để tăng 80% tỷ lệ được gọi phỏng vấn.</p>
                            <Link to="/student/profile" className="block text-center w-full py-2 bg-white text-blue-600 font-bold text-xs rounded-lg hover:bg-opacity-90 transition-all">Tạo CV ngay</Link>
                        </div>
                    </aside>

                    {/* Results Section */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="text-center py-20 text-slate-500">
                                <span className="material-symbols-outlined animate-spin text-4xl mb-4">refresh</span>
                                <p>Đang tải danh sách việc làm...</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">search_off</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Không tìm thấy việc làm</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Rất tiếc, không có công việc nào trùng khớp với bộ lọc của bạn.</p>
                                <button onClick={() => { setSearch(''); setLocationSearch(''); }} className="mt-6 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-sm font-semibold transition-colors">Xoá bộ lọc</button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filtered.map(job => (
                                    <div key={job.id} className="group bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-600 transition-all shadow-sm hover:shadow-md">
                                        <div className="flex flex-col sm:flex-row gap-5">
                                            <div className="w-16 h-16 shrink-0 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center p-2 text-2xl font-bold text-blue-600">
                                                {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                                                            <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                                                        </h3>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-0.5">{job.companyName}</p>
                                                    </div>
                                                    <button className="text-slate-400 hover:text-red-500 transition-colors">
                                                        <span className="material-symbols-outlined">bookmark_add</span>
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap gap-4 mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="material-symbols-outlined text-sm">payments</span>
                                                        <span className="text-blue-600 font-bold">{job.salary || 'Thoả thuận'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="material-symbols-outlined text-sm">location_on</span>
                                                        <span>{job.location || 'Chưa cập nhật'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                                        <span>Có sẵn</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {job.jobType && (
                                                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                                            {job.jobType}
                                                        </span>
                                                    )}
                                                    {job.level && (
                                                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                                            {job.level}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-end gap-3 mt-6 border-t border-slate-100 dark:border-slate-700 pt-4">
                                                    <Link to={`/jobs/${job.id}`} className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700">Chi tiết</Link>
                                                    {(!user || user?.role === 'ROLE_STUDENT') && (
                                                        <Link to={`/jobs/${job.id}`} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20">Ứng tuyển nhanh</Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && filtered.length > 0 && (
                            <div className="mt-10 flex items-center justify-center gap-2">
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold">1</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">2</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">3</button>
                                <span className="px-2 text-slate-400">...</span>
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

        </div>
    );
};

export default JobList;
