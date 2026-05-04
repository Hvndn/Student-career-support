import React, { useState, useRef, useEffect } from 'react';
import '../../assets/css/common/SearchableSelect.css';

// Normalize Vietnamese: remove diacritics for fuzzy matching
// e.g. "nghe" matches "Nghệ An", "tp hcm" matches "Thành phố Hồ Chí Minh"
const normalize = (str) =>
    str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');

/**
 * Custom Searchable Dropdown Component
 * - Gõ để lọc danh sách
 * - Kết quả hiển thị trong khung bên dưới (không dùng native datalist)
 * - Chọn để điền giá trị vào input
 */
const SearchableSelect = ({
    options = [],        // Array of { value, label } or plain strings
    value = '',
    onChange,
    placeholder = 'Tìm kiếm...',
    disabled = false,
    id,
}) => {
    const [inputVal, setInputVal] = useState(value || '');
    const [open, setOpen] = useState(false);
    const [filtered, setFiltered] = useState([]);
    const containerRef = useRef(null);

    // Normalize options to { value, label }
    const normalizedOptions = options.map(o =>
        typeof o === 'string' ? { value: o, label: o } : o
    );

    // Sync when value prop changes externally
    useEffect(() => {
        setInputVal(value || '');
    }, [value]);

    // Close when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputVal(val);
        onChange(val);

        if (val.trim() === '') {
            setFiltered(normalizedOptions.slice(0, 60));
        } else {
            const keyword = normalize(val);
            setFiltered(
                normalizedOptions
                    .filter(o => normalize(o.label).includes(keyword))
                    .slice(0, 60)
            );
        }
        setOpen(true);
    };

    const handleFocus = () => {
        const keyword = normalize(inputVal.trim());
        if (keyword === '') {
            setFiltered(normalizedOptions.slice(0, 60));
        } else {
            setFiltered(
                normalizedOptions
                    .filter(o => normalize(o.label).includes(keyword))
                    .slice(0, 60)
            );
        }
        setOpen(true);
    };

    const handleSelect = (option) => {
        setInputVal(option.label);
        onChange(option.label);
        setOpen(false);
    };

    const handleClear = () => {
        setInputVal('');
        onChange('');
        setFiltered(normalizedOptions.slice(0, 50));
        setOpen(true);
    };

    return (
        <div className="ss-container" ref={containerRef}>
            <div className="ss-input-wrap">
                <input
                    id={id}
                    type="text"
                    className="ss-input"
                    value={inputVal}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete="off"
                />
                {inputVal && !disabled && (
                    <button className="ss-clear-btn" type="button" onClick={handleClear}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                )}
                <span className="ss-chevron material-symbols-outlined">
                    {open ? 'expand_less' : 'expand_more'}
                </span>
            </div>

            {open && !disabled && filtered.length > 0 && (
                <div className="ss-dropdown">
                    {filtered.map((option, idx) => (
                        <div
                            key={idx}
                            className={`ss-option ${option.label === inputVal ? 'ss-option--selected' : ''}`}
                            onMouseDown={(e) => { e.preventDefault(); handleSelect(option); }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}

            {open && !disabled && filtered.length === 0 && inputVal && (
                <div className="ss-dropdown">
                    <div className="ss-no-result">Không tìm thấy kết quả phù hợp</div>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
