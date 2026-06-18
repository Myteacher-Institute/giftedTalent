import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AppNavbar from '../../Components/AppNavbar';
import { getAvatarUrl } from '@/Utils/avatar';
import '../../../css/messageindex.css';

export default function MessagesIndex({ auth, conversations }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(false);
    const [localConversations, setLocalConversations] = useState(conversations || []);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showBlockConfirm, setShowBlockConfirm] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reporting, setReporting] = useState(false);
    const [blocking, setBlocking] = useState(false);
    
    const currentUser = auth?.user;

    const totalUnreadCount = localConversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser);
        }
    }, [selectedUser]);

    const fetchMessages = async (userId) => {
        setLoading(true);
        try {
            const response = await fetch(`/messages/user/${userId}`);
            const data = await response.json();
            if (data.success) {
                setMessages(data.data);
                setLocalConversations(prev => prev.map(conv => 
                    conv.user_id === userId ? { ...conv, unread_count: 0 } : conv
                ));
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedUser) return;
        
        setSending(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/messages/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    receiver_id: selectedUser,
                    message: newMessage
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setNewMessage('');
                fetchMessages(selectedUser);
                updateConversationAfterMessage(selectedUser, newMessage);
                if (window.alertify) {
                    alertify.success('Message sent!');
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const updateConversationAfterMessage = (userId, message) => {
        setLocalConversations(prev => {
            const updated = prev.map(conv => {
                if (conv.user_id === userId) {
                    return { ...conv, last_message: message };
                }
                return conv;
            });
            const conversation = updated.find(c => c.user_id === userId);
            const others = updated.filter(c => c.user_id !== userId);
            return conversation ? [conversation, ...others] : updated;
        });
    };

    const deleteMessage = async (messageId) => {
        if (!confirm('Delete this message?')) return;
        
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(`/messages/${messageId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });
            
            if (response.ok) {
                fetchMessages(selectedUser);
                if (window.alertify) {
                    alertify.success('Message deleted');
                }
            }
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const deleteAllMessages = async () => {
        if (!confirm('Delete ALL messages in this conversation? This cannot be undone.')) return;
        
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(`/messages/conversation/${selectedUser}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });
            
            if (response.ok) {
                setMessages([]);
                if (window.alertify) {
                    alertify.success('All messages deleted');
                }
            }
        } catch (error) {
            console.error('Error deleting all messages:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(`/messages/mark-all-read/${selectedUser}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });
            
            if (response.ok) {
                setMessages(prev => prev.map(msg => ({ ...msg, is_read: 1 })));
                setLocalConversations(prev => prev.map(conv => 
                    conv.user_id === selectedUser ? { ...conv, unread_count: 0 } : conv
                ));
                if (window.alertify) {
                    alertify.success('All messages marked as read');
                }
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteConversation = async () => {
        if (!confirm('Delete this entire conversation? This cannot be undone.')) return;
        
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(`/messages/conversation/${selectedUser}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });
            
            if (response.ok) {
                setLocalConversations(prev => prev.filter(conv => conv.user_id !== selectedUser));
                setSelectedUser(null);
                setMessages([]);
                if (window.alertify) {
                    alertify.success('Conversation deleted');
                }
            }
        } catch (error) {
            console.error('Error deleting conversation:', error);
        }
    };

    const reportUser = async () => {
        if (!reportReason.trim()) {
            alertify.error('Please provide a reason for reporting');
            return;
        }
        
        setReporting(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/messages/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    reported_user_id: selectedUser,
                    reason: reportReason
                })
            });
            
            if (response.ok) {
                alertify.success('User reported successfully. Our team will review.');
                setShowReportModal(false);
                setReportReason('');
            } else {
                alertify.error('Failed to report user');
            }
        } catch (error) {
            console.error('Error reporting user:', error);
        } finally {
            setReporting(false);
        }
    };

    const blockUser = async () => {
        setBlocking(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/messages/block', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    blocked_user_id: selectedUser
                })
            });
            
            if (response.ok) {
                alertify.success('User blocked. They can no longer message you.');
                setShowBlockConfirm(false);
                setLocalConversations(prev => prev.filter(conv => conv.user_id !== selectedUser));
                setSelectedUser(null);
            } else {
                alertify.error('Failed to block user');
            }
        } catch (error) {
            console.error('Error blocking user:', error);
        } finally {
            setBlocking(false);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    const getInitials = (name) => {
        return name?.charAt(0)?.toUpperCase() || 'U';
    };

    const selectedUserData = localConversations.find(c => c.user_id === selectedUser);

    return (
        <>
            <Head title="Messages - GiftedTalent" />
            
            <AppNavbar 
                user={currentUser} 
                onMenuToggle={toggleSidebar}
                isMenuOpen={sidebarOpen}
            />

            {sidebarOpen && <div className="mobile-overlay" onClick={closeSidebar}></div>}

            <div className="messenger-container">
                {/* Conversations Sidebar */}
                <div className={`conversations-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
                    <div className="conversations-header">
                        <h3>
                            <i className="fa-regular fa-comments"></i> Chats
                            {totalUnreadCount > 0 && (
                                <span className="total-unread-badge">{totalUnreadCount}</span>
                            )}
                        </h3>
                    </div>
                    <div className="conversations-list">
                        {localConversations.length === 0 ? (
                            <div className="no-conversations">
                                <i className="fa-regular fa-envelope-open"></i>
                                <p>No messages yet</p>
                                <Link href="/hire" className="browse-link">Browse Talent</Link>
                            </div>
                        ) : (
                            localConversations.map(conv => {
                                const url = getAvatarUrl({ profile: { profile_image_base64: conv.profile_image_base64, avatar_url: conv.avatar_url, avatar: conv.avatar }, fallbackName: conv.name, fallbackColor: '4F46E5' });
                                return (
                                    <div 
                                        key={conv.user_id} 
                                        className={`conversation-item ${selectedUser === conv.user_id ? 'active' : ''}`}
                                        onClick={() => setSelectedUser(conv.user_id)}
                                    >
                                        <div className="conv-avatar">
                                            {url ? (
                                                <img src={url} alt={conv.name} />
                                            ) : (
                                                <div className="avatar-placeholder">{getInitials(conv.name)}</div>
                                            )}
                                        </div>
                                        <div className="conv-info">
                                            <div className="conv-name">{conv.name}</div>
                                            <div className="conv-last-message">{conv.last_message || 'Start chatting'}</div>
                                        </div>
                                        {conv.unread_count > 0 && (
                                            <div className="conv-unread">{conv.unread_count}</div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="chat-area">
                    {!selectedUser ? (
                        <div className="no-chat-selected">
                            <i className="fa-regular fa-comment-dots"></i>
                            <h3>Select a conversation</h3>
                            <p>Choose a chat from the left to start messaging</p>
                        </div>
                    ) : (
                        <>
                            <div className="chat-header">
                                <button className="mobile-back-btn" onClick={() => setSidebarOpen(false)}>
                                    <i className="fa-solid fa-arrow-left"></i>
                                </button>
                                <div className="chat-user">
                                    <div className="chat-avatar">
                                        {(() => {
                                            const url = getAvatarUrl({ profile: { profile_image_base64: selectedUserData?.profile_image_base64, avatar_url: selectedUserData?.avatar_url, avatar: selectedUserData?.avatar }, fallbackName: selectedUserData?.name, fallbackColor: '4F46E5' });
                                            return url ? (
                                                <img src={url} alt={selectedUserData.name} />
                                            ) : (
                                                <div className="avatar-placeholder-small">{getInitials(selectedUserData?.name)}</div>
                                            );
                                        })()}
                                    </div>
                                    <h3>{selectedUserData?.name}</h3>
                                </div>
                                <div className="chat-actions">
                                    <button className="action-btn" onClick={markAllAsRead} title="Mark all as read">
                                        <i className="fa-regular fa-envelope-open"></i>
                                    </button>
                                    <button className="action-btn" onClick={deleteAllMessages} title="Delete all messages">
                                        <i className="fa-regular fa-trash-can"></i>
                                    </button>
                                    <button className="action-btn" onClick={deleteConversation} title="Delete conversation">
                                        <i className="fa-regular fa-folder-open"></i>
                                    </button>
                                    <button className="action-btn" onClick={() => setShowReportModal(true)} title="Report user">
                                        <i className="fa-regular fa-flag"></i>
                                    </button>
                                    <button className="action-btn block-btn" onClick={() => setShowBlockConfirm(true)} title="Block user">
                                        <i className="fa-solid fa-ban"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="chat-messages">
                                {loading ? (
                                    <div className="loading-messages">
                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                        <p>Loading messages...</p>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="no-messages">
                                        <i className="fa-regular fa-envelope"></i>
                                        <p>No messages yet. Start the conversation!</p>
                                    </div>
                                ) : (
                                    messages.map(msg => (
                                        <div key={msg.id} className={`message-row ${msg.sender_id === currentUser?.id ? 'sent' : 'received'}`}>
                                            <div className="message-bubble">
                                                <p>{msg.message}</p>
                                                <span className="message-time">
                                                    {new Date(msg.created_at).toLocaleString()}
                                                </span>
                                                {msg.sender_id === currentUser?.id && (
                                                    <button 
                                                        className="delete-message-btn"
                                                        onClick={() => deleteMessage(msg.id)}
                                                        title="Delete message"
                                                    >
                                                        <i className="fa-regular fa-trash-can"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="chat-input-area">
                                <textarea
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                />
                                <button onClick={sendMessage} disabled={sending || !newMessage.trim()}>
                                    {sending ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-regular fa-paper-plane"></i>}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
                    <div className="report-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Report User</h3>
                            <button className="modal-close" onClick={() => setShowReportModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>Please tell us why you are reporting {selectedUserData?.name}:</p>
                            <textarea
                                placeholder="Enter reason for reporting..."
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                                rows="4"
                            />
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setShowReportModal(false)}>Cancel</button>
                            <button className="submit-btn" onClick={reportUser} disabled={reporting}>
                                {reporting ? 'Submitting...' : 'Submit Report'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Block Confirmation Modal */}
            {showBlockConfirm && (
                <div className="modal-overlay" onClick={() => setShowBlockConfirm(false)}>
                    <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Block User</h3>
                            <button className="modal-close" onClick={() => setShowBlockConfirm(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <i className="fa-solid fa-ban warning-icon"></i>
                            <p>Are you sure you want to block <strong>{selectedUserData?.name}</strong>?</p>
                            <p className="warning-text">Blocked users cannot message you or see your profile.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setShowBlockConfirm(false)}>Cancel</button>
                            <button className="block-confirm-btn" onClick={blockUser} disabled={blocking}>
                                {blocking ? 'Blocking...' : 'Yes, Block User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}