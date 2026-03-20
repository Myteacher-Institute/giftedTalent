import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function CvSimple({ user, resumes = [] }) {
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);
    const { post, delete: destroy, processing, errors } = useForm();

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(file.type)) {
            setMessage({ type: 'error', text: 'Please select PDF or DOCX file (max 2MB)' });
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'File too large. Max 2MB.' });
            return;
        }

        setUploading(true);
        setMessage(null);
        const formData = new FormData();
        formData.append('cv', file);
        formData.append('title', file.name.split('.')[0].substring(0, 50));

        post('/profile/resume', {
            forceFormData: true,
            onSuccess: () => {
                setMessage({ type: 'success', text: 'CV uploaded successfully!' });
                router.reload({ only: ['resumes'] });
                e.target.value = ''; // Reset input
            },
            onError: () => setMessage({ type: 'error', text: 'Upload failed. Please try again.' }),
            onFinish: () => {
                setUploading(false);
            },
        });
    };

    const handleDelete = (resumeId) => {
        if (!confirm('Are you sure you want to delete this CV?')) return;
        destroy(`/profile/resume/${resumeId}`, {
            onSuccess: () => setMessage({ type: 'success', text: 'CV deleted successfully!' }),
        });
    };

    const getFileIcon = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        return ext === 'pdf' ? '📄' : '📄';
    };

    const formatFileSize = (bytes) => {
        return (bytes / 1024).toFixed(1) + ' KB';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            year: 'numeric', month: 'short', day: 'numeric' 
        });
    };

    return (
        <AuthenticatedLayout 
            header={
                <h2 className="text-2xl font-bold text-gray-900">
                    CV Manager
                </h2>
            }
        >
            <Head title="CV Manager" />
            
            <div className="cv-page">
                <div className="cv-container">
                    {/* Header */}
                    <div className="cv-header">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <span className="text-xl font-bold text-white">CV</span>
                            </div>
                            <div>
                                <h1 className="cv-title">Manage Your CVs</h1>
                                <p className="cv-subtitle">Upload and manage your professional documents</p>
                            </div>
                        </div>
                        <p className="text-gray-600">👋 Welcome back, <span className="font-semibold">{user.name}</span></p>
                    </div>

                    {/* Upload Section */}
                    <div className="upload-section">
                        <div className="upload-label">
                            <span className="text-lg font-semibold text-gray-900 block mb-1">Upload New CV</span>
                            <span className="text-sm text-gray-500">PDF or DOCX • Max 2MB</span>
                        </div>
                        
                        <input 
                            type="file" 
                            className="upload-input"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileSelect}
                            disabled={uploading || processing}
                        />
                        <button 
                            className="upload-button disabled:opacity-50"
                            disabled={uploading || processing}
                            onClick={() => {}}
                        >
                            {uploading ? 'Uploading...' : 'Choose File & Upload'}
                        </button>
                    </div>

                    {/* Messages */}
                    {message && (
                        <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
                            {message.text}
                        </div>
                    )}
                    {errors.cv && (
                        <div className="error-message">Server error: {errors.cv}</div>
                    )}

                    {/* Resumes List */}
                    {resumes.length === 0 && !uploading ? (
                        <div className="empty-state">
                            <div className="empty-icon">📄</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No CVs uploaded</h3>
                            <p className="text-gray-600 mb-6">Upload your first CV to get started.</p>
                            <span className="text-sm text-gray-500">Click "Upload New CV" above</span>
                        </div>
                    ) : (
                        <div className="resumes-section">
                            <h3 className="resumes-title">Your CVs ({resumes.length})</h3>
                            <div className="resumes-grid">
                                {resumes.map((resume) => (
                                    <div key={resume.id} className="resume-card">
                                        <div className="resume-header">
                                            <div className="resume-icon">
                                                {getFileIcon(resume.title)}
                                            </div>
                                            <div className="resume-details">
                                                <div className="resume-name" title={resume.title}>
                                                    {resume.title.length > 30 ? resume.title.substring(0, 27) + '...' : resume.title}
                                                </div>
                                                <div className="resume-meta">
                                                    <span>{formatFileSize(resume.file_size)}</span>
                                                    <span>•</span>
                                                    <span>{formatDate(resume.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="resume-actions">
                                            <a 
                                                href={`/storage/${resume.file_path}`} 
                                                className="btn-download"
                                                download
                                            >
                                                Download
                                            </a>
                                            <button 
                                                className="btn-replace"
                                                onClick={() => document.querySelector('input[type="file"]').click()}
                                                disabled={uploading}
                                            >
                                                Replace
                                            </button>
                                            <button 
                                                className={`btn-delete ${processing ? 'loading' : ''}`}
                                                onClick={() => handleDelete(resume.id)}
                                                disabled={processing}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

