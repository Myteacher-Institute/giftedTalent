import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function CvReviewIndex({ pendingResumes, stats }) {
    const [search, setSearch] = useState('');

    const filteredResumes = pendingResumes.data.filter(resume =>
        resume.user_name.toLowerCase().includes(search.toLowerCase()) ||
        resume.title?.toLowerCase().includes(search.toLowerCase())
    );

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
        return (bytes/(1024*1024)).toFixed(1) + ' MB';
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">CV Review Dashboard</h2>}>
            <Head title="CV Review" />
            
            <div className="p-6 max-w-7xl mx-auto">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        <div className="text-gray-600">Pending Review</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                        <div className="text-gray-600">Approved</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                        <div className="text-gray-600">Rejected</div>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <input
                        type="text"
                        placeholder="Search by user name or CV title..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Pending CVs ({filteredResumes.length})
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CV Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profile %</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredResumes.map((resume) => (
                                    <tr key={resume.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-full object-cover"
                                                        src={`https://i.pravatar.cc/40?img=${resume.user_id}`}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{resume.user_name}</div>
                                                    <div className="text-sm text-gray-500">{resume.user_position}</div>
                                                    <div className="text-sm text-gray-500">{resume.user_email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{resume.title || 'Untitled CV'}</div>
                                            <div className="text-sm text-gray-500">
                                                {formatSize(resume.file_size)} • PDF/DOC
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {resume.profile_complete}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(resume.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="space-x-2">
                                                <Link
                                                    href={`/Admin/cv-review/${resume.id}/download`}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    📥 Download
                                                </Link>
                                                <Link
                                                    href={`/Admin/cv-review/${resume.id}`}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                                                >
                                                    Review
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {pendingResumes.links && (
                        <nav className="px-6 py-4 bg-gray-50">
                            <div dangerouslySetInnerHTML={{__html: pendingResumes.links?.map(link => link.label).join(' ')}} />
                        </nav>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

