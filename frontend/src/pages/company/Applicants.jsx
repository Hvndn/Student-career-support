import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';

const Applicants = () => {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        recruitmentApi.getApplicants(jobId)
            .then(res => {
                setApplicants(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [jobId]);

    const handleStatusUpdate = async (appId, status) => {
        try {
            await recruitmentApi.updateStatus(appId, status);
            setApplicants(applicants.map(app => app.id === appId ? { ...app, status } : app));
        } catch (err) {
            alert('Cập nhật trạng thái thất bại!');
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Đang tải...</div>;

    return (
        <div className="company-dashboard-container">
            <CompanySidebar />
            <div className="company-main-content">
                <CompanyNavbar title="Ứng viên" />
                <main className="cd-main">
                    <div className="container" style={{ marginTop: '3rem' }}>
                        <h1 style={{ marginBottom: '2rem' }}>Quản lý <span className="gradient-text">Ứng viên</span></h1>
                        
                        <div className="glass" style={{ padding: '2rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Ứng viên</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Ngày nộp</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Trạng thái</th>
                                        <th style={{ padding: '1rem', textAlign: 'center' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicants.map(app => (
                                        <tr key={app.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '1.5rem 1rem' }}>
                                                <div style={{ fontWeight: 'bold' }}>{app.studentName}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.studentEmail}</div>
                                            </td>
                                            <td style={{ padding: '1.5rem 1rem' }}>{app.appliedDate}</td>
                                            <td style={{ padding: '1.5rem 1rem' }}>
                                                <span style={{ 
                                                    padding: '0.3rem 0.6rem', 
                                                    borderRadius: '4px', 
                                                    fontSize: '0.8rem',
                                                    background: app.status === 'ACCEPTED' ? 'rgba(16, 185, 129, 0.2)' : 'var(--surface)',
                                                    color: app.status === 'ACCEPTED' ? 'var(--success)' : 'white'
                                                }}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                    <button onClick={() => handleStatusUpdate(app.id, 'ACCEPTED')} className="btn glass" style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Duyệt</button>
                                                    <button onClick={() => handleStatusUpdate(app.id, 'REJECTED')} className="btn glass" style={{ fontSize: '0.8rem', color: 'var(--error)' }}>Từ chối</button>
                                                    <button className="btn btn-primary" style={{ fontSize: '0.8rem' }}>Hồ sơ</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {applicants.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Chưa có ứng viên nào nộp đơn.</div>}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Applicants;
