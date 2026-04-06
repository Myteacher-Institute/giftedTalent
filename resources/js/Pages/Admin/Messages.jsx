import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import '/resources/css/admin-messages.css';

export default function Messages({ messages: initialMessages, stats: initialStats, filters }) {
    const [messages, setMessages] = useState(initialMessages.data || initialMessages);
    const [stats, setStats] = useState({
        total: initialStats.total || 0,
        unread: initialStats.unread || 0,
        read: initialStats.read || 0,
        replied: initialStats.replied || 0
    });
    const [paginationLinks, setPaginationLinks] = useState(initialMessages.links || null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [replying, setReplying] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [processing, setProcessing] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);

    // Update when props change
    useEffect(() => {
        setMessages(initialMessages.data || initialMessages);
        setStats({
            total: initialStats.total || 0,
            unread: initialStats.unread || 0,
            read: initialStats.read || 0,
            replied: initialStats.replied || 0
        });
        setPaginationLinks(initialMessages.links || null);
    }, [initialMessages, initialStats]);

    // Recalculate stats from messages whenever messages change
    useEffect(() => {
        const total = messages.length;
        const unread = messages.filter(m => !m.is_read).length;
        const read = messages.filter(m => m.is_read).length;
        const replied = messages.filter(m => m.admin_reply).length;

        setStats({
            total,
            unread,
            read,
            replied
        });
    }, [messages]);

    // Auto-refresh every 3 seconds
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            router.reload({
                only: ['messages', 'stats'],
                preserveState: true,
                preserveScroll: true
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [autoRefresh]);

    const handleSearch = () => {
        router.get('/Admin/messages', {
            search: searchTerm,
            status: statusFilter
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        router.get('/Admin/messages', {
            search: searchTerm,
            status: status
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleReply = (message) => {
        setSelectedMessage(message);
        setReplying(true);
    };

    const sendReply = () => {
        if (!replyText.trim()) {
            alert('Please enter a reply message');
            return;
        }

        setProcessing(true);

        router.post(`/Admin/messages/${selectedMessage.id}/reply`, {
            reply: replyText
        }, {
            onSuccess: () => {
                // Update local state with the reply
                setMessages(prev => prev.map(msg =>
                    msg.id === selectedMessage.id
                        ? {
                            ...msg,
                            is_read: true,
                            admin_reply: replyText,
                            replied_at: new Date().toISOString()
                        }
                        : msg
                ));

                setReplying(false);
                setSelectedMessage(null);
                setReplyText('');
                setProcessing(false);
                alert('Reply sent successfully!');
            },
            onError: (errors) => {
                console.error('Reply error:', errors);
                alert('Failed to send reply. Please try again.');
                setProcessing(false);
            }
        });
    };

    const deleteMessage = (id) => {
        if (confirm('Are you sure you want to delete this message?')) {
            setProcessing(true);
            router.delete(`/Admin/messages/${id}`, {
                onSuccess: () => {
                    setMessages(prev => prev.filter(msg => msg.id !== id));
                    setProcessing(false);
                    alert('Message deleted successfully!');
                },
                onError: (errors) => {
                    console.error('Delete error:', errors);
                    alert('Failed to delete message.');
                    setProcessing(false);
                }
            });
        }
    };

    const markAsRead = (message) => {
        const newReadStatus = !message.is_read;
        setProcessing(true);

        router.patch(`/Admin/messages/${message.id}/read`, {
            is_read: newReadStatus
        }, {
            onSuccess: () => {
                setMessages(prev => prev.map(msg =>
                    msg.id === message.id
                        ? { ...msg, is_read: newReadStatus }
                        : msg
                ));
                setProcessing(false);
            },
            onError: (errors) => {
                console.error('Mark as read error:', errors);
                setProcessing(false);
            }
        });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const hasMessages = messages && messages.length > 0;

    return (
        <>
            <Head title="Messages - Admin" />

            <div className="admin-messages-container">
                <div className="messages-header">
                    <h1>Contact Messages</h1>
                    <div className="header-controls">
                        <div className="auto-refresh-toggle">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={autoRefresh}
                                    onChange={(e) => setAutoRefresh(e.target.checked)}
                                />
                                Auto-refresh (3s)
                            </label>
                        </div>
                        <div className="messages-stats">
                            <div className="stat-card">
                                <span className="stat-value">{stats.total}</span>
                                <span className="stat-label">Total</span>
                            </div>
                            <div className="stat-card unread">
                                <span className="stat-value">{stats.unread}</span>
                                <span className="stat-label">Unread</span>
                            </div>
                            <div className="stat-card read">
                                <span className="stat-value">{stats.read}</span>
                                <span className="stat-label">Read</span>
                            </div>
                            <div className="stat-card replied">
                                <span className="stat-value">{stats.replied}</span>
                                <span className="stat-label">Replied</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="messages-filters">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by name, email, or subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button onClick={handleSearch} className="search-btn" disabled={processing}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                            </svg>
                        </button>
                    </div>
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${statusFilter === '' ? 'active' : ''}`}
                            onClick={() => handleStatusFilter('')}
                            disabled={processing}
                        >
                            All
                        </button>
                        <button
                            className={`filter-btn ${statusFilter === 'unread' ? 'active' : ''}`}
                            onClick={() => handleStatusFilter('unread')}
                            disabled={processing}
                        >
                            Unread
                        </button>
                        <button
                            className={`filter-btn ${statusFilter === 'read' ? 'active' : ''}`}
                            onClick={() => handleStatusFilter('read')}
                            disabled={processing}
                        >
                            Read
                        </button>
                    </div>
                </div>

                <div className="messages-list">
                    {!hasMessages ? (
                        <div className="no-messages">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            </svg>
                            <p>No messages found</p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div key={message.id} className={`message-card ${!message.is_read ? 'unread' : ''}`}>
                                <div className="message-status">
                                    <input
                                        type="checkbox"
                                        checked={message.is_read}
                                        onChange={() => markAsRead(message)}
                                        title={message.is_read ? "Mark as unread" : "Mark as read"}
                                        disabled={processing}
                                    />
                                </div>
                                <div className="message-content">
                                    <div className="message-header">
                                        <div className="sender-info">
                                            <h3>{message.name}</h3>
                                            <span className="sender-email">{message.email}</span>
                                        </div>
                                        <div className="message-meta">
                                            <span className="message-date">{formatDate(message.created_at)}</span>
                                            <div className="message-actions">
                                                <button
                                                    className="reply-btn"
                                                    onClick={() => handleReply(message)}
                                                    title="Reply"
                                                    disabled={processing}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => deleteMessage(message.id)}
                                                    title="Delete"
                                                    disabled={processing}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="message-subject">
                                        <strong>Subject:</strong> {message.subject}
                                    </div>
                                    <div className="message-body">
                                        {message.message}
                                    </div>

                                    {/* Show reply if exists */}
                                    {message.admin_reply && (
                                        <div className="original-message" style={{ marginTop: '16px', background: '#F0FDF4', borderLeft: '4px solid #10B981' }}>
                                            <p><strong>Admin Reply:</strong> <small>({formatDate(message.replied_at)})</small></p>
                                            <p>{message.admin_reply}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {paginationLinks && (
                    <div className="pagination">
                        {paginationLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={link.active ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (link.url && !processing) {
                                        router.get(link.url);
                                    }
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Reply Modal */}
                {replying && selectedMessage && (
                    <div className="modal-overlay" onClick={() => setReplying(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Reply to {selectedMessage.name}</h2>
                                <button className="close-btn" onClick={() => setReplying(false)}>×</button>
                            </div>
                            <div className="modal-body">
                                <div className="original-message">
                                    <p><strong>Original Message:</strong></p>
                                    <p>{selectedMessage.message}</p>
                                </div>

                                {selectedMessage.admin_reply && (
                                    <div className="original-message previous-reply">
                                        <p><strong>Your Previous Reply:</strong></p>
                                        <p>{selectedMessage.admin_reply}</p>
                                        <small>Sent on {formatDate(selectedMessage.replied_at)}</small>
                                    </div>
                                )}

                                <div className="reply-form">
                                    <label>Your Reply:</label>
                                    <textarea
                                        rows="6"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder={selectedMessage.admin_reply ? "Send another reply..." : "Type your reply here..."}
                                        disabled={processing}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="cancel-btn" onClick={() => setReplying(false)} disabled={processing}>Cancel</button>
                                <button className="send-btn" onClick={sendReply} disabled={processing}>
                                    {processing ? 'Sending...' : 'Send Reply'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}