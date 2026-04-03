import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import '/resources/css/admin-settings.css';

export default function Settings({ auth }) {
    const { flash } = usePage().props;
    
    const [profileForm, setProfileForm] = useState({
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
        bio: auth?.user?.profile?.bio || '',
        phone: auth?.user?.profile?.phone || '',
        location: auth?.user?.profile?.location || '',
    });

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