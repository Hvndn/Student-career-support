import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobApi } from '../../api';
import { getImageUrl } from '../../utils/urlUtils';
import '../../assets/css/student/Home.css';

const Home = () => {
  const [email, setEmail] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobApi.getJobs({ limit: 6 });
        setFeaturedJobs(res.data.data || []);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Hàm cuộn trang mượt mà
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="student-home mr-studio-style">
      {/* ── HERO SECTION (ID: home) ── */}
      <section id="home" className="mr-hero">
        <div className="mr-container">
          <div className="mr-hero-left">
            <h1 className="mr-headline">
              Nền tảng số 1 để <br />
              <span>Bứt phá Sự nghiệp</span>
            </h1>
            <div className="mr-search-box">
              <input type="email" placeholder="Nhập địa chỉ email của bạn..." value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="mr-btn-get-started">Bắt đầu ngay →</button>
            </div>
            <div className="mr-stats-box">
              <div className="mr-stat-big">1.6<span>x</span></div>
              <div className="mr-stat-divider"></div>
              <p className="mr-stat-desc">Tăng tỷ lệ ứng tuyển thành công lên <strong>60%</strong> nhờ AI của Fivecore.</p>
              <button className="mr-stat-plus">+</button>
            </div>
          </div>
          <div className="mr-hero-right">
            <div className="mr-gradient-shape"></div>
            <div className="mr-image-container">
              <img src="/images/imagehome.png" alt="Hero" className="mr-main-person" />
              <div className="mr-float-chart">📊</div>
              <div className="mr-float-engagement">
                <div className="mr-engagement-card">
                  <span className="mr-eng-label">Engagement</span>
                  <div className="mr-eng-value">28.51</div>
                  <div className="mr-eng-trend">+71.26%</div>
                  <div className="mr-eng-mini-chart">
                    {[40, 60, 80, 50, 70].map((h, i) => (
                      <div key={i} className="mr-bar" style={{height: `${h}%`}}></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mr-target-icon">🎯</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES (ID: categories) ── */}
      <section id="categories" className="mr-section mr-bg-white">
        <div className="mr-container">
          <div className="mr-section-header">
             <h2>Khám phá lĩnh vực</h2>
             {/* Nút xem tất cả đã bị xóa */}
          </div>
          <div className="mr-cat-grid">
            {[
              { icon: '💻', title: 'IT & Software', count: '120+ Jobs' },
              { icon: '📢', title: 'Marketing', count: '85+ Jobs' },
              { icon: '🎨', title: 'Design', count: '40+ Jobs' },
              { icon: '💰', title: 'Finance', count: '65+ Jobs' },
            ].map((cat, i) => (
              <div key={i} className="mr-cat-item">
                <span className="mr-cat-icon">{cat.icon}</span>
                <div className="mr-cat-info">
                  <h3>{cat.title}</h3>
                  <p>{cat.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED JOBS (ID: jobs) ── */}
      <section id="jobs" className="mr-section mr-bg-light">
        <div className="mr-container">
          <div className="mr-section-header">
            <h2>Việc làm <span className="dau-text-red">nổi bật</span></h2>
            <p>Những cơ hội tốt nhất dành cho bạn</p>
          </div>
          {loading ? (
            <div className="mr-loading">Đang tải...</div>
          ) : (
            <div className="mr-jobs-grid">
              {featuredJobs.map(job => (
                <div key={job.id} className="mr-job-card">
                  <div className="mr-job-top">
                    <div className="mr-job-logo">
                      {job.imageUrl ? (
                        <img src={getImageUrl(job.imageUrl)} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
                      ) : (
                        job.companyName?.charAt(0)
                      )}
                    </div>
                    <span className="mr-job-type">{job.jobType}</span>
                  </div>
                  <h3>{job.title}</h3>
                  <Link to={`/companies/${job.companyId}`} className="mr-job-company" style={{ textDecoration: 'none', display: 'block' }}>{job.companyName}</Link>
                  <div className="mr-job-footer">
                    <span>📍 {job.location}</span>
                    <span className="mr-job-salary">{job.salaryRange || (job.minSalary ? `${job.minSalary/1000000} - ${job.maxSalary/1000000} triệu` : 'Thỏa thuận')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── EVENTS (ID: events) ── */}
      <section id="events" className="mr-section">
        <div className="mr-container">
          <div className="mr-section-header">
            <h2>Sự kiện <span className="dau-text-blue">nghề nghiệp</span></h2>
            <p>Tham gia các Workshop và Job Fair để kết nối trực tiếp</p>
          </div>
          <div className="mr-events-grid">
            {[
              { date: '25 Th04', title: 'Ngày hội Việc làm Công nghệ 2024', loc: 'TP. Hồ Chí Minh' },
              { date: '12 Th05', title: 'Workshop: Kỹ năng viết CV chuẩn Quốc tế', loc: 'Trực tuyến' },
            ].map((ev, i) => (
              <div key={i} className="mr-event-card">
                <div className="mr-event-date">{ev.date}</div>
                <div className="mr-event-info">
                  <h3>{ev.title}</h3>
                  <p>📍 {ev.loc}</p>
                </div>
                <button className="mr-btn-outline">Đăng ký</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWS (ID: news) ── */}
      <section id="news" className="mr-section mr-bg-light">
        <div className="mr-container">
          <div className="mr-section-header">
            <h2>Tin tức & Xu hướng</h2>
            <p>Cập nhật những thông tin mới nhất về thị trường lao động</p>
          </div>
          <div className="mr-news-grid">
            {[1, 2, 3].map(n => (
              <div key={n} className="mr-news-card">
                <div className="mr-news-img"></div>
                <div className="mr-news-body">
                  <span className="mr-news-tag">Xu hướng</span>
                  <h3>Cách để đàm phán lương hiệu quả năm 2024</h3>
                  <p>Tìm hiểu các bí quyết giúp bạn đạt được mức lương mong muốn...</p>
                  <Link to="/blog" className="mr-news-link">Đọc tiếp →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (ID: testimonials) ── */}
      <section id="testimonials" className="mr-section">
        <div className="mr-container">
          <div className="mr-section-header-centered">
            <h2>Cảm nhận từ sinh viên</h2>
            <p>Hàng nghìn câu chuyện thành công bắt đầu từ Fivecore</p>
          </div>
          <div className="mr-testi-grid">
            {[
              { name: 'Nguyễn Văn A', role: 'Intern tại Google', text: 'Fivecore đã giúp mình tìm thấy công việc mơ ước chỉ sau 2 tuần ứng tuyển.' },
              { name: 'Trần Thị B', role: 'Designer tại VinFast', text: 'Hệ thống gợi ý việc làm của Fivecore cực kỳ chính xác và hữu ích.' }
            ].map((t, i) => (
              <div key={i} className="mr-testi-card">
                <p className="mr-testi-text">"{t.text}"</p>
                <div className="mr-testi-user">
                  <div className="mr-testi-avatar">{t.name[0]}</div>
                  <div>
                    <h4>{t.name}</h4>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUPPORT (ID: support) ── */}
      <section id="support" className="mr-section mr-bg-dark-section">
        <div className="mr-container">
          <div className="mr-support-flex">
            <div className="mr-support-text">
              <h2>Trung tâm Hỗ trợ</h2>
              <p>Bạn gặp khó khăn? Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ 24/7.</p>
              <div className="mr-support-options">
                <div className="mr-sup-opt"><span>💬</span> Trò chuyện trực tiếp</div>
                <div className="mr-sup-opt"><span>📞</span> Tổng đài: 1900 8888</div>
              </div>
            </div>
            <div className="mr-support-form">
              <h3>Gửi tin nhắn cho chúng tôi</h3>
              <input type="text" placeholder="Họ tên của bạn" />
              <textarea placeholder="Nội dung cần hỗ trợ..."></textarea>
              <button className="mr-btn-primary">Gửi yêu cầu</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mr-footer">
        <div className="mr-container">
          <div className="mr-footer-grid">
            <div className="mr-footer-col">
              <div className="mr-footer-logo">Fivecore</div>
              <p className="mr-footer-motto">CỔNG KẾT NỐI VIỆC LÀM TOÀN CẦU</p>
              <div className="mr-footer-contact">
                <div className="mr-contact-item"><span>📞</span><div><p>1900 8888</p></div></div>
                <div className="mr-contact-item"><span>📍</span><div><p>Quận 12, TP. Hồ Chí Minh</p></div></div>
              </div>
            </div>
            <div className="mr-footer-col">
              <h3>Điều hướng</h3>
              <ul className="mr-footer-links">
                <li><button onClick={() => scrollToSection('home')}>Trang chủ</button></li>
                <li><button onClick={() => scrollToSection('categories')}>Danh mục</button></li>
                <li><button onClick={() => scrollToSection('events')}>Sự kiện</button></li>
                <li><button onClick={() => scrollToSection('news')}>Tin tức</button></li>
              </ul>
            </div>
            <div className="mr-footer-col">
              <h3>Hợp tác</h3>
              <ul className="mr-footer-links">
                <li><Link to="/employer/post-job">Đăng tuyển</Link></li>
                <li><Link to="/partner">Đối tác</Link></li>
              </ul>
            </div>
            <div className="mr-footer-col">
              <div className="mr-newsletter-box">
                <h3>Nhận tin tức</h3>
                <div className="mr-newsletter-input">
                  <input type="text" placeholder="Email..." />
                  <button className="mr-newsletter-btn">✈️</button>
                </div>
              </div>
            </div>
          </div>
          <div className="mr-footer-bottom">
            <p>© 2025 Fivecore Platform.</p>
          </div>
        </div>
      </footer>

      {/* FLOATING SOCIALS */}
      <div className="mr-floating-actions">
        <a href="#" className="mr-float-btn fb">f</a>
        <a href="#" className="mr-float-btn zalo">Z</a>
        <a href="tel:19008888" className="mr-float-btn phone">📞</a>
      </div>
    </div>
  );
};

export default Home;
