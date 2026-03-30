import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function NotificationSettings({ user }) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    
    const [notifications, setNotifications] = useState({
        // Email Notifications
        email_job_alerts: true,
        email_application_updates: true,
        email_message_notifications: true,
        email_marketing: false,
        email_newsletter: false,
        
        // In-App Notifications
        in_app_job_alerts: true,
        in_app_application_updates: true,
        in_app_messages: true,
        
        // Push Notifications
        push_enabled: false,
        push_job_alerts: true,
        push_messages: true,
        
        // Frequency
        digest_frequency: 'daily',
        quiet_hours_enabled: false,
        quiet_hours_start: '22:00',
        quiet_hours_end: '08:00',
        
        // Desktop Notifications
        desktop_enabled: true,
        
        // Sound
        sound_enabled: true,
    });
    
    // Load saved notification preferences
    useEffect(() => {
        loadNotificationPreferences();
    }, []);
    
    const loadNotificationPreferences = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/user/notification-preferences');
            if (response.data && response.data.preferences) {
                setNotifications(response.data.preferences);
            }
        } catch (error) {
            console.log('No saved notification preferences found, using defaults');
        } finally {
            setLoading(false);
        }
    };
    
    const handleToggle = (field) => {
        setNotifications(prev => ({ ...prev, [field]: !prev[field] }));
        setSaveStatus(null);
    };
    
    const handleChange = (field, value) => {
        setNotifications(prev => ({ ...prev, [field]: value }));
        setSaveStatus(null);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaveStatus(null);
        
        try {
            const response = await axios.put('/user/notification-preferences', notifications);
            if (response.data.success) {
                setSaveStatus({ type: 'success', message: 'Notification preferences saved successfully!' });
                setTimeout(() => setSaveStatus(null), 3000);
            }
        } catch (error) {
            setSaveStatus({ type: 'error', message: 'Failed to save preferences' });
        } finally {
            setSaving(false);
        }
    };
    
    const styles = {
        container: { maxWidth: '800px' },
        section: { 
            background: 'white', 
            borderRadius: '12px', 
            padding: '24px', 
            marginBottom: '24px', 
            border: '1px solid #e5e7eb' 
        },
        title: { 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '8px', 
            color: '#1f2937', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px' 
        },
        description: { 
            fontSize: '13px', 
            color: '#6b7280', 
            marginBottom: '20px' 
        },
        formGroup: { 
            marginBottom: '20px' 
        },
        label: { 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            marginBottom: '8px', 
            color: '#374151' 
        },
        checkboxLabel: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            cursor: 'pointer', 
            marginBottom: '12px' 
        },
        toggleSwitch: { 
            position: 'relative', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '12px', 
            cursor: 'pointer' 
        },
        toggleSlider: { 
            position: 'relative', 
            display: 'inline-block', 
            width: '50px', 
            height: '24px', 
            backgroundColor: '#ccc', 
            borderRadius: '24px', 
            transition: '0.3s' 
        },
        toggleSliderActive: { 
            backgroundColor: '#4F46E5' 
        },
        toggleSliderBefore: { 
            position: 'absolute', 
            content: '""', 
            height: '18px', 
            width: '18px', 
            left: '3px', 
            bottom: '3px', 
            backgroundColor: 'white', 
            borderRadius: '50%', 
            transition: '0.3s' 
        },
        select: { 
            width: '100%', 
            padding: '10px 12px', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            fontSize: '14px', 
            background: 'white' 
        },
        timeInputs: { 
            display: 'flex', 
            gap: '16px', 
            marginTop: '12px' 
        },
        timeInput: { 
            flex: 1, 
            padding: '8px 12px', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px' 
        },
        formActions: { 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'flex-end', 
            marginTop: '24px', 
            paddingTop: '24px', 
            borderTop: '1px solid #e5e7eb' 
        },
        saveBtn: { 
            padding: '12px 24px', 
            background: '#4F46E5', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px' 
        },
        resetBtn: { 
            padding: '12px 24px', 
            background: 'white', 
            color: '#374151', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            cursor: 'pointer' 
        },
        saveStatus: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '12px 16px', 
            borderRadius: '8px', 
            marginBottom: '24px' 
        },
        success: { 
            background: '#f0fdf4', 
            border: '1px solid #86efac', 
            color: '#166534' 
        },
        error: { 
            background: '#fef2f2', 
            border: '1px solid #fecaca', 
            color: '#991b1b' 
        },
        divider: { 
            height: '1px', 
            background: '#e5e7eb', 
            margin: '20px 0' 
        },
        loadingSpinner: { 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '40px', 
            color: '#6b7280' 
        }
    };
    
    if (loading) {
        return (
            <div style={styles.loadingSpinner}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', marginRight: '12px' }}></i>
                <span>Loading notification preferences...</span>
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
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                    >
                        ×
                    </button>
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                {/* Email Notifications */}
                <div style={styles.section}>
                    <h3 style={styles.title}>
                        <i className="fas fa-envelope" style={{ color: '#4F46E5' }}></i>
                        Email Notifications
                    </h3>
                    <p style={styles.description}>Choose which emails you'd like to receive</p>
                    
                    <label htmlFor="email-job-alerts" style={styles.checkboxLabel}>
                        <input 
                            id="email-job-alerts"
                            name="email_job_alerts"
                            type="checkbox" 
                            checked={notifications.email_job_alerts} 
                            onChange={() => handleToggle('email_job_alerts')} 
                        />
                        <span>Job alerts - New jobs matching your preferences</span>
                    </label>
                    
                    <label htmlFor="email-application-updates" style={styles.checkboxLabel}>
                        <input 
                            id="email-application-updates"
                            name="email_application_updates"
                            type="checkbox" 
                            checked={notifications.email_application_updates} 
                            onChange={() => handleToggle('email_application_updates')} 
                        />
                        <span>Application updates - Status changes for your applications</span>
                    </label>
                    
                    <label htmlFor="email-message-notifications" style={styles.checkboxLabel}>
                        <input 
                            id="email-message-notifications"
                            name="email_message_notifications"
                            type="checkbox" 
                            checked={notifications.email_message_notifications} 
                            onChange={() => handleToggle('email_message_notifications')} 
                        />
                        <span>Message notifications - When you receive new messages</span>
                    </label>
                    
                    <label htmlFor="email-marketing" style={styles.checkboxLabel}>
                        <input 
                            id="email-marketing"
                            name="email_marketing"
                            type="checkbox" 
                            checked={notifications.email_marketing} 
                            onChange={() => handleToggle('email_marketing')} 
                        />
                        <span>Marketing emails - Tips, tricks, and special offers</span>
                    </label>
                    
                    <label htmlFor="email-newsletter" style={styles.checkboxLabel}>
                        <input 
                            id="email-newsletter"
                            name="email_newsletter"
                            type="checkbox" 
                            checked={notifications.email_newsletter} 
                            onChange={() => handleToggle('email_newsletter')} 
                        />
                        <span>Newsletter - Monthly updates and industry news</span>
                    </label>
                </div>
                
                {/* In-App Notifications */}
                <div style={styles.section}>
                    <h3 style={styles.title}>
                        <i className="fas fa-bell" style={{ color: '#4F46E5' }}></i>
                        In-App Notifications
                    </h3>
                    <p style={styles.description}>Notifications that appear in your dashboard</p>
                    
                    <label htmlFor="inapp-job-alerts" style={styles.checkboxLabel}>
                        <input 
                            id="inapp-job-alerts"
                            name="in_app_job_alerts"
                            type="checkbox" 
                            checked={notifications.in_app_job_alerts} 
                            onChange={() => handleToggle('in_app_job_alerts')} 
                        />
                        <span>Job alerts</span>
                    </label>
                    
                    <label htmlFor="inapp-application-updates" style={styles.checkboxLabel}>
                        <input 
                            id="inapp-application-updates"
                            name="in_app_application_updates"
                            type="checkbox" 
                            checked={notifications.in_app_application_updates} 
                            onChange={() => handleToggle('in_app_application_updates')} 
                        />
                        <span>Application updates</span>
                    </label>
                    
                    <label htmlFor="inapp-messages" style={styles.checkboxLabel}>
                        <input 
                            id="inapp-messages"
                            name="in_app_messages"
                            type="checkbox" 
                            checked={notifications.in_app_messages} 
                            onChange={() => handleToggle('in_app_messages')} 
                        />
                        <span>New messages</span>
                    </label>
                </div>
                
                {/* Push Notifications */}
                <div style={styles.section}>
                    <h3 style={styles.title}>
                        <i className="fas fa-mobile-alt" style={{ color: '#4F46E5' }}></i>
                        Push Notifications
                    </h3>
                    <p style={styles.description}>Browser push notifications</p>
                    
                    <label htmlFor="push-enabled" style={styles.toggleSwitch}>
                        <input 
                            id="push-enabled"
                            name="push_enabled"
                            type="checkbox" 
                            checked={notifications.push_enabled} 
                            onChange={() => handleToggle('push_enabled')} 
                            style={{ opacity: 0, width: 0, height: 0 }} 
                        />
                        <span style={{ 
                            ...styles.toggleSlider, 
                            ...(notifications.push_enabled ? styles.toggleSliderActive : {})
                        }}>
                            <span style={styles.toggleSliderBefore}></span>
                        </span>
                        <span>Enable push notifications</span>
                    </label>
                    
                    {notifications.push_enabled && (
                        <div style={{ marginTop: '16px' }}>
                            <label htmlFor="push-job-alerts" style={styles.checkboxLabel}>
                                <input 
                                    id="push-job-alerts"
                                    name="push_job_alerts"
                                    type="checkbox" 
                                    checked={notifications.push_job_alerts} 
                                    onChange={() => handleToggle('push_job_alerts')} 
                                />
                                <span>Job alerts</span>
                            </label>
                            
                            <label htmlFor="push-messages" style={styles.checkboxLabel}>
                                <input 
                                    id="push-messages"
                                    name="push_messages"
                                    type="checkbox" 
                                    checked={notifications.push_messages} 
                                    onChange={() => handleToggle('push_messages')} 
                                />
                                <span>New messages</span>
                            </label>
                        </div>
                    )}
                </div>
                
                {/* Digest Settings */}
                <div style={styles.section}>
                    <h3 style={styles.title}>
                        <i className="fas fa-clock" style={{ color: '#4F46E5' }}></i>
                        Digest Settings
                    </h3>
                    <p style={styles.description}>How often you want to receive summary emails</p>
                    
                    <div style={styles.formGroup}>
                        <label htmlFor="digest-frequency" style={styles.label}>Email digest frequency</label>
                        <select id="digest-frequency" name="digest_frequency" 
                            value={notifications.digest_frequency} 
                            onChange={(e) => handleChange('digest_frequency', e.target.value)} 
                            style={styles.select}
                        >
                            <option value="instant">Instant (as they happen)</option>
                            <option value="daily">Daily summary</option>
                            <option value="weekly">Weekly summary</option>
                        </select>
                    </div>
                </div>
                
                {/* Quiet Hours */}
                <div style={styles.section}>
                    <h3 style={styles.title}>
                        <i className="fas fa-moon" style={{ color: '#4F46E5' }}></i>
                        Quiet Hours
                    </h3>
                    <p style={styles.description}>Mute notifications during certain hours</p>
                    
                    <label htmlFor="quiet-hours-enabled" style={styles.toggleSwitch}>
                        <input 
                            id="quiet-hours-enabled"
                            name="quiet_hours_enabled"
                            type="checkbox" 
                            checked={notifications.quiet_hours_enabled} 
                            onChange={() => handleToggle('quiet_hours_enabled')} 
                            style={{ opacity: 0, width: 0, height: 0 }} 
                        />
                        <span style={{ 
                            ...styles.toggleSlider, 
                            ...(notifications.quiet_hours_enabled ? styles.toggleSliderActive : {})
                        }}>
                            <span style={styles.toggleSliderBefore}></span>
                        </span>
                        <span>Enable quiet hours</span>
                    </label>
                    
                    {notifications.quiet_hours_enabled && (
                        <div style={styles.timeInputs}>
                            <div style={{ flex: 1 }}>
                                <label htmlFor="quiet-hours-start" style={{ ...styles.label, fontSize: '12px' }}>Start time</label>
                                <input 
                                    id="quiet-hours-start"
                                    name="quiet_hours_start"
                                    type="time" 
                                    value={notifications.quiet_hours_start} 
                                    onChange={(e) => handleChange('quiet_hours_start', e.target.value)} 
                                    style={styles.timeInput} 
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label htmlFor="quiet-hours-end" style={{ ...styles.label, fontSize: '12px' }}>End time</label>
                                <input 
                                    id="quiet-hours-end"
                                    name="quiet_hours_end"
                                    type="time" 
                                    value={notifications.quiet_hours_end} 
                                    onChange={(e) => handleChange('quiet_hours_end', e.target.value)} 
                                    style={styles.timeInput} 
                                />
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Additional Settings */}
                <div style={styles.section}>
                    <h3 style={styles.title}>
                        <i className="fas fa-cog" style={{ color: '#4F46E5' }}></i>
                        Additional Settings
                    </h3>
                    
                    <label htmlFor="desktop-enabled" style={styles.checkboxLabel}>
                        <input 
                            id="desktop-enabled"
                            name="desktop_enabled"
                            type="checkbox" 
                            checked={notifications.desktop_enabled} 
                            onChange={() => handleToggle('desktop_enabled')} 
                        />
                        <span>Show desktop notifications</span>
                    </label>
                    
                    <label htmlFor="sound-enabled" style={styles.checkboxLabel}>
                        <input 
                            id="sound-enabled"
                            name="sound_enabled"
                            type="checkbox" 
                            checked={notifications.sound_enabled} 
                            onChange={() => handleToggle('sound_enabled')} 
                        />
                        <span>Play sound for notifications</span>
                    </label>
                </div>
                
                {/* Form Actions */}
                <div style={styles.formActions}>
                    <button 
                        type="submit" 
                        disabled={saving} 
                        style={styles.saveBtn}
                    >
                        {saving ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i> Saving...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save"></i> Save Preferences
                            </>
                        )}
                    </button>
                    <button 
                        type="button" 
                        onClick={loadNotificationPreferences} 
                        style={styles.resetBtn}
                    >
                        <i className="fas fa-undo-alt"></i> Reset
                    </button>
                </div>
            </form>
        </div>
    );
}