import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import '../../css/cv.css';

export default function Cv({ user, resumes = [] }) {
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);
    const [viewingResume, setViewingResume] = useState(null);
    const fileInputRef = useRef(null);
    
    // Debug log
    useEffect(() => {
        console.log('CV Page - User data:', user);
        console.log('CV Page - Resumes:', resumes);
    }, [user, resumes]);
    
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
        if (!validTypes.includes(file.type)) {
            setMessage({ type: 'error', text: 'Please select PDF or DOCX file (max 2MB)' });
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }
        
        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'File too large. Max 2MB.' });
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setUploading(true);
        setMessage(null);
        const formData = new FormData();
        formData.append('cv', file);
        formData.append('title', file.name.split('.')[0].substring(0, 50));

        router.post(route('profile.resume.store'), formData, {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                if (window.alertify) {
                    alertify.success('CV uploaded successfully and sent to Admin review!', 3);
                }
                setMessage({ type: 'success', text: 'CV uploaded successfully! It is now pending admin review.' });
                router.reload({ only: ['resumes'] });
                if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
                setViewingResume(null);
            },
            onError: (errors) => {
                const errorMsg = errors?.cv?.[0] || Object.values(errors)[0] || 'Upload failed. Please try again.';
                if (window.alertify) {
                    alertify.error(errorMsg, 3);
                }
                setMessage({ type: 'error', text: errorMsg });
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
            onFinish: () => setUploading(false),
        });
    };

    const handleDelete = (resumeId) => {
        if (!confirm('Are you sure you want to delete this CV?')) return;
        setUploading(true);
        router.delete(route('profile.resume.destroy', resumeId), {
            preserveState: true,
            onSuccess: () => {
                setMessage({ type: 'success', text: 'CV deleted successfully!' });
                setViewingResume(null);
            },
            onError: (errors) => {
                const errorMsg = Object.values(errors)[0] || 'Delete failed. Please try again.';
                setMessage({ type: 'error', text: errorMsg });
            },
            onFinish: () => setUploading(false),
        });
    };

    const handleView = (resume) => {
        setViewingResume(viewingResume?.id === resume.id ? null : resume);
    };

    const handleDownload = (resumeId) => {
        window.open(route('profile.resume.download', resumeId), '_blank');
    };

    const getFileIcon = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        if (ext === 'pdf') return '📄 PDF';
        if (ext === 'docx') return '📄 DOCX';
        if (ext === 'doc') return '📄 DOC';
        return '📄 File';
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 KB';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', text: '⏳ Pending Review' },
            approved: { color: 'bg-green-100 text-green-800', text: '✓ Approved' },
            rejected: { color: 'bg-red-100 text-red-800', text: '✗ Rejected' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    // Function to render file preview
    const renderFilePreview = (resume) => {
        if (!resume.file_base64) {
            return (
                <div className="text-center p-8">
                    <div className="text-6xl mb-4">📄</div>
                    <p className="text-gray-600">No preview available</p>
                    <button
                        onClick={() => handleDownload(resume.id)}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Download to View
                    </button>
                </div>
            );
        }

        const dataUrl = `data:${resume.file_mime_type};base64,${resume.file_base64}`;
        
        if (resume.file_mime_type === 'application/pdf') {
            return (
                <div>
                    <iframe
                        src={dataUrl}
                        className="w-full h-[500px] border rounded-lg"
                        title={resume.file_name}
                    />
                    <div className="mt-3 text-center">
                        <button
                            onClick={() => handleDownload(resume.id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Download PDF
                        </button>
                    </div>
                </div>
            );
        } else {
            // For DOC/DOCX files, show download option
            return (
                <div className="text-center p-8">
                    <div className="text-6xl mb-4">📄</div>
                    <p className="text-gray-600 mb-4">Preview not available for {resume.file_mime_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'DOCX' : 'DOC'} files</p>
                    <button
                        onClick={() => handleDownload(resume.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Download to View
                    </button>
                </div>
            );
        }
    };

    // Check if user data is available
    if (!user) {
        return (
            <AuthenticatedLayout>
                <Head title="CV Manager" />
                <div className="cv-page">
                    <div className="cv-container">
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading...</p>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

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
                            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                                <span className="text-xl font-bold text-white">CV</span>
                            </div>
                            <div>
                                <h1 className="cv-title">Manage Your CVs</h1>
                                <p className="cv-subtitle">Upload and organize your professional documents</p>
                            </div>
                        </div>
                        <p className="text-gray-600 text-lg">👋 Hi <span className="font-semibold text-gray-900">{user?.name?.split(' ')[0] || 'User'}</span></p>
                    </div>

                    {/* Upload Section */}
                    <div className="upload-section">
                        <label className="upload-label">
                            <span className="text-lg font-semibold text-gray-900 block mb-1">Upload New CV</span>
                            <span className="text-sm text-gray-500">Supports PDF, DOC, DOCX • Maximum 2MB</span>
                        </label>

                        <div className="upload-input-wrapper">
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="upload-input"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileSelect}
                                disabled={uploading}
                            />
                        </div>
                        <button
                            className="upload-button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            {uploading ? (
                                <>
                                    <div className="spinner mr-2"></div>
                                    Uploading...
                                </>
                            ) : (
                                'Select File and Upload CV'
                            )}
                        </button>
                    </div>

                    {/* Messages */}
                    {message && (
                        <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
                            {message.text}
                            <button
                                className="ml-auto text-sm hover:text-current"
                                onClick={() => setMessage(null)}
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* Resumes List */}
                    {resumes.length === 0 && !uploading ? (
                        <div className="empty-state">
                            <div className="empty-icon">📄</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No CVs Yet</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">Get started by uploading your first CV above. Your documents will appear here.</p>
                        </div>
                    ) : (
                        <div className="resumes-section">
                            <h3 className="resumes-title">Your CVs ({resumes.length})</h3>
                            {uploading && resumes.length === 0 && (
                                <div className="success-message mb-6">
                                    Uploading your first CV...
                                </div>
                            )}
                            <div className="resumes-grid">
                                {resumes.map((resume) => (
                                    <div key={resume.id} className="resume-item">
                                        <div className="resume-card">
                                            <div className="resume-header">
                                                <div className="resume-icon">
                                                    {getFileIcon(resume.file_name)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="resume-name" title={resume.title}>
                                                            {resume.title?.length > 30 ? resume.title.substring(0, 27) + '...' : resume.title || 'Untitled CV'}
                                                        </div>
                                                        {getStatusBadge(resume.status)}
                                                    </div>
                                                    <div className="resume-meta">
                                                        <span>{formatFileSize(resume.file_size)}</span>
                                                        <span>•</span>
                                                        <span>{formatDate(resume.created_at)}</span>
                                                    </div>
                                                    {resume.feedback && resume.status === 'rejected' && (
                                                        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                                                            <strong>Feedback:</strong> {resume.feedback}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="resume-actions">
                                                <button
                                                    className="btn-view"
                                                    onClick={() => handleView(resume)}
                                                >
                                                    {viewingResume?.id === resume.id ? 'Hide Preview' : 'Preview'}
                                                </button>
                                                <button
                                                    className="btn-download"
                                                    onClick={() => handleDownload(resume.id)}
                                                >
                                                    Download
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(resume.id)}
                                                    disabled={uploading}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Preview Section */}
                                        {viewingResume?.id === resume.id && (
                                            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-lg">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-semibold text-gray-900">Preview: {resume.file_name}</h4>
                                                    <button
                                                        onClick={() => setViewingResume(null)}
                                                        className="text-gray-500 hover:text-gray-700 text-xl"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                                {renderFilePreview(resume)}
                                            </div>
                                        )}
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