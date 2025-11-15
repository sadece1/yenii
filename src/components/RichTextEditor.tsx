import { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export const RichTextEditor = ({ value, onChange, placeholder, error }: RichTextEditorProps) => {
  const quillRef = useRef<ReactQuill>(null);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        ['link'],
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: false,
    },
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'link'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'İçeriğinizi buraya yazın...'}
        className={`bg-white dark:bg-gray-700 rounded-lg ${
          error ? 'border-2 border-red-500' : ''
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      <style>{`
        .rich-text-editor .ql-container {
          min-height: 300px;
          font-size: 16px;
          font-family: inherit;
        }
        
        .rich-text-editor .ql-editor {
          min-height: 300px;
          color: #1f2937;
        }
        
        .dark .rich-text-editor .ql-editor {
          color: #f9fafb;
        }
        
        .rich-text-editor .ql-toolbar {
          background: #f9fafb;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border: 1px solid #d1d5db;
        }
        
        .dark .rich-text-editor .ql-toolbar {
          background: #374151;
          border-color: #4b5563;
        }
        
        .rich-text-editor .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border: 1px solid #d1d5db;
          border-top: none;
        }
        
        .dark .rich-text-editor .ql-container {
          border-color: #4b5563;
          background: #1f2937;
        }
        
        .rich-text-editor .ql-toolbar button:hover,
        .rich-text-editor .ql-toolbar button:focus {
          color: #059669 !important;
        }
        
        .rich-text-editor .ql-toolbar button.ql-active {
          color: #059669 !important;
        }
        
        .dark .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: #f9fafb;
        }
        
        .dark .rich-text-editor .ql-toolbar .ql-fill {
          fill: #f9fafb;
        }
        
        .dark .rich-text-editor .ql-toolbar button:hover .ql-stroke,
        .dark .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #10b981;
        }
        
        .dark .rich-text-editor .ql-toolbar button:hover .ql-fill,
        .dark .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #10b981;
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        
        .dark .rich-text-editor .ql-editor.ql-blank::before {
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};



