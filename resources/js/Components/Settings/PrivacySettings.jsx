import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PrivacySettings({ user }) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    
    const [privacySettings, setPrivacySettings] = useState({
        // Profile Visibility
        profile_visibility: 'public',
        
        // Contact Information
        show_email: true,
        show_phone: false,
        
        // Profile Information
        show_experience: true,
        show_education: true,
        show_skills: true,
        show_rating: true,
        
        // Search Visibility
        appear_in_search: true,
        appear_in_talent_listings: true,
        
        // Data & Privacy
        allow_download_resume: true,
        allow_contact_requests: true,
        
        // Additional Settings
        show_read_receipts: false,
        show_last_active: true,
        
        // Data Sharing
        share_analytics: true,
        share_for_recommendations: true,
    });
    
    const visibilityOptions = [
        { value: 'public', label: 'Public', description: 'Anyone can view your profile', icon: 'fa-globe' },
        { value: 'registered_only', label: 'Registered Users Only', description: 'Only logged-in users can view your profile', icon: 'fa-users' },
        { value: 'private', label: 'Private', description: 'Only you can view your profile', icon: 'fa-lock' }
    ];
    
    // Load saved privacy settings
    useEffect(() => {
        loadPrivacySettings();
    }, []);
    
    const loadPrivacySettings = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/user/privacy-settings');
            if (response.data && response.data.settings) {
                setPrivacySettings(response.data.settings);
            }
        } catch (error) {
            console.log('No saved privacy settings found, using defaults');
        } finally {
            setLoading(false);
        }
    };
    
    const handleToggle = (field) => {
        setPrivacySettings(prev => ({ ...prev, [field]: !prev[field] }));
        setSaveStatus(null);
    };
    
    const handleChange = (field, value) => {
        setPrivacySettings(prev => ({ ...prev, [field]: value }));
        setSaveStatus(null);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaveStatus(null);
        
        try {
            const response = await axios.put('/user/privacy-settings', privacySettings);
            if (response.data.success) {
                setSaveStatus({ type: 'success', message: 'Privacy settings saved successfully!' });
                setTimeout(() => setSaveStatus(null), 3000);
            } else {
                setSaveStatus({ type: 'error', message: response.data.message || 'Failed to save settings' });
            }
        } catch (error) {
            console.error('Error saving privacy settings:', error);
            setSaveStatus({ 
                type: 'error', 
                message: error.response?.data?.message || 'Network error. Please try again.' 
            });
        } finally {
            setSaving(false);
        }
    };
    
    // Styles
    const styles = {
        container: { maxWidth: '800px' },
        section: { background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #e5e7eb' },
        title: { fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' },
        description: { fontSize: '13px', color: '#6b7280', marginBottom: '20px' },
        formGroup: { marginBottom: '20px' },
        label: { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' },
        toggleSwitch: { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '12px', cursor: 'pointer' },
        toggleSlider: { position: 'relative', display: 'inline-block', width: '50px', height: '24px', backgroundColor: '#ccc', borderRadius: '24px', transition: '0.3s' },
        toggleSliderActive: { backgroundColor: '#4F46E5' },
        toggleSliderBefore: { position: 'absolute', content: '""', height: '18px', width: '18px', left: '3px', bottom: '3px', backgroundColor: 'white', borderRadius: '50%', transition: '0.3s' },
        visibilityOptions: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' },
        visibilityCard: (isActive) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            border: isActive ? '2px solid #4F46E5' : '1px solid #e5e7eb',
            borderRadius: '12px',
            cursor: 'pointer',
            background: isActive ? '#EEF2FF' : 'white',
            transition: 'all 0.2s'
        }),
        visibilityIcon: { width: '40px', height: '40px', background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#4F46E5' },
        visibilityText: { flex: 1 },
        visibilityTitle: { fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' },
        visibilityDesc: { fontSize: '12px', color: '#6b7280' },
        formActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' },
        saveBtn: { 
            padding: '12px 24px', 
            background: '#4F46E5', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            opacity: saving ? 0.7 : 1,
            pointerEvents: saving ? 'none' : 'auto'
        },
        resetBtn: { padding: '12px 24px', background: 'white', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' },
        saveStatus: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px' },
        success: { background: '#f0fdf4', border: '1px solid #86efac', color: '#166534' },
        error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b' },
        loadingSpinner: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', color: '#6b7280' },
        divider: { height: '1px', background: '#e5e7eb', margin: '20px 0' }
    };
    
    if (loading) {
        return (
            <div style={styles.loadingSpinner}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', marginRight: '12px' }}></i>
                <span>Loading privacy settings...</span>
            </div>
        );
    }
    
    return (
        <div style={styles.container}>
            {saveStatus && (
                <div style={{ ...styles.saveStatus, ...(saveStatus.type === 'success' ? styles.success : styles.error) }}>
                    <i className={`fas fa-${saveStatus.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
                    <span>{saveStatus.message}</span>
                    <button 
                        onClick={() => setSaveStatus(null)} 
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                    >
                        ×
                    </button>
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                {/* Profile Visibility */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-eye"></i> Profile Visibility</h3>
                    <p style={styles.description}>Control who can see your profile information</p>
                    
                    <div style={styles.visibilityOptions}>
                        {visibilityOptions.map(option => (
                            <div 
                                key={option.value}
                                onClick={() => handleChange('profile_visibility', option.value)}
                                style={styles.visibilityCard(privacySettings.profile_visibility === option.value)}
                            >
                                <div style={styles.visibilityIcon}>
                                    <i className={`fas ${option.icon}`}></i>
                                </div>
                                <div style={styles.visibilityText}>
                                    <div style={styles.visibilityTitle}>{option.label}</div>
                                    <div style={styles.visibilityDesc}>{option.description}</div>
                                </div>
                                {privacySettings.profile_visibility === option.value && (
                                    <i className="fas fa-check-circle" style={{ color: '#4F46E5', fontSize: '20px' }}></i>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Contact Information Privacy */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-address-card"></i> Contact Information</h3>
                    <p style={styles.description}>Choose what contact details are visible to others</p>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.toggleSwitch}>
                            <input 
                                type="checkbox" 
                                checked={privacySettings.show_email} 
                                onChange={() => handleToggle('show_email')} 
                                style={{ opacity: 0, width: 0, height: 0 }} 
                            />
                            <span style={{ ...styles.toggleSlider, ...(privacySettings.show_email ? styles.toggleSliderActive : {}) }}>
                                <span style={styles.toggleSliderBefore}></span>
                            </span>
                            <span>Show email address on profile</span>
                        </label>
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.toggleSwitch}>
                            <input 
                                type="checkbox" 
                                checked={privacySettings.show_phone} 
                                onChange={() => handleToggle('show_phone')} 
                                style={{ opacity: 0, width: 0, height: 0 }} 
                            />
                            <span style={{ ...styles.toggleSlider, ...(privacySettings.show_phone ? styles.toggleSliderActive : {}) }}>
                                <span style={styles.toggleSliderBefore}></span>
                            </span>
                            <span>Show phone number on profile</span>
                        </label>
                    </div>
                </div>
                
                {/* Profile Information Privacy */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-user-circle"></i> Profile Information</h3>
                    <p style={styles.description}>Control what profile sections are visible</p>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.toggleSwitch}>
                            <input type="checkbox" checked={privacySettings.show_experience} onChange={() => handleToggle('show_experience')} style={{ opacity: 0, width: 0, height: 0 }} />
                            <span style={{ ...styles.toggleSlider, ...(privacySettings.show_experience ? styles.toggleSliderActive : {}) }}>
                                <span style={styles.toggleSliderBefore}></span>
                            </span>
                            <span>Show work experience</span>
                        </label>
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.toggleSwitch}>
                            <input type="checkbox" checked={privacySettings.show_education} onChange={() => handleToggle('show_education')} style={{ opacity: 0, width: 0, height: 0 }} />
                            <span style={{ ...styles.toggleSlider, ...(privacySettings.show_education ? styles.toggleSliderActive : {}) }}>
                                <span style={styles.toggleSliderBefore}></span>
                            </span>
                            <span>Show education history</span>
                        </label>
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.toggleSwitch}>
                            <input type="checkbox" checked={privacySettings.show_skills} onChange={() => handleToggle('show_skills')} style={{ opacity: 0, width: 0, height: 0 }} />
                            <span style={{ ...styles.toggleSlider, ...(privacySettings.show_skills ? styles.toggleSliderActive : {}) }}>
                                <span style={styles.toggleSliderBefore}></span>
                            </span>
                            <span>Show skills</span>
                        </label>
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.toggleSwitch}>
                            <input type="checkbox" checked={privacySettings.show_rating} onChange={() => handleToggle('show_rating')} style={{ opacity: 0, width: 0, height: 0 }} />
                            <span style={{ ...styles.toggleSlider, ...(privacySettings.show_rating ? styles.toggleSliderActive : {}) }}>
                                <span style={styles.toggleSliderBefore}></span>
                            </span>
                            <span>Show ratings and reviews</span>
                        </label>
                    </div>
                </div>
                
                {/* Search Visibility */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-search"></i> Search Visibility</h3>
                    <p style={styles.description}>Control how you appear in searches</p>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.toggleSwitch}>
                            <input type="checkbox" checked={privacySettings.appear_in_search} onChange={() => handleToggle('appear_in_search')} style={{ opacity: 0, width: 0, height: 0 }} />
                            <span style={{ ...styles.toggleSlider, ...(privacySettings.appear_in_search ? styles.toggleSliderActive : {}) }}>
                                <span style={styles.toggleSliderBefore}></span>
                            </span>
                            <span>Appear in search results</span>
                        </label>
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.toggleSwitch}>
                            <input type="checkbox" checked={privacySettings.appear_in_talent_listings} onChange={() => handleToggle('appear_in_talent_listings')} style={{ opacity: 0, width: 0, height: 0 }} />
                            <span style={{ ...styles.toggleSlider, ...(privacySettings.appear_in_talent_listings ? styles.toggleSliderActive : {}) }}>
                                <span style={styles.toggleSliderBefore}></span>
                            </span>
                            <span>Appear in talent listings for employers</span>
                        </label>
                    </div>
                </div>
                
                {/* Data & Privacy */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-shield-alt"></i> Data & Privacy</h3>
                    <p style={styles.description}>Control how your data is shared</p>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.toggleSwitch}>
                            <input type="checkbox" checked={privacySettings.allow_download_resume} onChange={() => handleToggle('allow_download_resume')} style={{ opacity: 0, width: 0, height: 0 }} />
                            <span style={{ ...styles.toggleSlider, ...(privacySettings.allow_download_resume ? styles.toggleSliderActive : {}) }}>
                                <span style={styles.toggleSliderBefore}></span>
                            </span>
                            <span>Allow employers to download my resume</span>
                        </label>
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.toggleSwitch}>
                            <input type="checkbox" checked={privacySettings.allow_contact_requests} onChange={() => handleToggle('allow_contact_requests')} style={{ opacity: 0, width: 0, height: 0 }} />
                            <span style={{ ...styles.toggleSlider, ...(privacySettings.allow_contact_requests ? styles.toggleSliderActive : {}) }}>
                                <span style={styles.toggleSliderBefore}></span>
                            </span>
                            <span>Allow employers to contact me</span>
                        </label>
                    </div>
                    
                    <div style={styles.divider}></div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.toggleSwitch}>
                            <input type="checkbox" checked={privacySettings.share_analytics} onChange={() => handleToggle('share_analytics')} style={{ opacity: 0, width: 0, height: 0 }} />
                            <span style={{ ...styles.toggleSlider, ...(privacySettings.share_analytics ? styles.toggleSliderActive : {}) }}>
                                <span style={styles.toggleSliderBefore}></span>
                            </span>
                            <span>Share anonymous usage data to improve the platform</span>
                        </label>
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.toggleSwitch}>
                            <input type="checkbox" checked={privacySettings.share_for_recommendations} onChange={() => handleToggle('share_for_recommendations')} style={{ opacity: 0, width: 0, height: 0 }} />
                            <span style={{ ...styles.toggleSlider, ...(privacySettings.share_for_recommendations ? styles.toggleSliderActive : {}) }}>
                                <span style={styles.toggleSliderBefore}></span>
                            </span>
                            <span>Use my profile for personalized job recommendations</span>
                        </label>
                    </div>
                </div>
                
                {/* Additional Settings */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-cog"></i> Additional Settings</h3>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.toggleSwitch}>
                            <input type="checkbox" checked={privacySettings.show_last_active} onChange={() => handleToggle('show_last_active')} style={{ opacity: 0, width: 0, height: 0 }} />
                            <span style={{ ...styles.toggleSlider, ...(privacySettings.show_last_active ? styles.toggleSliderActive : {}) }}>
                                <span style={styles.toggleSliderBefore}></span>
                            </span>
                            <span>Show when I was last active</span>
                        </label>
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.toggleSwitch}>
                            <input type="checkbox" checked={privacySettings.show_read_receipts} onChange={() => handleToggle('show_read_receipts')} style={{ opacity: 0, width: 0, height: 0 }} />
                            <span style={{ ...styles.toggleSlider, ...(privacySettings.show_read_receipts ? styles.toggleSliderActive : {}) }}>
                                <span style={styles.toggleSliderBefore}></span>
                            </span>
                            <span>Show read receipts in messages</span>
                        </label>
                    </div>
                </div>
                
                {/* Form Actions */}
                <div style={styles.formActions}>
                    <button type="submit" disabled={saving} style={styles.saveBtn}>
                        {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} 
                        {saving ? ' Saving...' : ' Save Privacy Settings'}
                    </button>
                    <button type="button" onClick={loadPrivacySettings} style={styles.resetBtn}>
                        <i className="fas fa-undo-alt"></i> Reset
                    </button>
                </div>
            </form>
        </div>
    );
}