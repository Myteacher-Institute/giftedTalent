import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import AppNavbar from '../Components/AppNavbar';
import '../../css/cv.css';

export default function Cv({ auth, resumes = [] }) {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);
    const fileInputRef = useRef(null);
    
    const currentUser = auth?.user || null;

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen(!mobileSidebarOpen);
    };

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

        router.post(route('profile.resume.store'), formData, {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                alertify.success('CV uploaded successfully and sent to Admin review!', 3);
                setMessage({ type: 'success', text: 'CV uploaded to Admin review!' });
                router.reload({ only: ['resumes'] });
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
            onError: (errors) => {
                const errorMsg = Object.values(errors)[0] || 'Upload failed. Please try again.';
                alertify.error(errorMsg, 3);
                setMessage({ type: 'error', text: errorMsg });
            },
            onFinish: () => setUploading(false),
        });
    };

    const handleDelete = (resumeId) => {
        if (!confirm('Are you sure you want to delete this CV?')) return;
        router.delete(route('profile.resume.destroy', resumeId), {
            preserveState: true,
            onSuccess: () => setMessage({ type: 'success', text: 'CV deleted successfully!' }),
            onFinish: () => setUploading(false),
        });
    };

    const getFileIcon = (fileName) => {
        if (!fileName) return 'fa-file';
        const ext = fileName.split('.').pop().toLowerCase();
        if (ext === 'pdf') return 'fa-file-pdf';
        if (ext === 'doc' || ext === 'docx') return 'fa-file-word';
        return 'fa-file';
    };

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 KB';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const getUserName = () => {
        if (currentUser && currentUser.name) {
            return currentUser.name.split(' ')[0];
        }
        return 'User';
    };

    return (
        <>
            <Head title="CV Manager - GiftedTalents" />
            
            <AppNavbar 
                user={currentUser} 
                onMenuToggle={toggleMobileSidebar}
                isMenuOpen={mobileSidebarOpen}
            />

            <div className="cv-page">
                <div className="cv-container">
                    {/* Header */}
                    <div className="cv-header">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="cv-icon-box">
                                <i className="fas fa-file-alt"></i>
                            </div>
                            <div>
                                <h1 className="cv-title">Manage Your CVs</h1>
                                <p className="cv-subtitle">Upload and organize your professional documents</p>
                            </div>
                        </div>
                        <p className="welcome-text">
                            <i className="fas fa-hand-wave"></i> Hi <span className="user-name">{getUserName()}</span>
                        </p>
                    </div>

                    {/* Upload Section */}
                    <div className="upload-section">
                        <label className="upload-label">
                            <span className="upload-title">
                                <i className="fas fa-cloud-upload-alt"></i> Upload New CV
                            </span>
                            <span className="upload-hint">Supports PDF, DOCX • Maximum 2MB</span>
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
                            <i className="fas fa-folder-open upload-icon"></i>
                        </div>
                        <button className="upload-button" disabled={uploading}>
                            {uploading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Uploading...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-upload"></i> Select File and Upload CV
                                </>
                            )}
                        </button>
                    </div>

                    {/* Messages */}
                    {message && (
                        <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
                            <i className={message.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}></i>
                            {message.text}
                            <button className="close-message" onClick={() => setMessage(null)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    )}

                    {/* Resumes List */}
                    {(!resumes || resumes.length === 0) && !uploading ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <i className="fas fa-file-alt"></i>
                            </div>
                            <h3>No CVs Yet</h3>
                            <p>Get started by uploading your first CV above. Your documents will appear here.</p>
                            <button className="btn-primary" onClick={() => fileInputRef.current?.click()}>
                                <i className="fas fa-cloud-upload-alt"></i> Upload Your First CV
                            </button>
                        </div>
                    ) : (
                        <div className="resumes-section">
                            <h3 className="resumes-title">
                                <i className="fas fa-files"></i> Your CVs ({resumes ? resumes.length : 0})
                            </h3>
                            {uploading && (!resumes || resumes.length === 0) && (
                                <div className="success-message">
                                    <i className="fas fa-spinner fa-spin"></i> Uploading your first CV...
                                </div>
                            )}
                            <div className="resumes-grid">
                                {resumes && resumes.map((resume) => (
                                    <div key={resume.id} className="resume-card">
                                        <div className="resume-header">
                                            <div className="resume-icon">
                                                <i className={`fas ${getFileIcon(resume.file_name)}`}></i>
                                            </div>
                                            <div className="resume-details">
                                                <div className="resume-name" title={resume.title}>
                                                    {resume.title?.length > 30 ? resume.title.substring(0, 27) + '...' : resume.title || 'Untitled CV'}
                                                </div>
                                                <div className="resume-meta">
                                                    <span><i className="fas fa-database"></i> {formatFileSize(resume.file_size)}</span>
                                                    <span>•</span>
                                                    <span><i className="far fa-calendar-alt"></i> {formatDate(resume.created_at)}</span>
                                                </div>
                                            </div>
                                            <div className="resume-status">
                                                {resume.status === 'pending' ? (
                                                    <span className="status-pending">
                                                        <i className="fas fa-clock"></i> Pending
                                                    </span>
                                                ) : resume.status === 'approved' ? (
                                                    <span className="status-approved">
                                                        <i className="fas fa-check-circle"></i> Approved
                                                    </span>
                                                ) : (
                                                    <span className="status-rejected">
                                                        <i className="fas fa-times-circle"></i> Rejected
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="resume-actions">
                                            <a href={`/storage/${resume.file_path}`} className="btn-download" download>
                                                <i className="fas fa-download"></i> Download
                                            </a>
                                            <button className="btn-replace" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                                <i className="fas fa-sync-alt"></i> Replace
                                            </button>
                                            <button className={`btn-delete ${uploading ? 'loading' : ''}`} onClick={() => handleDelete(resume.id)} disabled={uploading}>
                                                <i className="fas fa-trash-alt"></i> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}