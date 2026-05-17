import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';

export default function ProfileSettings({ user, profile, onUpdate }) {
    const [statusMessage, setStatusMessage] = useState(null);

    const { data, setData, patch, processing, errors, reset } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        position: profile?.position || '',
        bio: profile?.bio || '',
        phone: profile?.phone || '',
        location: profile?.location || '',
        portfolio_url: profile?.portfolio_url || '',
        github_url: profile?.github_url || '',
        linkedin_url: profile?.linkedin_url || '',
        twitter_url: profile?.twitter_url || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
        setStatusMessage(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        patch('/profile', {
            preserveScroll: true,
            onSuccess: (page) => {
                setStatusMessage('Profile updated successfully.');
                if (onUpdate) {
                    onUpdate({ ...profile, ...data });
                }
                setTimeout(() => setStatusMessage(null), 3000);
            },
            onError: () => {
                setStatusMessage('Failed to update profile.');
            }
        });
    };

    const sectionStyle = {
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        border: '1px solid #e5e7eb'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 600,
        color: '#111827'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        marginBottom: '16px'
    };

    return (
        <div style={{ maxWidth: '820px', width: '100%' }}>
            {statusMessage && (
                <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '10px', background: '#ecfdf5', color: '#166534' }}>
                    {statusMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={sectionStyle}>
                    <h3 style={{ marginBottom: '16px', fontSize: '20px', color: '#111827' }}>Profile Settings</h3>

                    <label htmlFor="name" style={labelStyle}>Name</label>
                    <input id="name" name="name" type="text" value={data.name} onChange={handleChange} style={inputStyle} />
                    {errors.name && <div style={{ color: '#dc2626', marginBottom: '12px' }}>{errors.name}</div>}

                    <label htmlFor="email" style={labelStyle}>Email</label>
                    <input id="email" name="email" type="email" value={data.email} onChange={handleChange} style={inputStyle} />
                    {errors.email && <div style={{ color: '#dc2626', marginBottom: '12px' }}>{errors.email}</div>}

                    <label htmlFor="position" style={labelStyle}>Title</label>
                    <input id="position" name="position" type="text" value={data.position} onChange={handleChange} style={inputStyle} />

                    <label htmlFor="bio" style={labelStyle}>Bio</label>
                    <textarea id="bio" name="bio" value={data.bio} onChange={handleChange} style={{ ...inputStyle, minHeight: '120px' }} />

                    <label htmlFor="phone" style={labelStyle}>Phone</label>
                    <input id="phone" name="phone" type="text" value={data.phone} onChange={handleChange} style={inputStyle} />

                    <label htmlFor="location" style={labelStyle}>Location</label>
                    <input id="location" name="location" type="text" value={data.location} onChange={handleChange} style={inputStyle} />

                    <label htmlFor="portfolio_url" style={labelStyle}>Portfolio URL</label>
                    <input id="portfolio_url" name="portfolio_url" type="url" value={data.portfolio_url} onChange={handleChange} style={inputStyle} />

                    <label htmlFor="github_url" style={labelStyle}>GitHub URL</label>
                    <input id="github_url" name="github_url" type="url" value={data.github_url} onChange={handleChange} style={inputStyle} />

                    <label htmlFor="linkedin_url" style={labelStyle}>LinkedIn URL</label>
                    <input id="linkedin_url" name="linkedin_url" type="url" value={data.linkedin_url} onChange={handleChange} style={inputStyle} />

                    <label htmlFor="twitter_url" style={labelStyle}>Twitter URL</label>
                    <input id="twitter_url" name="twitter_url" type="url" value={data.twitter_url} onChange={handleChange} style={inputStyle} />

                    <button type="submit" disabled={processing} style={{ padding: '12px 24px', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                        {processing ? 'Saving...' : 'Save Profile'}
                    </button>
                    <button type="button" onClick={() => reset()} style={{ marginLeft: '12px', padding: '12px 24px', background: '#fff', color: '#111827', border: '1px solid #d1d5db', borderRadius: '10px', cursor: 'pointer' }}>
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}
