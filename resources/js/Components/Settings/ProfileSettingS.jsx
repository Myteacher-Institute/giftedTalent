import React, { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function ProfileSettings({ user, profile, onUpdate }) {
    const [formData, setFormData] = useState({
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
    
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [newSkillProficiency, setNewSkillProficiency] = useState('intermediate');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [errors, setErrors] = useState({});
    const [profileImagePreview, setProfileImagePreview] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef(null);
    
    const proficiencyLevels = [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
        { value: 'expert', label: 'Expert' }
    ];
    
    const getProfileImageUrl = () => {
        if (profileImagePreview) return profileImagePreview;
        if (profile?.avatar_url) return profile.avatar_url;
        if (profile?.avatar) {
            const avatarPath = profile.avatar;
            if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
                return avatarPath;
            }
            return `/storage/${avatarPath.replace(/^\/+/, '')}`;
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4F46E5&color=fff&size=150&bold=true`;
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setSaveStatus(null);
    };
    
    const handleProfileImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setErrors({ profile_image: 'Please upload a valid image (JPEG, PNG, or WebP)' });
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            setErrors({ profile_image: 'Image size should be less than 5MB' });
            return;
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        
        setUploadingImage(true);
        const uploadFormData = new FormData();
        uploadFormData.append('avatar', file);
        
        try {
            const response = await axios.post('/user/upload-avatar', uploadFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.data.success) {
                setSaveStatus({ type: 'success', message: 'Profile picture updated!' });
                setTimeout(() => setSaveStatus(null), 3000);
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            setErrors({ profile_image: 'Failed to upload image' });
        } finally {
            setUploadingImage(false);
        }
    };
    
    const handleRemoveProfileImage = async () => {
        if (!confirm('Remove profile picture?')) return;
        
        setUploadingImage(true);
        try {
            const response = await axios.delete('/user/remove-avatar');
            if (response.data.success) {
                setProfileImagePreview('');
                setSaveStatus({ type: 'success', message: 'Profile picture removed!' });
                setTimeout(() => setSaveStatus(null), 3000);
            }
        } catch (error) {
            console.error('Error removing profile picture:', error);
        } finally {
            setUploadingImage(false);
        }
    };
    
    const handleAddSkill = () => {
        if (!newSkill.trim()) {
            setErrors({ skill: 'Enter a skill name' });
            return;
        }
        
        if (skills.some(skill => skill.name?.toLowerCase() === newSkill.toLowerCase())) {
            setErrors({ skill: 'Skill already exists' });
            return;
        }
        
        setSkills([...skills, { id: Date.now(), name: newSkill.trim(), proficiency: newSkillProficiency }]);
        setNewSkill('');
        setErrors({});
    };
    
    const handleRemoveSkill = (skillId) => {
        setSkills(skills.filter(skill => skill.id !== skillId));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            const response = await axios.put('/user/profile', { ...formData, skills });
            if (response.data.success) {
                setSaveStatus({ type: 'success', message: 'Profile updated successfully!' });
                if (onUpdate) onUpdate(response.data.profile);
                setTimeout(() => setSaveStatus(null), 3000);
            }
        } catch (error) {
            setSaveStatus({ type: 'error', message: 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };
    
    // Styles
    const styles = {
        container: { maxWidth: '800px' },
        section: { background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #e5e7eb' },
        title: { fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' },
        formGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' },
        formGroup: { display: 'flex', flexDirection: 'column', marginBottom: '16px' },
        label: { fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' },
        input: { padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' },
        textarea: { padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', resize: 'vertical', minHeight: '100px' },
        hint: { fontSize: '12px', color: '#6b7280', marginTop: '4px' },
        profileImageContainer: { textAlign: 'center', position: 'relative', display: 'inline-block' },
        profileImage: { width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #4F46E5' },
        imageActions: { position: 'absolute', bottom: '0', right: '0', display: 'flex', gap: '8px' },
        imageBtn: { width: '36px', height: '36px', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        uploadBtn: { background: '#4F46E5', color: 'white' },
        removeBtn: { background: '#ef4444', color: 'white' },
        skillsList: { display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' },
        skillItem: { display: 'flex', alignItems: 'center', gap: '8px', background: '#f9fafb', padding: '8px 12px', borderRadius: '8px' },
        addSkill: { display: 'flex', gap: '12px', marginTop: '16px' },
        addSkillInput: { flex: 1, padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px' },
        addSkillSelect: { padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px' },
        addSkillBtn: { padding: '10px 20px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
        formActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' },
        saveBtn: { padding: '12px 24px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
        cancelBtn: { padding: '12px 24px', background: 'white', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' },
        saveStatus: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px' },
        success: { background: '#f0fdf4', border: '1px solid #86efac', color: '#166534' },
        error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b' }
    };
    
    return (
        <div style={styles.container}>
            {saveStatus && (
                <div style={{ ...styles.saveStatus, ...(saveStatus.type === 'success' ? styles.success : styles.error) }}>
                    <i className={`fas fa-${saveStatus.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
                    <span>{saveStatus.message}</span>
                    <button onClick={() => setSaveStatus(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                {/* Profile Picture */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-camera"></i> Profile Picture</h3>
                    <div style={{ textAlign: 'center' }}>
                        <div style={styles.profileImageContainer}>
                            <img src={getProfileImageUrl()} alt="Profile" style={styles.profileImage} />
                            <div style={styles.imageActions}>
                                <button type="button" onClick={() => fileInputRef.current?.click()} style={{ ...styles.imageBtn, ...styles.uploadBtn }}>
                                    <i className="fas fa-upload"></i>
                                </button>
                                <button type="button" onClick={handleRemoveProfileImage} style={{ ...styles.imageBtn, ...styles.removeBtn }}>
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleProfileImageChange} style={{ display: 'none' }} />
                        </div>
                        <p style={styles.hint}>Square image, 300x300px, max 5MB</p>
                    </div>
                </div>
                
                {/* Basic Info */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-user"></i> Basic Information</h3>
                    <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Full Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Email Address *</label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Professional Title</label>
                            <input type="text" name="position" value={formData.position} onChange={handleInputChange} style={styles.input} placeholder="Senior Software Engineer" />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Phone Number</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleInputChange} style={styles.input} />
                        </div>
                    </div>
                </div>
                
                {/* Bio */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-align-left"></i> Bio / About</h3>
                    <textarea name="bio" rows="4" value={formData.bio} onChange={handleInputChange} style={styles.textarea} placeholder="Tell employers about yourself..."></textarea>
                    <p style={styles.hint}>{formData.bio.length}/500 characters</p>
                </div>
                
                {/* Skills */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-code"></i> Skills & Expertise</h3>
                    <div style={styles.skillsList}>
                        {skills.map(skill => (
                            <div key={skill.id} style={styles.skillItem}>
                                <span>{skill.name}</span>
                                <select value={skill.proficiency} onChange={(e) => handleUpdateSkillProficiency?.(skill.id, e.target.value)} style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>
                                    {proficiencyLevels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                                </select>
                                <button type="button" onClick={() => handleRemoveSkill(skill.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>×</button>
                            </div>
                        ))}
                    </div>
                    <div style={styles.addSkill}>
                        <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a skill..." style={styles.addSkillInput} />
                        <select value={newSkillProficiency} onChange={(e) => setNewSkillProficiency(e.target.value)} style={styles.addSkillSelect}>
                            {proficiencyLevels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                        </select>
                        <button type="button" onClick={handleAddSkill} style={styles.addSkillBtn}>Add</button>
                    </div>
                </div>
                
                {/* Professional Links */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-link"></i> Professional Links</h3>
                    <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Portfolio Website</label>
                            <input type="url" name="portfolio_url" value={formData.portfolio_url} onChange={handleInputChange} style={styles.input} placeholder="https://yourportfolio.com" />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>GitHub</label>
                            <input type="url" name="github_url" value={formData.github_url} onChange={handleInputChange} style={styles.input} placeholder="https://github.com/username" />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>LinkedIn</label>
                            <input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleInputChange} style={styles.input} placeholder="https://linkedin.com/in/username" />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Twitter/X</label>
                            <input type="url" name="twitter_url" value={formData.twitter_url} onChange={handleInputChange} style={styles.input} placeholder="https://twitter.com/username" />
                        </div>
                    </div>
                </div>
                
                {/* Actions */}
                <div style={styles.formActions}>
                    <button type="submit" disabled={saving} style={styles.saveBtn}>
                        {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} Save Changes
                    </button>
                    <button type="button" onClick={() => window.location.reload()} style={styles.cancelBtn}>Cancel</button>
                </div>
            </form>
        </div>
    );
}