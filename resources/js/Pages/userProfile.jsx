import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import '../../css/userProfile.css';

export default function EditProfile({ user }) {
    const { data, setData, patch, processing, errors, clearErrors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        position: '',
        company: '',
        education: '',
        bio: '',
        city: '',
        address: '',
        country: '',
        linkedin_url: '',
        github_url: '',
        portfolio_url: '',
        employment_type: '',
        start_date: '',
        availability_status: '',
    });

    // Skills states
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [skillLevel, setSkillLevel] = useState('intermediate');

    // ADD THIS - Avatar preview state
    const [avatarPreview, setAvatarPreview] = useState(null);

    // Populate form with current values on mount
    useEffect(() => {
        if (user) {
            setData({
                first_name: user.name ? user.name.split(' ')[0] || '' : '',
                last_name: user.name ? user.name.split(' ').slice(1).join(' ') || '' : '',
                email: user.email || '',
                phone: user.profile?.phone || '',
                position: user.profile?.position || '',
                company: user.profile?.company || '',
                education: user.profile?.education || '',
                bio: user.profile?.bio || '',
                city: user.profile?.city || '',
                address: user.profile?.address || '',
                country: user.profile?.country || '',
                linkedin_url: user.profile?.linkedin_url || '',
                github_url: user.profile?.github_url || '',
                portfolio_url: user.profile?.portfolio_url || '',
                employment_type: user.profile?.employment_type || '',
                start_date: user.profile?.start_date || '',
                availability_status: user.profile?.availability_status || '',
            });
        }

        // Load skills
        if (user?.skills) {
            setSkills(user.skills);
        }
    }, [user]);

    const [uploading, setUploading] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        clearErrors();

        console.log('Start Date value:', data.start_date);
        console.log('Employment Type:', data.employment_type);
        console.log('Availability Status:', data.availability_status);

        patch(route('profile.updateExtended'), {
            preserveScroll: true,
            onSuccess: () => {
                if (typeof alertify !== 'undefined') {
                    alertify.success('Profile updated successfully!');
                }
                router.reload();
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                if (typeof alertify !== 'undefined') {
                    alertify.error('Please check the form for errors.');
                }
            }
        });
    };

    // ========== SKILLS FUNCTIONS ==========
    const handleAddSkill = async () => {
        if (!newSkill.trim()) return;

        try {
            await router.post(route('profile.skills.add'), {
                name: newSkill,
                proficiency_level: skillLevel,
            }, {
                preserveState: true,
                onSuccess: () => {
                    setNewSkill('');
                    setSkillLevel('intermediate');
                    alertify.success('Skill added!');
                    router.reload();
                },
                onError: (errors) => {
                    console.error('Error:', errors);
                    alertify.error(errors.message || 'Failed to add skill');
                }
            });
        } catch (error) {
            console.error('Error adding skill:', error);
            alertify.error('Network error. Please try again.');
        }
    };

    const handleDeleteSkill = async (skillId) => {
        try {
            await router.delete(route('profile.skills.remove', { skillId: skillId }), {
                preserveState: true,
                onSuccess: () => {
                    alertify.success('Skill removed');
                    router.reload();
                },
                onError: (errors) => {
                    console.error('Error:', errors);
                    alertify.error('Failed to remove skill');
                }
            });
        } catch (error) {
            console.error('Error deleting skill:', error);
            alertify.error('Network error. Please try again.');
        }
    };

    // UPDATED: uploadAvatar function with HEIC validation
    const uploadAvatar = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // HEIC and file validation
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        
        // Check for HEIC files
        if (file.type === 'image/heic' || fileExtension === 'heic') {
            if (typeof alertify !== 'undefined') {
                alertify.error('❌ HEIC files are not supported. Please convert your image to JPG, PNG, or GIF format before uploading.');
            }
            e.target.value = '';
            return;
        }
        
        // Check allowed types
        if (!allowedTypes.includes(file.type)) {
            if (typeof alertify !== 'undefined') {
                alertify.error('❌ Only JPG, PNG, GIF, and WEBP images are allowed.');
            }
            e.target.value = '';
            return;
        }
        
        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            if (typeof alertify !== 'undefined') {
                alertify.error('❌ Image size must be less than 2MB.');
            }
            e.target.value = '';
            return;
        }

        // Create preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(file);

        setUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        try {
            await router.post(route('profile.avatar.upload'), formData, {
                headers: {
                    'X-CSRF-TOKEN': token,
                },
                forceFormData: true,
                preserveState: true,
                onSuccess: () => {
                    if (typeof alertify !== 'undefined') {
                        alertify.success('✅ Avatar uploaded successfully!');
                    }
                    setAvatarPreview(null);
                    router.reload();
                },
                onError: (errors) => {
                    console.error('Upload error:', errors);
                    setAvatarPreview(null);
                    if (typeof alertify !== 'undefined') {
                        alertify.error('❌ Failed to upload image. Please use JPG, PNG, or GIF format.');
                    }
                }
            });
        } catch (error) {
            console.error('Upload failed', error);
            setAvatarPreview(null);
            if (typeof alertify !== 'undefined') {
                alertify.error('❌ Upload failed. Please try again.');
            }
        } finally {
            setUploading(false);
        }
    };

    const removeAvatar = async () => {
        if (!confirm('Remove profile picture?')) return;

        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        try {
            await router.delete(route('profile.avatar.remove'), {
                headers: {
                    'X-CSRF-TOKEN': token,
                },
                preserveState: true,
                onSuccess: () => {
                    if (typeof alertify !== 'undefined') {
                        alertify.success('Avatar removed');
                    }
                    router.reload();
                },
                onError: (errors) => {
                    console.error('Remove error:', errors);
                    if (typeof alertify !== 'undefined') {
                        alertify.error('Failed to remove image');
                    }
                }
            });
        } catch (error) {
            console.error('Remove failed', error);
        }
    };

    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'JD';
    const hasAvatar = user?.profile?.avatar_url || user?.profile?.avatar;

    // UPDATED: getAvatarUrl to handle preview first
    const getAvatarUrl = () => {
        // If we have a preview, use it first
        if (avatarPreview) return avatarPreview;
        
        const avatarUrl = user?.profile?.avatar_url || user?.profile?.avatar;
        
        // Check if it's a HEIC file and return null (will trigger initials fallback)
        if (avatarUrl && typeof avatarUrl === 'string' && avatarUrl.toLowerCase().includes('.heic')) {
            return null;
        }
        
        if (!avatarUrl) {
            return null;
        }
        if (typeof avatarUrl === 'string' && (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://') || avatarUrl.startsWith('data:image'))) {
            return avatarUrl;
        }
        const cleanPath = String(avatarUrl).replace(/^\/+/, '');
        return cleanPath.startsWith('storage/') ? `/${cleanPath}` : `/storage/${cleanPath}`;
    };

    const handleChange = (e, field) => {
        setData(field, e.target.value);
    };

    return (
        <>
            <Head title="Edit Profile" />
            <div className="profile-edit-container">
                <div className="profile-edit-card">
                    {/* Header */}
                    <div className="profile-edit-header">
                        <Link href="/dashboard" className="back-to-dashboard">
                            <i className="fas fa-arrow-left"></i> Back to Dashboard
                        </Link>
                        <h1>Edit Profile</h1>
                        <p>Update your personal and professional details</p>
                    </div>

                    {/* Avatar Section - UPDATED with preview */}
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-wrapper">
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="Profile Preview"
                                    className="profile-avatar-img"
                                />
                            ) : (hasAvatar && getAvatarUrl()) ? (
                                <img
                                    src={getAvatarUrl()}    
                                    alt="Profile"
                                    className="profile-avatar-img"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        const parent = e.target.parentElement;
                                        if (parent && !parent.querySelector('.avatar-fallback-initials')) {
                                            const initialsDiv = document.createElement('div');
                                            initialsDiv.className = 'profile-avatar-initials avatar-fallback-initials';
                                            initialsDiv.textContent = initials;
                                            parent.appendChild(initialsDiv);
                                        }
                                    }}
                                />
                            ) : (
                                <div className="profile-avatar-initials">
                                    {initials}
                                </div>
                            )}
                            <div className="profile-verified-badge">
                                <i className="fas fa-check-circle"></i>
                            </div>
                        </div>
                        <div className="profile-avatar-actions">
                            <label htmlFor="avatar-upload" className="btn-avatar-upload">
                                <i className="fas fa-camera"></i>
                                <span>Change Photo</span>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    onChange={uploadAvatar}
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    className="hidden-input"
                                    disabled={uploading}
                                />
                            </label>
                            {hasAvatar && (
                                <button onClick={removeAvatar} className="btn-avatar-remove" disabled={uploading}>
                                    <i className="fas fa-trash"></i>
                                    <span>Remove</span>
                                </button>
                            )}
                        </div>
                        <div className="profile-info-text">
                            <h3>{user?.name || 'User'}</h3>
                        </div>
                    </div>

                    <form onSubmit={submit} className="profile-edit-form">
                        {/* Personal Information Section */}
                        <div className="form-section">
                            <div className="form-section-title">
                                <i className="fas fa-user-circle"></i>
                                <span>Personal Information</span>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="first_name">First Name</label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        value={data.first_name}
                                        onChange={(e) => handleChange(e, 'first_name')}
                                        className="form-input"
                                        placeholder="Enter your first name"
                                    />
                                    <InputError message={errors.first_name} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="last_name">Last Name</label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        value={data.last_name}
                                        onChange={(e) => handleChange(e, 'last_name')}
                                        className="form-input"
                                        placeholder="Enter your last name"
                                    />
                                    <InputError message={errors.last_name} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => handleChange(e, 'email')}
                                        className="form-input"
                                        placeholder="your@email.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => handleChange(e, 'phone')}
                                        className="form-input"
                                        placeholder="+1 234 567 8900"
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                            </div>
                        </div>

                        {/* Professional Details Section */}
                        <div className="form-section">
                            <div className="form-section-title">
                                <i className="fas fa-briefcase"></i>
                                <span>Professional Details</span>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="position">Job Title / Position</label>
                                    <input
                                        type="text"
                                        id="position"
                                        value={data.position}
                                        onChange={(e) => handleChange(e, 'position')}
                                        className="form-input"
                                        placeholder="e.g. Frontend Developer"
                                    />
                                    <InputError message={errors.position} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="company">Company</label>
                                    <input
                                        type="text"
                                        id="company"
                                        value={data.company}
                                        onChange={(e) => handleChange(e, 'company')}
                                        className="form-input"
                                        placeholder="e.g. Google, Microsoft"
                                    />
                                    <InputError message={errors.company} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="employment_type">Employment Type</label>
                                    <select
                                        id="employment_type"
                                        value={data.employment_type}
                                        onChange={(e) => handleChange(e, 'employment_type')}
                                        className="form-select"
                                    >
                                        <option value="">Select employment type</option>
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Freelance">Freelance</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                    <InputError message={errors.employment_type} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="availability_status">Availability Status</label>
                                    <select
                                        id="availability_status"
                                        value={data.availability_status}
                                        onChange={(e) => handleChange(e, 'availability_status')}
                                        className="form-select"
                                    >
                                        <option value="">Select availability</option>
                                        <option value="Open to work">Open to work</option>
                                        <option value="Actively looking">Actively looking</option>
                                        <option value="Not looking">Not looking</option>
                                        <option value="Available immediately">Available immediately</option>
                                    </select>
                                    <InputError message={errors.availability_status} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label htmlFor="bio">Professional Bio</label>
                                    <textarea
                                        id="bio"
                                        value={data.bio}
                                        onChange={(e) => handleChange(e, 'bio')}
                                        className="form-textarea"
                                        rows="4"
                                        placeholder="Tell us about yourself, your experience, and what you're looking for..."
                                    />
                                    <InputError message={errors.bio} />
                                </div>
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className="form-section">
                            <div className="form-section-title">
                                <i className="fas fa-code"></i>
                                <span>Skills</span>
                            </div>

                            {/* Skills List */}
                            <div className="skills-container">
                                {skills.map(skill => (
                                    <div key={skill.id} className="skill-tag">
                                        <span>{skill.name}</span>
                                        <button type="button" onClick={() => handleDeleteSkill(skill.id)}>
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Skill Form */}
                            <div className="add-skill-form">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter a skill (e.g. React, Python, Project Management)"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                                />
                                <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} className="form-select">
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                    <option value="expert">Expert</option>
                                </select>
                                <button type="button" onClick={handleAddSkill} className="btn-add-skill">
                                    <i className="fas fa-plus"></i> Add
                                </button>
                            </div>
                        </div>

                        {/* Education Section */}
                        <div className="form-section">
                            <div className="form-section-title">
                                <i className="fas fa-graduation-cap"></i>
                                <span>Education</span>
                            </div>

                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label htmlFor="education">Highest Education</label>
                                    <input
                                        type="text"
                                        id="education"
                                        value={data.education}
                                        onChange={(e) => handleChange(e, 'education')}
                                        className="form-input"
                                        placeholder="e.g. B.Sc Computer Science, MBA, PhD"
                                    />
                                    <InputError message={errors.education} />
                                </div>
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="form-section">
                            <div className="form-section-title">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>Location</span>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">City</label>
                                    <input
                                        type="text"
                                        id="city"
                                        value={data.city}
                                        onChange={(e) => handleChange(e, 'city')}
                                        className="form-input"
                                        placeholder="e.g. New York"
                                    />
                                    <InputError message={errors.city} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="country">Country</label>
                                    <input
                                        type="text"
                                        id="country"
                                        value={data.country}
                                        onChange={(e) => handleChange(e, 'country')}
                                        className="form-input"
                                        placeholder="e.g. United States"
                                    />
                                    <InputError message={errors.country} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label htmlFor="address">Street Address</label>
                                    <input
                                        type="text"
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => handleChange(e, 'address')}
                                        className="form-input"
                                        placeholder="Street address, P.O. Box"
                                    />
                                    <InputError message={errors.address} />
                                </div>
                            </div>
                        </div>

                        {/* Social Links Section */}
                        <div className="form-section">
                            <div className="form-section-title">
                                <i className="fas fa-link"></i>
                                <span>Social & Professional Links</span>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="linkedin_url">LinkedIn Profile</label>
                                    <input
                                        type="url"
                                        id="linkedin_url"
                                        value={data.linkedin_url}
                                        onChange={(e) => handleChange(e, 'linkedin_url')}
                                        className="form-input"
                                        placeholder="https://linkedin.com/in/username"
                                    />
                                    <InputError message={errors.linkedin_url} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="github_url">GitHub Profile</label>
                                    <input
                                        type="url"
                                        id="github_url"
                                        value={data.github_url}
                                        onChange={(e) => handleChange(e, 'github_url')}
                                        className="form-input"
                                        placeholder="https://github.com/username"
                                    />
                                    <InputError message={errors.github_url} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label htmlFor="portfolio_url">Portfolio / Website</label>
                                    <input
                                        type="url"
                                        id="portfolio_url"
                                        value={data.portfolio_url}
                                        onChange={(e) => handleChange(e, 'portfolio_url')}
                                        className="form-input"
                                        placeholder="https://yourportfolio.com"
                                    />
                                    <InputError message={errors.portfolio_url} />
                                </div>
                            </div>
                        </div>

                        {/* Start Date Preference */}
                        <div className="form-section">
                            <div className="form-section-title">
                                <i className="fas fa-calendar-alt"></i>
                                <span>Start Date Preference</span>
                            </div>

                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label htmlFor="start_date">When can you start?</label>
                                    <select
                                        id="start_date"
                                        value={data.start_date}
                                        onChange={(e) => handleChange(e, 'start_date')}
                                        className="form-select"
                                    >
                                        <option value="">Select start preference</option>
                                        <option value="Immediately">Immediately</option>
                                        <option value="Within 2 weeks">Within 2 weeks</option>
                                        <option value="Within 1 month">Within 1 month</option>
                                        <option value="Negotiable">Negotiable</option>
                                    </select>
                                    <InputError message={errors.start_date} />
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={() => window.history.back()}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-submit" disabled={processing}>
                                {processing ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i> Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save"></i> Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}