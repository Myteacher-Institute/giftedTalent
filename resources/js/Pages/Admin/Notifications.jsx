import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import '/resources/css/admin-notifications.css';

export default function Notifications({ notifications: initialNotifications, unreadCount: initialUnreadCount }) {
    const [notifications, setNotifications] = useState(initialNotifications.data || initialNotifications);
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
    const [processing, setProcessing] = useState(false);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const markAsRead = (id) => {
        setProcessing(true);
        router.patch(`/Admin/notifications/${id}/read`, {}, {
            onSuccess: () => {
                setNotifications(prev => prev.map(n =>
                    n.id === id ? { ...n, read_at: new Date().toISOString() } : n
                ));
                setUnreadCount(prev => prev - 1);
                setProcessing(false);
            }
        });
    };

    const markAllAsRead = () => {
        if (unreadCount === 0) return;
        setProcessing(true);
        router.post('/Admin/notifications/mark-all-read', {}, {
            onSuccess: () => {
                setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
                setUnreadCount(0);
                setProcessing(false);
            }
        });
    };

    const deleteNotification = (id) => {
        if (confirm('Delete this notification?')) {
            router.delete(`/Admin/notifications/${id}`);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'new_message':
                return (
                    <svg className="notification-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                );
            case 'new_job':
                return (
                    <svg className="notification-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                );
            default:
                return (
                    <svg className="notification-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                );
        }
    };

    const hasNotifications = notifications && notifications.length > 0;

    return (
        <>
            <Head title="Notifications - Admin" />

            <div className="admin-notifications-container">
                <div className="notifications-header">
                    <h1>Notifications</h1>
                    <div className="header-actions">
                        {unreadCount > 0 && (
                            <button
                                className="mark-all-btn"
                                onClick={markAllAsRead}
                                disabled={processing}
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                </div>

                <div className="notifications-stats">
                    <div className="stat-card">
                        <span className="stat-value">{notifications.length}</span>
                        <span className="stat-label">Total</span>
                    </div>
                    <div className="stat-card unread">
                        <span className="stat-value">{unreadCount}</span>
                        <span className="stat-label">Unread</span>
                    </div>
                </div>

                <div className="notifications-list">
                    {!hasNotifications ? (
                        <div className="no-notifications">
                            <svg className="empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            <p>No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map((notification) => {
                            const notificationLink = notification.data?.link || notification.link;
                            return (
                                <div
                                    key={notification.id}
                                    className={`notification-card ${!notification.read_at ? 'unread' : ''}`}
                                    onClick={() => {
                                        if (notificationLink) {
                                            router.get(notificationLink);
                                        }
                                    }}
                                    style={{ cursor: notificationLink ? 'pointer' : 'default' }}
                                >
                                    <div className="notification-icon">
                                        {getIcon(notification.data?.type || notification.type)}
                                    </div>
                                    <div className="notification-content">
                                        <div className="notification-header">
                                            <h3>{notification.data?.title || notification.title || 'Notification'}</h3>
                                            <span className="notification-date">{formatDate(notification.created_at)}</span>
                                        </div>
                                        <p>{notification.data?.message || notification.message}</p>
                                        {notificationLink && (
                                            <span className="notification-link">
                                                View details
                                                <svg className="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        )}
                                    </div>
                                    <div className="notification-actions">
                                        {!notification.read_at && (
                                            <button
                                                className="mark-read-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsRead(notification.id);
                                                }}
                                                title="Mark as read"
                                                disabled={processing}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </button>
                                        )}
                                        <button
                                            className="delete-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notification.id);
                                            }}
                                            title="Delete"
                                            disabled={processing}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {initialNotifications.links && (
                    <div className="pagination">
                        {initialNotifications.links.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={link.active ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (link.url) {
                                        router.get(link.url);
                                    }
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}