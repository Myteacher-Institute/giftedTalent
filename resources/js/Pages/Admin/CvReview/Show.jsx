import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function CvReviewShow({ resume, stats }) {
    const { patch, processing, errors, setData, data } = useForm({
        status: '',
        feedback: '',
    });

    const handleSubmit = (status) => {
        setData('status', status);
        patch(`/Admin/cv-review/${resume.id}`, {
            onSuccess: () => {},
        });
    };

    const { url } = usePage();

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        return (bytes / 1024).toFixed(1) + ' KB';
    };

    const getStatusColor = (status) => ({
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        approved: 'bg-green-100 text-green-800 border-green-300',
        rejected: 'bg-red-100 text-red-800 border-red-300',
    }[status] || 'bg-gray-100 text-gray-800 border-gray-300');

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Review CV: {resume.title}</h2>}>
            <Head title={`Review CV - ${resume.user_name}`} />
            
            <div className="p-6 max-w-4xl mx-auto space-y-8">
                {/* User Info */}
                <div className="bg-white p-8 rounded-lg shadow">
                    <div className="flex items-start space-x-6">
                        <img 
                            className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-md"
                            src={`https://i.pravatar.cc/80?img=${resume.user_id}`}
                            alt={resume.user_name}
                        />
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900">{resume.user_name}</h3>
                            <p className="text-xl text-gray-600">{resume.user_position}</p>
                            <p className="text-gray-500 mb-2">{resume.user_email}</p>
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold border rounded-full ${getStatusColor(resume.status)}`}>
                                {resume.status.toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <span className="text-gray-500">Profile Completion:</span>
                            <span className="font-semibold ml-2">{resume.profile_complete}%</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Uploaded:</span>
                            <span className="font-semibold ml-2">
                                {new Date(resume.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* CV File */}
                <div className="bg-white p-8 rounded-lg shadow">
                    <h4 className="text-lg font-semibold mb-6">CV Document</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h5 className="text-md font-semibold mb-3">{resume.title || 'Untitled CV'}</h5>
                            <p className="text-gray-600 mb-6">
                                Size: {formatSize(resume.file_size)} • 
                                Status: <span className={`font-semibold ${getStatusColor(resume.status).replace('border', 'text')}`}>{resume.status}</span>
                            </p>
                            <Link
                                href={`/Admin/cv-review/${resume.id}/download`}
                                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                📥 Download CV
                            </Link>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <iframe 
                                src={resume.file_url} 
                                className="w-full h-96 border rounded-lg shadow-sm"
                                title="CV Preview"
                            />
                        </div>
                    </div>
                </div>

                {/* Review Form */}
                {resume.status === 'pending' && (
                    <div className="bg-white p-8 rounded-lg shadow">
                        <h4 className="text-xl font-semibold mb-6">Complete Review</h4>
                        
                        {Object.keys(errors).length > 0 && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                {Object.values(errors).map((error, i) => (
                                    <p key={i} className="text-red-800 text-sm">{error}</p>
                                ))}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
Feedback *(required)
                                </label>
                                <textarea
                                    rows="6"
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter your feedback, suggestions, or reasons for rejection..."
                                    value={data.feedback}
                                    onChange={(e) => setData('feedback', e.target.value)}
                                    disabled={processing}
                                />
                            </div>

                            <div className="flex flex-col lg:flex-row gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleSubmit('approved')}
                                    disabled={processing}
                                    className="flex-1 bg-green-600 text-white py-4 px-8 rounded-xl font-semibold hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        '✅ Approve CV'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSubmit('rejected')}
                                    disabled={processing}
                                    className="flex-1 bg-red-600 text-white py-4 px-8 rounded-xl font-semibold hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        '❌ Reject CV'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {resume.reviewer_id && (
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <h5 className="font-semibold text-blue-900 mb-2">Review History</h5>
                        <p className="text-sm text-blue-800">
                            Previously reviewed by admin on {new Date(resume.reviewed_at).toLocaleString()}
                        </p>
                    </div>
                )}

                <div className="flex space-x-4 pt-8 border-t">
                    <Link
                        href="/Admin/cv-review"
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium transition-colors"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

