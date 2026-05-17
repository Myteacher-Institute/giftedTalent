import React, { useState } from 'react';
import axios from 'axios';

export default function AccountSecurity({ user }) {
    const [activeSection, setActiveSection] = useState('password');
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
    
    const styles = {
        container: { maxWidth: '800px' },
        nav: { display: 'flex', gap: '12px', marginBottom: '32px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', flexWrap: 'wrap' },
        navBtn: (isActive) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: isActive ? '#4F46E5' : 'transparent',
            color: isActive ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s'
        }),
        section: { animation: 'fadeIn 0.3s ease' },
        title: { fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' },
        description: { color: '#6b7280', fontSize: '14px', marginBottom: '24px' },
        formGroup: { marginBottom: '20px' },
        label: { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' },
        inputWrapper: { position: 'relative' },
        input: { width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' },
        toggleBtn: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' },
        error: { fontSize: '12px', color: '#ef4444', marginTop: '4px' },
        card: { background: '#f9fafb', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid #e5e7eb' },
        cardHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' },
        verifiedBadge: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#10b981', color: 'white', borderRadius: '8px' },
        warningText: { color: '#f59e0b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
        btn: { padding: '8px 16px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
        dangerBtn: { padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' },
        formActions: { marginTop: '24px' },
        updateBtn: { padding: '12px 24px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' },
        saveStatus: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px' },
        success: { background: '#f0fdf4', border: '1px solid #86efac', color: '#166534' },
        errorStatus: { background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b' }
    };
    
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (formData.new_password !== formData.new_password_confirmation) {
            setErrors({ confirm: 'Passwords do not match' });
            return;
        }
        
        setLoading(true);
        try {
            const response = await axios.put('/password', formData);
            if (response.data.success) {
                setSaveStatus({ type: 'success', message: 'Password updated!' });
                setFormData({ current_password: '', new_password: '', new_password_confirmation: '' });
                setTimeout(() => setSaveStatus(null), 3000);
            }
        } catch (error) {
            setSaveStatus({ type: 'error', message: error.response?.data?.message || 'Failed to update password' });
        } finally {
            setLoading(false);
        }
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
            
            <div style={styles.nav}>
                <button onClick={() => setActiveSection('password')} style={styles.navBtn(activeSection === 'password')}>
                    <i className="fas fa-key"></i> Change Password
                </button>
                <button onClick={() => setActiveSection('security')} style={styles.navBtn(activeSection === 'security')}>
                    <i className="fas fa-shield-alt"></i> Security
                </button>
                <button onClick={() => setActiveSection('danger')} style={styles.navBtn(activeSection === 'danger')}>
                    <i className="fas fa-exclamation-triangle"></i> Danger Zone
                </button>
            </div>
            
            {activeSection === 'password' && (
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-key"></i> Change Password</h3>
                    <p style={styles.description}>Choose a strong password to keep your account secure</p>
                    
                    <form onSubmit={handleUpdatePassword}>
                        <div style={styles.formGroup}>
                            <label htmlFor="current-password" style={styles.label}>Current Password</label>
                            <div style={styles.inputWrapper}>
                                <input id="current-password" type={showPassword.current ? 'text' : 'password'} name="current_password" autoComplete="current-password" value={formData.current_password} onChange={(e) => setFormData({...formData, current_password: e.target.value})} style={styles.input} />
                                <button type="button" onClick={() => setShowPassword({...showPassword, current: !showPassword.current})} style={styles.toggleBtn}>
                                    <i className={`fas fa-eye${showPassword.current ? '' : '-slash'}`}></i>
                                </button>
                            </div>
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label htmlFor="new-password" style={styles.label}>New Password</label>
                            <div style={styles.inputWrapper}>
                                <input id="new-password" type={showPassword.new ? 'text' : 'password'} name="new_password" autoComplete="new-password" value={formData.new_password} onChange={(e) => setFormData({...formData, new_password: e.target.value})} style={styles.input} />
                                <button type="button" onClick={() => setShowPassword({...showPassword, new: !showPassword.new})} style={styles.toggleBtn}>
                                    <i className={`fas fa-eye${showPassword.new ? '' : '-slash'}`}></i>
                                </button>
                            </div>
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label htmlFor="confirm-password" style={styles.label}>Confirm New Password</label>
                            <div style={styles.inputWrapper}>
                                <input id="confirm-password" type={showPassword.confirm ? 'text' : 'password'} name="new_password_confirmation" autoComplete="new-password" value={formData.new_password_confirmation} onChange={(e) => setFormData({...formData, new_password_confirmation: e.target.value})} style={styles.input} />
                                <button type="button" onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})} style={styles.toggleBtn}>
                                    <i className={`fas fa-eye${showPassword.confirm ? '' : '-slash'}`}></i>
                                </button>
                            </div>
                            {errors.confirm && <span style={styles.error}>{errors.confirm}</span>}
                        </div>
                        
                        <div style={styles.formActions}>
                            <button type="submit" disabled={loading} style={styles.updateBtn}>
                                {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} Update Password
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            {activeSection === 'security' && (
                <div>
                    <h3 style={styles.title}><i className="fas fa-shield-alt"></i> Security Settings</h3>
                    
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <i className="fas fa-envelope" style={{ fontSize: '24px', color: '#4F46E5' }}></i>
                            <div>
                                <h4 style={{ margin: 0 }}>Email Verification</h4>
                                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Verify your email address</p>
                            </div>
                        </div>
                        {user?.email_verified_at ? (
                            <div style={styles.verifiedBadge}><i className="fas fa-check-circle"></i> Email verified</div>
                        ) : (
                            <>
                                <p style={styles.warningText}><i className="fas fa-exclamation-triangle"></i> Your email is not verified</p>
                                <button style={styles.btn}>Resend Verification Email</button>
                            </>
                        )}
                    </div>
                    
                    <div style={{ ...styles.card, opacity: 0.7 }}>
                        <div style={styles.cardHeader}>
                            <i className="fas fa-mobile-alt" style={{ fontSize: '24px', color: '#4F46E5' }}></i>
                            <div>
                                <h4 style={{ margin: 0 }}>Two-Factor Authentication</h4>
                                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Add an extra layer of security</p>
                            </div>
                            <span style={{ padding: '4px 8px', background: '#e5e7eb', borderRadius: '4px', fontSize: '11px' }}>Coming Soon</span>
                        </div>
                    </div>
                </div>
            )}
            
            {activeSection === 'danger' && (
                <div>
                    <h3 style={{ ...styles.title, color: '#ef4444' }}><i className="fas fa-exclamation-triangle"></i> Danger Zone</h3>
                    <p style={styles.description}>Irreversible account actions. Proceed with caution.</p>
                    
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                            <i className="fas fa-trash-alt" style={{ fontSize: '24px', color: '#ef4444' }}></i>
                            <div>
                                <h4 style={{ margin: 0 }}>Delete Account</h4>
                                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Permanently delete your account and all associated data</p>
                            </div>
                        </div>
                        <button style={styles.dangerBtn}><i className="fas fa-trash-alt"></i> Delete Account</button>
                    </div>
                </div>
            )}
        </div>
    );
}