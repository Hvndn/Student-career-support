import React, { useState, useEffect } from 'react';
import { recruitmentApi } from '../../api';
import toast from 'react-hot-toast';

const InterviewEvaluationModal = ({ isOpen, onClose, onSuccess, interview }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        technicalScore: 5,
        communicationScore: 5,
        problemSolvingScore: 5,
        evaluationNotes: '',
        result: 'PASS',
        recommendation: 'PASS'
    });

    // Populate data if editing an existing evaluation
    useEffect(() => {
        if (isOpen && interview) {
            setFormData({
                technicalScore: interview.technicalScore || 5,
                communicationScore: interview.communicationScore || 5,
                problemSolvingScore: interview.problemSolvingScore || 5,
                evaluationNotes: interview.evaluationNotes || '',
                result: interview.result || 'PASS',
                recommendation: interview.recommendation || 'PASS'
            });
        }
    }, [isOpen, interview]);

    if (!isOpen || !interview) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            // Auto mapping recommendation to result
            if (name === 'recommendation') {
                if (value === 'PASS') newData.result = 'PASS';
                if (value === 'FAIL') newData.result = 'FAIL';
                if (value === 'CONSIDER') newData.result = 'CONSIDER';
            }
            return newData;
        });
    };

    const handleScoreChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    };

    const calculateOverall = () => {
        const score = (formData.technicalScore * 0.5) + 
                      (formData.communicationScore * 0.2) + 
                      (formData.problemSolvingScore * 0.3);
        return Math.round(score * 10) / 10;
    };

    const getScoreColor = (score) => {
        if (score >= 8) return '#10b981'; // Green
        if (score >= 5) return '#f59e0b'; // Orange/Yellow
        return '#ef4444'; // Red
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await recruitmentApi.evaluateInterview(interview.id, formData);
            if (response.data.status === 'success') {
                toast.success('Ghi nhận đánh giá thành công!');
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error submitting evaluation:', error);
            toast.error('Có lỗi xảy ra khi lưu đánh giá');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pjm-overlay">
            <div className="pjm-container" style={{ maxWidth: '600px' }}>
                <div className="pjm-header">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span className="material-symbols-outlined" style={{ color: '#10b981' }}>analytics</span> 
                            Đánh giá ứng viên: {interview.studentName}
                        </h2>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {interview.jobTitle} • {interview.stageType}
                        </span>
                    </div>
                    <button className="btn-close-modal" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                    <div className="pjm-body" style={{ flex: 1, overflowY: 'auto' }}>
                        <div className="pjm-section">
                            <div className="pjm-section-title">Điểm thành phần (1-10)</div>
                            
                            <div className="evaluation-grid" style={{ display: 'grid', gap: '1rem' }}>
                                <div className="pjm-field">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label>Kỹ thuật (Weight: 50%)</label>
                                        <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{formData.technicalScore}/10</span>
                                    </div>
                                    <input 
                                        type="range" min="1" max="10" 
                                        className="pjm-range"
                                        name="technicalScore"
                                        value={formData.technicalScore}
                                        onChange={(e) => handleScoreChange('technicalScore', e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                <div className="pjm-field">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label>Giao tiếp (Weight: 20%)</label>
                                        <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{formData.communicationScore}/10</span>
                                    </div>
                                    <input 
                                        type="range" min="1" max="10" 
                                        className="pjm-range"
                                        name="communicationScore"
                                        value={formData.communicationScore}
                                        onChange={(e) => handleScoreChange('communicationScore', e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                <div className="pjm-field">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label>Giải quyết vấn đề (Weight: 30%)</label>
                                        <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{formData.problemSolvingScore}/10</span>
                                    </div>
                                    <input 
                                        type="range" min="1" max="10" 
                                        className="pjm-range"
                                        name="problemSolvingScore"
                                        value={formData.problemSolvingScore}
                                        onChange={(e) => handleScoreChange('problemSolvingScore', e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>

                            <div style={{ 
                                marginTop: '1.5rem', 
                                padding: '1.25rem', 
                                borderRadius: '12px', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                background: `${getScoreColor(calculateOverall())}08`, 
                                border: `1px solid ${getScoreColor(calculateOverall())}33` 
                            }}>
                                <span style={{ fontWeight: '600', color: '#1e293b' }}>Điểm trung bình (Overall):</span>
                                <span style={{ 
                                    fontSize: '1.75rem', 
                                    fontWeight: '800', 
                                    color: getScoreColor(calculateOverall()),
                                    transition: 'all 0.3s ease'
                                }}>
                                    {calculateOverall()}
                                </span>
                            </div>
                        </div>

                        <div className="pjm-section">
                            <div className="pjm-section-title">Quyết định Tuyển dụng</div>
                            
                            <div className="pjm-row" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="pjm-field">
                                    <label>Đề xuất (Recommendation) *</label>
                                    <select 
                                        className="pjm-select"
                                        name="recommendation"
                                        value={formData.recommendation}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="PASS">Pass (Phù hợp)</option>
                                        <option value="FAIL">Fail (Không phù hợp)</option>
                                        <option value="CONSIDER">Consider (Cân nhắc thêm)</option>
                                    </select>
                                </div>
                                <div className="pjm-field">
                                    <label>Kết quả cuối (Result) *</label>
                                    <select 
                                        className="pjm-select"
                                        name="result"
                                        value={formData.result}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="PASS">✅ Chuyển sang Offer</option>
                                        <option value="FAIL">❌ Loại ứng viên (Rejected)</option>
                                        <option value="CONSIDER">🤔 Chờ xem xét</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pjm-field" style={{ marginTop: '1rem' }}>
                                <label>Ghi chú đánh giá</label>
                                <textarea 
                                    className="pjm-input"
                                    rows="4"
                                    name="evaluationNotes"
                                    placeholder="Ưu điểm, nhược điểm và nhận xét khác..."
                                    value={formData.evaluationNotes}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="pjm-footer">
                        <button type="button" className="pjm-btn-cancel" onClick={onClose}>
                            Để sau
                        </button>
                        <button 
                            type="submit" 
                            className="pjm-btn-submit" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang lưu...' : 'Hoàn thành đánh giá'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InterviewEvaluationModal;
