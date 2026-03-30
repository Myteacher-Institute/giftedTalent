import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function JobPreferences({ user }) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    
    const [preferences, setPreferences] = useState({
        // Job Types
        job_types: [],
        employment_types: [],
        
        // Location
        locations: [],
        remote_only: false,
        max_commute_distance: 50,
        
        // Salary
        salary_min: '',
        salary_max: '',
        salary_currency: 'USD',
        
        // Job Alerts
        job_alerts_enabled: true,
        alert_frequency: 'daily',
        alert_email: user?.email || '',
        
        // Experience
        experience_level: '',
        
        // Industries
        industries: [],
        
        // Match Score
        minimum_match_score: 60,
        
        // Job Search
        show_remote_jobs: true,
        show_urgent_jobs: true,
    });
    
    // Options
    const jobTypeOptions = [
        'Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Temporary'
    ];
    
    const employmentTypeOptions = [
        'Remote', 'Hybrid', 'On-site'
    ];
    
    const experienceLevels = [
        'Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Lead', 'Executive'
    ];
    
    const alertFrequencies = [
        { value: 'instant', label: 'Instant (Immediately)', icon: 'fa-bolt' },
        { value: 'daily', label: 'Daily Summary', icon: 'fa-sun' },
        { value: 'weekly', label: 'Weekly Summary', icon: 'fa-calendar-week' }
    ];
    
    const industriesList = [
        'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
        'Retail', 'Construction', 'Hospitality', 'Media', 'Transportation',
        'Real Estate', 'Consulting', 'Marketing', 'Design', 'Engineering'
    ];
    
    const locationsList = [
        'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
        'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'Austin',
        'San Francisco', 'Boston', 'Seattle', 'Denver', 'Miami'
    ];
    
    // Load saved preferences when component mounts
    useEffect(() => {
        loadPreferences();
    }, []);
    
    const loadPreferences = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/user/job-preferences');
            if (response.data && response.data.preferences) {
                const savedPrefs = response.data.preferences;
                setPreferences({
                    job_types: savedPrefs.job_types || [],
                    employment_types: savedPrefs.employment_types || [],
                    locations: savedPrefs.locations || [],
                    remote_only: savedPrefs.remote_only || false,
                    max_commute_distance: savedPrefs.max_commute_distance || 50,
                    salary_min: savedPrefs.salary_min || '',
                    salary_max: savedPrefs.salary_max || '',
                    salary_currency: savedPrefs.salary_currency || 'USD',
                    job_alerts_enabled: savedPrefs.job_alerts_enabled !== undefined ? savedPrefs.job_alerts_enabled : true,
                    alert_frequency: savedPrefs.alert_frequency || 'daily',
                    alert_email: savedPrefs.alert_email || user?.email || '',
                    experience_level: savedPrefs.experience_level || '',
                    industries: savedPrefs.industries || [],
                    minimum_match_score: savedPrefs.minimum_match_score || 60,
                    show_remote_jobs: savedPrefs.show_remote_jobs !== undefined ? savedPrefs.show_remote_jobs : true,
                    show_urgent_jobs: savedPrefs.show_urgent_jobs !== undefined ? savedPrefs.show_urgent_jobs : true,
                });
                
                setSaveStatus({ type: 'success', message: 'Preferences loaded!' });
                setTimeout(() => setSaveStatus(null), 2000);
            }
        } catch (error) {
            console.log('No saved preferences found, using defaults');
        } finally {
            setLoading(false);
        }
    };
    
    const handleToggle = (field) => {
        setPreferences(prev => ({ ...prev, [field]: !prev[field] }));
        setSaveStatus(null);
    };
    
    const handleChange = (field, value) => {
        setPreferences(prev => ({ ...prev, [field]: value }));
        setSaveStatus(null);
    };
    
    const handleMultiSelect = (field, value) => {
        setPreferences(prev => {
            const current = prev[field];
            if (current.includes(value)) {
                return { ...prev, [field]: current.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...current, value] };
            }
        });
        setSaveStatus(null);
    };
    
    const handleAddLocation = (location) => {
        if (!location.trim()) return;
        setPreferences(prev => ({
            ...prev,
            locations: [...prev.locations, location.trim()]
        }));
        setSaveStatus(null);
    };
    
    const handleRemoveLocation = (location) => {
        setPreferences(prev => ({
            ...prev,
            locations: prev.locations.filter(l => l !== location)
        }));
        setSaveStatus(null);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaveStatus(null);
        
        try {
            const response = await axios.put('/user/job-preferences', preferences);
            if (response.data.success) {
                setSaveStatus({ type: 'success', message: 'Job preferences saved successfully!' });
                setTimeout(() => setSaveStatus(null), 3000);
            }
        } catch (error) {
            console.error('Error saving preferences:', error);
            setSaveStatus({ type: 'error', message: error.response?.data?.message || 'Failed to save preferences' });
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
        input: { width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' },
        select: { width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', background: 'white' },
        optionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', marginBottom: '20px' },
        optionCard: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' },
        rangeSlider: { width: '100%', margin: '12px 0' },
        rangeValue: { fontSize: '12px', color: '#6b7280' },
        selectedItems: { display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '12px 0' },
        selectedTag: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 10px', background: '#f3f4f6', borderRadius: '6px', fontSize: '13px' },
        removeTag: { background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '0 4px' },
        popularButtons: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' },
        popularBtn: { padding: '4px 12px', background: '#f3f4f6', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
        frequencyButtons: { display: 'flex', gap: '12px', marginTop: '8px' },
        frequencyBtn: (isActive) => ({
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px',
            background: isActive ? '#4F46E5' : '#f3f4f6',
            color: isActive ? 'white' : '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer'
        }),
        experienceButtons: { display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' },
        experienceBtn: (isActive) => ({
            padding: '8px 16px',
            background: isActive ? '#4F46E5' : '#f3f4f6',
            color: isActive ? 'white' : '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer'
        }),
        toggleSwitch: { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '12px', cursor: 'pointer' },
        toggleSlider: { position: 'relative', display: 'inline-block', width: '50px', height: '24px', backgroundColor: '#ccc', borderRadius: '24px', transition: '0.3s' },
        toggleSliderActive: { backgroundColor: '#4F46E5' },
        toggleSliderBefore: { position: 'absolute', content: '""', height: '18px', width: '18px', left: '3px', bottom: '3px', backgroundColor: 'white', borderRadius: '50%', transition: '0.3s' },
        formActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' },
        saveBtn: { padding: '12px 24px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
        resetBtn: { padding: '12px 24px', background: 'white', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' },
        saveStatus: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px' },
        success: { background: '#f0fdf4', border: '1px solid #86efac', color: '#166534' },
        error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b' },
        loadingSpinner: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', color: '#6b7280' },
        twoColumn: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
        industriesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }
    };
    
    if (loading) {
        return (
            <div style={styles.loadingSpinner}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', marginRight: '12px' }}></i>
                <span>Loading your preferences...</span>
            </div>
        );
    }
    
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
                {/* Job Types */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-briefcase"></i> Job Types</h3>
                    <p style={styles.description}>Select the types of jobs you're interested in</p>
                    <div style={styles.optionsGrid}>
                        {jobTypeOptions.map(type => {
                            const optionId = `job-type-${type.replace(/\s+/g, '-').toLowerCase()}`;
                            return (
                                <label key={type} htmlFor={optionId} style={styles.optionCard}>
                                    <input id={optionId} name="job_types" type="checkbox" checked={preferences.job_types.includes(type)} onChange={() => handleMultiSelect('job_types', type)} />
                                    <span>{type}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
                
                {/* Employment Types */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-building"></i> Employment Types</h3>
                    <p style={styles.description}>Choose how you prefer to work</p>
                    <div style={styles.optionsGrid}>
                        {employmentTypeOptions.map(type => {
                            const optionId = `employment-type-${type.replace(/\s+/g, '-').toLowerCase()}`;
                            return (
                                <label key={type} htmlFor={optionId} style={styles.optionCard}>
                                    <input id={optionId} name="employment_types" type="checkbox" checked={preferences.employment_types.includes(type)} onChange={() => handleMultiSelect('employment_types', type)} />
                                    <span>{type}</span>
                                </label>
                            );
                        })}
                    </div>
                    
                    <label htmlFor="remote-only" style={styles.toggleSwitch}>
                        <input id="remote-only" name="remote_only" type="checkbox" checked={preferences.remote_only} onChange={() => handleToggle('remote_only')} style={{ opacity: 0, width: 0, height: 0 }} />
                        <span style={{ ...styles.toggleSlider, ...(preferences.remote_only ? styles.toggleSliderActive : {}) }}>
                            <span style={styles.toggleSliderBefore}></span>
                        </span>
                        <span>Remote only (exclude on-site jobs)</span>
                    </label>
                    
                    {!preferences.remote_only && (
                        <div style={styles.formGroup}>
                            <label htmlFor="max-commute" style={styles.label}>Maximum commute distance (miles)</label>
                            <input id="max-commute" name="max_commute_distance" type="range" min="0" max="200" value={preferences.max_commute_distance} onChange={(e) => handleChange('max_commute_distance', parseInt(e.target.value))} style={styles.rangeSlider} />
                            <span style={styles.rangeValue}>{preferences.max_commute_distance} miles</span>
                        </div>
                    )}
                </div>
                
                {/* Location Preferences */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-map-marker-alt"></i> Location Preferences</h3>
                    <p style={styles.description}>Select preferred locations</p>
                    
                    <div style={styles.formGroup}>
                        <label htmlFor="location-input" style={styles.label}>Add a location</label>
                        <input id="location-input" name="location" type="text" placeholder="Add a location..." style={styles.input} onKeyPress={(e) => { if (e.key === 'Enter' && e.target.value) { handleAddLocation(e.target.value); e.target.value = ''; e.preventDefault(); } }} />
                    </div>
                    
                    <div style={styles.selectedItems}>
                        {preferences.locations.map(location => (
                            <span key={location} style={styles.selectedTag}>
                                {location}
                                <button type="button" onClick={() => handleRemoveLocation(location)} style={styles.removeTag}>×</button>
                            </span>
                        ))}
                    </div>
                    
                    <div>
                        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Popular locations:</p>
                        <div style={styles.popularButtons}>
                            {locationsList.slice(0, 8).map(location => (
                                <button key={location} type="button" onClick={() => handleAddLocation(location)} style={styles.popularBtn}>{location}</button>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Salary Preferences */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-dollar-sign"></i> Salary Expectations</h3>
                    <div style={styles.twoColumn}>
                        <div style={styles.formGroup}>
                            <label htmlFor="salary-min" style={styles.label}>Minimum Salary</label>
                            <input id="salary-min" name="salary_min" type="number" value={preferences.salary_min} onChange={(e) => handleChange('salary_min', e.target.value)} placeholder="30,000" style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label htmlFor="salary-max" style={styles.label}>Maximum Salary</label>
                            <input id="salary-max" name="salary_max" type="number" value={preferences.salary_max} onChange={(e) => handleChange('salary_max', e.target.value)} placeholder="100,000" style={styles.input} />
                        </div>
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="salary-currency" style={styles.label}>Currency</label>
                        <select id="salary-currency" name="salary_currency" value={preferences.salary_currency} onChange={(e) => handleChange('salary_currency', e.target.value)} style={styles.select}>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="CAD">CAD - Canadian Dollar</option>
                        </select>
                    </div>
                </div>
                
                {/* Experience Level */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-chart-line"></i> Experience Level</h3>
                    <div style={styles.experienceButtons}>
                        {experienceLevels.map(level => (
                            <button key={level} type="button" onClick={() => handleChange('experience_level', level)} style={styles.experienceBtn(preferences.experience_level === level)}>
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Industries */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-chart-pie"></i> Industries</h3>
                    <p style={styles.description}>Select industries you're interested in</p>
                    <div style={styles.industriesGrid}>
                        {industriesList.map(industry => {
                            const industryId = `industry-${industry.replace(/\s+/g, '-').toLowerCase()}`;
                            return (
                                <label key={industry} htmlFor={industryId} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f9fafb', borderRadius: '8px', cursor: 'pointer' }}>
                                    <input id={industryId} name="industries" type="checkbox" checked={preferences.industries.includes(industry)} onChange={() => handleMultiSelect('industries', industry)} />
                                    <span>{industry}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
                
                {/* Job Alerts */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-bell"></i> Job Alerts</h3>
                    <label htmlFor="job-alerts-enabled" style={styles.toggleSwitch}>
                        <input id="job-alerts-enabled" name="job_alerts_enabled" type="checkbox" checked={preferences.job_alerts_enabled} onChange={() => handleToggle('job_alerts_enabled')} style={{ opacity: 0, width: 0, height: 0 }} />
                        <span style={{ ...styles.toggleSlider, ...(preferences.job_alerts_enabled ? styles.toggleSliderActive : {}) }}>
                            <span style={styles.toggleSliderBefore}></span>
                        </span>
                        <span>Enable job alerts</span>
                    </label>
                    
                    {preferences.job_alerts_enabled && (
                        <>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Alert Frequency</label>
                                <div style={styles.frequencyButtons}>
                                    {alertFrequencies.map(freq => (
                                        <button key={freq.value} type="button" onClick={() => handleChange('alert_frequency', freq.value)} style={styles.frequencyBtn(preferences.alert_frequency === freq.value)}>
                                            <i className={`fas ${freq.icon}`}></i>
                                            <span>{freq.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div style={styles.formGroup}>
                                <label htmlFor="alert-email" style={styles.label}>Alert Email</label>
                                <input id="alert-email" name="alert_email" type="email" value={preferences.alert_email} onChange={(e) => handleChange('alert_email', e.target.value)} style={styles.input} />
                                <p style={styles.description}>We'll send job alerts to this email address</p>
                            </div>
                        </>
                    )}
                </div>
                
                {/* Additional Filters */}
                <div style={styles.section}>
                    <h3 style={styles.title}><i className="fas fa-sliders-h"></i> Additional Filters</h3>
                    
                    <div style={{ marginBottom: '16px' }}>
                        <label htmlFor="show-remote-jobs" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input id="show-remote-jobs" name="show_remote_jobs" type="checkbox" checked={preferences.show_remote_jobs} onChange={() => handleToggle('show_remote_jobs')} />
                            <span>Show remote jobs in recommendations</span>
                        </label>
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                        <label htmlFor="show-urgent-jobs" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input id="show-urgent-jobs" name="show_urgent_jobs" type="checkbox" checked={preferences.show_urgent_jobs} onChange={() => handleToggle('show_urgent_jobs')} />
                            <span>Highlight urgent/featured jobs</span>
                        </label>
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label htmlFor="minimum-match-score" style={styles.label}>Minimum match score for recommendations</label>
                        <input id="minimum-match-score" name="minimum_match_score" type="range" min="0" max="100" step="10" value={preferences.minimum_match_score} onChange={(e) => handleChange('minimum_match_score', parseInt(e.target.value))} style={styles.rangeSlider} />
                        <span style={styles.rangeValue}>{preferences.minimum_match_score}%</span>
                    </div>
                </div>
                
                {/* Form Actions */}
                <div style={styles.formActions}>
                    <button type="submit" disabled={saving} style={styles.saveBtn}>
                        {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} Save Preferences
                    </button>
                    <button type="button" onClick={loadPreferences} style={styles.resetBtn}>
                        <i className="fas fa-undo-alt"></i> Reset
                    </button>
                </div>
            </form>
        </div>
    );
}