import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppNavbar from '../../Components/AppNavbar';
import '../../../css/messageindex.css';

export default function MessagesShow({ auth, messages, otherUser }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [messageList, setMessageList] = useState(messages || []);
    const currentUser = auth?.user;

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        
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
                    receiver_id: otherUser?.id,
                    message: newMessage
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setNewMessage('');
                setMessageList([...messageList, {
                    id: data.data.id,
                    sender_id: currentUser?.id,
                    message: newMessage,
                    created_at: new Date().toISOString(),
                    is_read: 0
                }]);
                if (window.alertify) {
                    alertify.success('Message sent!');
                }
            } else {
                if (window.alertify) {
                    alertify.error(data.message || 'Failed to send');
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const getInitials = (name) => {
        return name?.charAt(0)?.toUpperCase() || 'U';
    };

    return (
        <>
            <Head title={`Chat with ${otherUser?.name} - GiftedTalent`} />
            
            <AppNavbar 
                user={currentUser} 
                onMenuToggle={toggleSidebar}
                isMenuOpen={sidebarOpen}
            />

            {sidebarOpen && <div className="mobile-overlay" onClick={closeSidebar}></div>}

            <div className="chat-container">
                <div className="chat-header">
                    <Link href="/messages" className="back-btn">
                        <i className="fa-solid fa-arrow-left"></i> Back
                    </Link>
                    <div className="chat-user">
                        <div className="chat-avatar">
                            <div className="avatar-placeholder">
                                {getInitials(otherUser?.name)}
                            </div>
                        </div>
                        <h3>{otherUser?.name}</h3>
                    </div>
                </div>
                
                <div className="chat-messages">
                    {messageList.length === 0 ? (
                        <div className="no-messages">
                            <i className="fa-regular fa-envelope"></i>
                            <p>No messages yet. Start a conversation!</p>
                        </div>
                    ) : (
                        messageList.map((msg) => (
                            <div key={msg.id} className={`message-bubble ${msg.sender_id === currentUser?.id ? 'sent' : 'received'}`}>
                                <div className="message-content">
                                    <p>{msg.message}</p>
                                    <small>{new Date(msg.created_at).toLocaleString()}</small>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                
                <div className="chat-input">
                    <textarea
                        placeholder="Type your message..."
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
            </div>

            <style>{`
                .chat-container {
                    display: flex;
                    flex-direction: column;
                    height: calc(100vh - 60px);
                    max-width: 800px;
                    margin: 0 auto;
                    background: #f8fafc;
                }
                .chat-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    padding: 16px 20px;
                    background: white;
                    border-bottom: 1px solid #e5e7eb;
                }
                .back-btn {
                    color: #0A2463;
                    text-decoration: none;
                    font-size: 16px;
                }
                .chat-user {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .chat-avatar {
                    width: 40px;
                    height: 40px;
                }
                .avatar-placeholder {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #0A2463, #1e3a5f);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 16px;
                    font-weight: bold;
                }
                .chat-user h3 {
                    font-size: 18px;
                    margin: 0;
                }
                .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .message-bubble {
                    display: flex;
                }
                .message-bubble.sent {
                    justify-content: flex-end;
                }
                .message-bubble.received {
                    justify-content: flex-start;
                }
                .message-content {
                    max-width: 70%;
                    padding: 10px 16px;
                    border-radius: 18px;
                }
                .message-bubble.sent .message-content {
                    background: #0A2463;
                    color: white;
                }
                .message-bubble.received .message-content {
                    background: white;
                    color: #1f2937;
                    border: 1px solid #e5e7eb;
                }
                .message-content small {
                    font-size: 10px;
                    opacity: 0.7;
                    display: block;
                    margin-top: 5px;
                }
                .chat-input {
                    padding: 16px;
                    background: white;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    gap: 10px;
                }
                .chat-input textarea {
                    flex: 1;
                    padding: 12px;
                    border: 1px solid #e5e7eb;
                    border-radius: 24px;
                    resize: none;
                    font-family: inherit;
                    font-size: 14px;
                }
                .chat-input button {
                    width: 48px;
                    height: 48px;
                    background: #0A2463;
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                }
                .chat-input button:disabled {
                    opacity: 0.5;
                }
                .no-messages {
                    text-align: center;
                    padding: 60px;
                    color: #6b7280;
                }
                .no-messages i {
                    font-size: 48px;
                    margin-bottom: 16px;
                }
                .mobile-overlay {
                    position: fixed;
                    top: 60px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 1001;
                }
            `}</style>
        </>
    );
}