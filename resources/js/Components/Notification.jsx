import { useState } from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';

export default function NotificationBell() {
    const { notifications = { unread_count: 0, recent_unread: [] } } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);

    const markRead = (notificationId) => {
        router.post(route('notifications.read', notificationId));
    };

    const markAllRead = () => {
        router.post(route('notifications.readAll'));
    };

    return (
        <>
            <div className="relative">
                <Dropdown>
                    <Dropdown.Trigger>
                        <button className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {notifications.unread_count > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">
                                    {notifications.unread_count > 99 ? '99+' : notifications.unread_count}
                                </span>
                            )}
                        </button>
                    </Dropdown.Trigger>

                    <Dropdown.Content className="w-80 max-h-96 overflow-y-auto">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-900">Notifications ({notifications.unread_count})</h3>
                                {notifications.unread_count > 0 && (
                                    <button 
                                        onClick={markAllRead}
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>
                        </div>

                        {notifications.recent_unread.length === 0 ? (
                            <div className="p-4 text-sm text-gray-500 text-center py-8">
                                No new notifications
                            </div>
                        ) : (
                            notifications.recent_unread.map((notification) => (
                                <Link 
                                    key={notification.id} 
                                    href={route('notifications.index')} 
                                    className={`block p-4 border-b border-gray-100 hover:bg-gray-50 ${
                                        notification.is_unread ? 'bg-blue-50 border-blue-200' : ''
                                    }`}
                                    onClick={() => markRead(notification.id)}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                                                notification.status === 'approved' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : notification.status === 'rejected' 
                                                        ? 'bg-red-100 text-red-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {notification.status === 'approved' ? '✓' : 
                                                 notification.status === 'rejected' ? '✗' : 'ℹ'}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                                            <p className="text-sm text-gray-500 truncate mt-1">{notification.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}

                        <div className="p-4 border-t border-gray-200">
                            <Link 
                                href={route('notifications.index')} 
                                className="block w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                                View all notifications
                            </Link>
                        </div>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </>
    );
}
