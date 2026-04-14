import React, { useState, useEffect, useRef } from 'react';

const EditableText = ({ value, onChange, placeholder, style, as: Component = 'span', multiline = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(value || '');
    const inputRef = useRef(null);

    useEffect(() => {
        setText(value || '');
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleBlur = () => {
        setIsEditing(false);
        if (text !== value) {
            onChange(text);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !multiline) {
            handleBlur();
        }
        if (e.key === 'Escape') {
            setText(value || '');
            setIsEditing(false);
        }
    };

    if (isEditing) {
        if (multiline) {
            return (
                <textarea
                    ref={inputRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    style={{
                        ...style,
                        width: '100%',
                        border: '1px solid var(--accent-color, #2563eb)',
                        outline: 'none',
                        background: 'rgba(37, 99, 235, 0.05)',
                        padding: '2px',
                        borderRadius: '2px',
                        resize: 'none',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        color: 'inherit',
                        lineHeight: 'inherit'
                    }}
                    rows={text.split('\n').length || 1}
                />
            );
        }
        return (
            <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                style={{
                    ...style,
                    border: '1px solid var(--accent-color, #2563eb)',
                    outline: 'none',
                    background: 'rgba(37, 99, 235, 0.05)',
                    padding: '0 2px',
                    borderRadius: '2px',
                    width: '100%',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    color: 'inherit'
                }}
            />
        );
    }

    return (
        <Component
            onClick={() => setIsEditing(true)}
            style={{
                ...style,
                cursor: 'text',
                border: '1px solid transparent',
                borderRadius: '2px',
                transition: 'all 0.2s',
                display: multiline ? 'block' : 'inline-block',
                minWidth: '20px',
                minHeight: multiline ? '1.5em' : 'auto'
            }}
            className="editable-hover"
        >
            {text || placeholder || '...'}
        </Component>
    );
};

export default EditableText;
