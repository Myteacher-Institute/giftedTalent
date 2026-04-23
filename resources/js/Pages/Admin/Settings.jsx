import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import '/resources/css/admin-settings.css';

export default function Settings({ auth }) {
    const { flash } = usePage().props;
    const fileInputRef = useRef(null);

    const [profileForm, setProfileForm] = useState({
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
        bio: auth?.user?.profile?.bio || '',
        phone: auth?.user?.profile?.phone || '',
        location: auth?.user?.profile?.location || '',
    });

    const [avatar, setAvatar] = useState(auth?.user?.profile?.avatar || null);
    const [uploading, setUploading] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const [processing, setProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            setTimeout(() => setMessage(null), 5000);
        }
        if (flash?.error) {
            setMessage(flash.error);
            setTimeout(() => setMessage(null), 5000);
        }
    }, [flash]);

    // Handle avatar upload with base64
    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('Image size should be less than 2MB');
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        setUploading(true);

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setAvatar(base64String);

            router.post('/Admin/profile/avatar', { avatar: base64String }, {
                onSuccess: () => {
                    setUploading(false);
                    setMessage('Avatar updated successfully!');
                    setTimeout(() => setMessage(null), 3000);
                    // Use Inertia reload instead of full page reload
                    router.reload({ only: ['auth'] });
                },
                onError: () => {
                    setUploading(false);
                    alert('Failed to upload avatar');
                }
            });
        };
        reader.readAsDataURL(file);
    };

    const removeAvatar = () => {
        if (confirm('Remove your profile picture?')) {
            router.delete('/Admin/profile/avatar', {
                onSuccess: () => {
                    setAvatar(null);
                    setMessage('Avatar removed successfully!');
                    setTimeout(() => setMessage(null), 3000);
                    window.location.reload();
                }
            });
        }
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.patch('/Admin/profile', profileForm, {
            onSuccess: () => {
                setProcessing(false);
            },
            onError: (errors) => {
                console.error(errors);
                setProcessing(false);
            }
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();

        if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
            alert('New passwords do not match');
            return;
        }

        setProcessing(true);

        router.put('/Admin/password', passwordForm, {
            onSuccess: () => {
                setProcessing(false);
                setPasswordForm({
                    current_password: '',
                    new_password: '',
                    new_password_confirmation: '',
                });
            },
            onError: (errors) => {
                console.error(errors);
                setProcessing(false);
            }
        });
    };

    return (
        <>
            <Head title="Settings - Admin" />

            <div className="admin-settings-container">
                <button
                    className="back-btn"
                    onClick={() => router.get('/Admin/dashboard')}
                    title="Back to Dashboard"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </button>
                <div className="settings-header">
                    <h1>Settings</h1>
                    <p>Manage your account settings and preferences</p>
                </div>

                {message && (
                    <div className="alert alert-success">
                        {message}
                    </div>
                )}

                <div className="settings-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile Settings
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
                        onClick={() => setActiveTab('password')}
                    >
                        Change Password
                    </button>
                </div>

                <div className="settings-content">
                    {activeTab === 'profile' && (
                        <form onSubmit={handleProfileSubmit} className="settings-form">
                            <div className="avatar-section">
                                <div className="avatar-preview">
                                    {avatar ? (
                                        <img src={avatar} alt="Profile" className="avatar-large" />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {auth?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        className="avatar-upload-btn"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        title="Upload Photo"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="12" y1="5" x2="12" y2="19" />
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="avatar-actions">
                                    {avatar && (
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={removeAvatar}
                                        >
                                            Remove
                                        </button>
                                    )}
                                    <p className="avatar-hint">Click + to upload photo (Max 2MB)</p>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarUpload}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                            </div>

                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                    required
                                    disabled={processing}
                                />
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={profileForm.email}
                                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                    required
                                    disabled={processing}
                                />
                            </div>

                            <div className="form-group">
                                <label>Bio</label>
                                <textarea
                                    rows="3"
                                    value={profileForm.bio}
                                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                    placeholder="Tell us a little about yourself..."
                                    disabled={processing}
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    value={profileForm.phone}
                                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                    placeholder="+234 801 234 5678"
                                    disabled={processing}
                                />
                            </div>

                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    value={profileForm.location}
                                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                                    placeholder="Port Harcourt, Nigeria"
                                    disabled={processing}
                                />
                            </div>

                            <button type="submit" className="save-btn" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    )}

                    {activeTab === 'password' && (
                        <form onSubmit={handlePasswordSubmit} className="settings-form">
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.current_password}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                                    required
                                    disabled={processing}
                                />
                            </div>

                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.new_password}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                                    required
                                    disabled={processing}
                                />
                            </div>

                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.new_password_confirmation}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
                                    required
                                    disabled={processing}
                                />
                            </div>

                            <button type="submit" className="save-btn" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}