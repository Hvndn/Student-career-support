import React, { useRef, useEffect } from 'react';
import '../../assets/css/common/RichTextEditor.css';

const RichTextEditor = ({ value, onChange, placeholder, label }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const execCommand = (command, arg = null) => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const toggleCase = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const text = range.toString();
    
    if (text) {
      const isUpper = text === text.toUpperCase();
      const newText = isUpper ? text.toLowerCase() : text.toUpperCase();
      
      const newNode = document.createTextNode(newText);
      range.deleteContents();
      range.insertNode(newNode);
      
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  return (
    <div className="rte-container">
      {label && <label className="rte-label">{label}</label>}
      <div className="rte-toolbar">
        <button type="button" onClick={() => execCommand('bold')} title="In đậm">
          <b>B</b>
        </button>
        <button type="button" onClick={() => execCommand('italic')} title="In nghiêng">
          <i>I</i>
        </button>
        <button type="button" onClick={() => execCommand('underline')} title="Gạch chân">
          <u>U</u>
        </button>
        <button type="button" onClick={toggleCase} title="Chuyển đổi HOA/thường">
          Aa
        </button>
        <div className="rte-separator"></div>
        <button type="button" onClick={() => execCommand('insertUnorderedList')} title="Danh sách">
          • List
        </button>
        <button type="button" onClick={() => execCommand('removeFormat')} title="Xóa định dạng">
          ⌫
        </button>
      </div>
      <div
        ref={editorRef}
        className="rte-editor"
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        placeholder={placeholder}
      ></div>
    </div>
  );
};

export default RichTextEditor;
