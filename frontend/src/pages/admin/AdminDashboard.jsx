import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { adminApi } from '../../api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminLayout.css';
import '../../assets/css/admin/AdminSidebar.css';
import '../../assets/css/admin/AdminNavbar.css';
import '../../assets/css/admin/AdminDashboard.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCompanies: 0,
        totalJobs: 0,
        totalApplications: 0,
        pendingCompanies: 0,
        totalProjects: 0,
        totalInterviews: 0,
        totalVisits: 0,
        dailyVisits: [],
        industryDistribution: {},
        recentActivities: [],
        topJobs: []
    });
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await adminApi.getStats();
                if (res.data && res.data.data) {
                    setStats(prev => ({ ...prev, ...res.data.data }));
                }
            } catch (error) {
                console.error("Lỗi lấy dữ liệu dashboard admin:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const metrics = [
        { label: 'Sinh viên', value: stats.totalStudents, icon: 'group', color: '#3b82f6', bg: '#eff6ff', link: '/admin/students' },
        { label: 'Doanh nghiệp', value: stats.totalCompanies, icon: 'domain', color: '#ef4444', bg: '#fef2f2', link: '/admin/companies' },
        { label: 'Việc làm', value: stats.totalJobs, icon: 'work', color: '#f59e0b', bg: '#fffbeb' },
        { label: 'Thử thách dự án', value: stats.totalProjects, icon: 'emoji_events', color: '#10b981', bg: '#ecfdf5' },
        { label: 'Lượt truy cập', value: stats.totalVisits, icon: 'show_chart', color: '#8b5cf6', bg: '#f5f3ff' },
        { label: 'Ứng tuyển', value: stats.totalApplications, icon: 'assignment', color: '#ec4899', bg: '#fdf2f8' },
        { label: 'Lịch hẹn', value: stats.totalInterviews, icon: 'event', color: '#0ea5e9', bg: '#f0f9ff' },
        { label: 'Bài viết tin tức', value: '0', icon: 'article', color: '#14b8a6', bg: '#f0fdfa' }
    ];

    const COLORS = ['#3b82f6', '#ef4444', '#f97316', '#8b5cf6', '#10b981', '#94a3b8'];

    const dynamicPieData = Object.entries(stats.industryDistribution || {}).map(([key, val]) => ({
        name: key,
        value: val
    }));
    const pieData = dynamicPieData.length > 0 ? dynamicPieData : [{ name: 'Chưa có phân bố', value: 100 }];
    const totalPie = pieData.reduce((acc, curr) => acc + curr.value, 0);

    const getRankClass = (idx) => {
        if (idx === 0) return 'rank-1';
        if (idx === 1) return 'rank-2';
        if (idx === 2) return 'rank-3';
        return 'rank-other';
    };

    const handleExportReport = async () => {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'DAU Connect';
        workbook.created = new Date();

        const styleHeader = (worksheet, headers, width = 25) => {
            const headerRow = worksheet.addRow(headers);
            headerRow.font = { name: 'Arial', bold: true, color: { argb: 'FFFFFFFF' } };
            headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
            headerRow.eachCell((cell) => {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D5CDA' } };
                cell.border = {
                    top: { style: 'thin' }, left: { style: 'thin' },
                    bottom: { style: 'thin' }, right: { style: 'thin' }
                };
            });
            worksheet.columns.forEach(col => { col.width = width; });
            return headerRow;
        };

        const addBorders = (row) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' }, left: { style: 'thin' },
                    bottom: { style: 'thin' }, right: { style: 'thin' }
                };
            });
        };

        // 1. Sheet Tổng quan
        const wsTongQuan = workbook.addWorksheet('Tổng quan');
        styleHeader(wsTongQuan, ['Chỉ số', 'Giá trị'], 35);
        [
            ['Sinh viên', stats.totalStudents || 0],
            ['Doanh nghiệp', stats.totalCompanies || 0],
            ['Việc làm', stats.totalJobs || 0],
            ['Thử thách dự án', stats.totalProjects || 0],
            ['Lượt truy cập', stats.totalVisits || 0],
            ['Ứng tuyển', stats.totalApplications || 0],
            ['Lịch hẹn', stats.totalInterviews || 0],
            ['Doanh nghiệp chờ duyệt', stats.pendingCompanies || 0],
        ].forEach(data => addBorders(wsTongQuan.addRow(data)));

        // 2. Sheet Lượt truy cập
        if (stats.dailyVisits && stats.dailyVisits.length > 0) {
            const wsTruyCap = workbook.addWorksheet('Lượt truy cập');
            styleHeader(wsTruyCap, ['Ngày', 'Lượt truy cập']);
            stats.dailyVisits.forEach(v => addBorders(wsTruyCap.addRow([v.date, v.truyCap])));
        }

        // 3. Sheet Ngành nghề
        if (stats.industryDistribution && Object.keys(stats.industryDistribution).length > 0) {
            const wsNganhNghe = workbook.addWorksheet('Ngành nghề');
            styleHeader(wsNganhNghe, ['Ngành nghề', 'Số lượng doanh nghiệp'], 40);
            Object.entries(stats.industryDistribution).forEach(([industry, count]) => {
                addBorders(wsNganhNghe.addRow([industry, count]));
            });
        }

        // 4. Sheet Việc làm nổi bật
        if (stats.topJobs && stats.topJobs.length > 0) {
            const wsViecLam = workbook.addWorksheet('Việc làm nổi bật');
            styleHeader(wsViecLam, ['Tên việc làm', 'Công ty', 'Lượt xem', 'Lượt ứng tuyển'], 40);
            stats.topJobs.forEach(job => addBorders(wsViecLam.addRow([job.title, job.companyName, job.views, job.applicants])));
        }

        // 5. Sheet Hoạt động gần đây
        if (stats.recentActivities && stats.recentActivities.length > 0) {
            const wsHoatDong = workbook.addWorksheet('Hoạt động gần đây');
            styleHeader(wsHoatDong, ['Người dùng', 'Vai trò', 'Ngày tham gia'], 30);
            stats.recentActivities.forEach(act => {
                const roleName = act.role.toLowerCase() === 'student' ? 'Sinh viên' : 'Nhà tuyển dụng';
                addBorders(wsHoatDong.addRow([act.name, roleName, new Date(act.createdAt).toLocaleDateString('vi-VN')]));
            });
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `Bao_cao_chi_tiet_DAU_Connect_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    if (loading) return (
        <div className="admin-loading">
            <div className="loader"></div>
            <span>Đang tải dữ liệu...</span>
        </div>
    );

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar />
                <main className="admin-body">
                    <section className="dau-header-section">
                        <div className="dau-header-left">
                            <div className="status-badge-dau">
                                <span className="status-dot"></span>
                                ADMIN DASHBOARD
                            </div>
                            <h1>Chào buổi tối, <span className="text-red">Admin</span> 👋</h1>
                            <p>Tổng quan hệ thống DAU Connect hôm nay</p>
                        </div>
                        <div className="dau-header-right" style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={handleExportReport} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem', boxShadow: '0 2px 4px rgba(16,185,129,0.2)' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>download</span>
                                Xuất báo cáo
                            </button>
                            <button className="btn-refresh" onClick={() => window.location.reload()}>
                                <span className="material-symbols-outlined">refresh</span>
                                Làm mới
                            </button>
                        </div>
                    </section>

                    <section className="dau-metrics-grid">
                        {metrics.map((metric, i) => {
                            const CardContent = (
                                <>
                                    <div className="dau-metric-icon" style={{ backgroundColor: metric.bg, color: metric.color }}>
                                        <span className="material-symbols-outlined">{metric.icon}</span>
                                    </div>
                                    <div className="dau-metric-content">
                                        <h2 className="dau-metric-value">{metric.value}</h2>
                                        <span className="dau-metric-label">{metric.label}</span>
                                    </div>
                                </>
                            );

                            return metric.link ? (
                                <Link key={i} to={metric.link} className="dau-metric-card" style={{ textDecoration: 'none' }}>
                                    {CardContent}
                                </Link>
                            ) : (
                                <div key={i} className="dau-metric-card">
                                    {CardContent}
                                </div>
                            );
                        })}
                    </section>

                    <div className="dau-charts-grid">
                        <div className="dau-chart-card">
                            <div className="dau-chart-header">
                                <div className="dau-chart-title">
                                    <h3>Xu hướng tăng trưởng truy cập</h3>
                                    <p>Lượt đăng nhập theo ngày</p>
                                </div>
                                <div className="dau-chart-legend">
                                    <div className="legend-item"><span className="dot" style={{ background: '#a31919' }}></span>Lượt truy cập</div>
                                </div>
                            </div>

                            <div style={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stats.dailyVisits} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="date" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Line type="monotone" dataKey="truyCap" name="Lượt đăng nhập" stroke="#a31919" strokeWidth={3} dot={{ r: 6, fill: '#a31919' }} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="dau-chart-card">
                            <div className="dau-chart-header">
                                <div className="dau-chart-title">
                                    <h3>Phân bố ngành nghề</h3>
                                    <p>Doanh nghiệp theo lĩnh vực</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', height: 300, paddingRight: '20px' }}>
                                <div style={{ flex: 1, height: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="pie-custom-legend">
                                    {pieData.map((entry, index) => {
                                        let percent = totalPie > 0 ? Math.round((entry.value / totalPie) * 100) : 0;
                                        if (entry.name === 'Chưa có phân bố') percent = 100;
                                        return (
                                            <div key={index} className="pie-legend-item">
                                                <div className="pie-legend-left">
                                                    <span className="dot" style={{ background: COLORS[index % COLORS.length] }}></span>
                                                    <span className="name">{entry.name}</span>
                                                </div>
                                                <span className="value">{percent}%</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dau-bottom-grid">
                        <div className="dau-list-card">
                            <div className="dau-list-header">
                                <div className="dau-list-title">
                                    <span className="material-symbols-outlined icon-orange">trending_up</span>
                                    <div>
                                        <h3>Top việc làm nổi bật</h3>
                                        <p>Nhiều lượt xem nhất</p>
                                    </div>
                                </div>
                                <a href="#all" className="link-red">Xem tất cả <span className="material-symbols-outlined">arrow_forward</span></a>
                            </div>
                            <div className="dau-list-content">
                                {stats.topJobs && stats.topJobs.length > 0 ? (
                                    stats.topJobs.map((job, idx) => (
                                        <div key={job.id} className="job-top-item">
                                            <span className={`rank-badge ${getRankClass(idx)}`}>#{idx + 1}</span>
                                            <div className="job-info">
                                                <h4>{job.title}</h4>
                                                <p>{job.companyName}</p>
                                            </div>
                                            <div className="job-stats">
                                                <span className="stat"><span className="material-symbols-outlined">visibility</span> {job.views}</span>
                                                <span className="stat hl"><span className="material-symbols-outlined">person_outline</span> {job.applicants}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', marginTop: '20px' }}>Chưa có tin tuyển dụng nào</p>
                                )}
                            </div>
                        </div>

                        <div className="dau-list-card">
                            <div className="dau-list-header">
                                <div className="dau-list-title">
                                    <span className="material-symbols-outlined icon-blue">schedule</span>
                                    <div>
                                        <h3>Hoạt động gần đây</h3>
                                        <p>Cập nhật người đăng ký mới nhất</p>
                                    </div>
                                </div>
                            </div>
                            <div className="dau-list-content">
                                {stats.recentActivities && stats.recentActivities.length > 0 ? (
                                    stats.recentActivities.map((act, idx) => {
                                        const isStudent = act.role.toLowerCase() === 'student';
                                        return (
                                            <div key={idx} className="activity-row">
                                                <div className="avatar-icon"><span className="material-symbols-outlined">person_add</span></div>
                                                <div className="activity-info">
                                                    <p>{isStudent ? 'Sinh viên' : 'Nhà tuyển dụng'} <strong>{act.name}</strong> vừa tham gia hệ thống</p>
                                                    <span>{new Date(act.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', marginTop: '20px' }}>Chưa có hoạt động mới</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="dau-full-card mt-20">
                        <div className="dau-list-header">
                            <div className="dau-list-title">
                                <span className="material-symbols-outlined icon-yellow">error</span>
                                <div>
                                    <h3>Doanh nghiệp chờ duyệt</h3>
                                    <p>Cần xét duyệt để kích hoạt</p>
                                </div>
                            </div>
                            <a href="#manage" className="link-red">Quản lý <span className="material-symbols-outlined">arrow_forward</span></a>
                        </div>
                        {stats.pendingCompanies === 0 ? (
                            <div className="dau-empty-state">
                                <div className="empty-icon-wrapper">
                                    <span className="material-symbols-outlined success-icon">task_alt</span>
                                </div>
                                <h4>Không có doanh nghiệp nào chờ duyệt</h4>
                                <p>Tất cả đã được xử lý ✨</p>
                            </div>
                        ) : (
                            <div className="dau-empty-state" style={{ flexDirection: 'row', gap: '20px' }}>
                                <div className="empty-icon-wrapper" style={{ background: '#fefce8', color: '#eab308' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>warning</span>
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <h4>Đang có {stats.pendingCompanies} doanh nghiệp chờ duyệt</h4>
                                    <p>Vui lòng chuyển hướng sang trang Quản lý Sinh viên/Doanh nghiệp để xét duyệt nhanh.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
