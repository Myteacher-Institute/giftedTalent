// resources/js/Components/MessageModal.jsx
import React from 'react';

export default function MessageModal({ isOpen, onClose, messages, loading, onMarkAsRead }) {
    if (!isOpen) return null;

    return (
        <div className="message-modal-overlay" onClick={onClose}>
            <div className="message-modal" onClick={(e) => e.stopPropagation()}>
                <div className="message-modal-header">
                    <h3>Messages</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="message-modal-body">
                    {loading ? (
                        <div className="loading-messages">
                            <i className="fas fa-spinner fa-spin"></i>
                            <span>Loading messages...</span>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="no-messages">
                            <i className="fas fa-envelope-open-text"></i>
                            <p>No messages yet</p>
                        </div>
                    ) : (
                        <div className="messages-list">
                            {messages.map((message) => (
                                <div 
                                    key={message.id} 
                                    className={`message-item ${!message.is_read ? 'unread' : ''}`}
                                    onClick={() => onMarkAsRead && onMarkAsRead(message.id)}
                                >
                                    <div className="message-icon">
                                        <i className={`fas ${message.type === 'notification' ? 'fa-bell' : 'fa-envelope'}`}></i>
                                    </div>
                                    <div className="message-content">
                                        <div className="message-title">{message.title || 'Notification'}</div>
                                        <div className="message-text">{message.content}</div>
                                        <div className="message-time">
                                            {new Date(message.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    {!message.is_read && <div className="unread-dot"></div>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}