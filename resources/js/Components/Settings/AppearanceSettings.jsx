import React, { useState, useEffect } from 'react';
import axios from 'axios';

const accentColors = [
    { value: 'indigo', label: 'Indigo', hex: '#4F46E5' },
    { value: 'emerald', label: 'Emerald', hex: '#10B981' },
    { value: 'rose', label: 'Rose', hex: '#F43F5E' },
    { value: 'amber', label: 'Amber', hex: '#F59E0B' },
    { value: 'sky', label: 'Sky', hex: '#0EA5E9' },
];

const themeModes = [
    { value: 'light', title: 'Light Mode', description: 'Clean and bright interface.' },
    { value: 'dark', title: 'Dark Mode', description: 'Low-light friendly interface.' },
    { value: 'system', title: 'System Default', description: 'Matches your device preference.' },
];

const densities = [
    { value: 'comfortable', label: 'Comfortable', description: 'A balanced layout with breathing room.' },
    { value: 'compact', label: 'Compact', description: 'Tighter layout for power users.' },
];

const sidebarStyles = [
    { value: 'modern', label: 'Modern', description: 'Soft cards and subtle shadows.' },
    { value: 'classic', label: 'Classic', description: 'Structured panels with strong contrast.' },
];

export default function AppearanceSettings() {
    const [settings, setSettings] = useState({
        theme_mode: 'system',
        accent_color: 'indigo',
        density: 'comfortable',
        sidebar_style: 'modern',
        font_size: 'normal',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        loadAppearanceSettings();
    }, []);

    useEffect(() => {
        applyClientTheme(settings);
    }, [settings.theme_mode, settings.accent_color]);

    const loadAppearanceSettings = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/user/appearance-settings');
            if (response.data?.settings) {
                setSettings(prev => ({ ...prev, ...response.data.settings }));
            }
        } catch (error) {
            console.warn('Appearance settings not set yet, using defaults.');
        } finally {
            setLoading(false);
        }
    };

    const applyClientTheme = (themeSettings) => {
        const root = document.documentElement;
        const currentMode = themeSettings.theme_mode;

        if (currentMode === 'dark') {
            root.classList.add('dark-theme');
            root.classList.remove('light-theme');
        } else if (currentMode === 'light') {
            root.classList.add('light-theme');
            root.classList.remove('dark-theme');
        } else {
            root.classList.remove('light-theme', 'dark-theme');
        }

        root.style.setProperty('--app-accent', accentColors.find(item => item.value === themeSettings.accent_color)?.hex || '#4F46E5');
    };

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
        setStatus(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setStatus(null);

        try {
            const response = await axios.put('/user/appearance-settings', settings);
            if (response.data?.success) {
                setStatus({ type: 'success', message: 'Appearance preferences saved successfully.' });
                setSettings(prev => ({ ...prev, ...response.data.settings }));
            } else {
                setStatus({ type: 'error', message: response.data?.message || 'Unable to save appearance settings.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Network error while saving settings.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: '12px' }}></i>
                Loading appearance settings...
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '920px', width: '100%' }}>
            {status && (
                <div style={{
                    marginBottom: '24px',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    border: status.type === 'success' ? '1px solid #a7f3d0' : '1px solid #fecaca',
                    background: status.type === 'success' ? '#ecfdf5' : '#fef2f2',
                    color: status.type === 'success' ? '#166534' : '#991b1b'
                }}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', marginBottom: '24px' }}>
                    <div style={{ display: 'grid', gap: '24px' }}>
                        <section style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e5e7eb', padding: '26px', boxShadow: '0 18px 50px rgba(15, 23, 42, 0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '16px', background: '#eef2ff', display: 'grid', placeItems: 'center', color: '#4338ca' }}>
                                    <i className="fas fa-paint-brush"></i>
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '20px', color: '#111827' }}>Theme Mode</h3>
                                    <p style={{ margin: 0, color: '#6b7280' }}>Choose how GiftedTalent displays across your devices.</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '12px' }}>
                                {themeModes.map(mode => (
                                    <button
                                        key={mode.value}
                                        type="button"
                                        onClick={() => handleChange('theme_mode', mode.value)}
                                        style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '18px',
                                            borderRadius: '16px',
                                            border: settings.theme_mode === mode.value ? '1px solid #4F46E5' : '1px solid #e5e7eb',
                                            background: settings.theme_mode === mode.value ? '#eef2ff' : '#fff',
                                            cursor: 'pointer',
                                            color: '#111827'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <strong>{mode.title}</strong>
                                                <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: '14px' }}>{mode.description}</p>
                                            </div>
                                            {settings.theme_mode === mode.value && (
                                                <span style={{ fontSize: '16px', color: '#4F46E5' }}><i className="fas fa-check-circle"></i></span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e5e7eb', padding: '26px', boxShadow: '0 18px 50px rgba(15, 23, 42, 0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '16px', background: '#fef3c7', display: 'grid', placeItems: 'center', color: '#b45309' }}>
                                    <i className="fas fa-droplet"></i>
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '20px', color: '#111827' }}>Accent Color</h3>
                                    <p style={{ margin: 0, color: '#6b7280' }}>Define the primary brand color for the dashboard.</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px' }}>
                                {accentColors.map(color => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => handleChange('accent_color', color.value)}
                                        style={{
                                            minHeight: '90px',
                                            padding: '16px',
                                            borderRadius: '18px',
                                            border: settings.accent_color === color.value ? `2px solid ${color.hex}` : '1px solid #e5e7eb',
                                            background: '#fff',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <div style={{ width: '100%', height: '34px', borderRadius: '14px', background: color.hex }}></div>
                                        <div style={{ fontSize: '14px', color: '#111827', fontWeight: '600' }}>{color.label}</div>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e5e7eb', padding: '26px', boxShadow: '0 18px 50px rgba(15, 23, 42, 0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '16px', background: '#e0f2fe', display: 'grid', placeItems: 'center', color: '#0284c7' }}>
                                    <i className="fas fa-list"></i>
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '20px', color: '#111827' }}>UI Density</h3>
                                    <p style={{ margin: 0, color: '#6b7280' }}>Choose the spacing that fits your workflow.</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '12px' }}>
                                {densities.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleChange('density', option.value)}
                                        style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '18px',
                                            borderRadius: '16px',
                                            border: settings.density === option.value ? '1px solid #4F46E5' : '1px solid #e5e7eb',
                                            background: settings.density === option.value ? '#eef2ff' : '#fff',
                                            cursor: 'pointer',
                                            color: '#111827'
                                        }}
                                    >
                                        <strong>{option.label}</strong>
                                        <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: '14px' }}>{option.description}</p>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e5e7eb', padding: '26px', boxShadow: '0 18px 50px rgba(15, 23, 42, 0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '16px', background: '#dbeafe', display: 'grid', placeItems: 'center', color: '#2563eb' }}>
                                    <i className="fas fa-columns"></i>
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '20px', color: '#111827' }}>Sidebar Style</h3>
                                    <p style={{ margin: 0, color: '#6b7280' }}>Select the sidebar appearance you prefer.</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '12px' }}>
                                {sidebarStyles.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleChange('sidebar_style', option.value)}
                                        style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '18px',
                                            borderRadius: '16px',
                                            border: settings.sidebar_style === option.value ? '1px solid #4F46E5' : '1px solid #e5e7eb',
                                            background: settings.sidebar_style === option.value ? '#eef2ff' : '#fff',
                                            cursor: 'pointer',
                                            color: '#111827'
                                        }}
                                    >
                                        <strong>{option.label}</strong>
                                        <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: '14px' }}>{option.description}</p>
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside style={{ background: '#f8fafc', borderRadius: '24px', padding: '28px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
                        <div>
                            <p style={{ margin: 0, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '12px' }}>Live Preview</p>
                            <h3 style={{ margin: '10px 0 0', fontSize: '22px', color: '#111827' }}>Your dashboard will feel like this</h3>
                        </div>

                        <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(15, 23, 42, 0.08)' }}>
                            <div style={{ padding: '22px', background: '#fff', borderBottom: '1px solid rgba(15, 23, 42, 0.06)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                                    <div>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '9999px', background: '#ef4444', display: 'inline-block', marginRight: '6px' }}></div>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '9999px', background: '#f59e0b', display: 'inline-block', marginRight: '6px' }}></div>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '9999px', background: '#10b981', display: 'inline-block' }}></div>
                                    </div>
                                    <div style={{ fontWeight: '700', color: '#374151' }}>{settings.theme_mode === 'system' ? 'System' : settings.theme_mode === 'dark' ? 'Dark' : 'Light'}</div>
                                </div>
                                <div style={{ minHeight: '220px', background: settings.theme_mode === 'dark' ? '#0f172a' : '#f8fafc', color: settings.theme_mode === 'dark' ? '#e2e8f0' : '#0f172a', padding: '22px', borderRadius: '18px', boxShadow: 'inset 0 0 0 1px rgba(15, 23, 42, 0.03)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                                        <div>
                                            <div style={{ fontSize: '14px', color: settings.theme_mode === 'dark' ? '#94a3b8' : '#6b7280' }}>Navigation</div>
                                            <div style={{ marginTop: '8px', fontWeight: '700', color: settings.theme_mode === 'dark' ? '#f8fafc' : '#111827' }}>GiftedTalent</div>
                                        </div>
                                        <span style={{ color: '#9ca3af', fontSize: '14px' }}>Menu</span>
                                    </div>
                                    <div style={{ background: settings.theme_mode === 'dark' ? '#111827' : '#fff', borderRadius: '18px', padding: '18px', color: settings.theme_mode === 'dark' ? '#cbd5e1' : '#0f172a', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                            <div style={{ fontWeight: '700', color: 'var(--app-accent, #4F46E5)' }}>Recruitment insights</div>
                                            <span style={{ fontSize: '13px', color: settings.theme_mode === 'dark' ? '#94a3b8' : '#6b7280' }}>Live</span>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                            <div style={{ background: settings.theme_mode === 'dark' ? '#0f172a' : '#f8fafc', borderRadius: '16px', padding: '16px' }}>
                                                <div style={{ fontSize: '12px', color: settings.theme_mode === 'dark' ? '#94a3b8' : '#6b7280' }}>Status</div>
                                                <div style={{ marginTop: '12px', fontWeight: '700' }}>Smooth</div>
                                            </div>
                                            <div style={{ background: settings.theme_mode === 'dark' ? '#0f172a' : '#f8fafc', borderRadius: '16px', padding: '16px' }}>
                                                <div style={{ fontSize: '12px', color: settings.theme_mode === 'dark' ? '#94a3b8' : '#6b7280' }}>Accent</div>
                                                <div style={{ marginTop: '12px', fontWeight: '700', color: 'var(--app-accent, #4F46E5)' }}>{settings.accent_color}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ borderRadius: '16px', padding: '18px', background: '#fff', border: '1px solid #e5e7eb' }}>
                            <h4 style={{ margin: 0, color: '#111827', fontSize: '18px' }}>Saved settings</h4>
                            <p style={{ margin: '10px 0 0', color: '#6b7280', fontSize: '14px' }}>These preferences are stored for your account and applied across devices.</p>
                            <ul style={{ margin: '18px 0 0', paddingLeft: '18px', color: '#374151', fontSize: '14px', lineHeight: '1.8' }}>
                                <li>Theme mode: {settings.theme_mode}</li>
                                <li>Accent color: {settings.accent_color}</li>
                                <li>UI density: {settings.density}</li>
                                <li>Sidebar style: {settings.sidebar_style}</li>
                            </ul>
                        </div>
                    </aside>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '4px' }}>
                    <button
                        type="button"
                        onClick={loadAppearanceSettings}
                        style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#fff', color: '#374151', cursor: 'pointer' }}
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'var(--app-accent, #4F46E5)',
                            color: '#fff',
                            cursor: 'pointer',
                            opacity: saving ? 0.7 : 1
                        }}
                    >
                        {saving ? 'Saving...' : 'Save Appearance'}
                    </button>
                </div>
            </form>
        </div>
    );
}
