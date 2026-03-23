import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function NotificationsIndex({ auth, notifications, unread_count }) {
    const [markingRead, setMarkingRead] = useState({});

    const handleMarkRead = (notificationId) => {
        setMarkingRead(prev => ({ ...prev, [notificationId]: true }));
        router.post(route('notifications.read', notificationId), {
            onSuccess: () => {
                setMarkingRead(prev => ({ ...prev, [notificationId]: false }));
            }
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Notifications ({unread_count} unread)
                </h2>
            }
        >
            <Head title="Notifications" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {notifications.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                                    <p className="text-gray-500">You'll see updates here when admin reviews your CVs.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {notifications.data.map((notification) => (
                                        <div key={notification.id} className={`p-6 border rounded-lg ${
                                            notification.is_unread 
                                                ? 'bg-blue-50 border-blue-200' 
                                                : 'bg-white border-gray-200'
                                        }`}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(notification.resume_status)}`}>
                                                            {notification.resume_status === 'approved' ? 'Approved' : 
                                                             notification.resume_status === 'rejected' ? 'Rejected' : 'Review'}
                                                        </span>
                                                        {notification.is_unread && (
                                                            <span className="text-xs font-medium text-blue-600">New</span>
                                                        )}
                                                    </div>
                                                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{notification.title}</h4>
                                                    <p className="text-gray-700 mb-3">{notification.message}</p>
                                                    {notification.resume && (
                                                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                                                            <p className="text-sm font-medium text-gray-900 mb-1">CV: {notification.resume.title}</p>
                                                            <p className="text-sm text-gray-600">Status: <span className={`font-semibold ${getStatusBadge(notification.resume.status).replace('text-', 'text- font-medium ')}`}>{notification.resume.status}</span></p>
                                                        </div>
                                                    )}
                                                    <p className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
                                                </div>
                                                <div className="flex-shrink-0 ml-4">
                                                    {notification.is_unread && (
                                                        <button
                                                            onClick={() => handleMarkRead(notification.id)}
                                                            disabled={markingRead[notification.id]}
                                                            className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors disabled:opacity-50"
                                                        >
                                                            {markingRead[notification.id] ? 'Reading...' : 'Mark read'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {notifications.links && (
                                <div className="mt-8 flex justify-center">
                                    {notifications.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`mx-1 px-3 py-2 text-sm font-medium rounded-md ${
                                                link.active
                                                    ? 'bg-blue-500 text-white'
                                                    : link.url
                                                        ? 'text-blue-600 hover:bg-blue-100'
                                                        : 'text-gray-400 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
