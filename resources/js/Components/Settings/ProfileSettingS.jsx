import React, { useState, useEffect, useRef } from 'react';
import { useForm, router } from '@inertiajs/react';
import axios from 'axios';

export default function ProfileSettings({ user, profile, onUpdate }) {
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [newSkillProficiency, setNewSkillProficiency] = useState('intermediate');
    const [profileImagePreview, setProfileImagePreview] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const fileInputRef = useRef(null);
    
    // Use Inertia form
    const { data, setData, put, processing, errors, reset } = useForm({
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
        skills: [],
    });
    
    const proficiencyLevels = [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
        { value: 'expert', label: 'Expert' }
    ];
    
    // Load skills from profile
    useEffect(() => {
        const userSkills = profile?.skills || user?.profile?.skills || [];
        if (userSkills.length > 0) {
            setSkills(userSkills);
        }
    }, []);
    
    // Updated getProfileImageUrl to check for base64 first
    const getProfileImageUrl = () => {
        // Priority 1: Preview image (new upload not yet saved)
        if (profileImagePreview) return profileImagePreview;
        
        // Priority 2: Base64 image from database
        if (profile?.profile_image_base64) {
            return profile.profile_image_base64;
        }
        
        // Priority 3: Avatar from storage (for backward compatibility)
        if (profile?.avatar_url) return profile.avatar_url;
        if (profile?.avatar) {
            const avatarPath = profile.avatar;
            if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
                return avatarPath;
            }
            return `/storage/${avatarPath.replace(/^\/+/, '')}`;
        }
        
        // Fallback: Avatar from name
        const userName = user?.name || 'User';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=150&bold=true`;
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
        setSaveStatus(null);
    };
    
    const handleProfileImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setSaveStatus({ type: 'error', message: 'Please upload a valid image (JPEG, PNG, or WebP)' });
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            setSaveStatus({ type: 'error', message: 'Image size should be less than 5MB' });
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
                // Update the profile data with new base64 image
                if (onUpdate && response.data.image) {
                    onUpdate({ ...profile, profile_image_base64: response.data.image });
                }
                setTimeout(() => setSaveStatus(null), 3000);
            }
        } catch (error) {
            setSaveStatus({ type: 'error', message: 'Failed to upload image' });
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
                // Update the profile to clear the base64 image
                if (onUpdate) {
                    onUpdate({ ...profile, profile_image_base64: null });
                }
                setTimeout(() => setSaveStatus(null), 3000);
            }
        } catch (error) {
            setSaveStatus({ type: 'error', message: 'Failed to remove image' });
        } finally {
            setUploadingImage(false);
        }
    };
    
    const handleAddSkill = () => {
        if (!newSkill.trim()) {
            setSaveStatus({ type: 'error', message: 'Enter a skill name' });
            return;
        }
        
        if (skills.some(skill => skill.name?.toLowerCase() === newSkill.toLowerCase())) {
            setSaveStatus({ type: 'error', message: 'Skill already exists' });
            return;
        }
        
        setSkills([...skills, { id: Date.now(), name: newSkill.trim(), proficiency: newSkillProficiency }]);
        setNewSkill('');
        setSaveStatus(null);
    };
    
    const handleRemoveSkill = (skillId) => {
        setSkills(skills.filter(skill => skill.id !== skillId));
    };
    
    const handleUpdateSkillProficiency = (skillId, proficiency) => {
        setSkills(skills.map(skill => 
            skill.id === skillId ? { ...skill, proficiency } : skill
        ));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Add skills to form data
        setData('skills', skills);
        
        // Submit using Inertia
        put('/user/profile', {
            preserveScroll: true,
            onSuccess: () => {
                setSaveStatus({ type: 'success', message: 'Profile updated successfully!' });
                if (onUpdate) onUpdate(data);
                setTimeout(() => setSaveStatus(null), 3000);
            },
            onError: (err) => {
                console.error('Profile update error:', err);
                const errorMessages = Object.values(err).flat().join(', ');
                setSaveStatus({ type: 'error', message: errorMessages || 'Failed to update profile' });
            }
        });
    };
    
    // Styles - Fixed duplicate key issue
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
        errorText: { fontSize: '12px', color: '#ef4444', marginTop: '4px' },
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
        errorStatus: { background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b' }
    };
    
    return (
        <div style={styles.container}>
            {saveStatus && (
                <div style={{ ...styles.saveStatus, ...(saveStatus.type === 'success' ? styles.success : styles.errorStatus) }}>
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
                            <input type="text" name="name" value={data.name} onChange={handleInputChange} style={styles.input} />
                            {errors.name && <span style={styles.errorText}>{errors.name}</span>}
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Email Address *</label>
                            <input type="email" name="email" value={data.email} onChange={handleInputChange} style={styles.input} />
                            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Professional Title</label>
                            <input type="text" name="position" value={data.position} onChange={handleInputChange} style={styles.input} placeholder="Senior Software Engineer" />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Phone Number</label>
                            <input type="tel" name="phone" value={data.phone} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Location</label>
                            <input type="text" name="location" value={data.location} onChange={handleInputChange} style={styles.input} />
                        </div>
                    </div>
                </div>
                
                {/* Bio */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-align-left"></i> Bio / About</h3>
                    <textarea name="bio" rows="4" value={data.bio} onChange={handleInputChange} style={styles.textarea} placeholder="Tell employers about yourself..."></textarea>
                    <p style={styles.hint}>{data.bio.length}/500 characters</p>
                </div>
                
                {/* Skills */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-code"></i> Skills & Expertise</h3>
                    <div style={styles.skillsList}>
                        {skills.map(skill => (
                            <div key={skill.id} style={styles.skillItem}>
                                <span>{skill.name}</span>
                                <select 
                                    value={skill.proficiency} 
                                    onChange={(e) => handleUpdateSkillProficiency(skill.id, e.target.value)} 
                                    style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}
                                >
                                    {proficiencyLevels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                                </select>
                                <button type="button" onClick={() => handleRemoveSkill(skill.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>×</button>
                            </div>
                        ))}
                    </div>
                    <div style={styles.addSkill}>
                        <input 
                            type="text" 
                            value={newSkill} 
                            onChange={(e) => setNewSkill(e.target.value)} 
                            placeholder="Add a skill..." 
                            style={styles.addSkillInput} 
                        />
                        <select 
                            value={newSkillProficiency} 
                            onChange={(e) => setNewSkillProficiency(e.target.value)} 
                            style={styles.addSkillSelect}
                        >
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
                            <input type="url" name="portfolio_url" value={data.portfolio_url} onChange={handleInputChange} style={styles.input} placeholder="https://yourportfolio.com" />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>GitHub</label>
                            <input type="url" name="github_url" value={data.github_url} onChange={handleInputChange} style={styles.input} placeholder="https://github.com/username" />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>LinkedIn</label>
                            <input type="url" name="linkedin_url" value={data.linkedin_url} onChange={handleInputChange} style={styles.input} placeholder="https://linkedin.com/in/username" />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Twitter/X</label>
                            <input type="url" name="twitter_url" value={data.twitter_url} onChange={handleInputChange} style={styles.input} placeholder="https://twitter.com/username" />
                        </div>
                    </div>
                </div>
                
                {/* Actions */}
                <div style={styles.formActions}>
                    <button type="submit" disabled={processing} style={styles.saveBtn}>
                        {processing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} Save Changes
                    </button>
                    <button type="button" onClick={() => reset()} style={styles.cancelBtn}>Cancel</button>
                </div>
            </form>
        </div>
    );
}