import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="loading-overlay">
            <div className="spinner-container">
                <div className="premium-spinner"></div>
                <span className="loading-text">Đang tải dữ liệu...</span>
            </div>
        </div>
    );
};

export default LoadingSpinner;
