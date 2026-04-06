import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import '../../css/userProfile.css';

export default function EditProfile({ user }) {
    const { data, setData, patch, processing, errors, clearErrors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        position: '',
        education: '',
        bio: '',
        city: '',
        address: '',
        country: '',
        linkedin_url: '',
        github_url: '',
        portfolio_url: '',
    });

    // Populate form with current values on mount
    useEffect(() => {
        if (user) {
            setData({
                first_name: user.name ? user.name.split(' ')[0] || '' : '',
                last_name: user.name ? user.name.split(' ').slice(1).join(' ') || '' : '',
                email: user.email || '',
                phone: user.profile?.phone || '',
                position: user.profile?.position || '',
                education: user.profile?.education || '',
                bio: user.profile?.bio || '',
                city: user.profile?.city || '',
                address: user.profile?.address || '',
                country: user.profile?.country || '',
                linkedin_url: user.profile?.linkedin_url || '',
                github_url: user.profile?.github_url || '',
                portfolio_url: user.profile?.portfolio_url || '',
            });
        }
    }, [user, setData]);

    // Track changes with debug
    useEffect(() => {
        const hasAnyChanges = Object.keys(data).some(
            key => data[key] !== initialData.current[key]
        );
        console.log('Checking changes...');
        console.log('Has changes:', hasAnyChanges);
        setHasChanges(hasAnyChanges);
    }, [data]);

    const submit = (e) => {
        e.preventDefault();
        
        console.log('Submit button clicked!');
        console.log('isSubmitting:', isSubmitting);
        console.log('hasChanges:', hasChanges);
        console.log('processing:', processing);
        
        if (isSubmitting) return;
        
        // Find only the fields that have changed
        const changedFields = {};
        Object.keys(data).forEach(key => {
            if (data[key] !== initialData.current[key]) {
                changedFields[key] = data[key];
            }
        });
        
        console.log('Changed fields:', changedFields);
        
        // Check if there are any changes
        if (Object.keys(changedFields).length === 0) {
            alertify.message('No changes to update');
            return;
        }
        
        clearErrors();
        setIsSubmitting(true);
        
        // Send only the changed fields to the extended profile endpoint
        patch(route('profile.updateExtended'), changedFields, {
            preserveState: false,
            preserveScroll: true,
            onSuccess: (response) => {
                console.log('Success response:', response);
                alertify.success('Profile updated successfully!');
                sessionStorage.setItem('profileUpdated', 'true');
                sessionStorage.setItem('profileUpdateTime', Date.now().toString());
                router.visit('/dashboard');
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                alertify.error('Please check the form for errors.');
            }
        });

    };

    // Reset form function
    const resetForm = () => {
        setData(initialData.current);
        setPreviewImage(profile?.profile_image_base64 || profile?.avatar_url || null);
        alertify.message('Changes discarded');
        setHasChanges(false);
    };

    // Handle image upload with base64 conversion
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alertify.error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alertify.error('Image size should be less than 5MB');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const base64 = await convertToBase64(file);
            setData('profile_image', base64);
            setPreviewImage(base64);
            alertify.success('Image ready. Click Save Changes to apply.');
        } catch (error) {
            console.error('Upload failed', error);
        } finally {
            setUploading(false);
        }
    };

    const removeAvatar = async () => {
        if (!confirm('Remove profile picture?')) return;
        setData('profile_image', '');
        setPreviewImage(null);
        alertify.message('Image will be removed when you save changes');
    };

    // Function to get profile image URL with proper fallback
    const getProfileImageUrl = () => {
        if (previewImage) {
            return previewImage;
        }
        if (profile?.profile_image_base64) {
            return profile.profile_image_base64;
        }
        if (profile?.avatar_url) {
            return profile.avatar_url;
        }
        if (profile?.avatar) {
            const avatarPath = profile.avatar;
            if (avatarPath.startsWith('/storage/')) {
                return avatarPath;
            }
            return `/storage/${avatarPath}`;
        }
        if (user?.profile?.avatar_url) {
            return user.profile.avatar_url;
        }
        const userName = user?.name || 'User';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=150&bold=true`;
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Profile</h2>}>
            <Head title="Edit Profile" />
            <div className="profile-edit-page">
                {/* Back to Dashboard Button */}
                <div className="back-to-dashboard">
                    <Link href="/dashboard" className="back-btn">
                        <i className="fas fa-arrow-left"></i> Back to Dashboard
                    </Link>
                </div>
                
                <div className="py-12">
                    <div className="container">
                        <div className="card">
                            <div className="card-header">
                                <h1 className="card-title">Edit Profile</h1>
                                <p className="card-subtitle">Update your personal and professional details</p>
                            </div>

                            <div className="profile-section">
                                <div className="profile-left">
                                    <div className="profile-image-wrapper">
                                        <img 
                                            src={getProfileImageUrl()} 
                                            alt={user?.name || 'Profile'} 
                                            className="profile-image"
                                            onError={(e) => {
                                                const userName = user?.name || 'User';
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=150&bold=true`;
                                            }}
                                        />
                                        <div className="verified-overlay">
                                            <i className="fa-solid fa-check-circle"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="profile-right">
                                    <div className="profile-info">
                                        <div className="profile-name">{user?.name || 'User'}</div>
                                        <div className="profile-experience">
                                            {data.title || 'Add your title'} at {data.company || 'Add company'}
                                        </div>
                                    </div>
                                    <div className="profile-actions">
                                        <label htmlFor="avatar-upload" className="btn-upload">
                                            <i className="fa-solid fa-camera"></i> 
                                            {uploading ? 'Processing...' : 'Change Photo'}
                                            <input 
                                                id="avatar-upload"
                                                type="file" 
                                                onChange={handleImageUpload}
                                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                                className="hidden"
                                                disabled={uploading || isSubmitting}
                                            />
                                        </label>
                                        {(previewImage || profile?.avatar || profile?.profile_image_base64) && (
                                            <button 
                                                type="button"
                                                onClick={removeAvatar} 
                                                className="btn-remove" 
                                                disabled={uploading || isSubmitting}
                                            >
                                                <i className="fa-solid fa-trash"></i> Remove
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Max size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={submit}>
                                <div className="section-title">
                                    <i className="fas fa-user-circle"></i>
                                    Personal Information
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="first_name">First Name</label>
                                        <TextInput
                                            id="first_name"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            className="mt-1 block w-full"
                                            disabled={isSubmitting}
                                        />
                                        <InputError message={errors.first_name} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="last_name">Last Name</label>
                                        <TextInput
                                            id="last_name"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            className="mt-1 block w-full"
                                            disabled={isSubmitting}
                                        />
                                        <InputError message={errors.last_name} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group full-width">
                                        <label htmlFor="email">Email</label>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1 block w-full"
                                            disabled={isSubmitting}
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone</label>
                                        <TextInput
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="mt-1 block w-full"
                                            disabled={isSubmitting}
                                        />
                                        <InputError message={errors.phone} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="employment_type">Employment Type</label>
                                        <select
                                            id="employment_type"
                                            value={data.employment_type}
                                            onChange={(e) => setData('employment_type', e.target.value)}
                                            className="mt-1 block w-full"
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Select employment type</option>
                                            {employmentTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.employment_type} />
                                    </div>
                                </div>

                                <div className="section-title">
                                    <i className="fas fa-briefcase"></i>
                                    Professional Details
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="title">Job Title</label>
                                        <TextInput
                                            id="title"
                                            placeholder="e.g. Senior Frontend Developer"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="mt-1 block w-full"
                                            disabled={isSubmitting}
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="company">Company</label>
                                        <TextInput
                                            id="company"
                                            placeholder="e.g. Tech Company Inc."
                                            value={data.company}
                                            onChange={(e) => setData('company', e.target.value)}
                                            className="mt-1 block w-full"
                                            disabled={isSubmitting}
                                        />
                                        <InputError message={errors.company} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="start_date">Start Date</label>
                                        <TextInput
                                            id="start_date"
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="mt-1 block w-full"
                                            disabled={isSubmitting}
                                        />
                                        <InputError message={errors.start_date} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="education">Education</label>
                                        <TextInput
                                            id="education"
                                            placeholder="e.g. B.Sc Computer Science"
                                            value={data.education}
                                            onChange={(e) => setData('education', e.target.value)}
                                            className="mt-1 block w-full"
                                            disabled={isSubmitting}
                                        />
                                        <InputError message={errors.education} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group full-width">
                                        <label htmlFor="bio">Bio</label>
                                        <textarea
                                            id="bio"
                                            placeholder="Tell us about yourself, your experience, and what you're looking for..."
                                            value={data.bio}
                                            onChange={(e) => setData('bio', e.target.value)}
                                            className="mt-1 block w-full"
                                            rows="4"
                                            disabled={isSubmitting}
                                        />
                                        <InputError message={errors.bio} />
                                    </div>
                                </div>

                                <div className="section-title">
                                    <i className="fas fa-map-marker-alt"></i>
                                    Location
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="city">City</label>
                                        <TextInput
                                            id="city"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            className="mt-1 block w-full"
                                            disabled={isSubmitting}
                                        />
                                        <InputError message={errors.city} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="country">Country</label>
                                        <TextInput
                                            id="country"
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                            className="mt-1 block w-full"
                                            disabled={isSubmitting}
                                        />
                                        <InputError message={errors.country} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group full-width">
                                        <label htmlFor="address">Address</label>
                                        <TextInput
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="mt-1 block w-full"
                                            disabled={isSubmitting}
                                        />
                                        <InputError message={errors.address} />
                                    </div>
                                </div>

                                <div className="section-title">
                                    <i className="fas fa-link"></i>
                                    Social Links
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="linkedin_url">LinkedIn</label>
                                        <TextInput
                                            id="linkedin_url"
                                            value={data.linkedin_url}
                                            onChange={(e) => setData('linkedin_url', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="https://linkedin.com/in/username"
                                            disabled={isSubmitting}
                                        />
                                        <InputError message={errors.linkedin_url} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="github_url">GitHub</label>
                                        <TextInput
                                            id="github_url"
                                            value={data.github_url}
                                            onChange={(e) => setData('github_url', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="https://github.com/username"
                                            disabled={isSubmitting}
                                        />
                                        <InputError message={errors.github_url} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group full-width">
                                        <label htmlFor="portfolio_url">Portfolio</label>
                                        <TextInput
                                            id="portfolio_url"
                                            value={data.portfolio_url}
                                            onChange={(e) => setData('portfolio_url', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="https://yourportfolio.com"
                                            disabled={isSubmitting}
                                        />
                                        <InputError message={errors.portfolio_url} />
                                    </div>
                                </div>

                                <div className="card-actions">
                                    <button 
                                        type="button" 
                                        className="btn-secondary" 
                                        onClick={resetForm}
                                        disabled={!hasChanges || processing || isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn-primary"
                                        disabled={isSubmitting}
                                        style={{
                                            padding: '12px 24px',
                                            background: '#4F46E5',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="profile-section">
                            <div className="profile-left">
                                <div className="profile-image-wrapper">
                                    {user.profile?.avatar_url ? (
                                        <img 
                                            src={user.profile.avatar_url} 
                                            alt="Profile" 
                                            className="profile-image"
                                        />
                                    ) : (
                                        <div className="profile-initials">
                                            {initials}
                                        </div>
                                    )}
                                    <div className="verified-overlay">
                                        <i className="fa-solid fa-check-circle"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="profile-right">
                                <div className="profile-info">
                                    <div className="profile-name">{user.name}</div>
                                    <div className="profile-experience">
                                        {recentExperience.company} - {recentExperience.job_title}
                                    </div>
                                </div>
                                <div className="profile-actions">
                                    <label htmlFor="avatar-upload" className="btn-upload">
                                        <i className="fa-solid fa-camera"></i> Change Photo
                                        <input 
                                            id="avatar-upload"
                                            type="file" 
                                            onChange={uploadAvatar}
                                            accept="image/*"
                                            className="hidden"
                                            disabled={uploading}
                                        />
                                    </label>
                                    {user.profile?.avatar && (
                                        <button onClick={removeAvatar} className="btn-remove" disabled={uploading}>
                                            <i className="fa-solid fa-trash"></i> Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={submit}>
<div className="section-title">
    <i className="fas fa-user-circle text-teal-500 mr-2"></i>
    Personal Information
</div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="first_name">First Name</label>
                                    <TextInput
                                        id="first_name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.first_name} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="last_name">Last Name</label>
                                    <TextInput
                                        id="last_name"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.last_name} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label htmlFor="email">Email</label>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label htmlFor="phone">Phone</label>
                                    <TextInput
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                            </div>

<div className="section-title">
    <i className="fas fa-briefcase text-blue-500 mr-2"></i>
    Professional Details
</div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="position">Position</label>
                                    <TextInput
                                        id="position"
                                        placeholder="e.g. Frontend Developer"
                                        value={data.position}
                                        onChange={(e) => setData('position', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.position} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="education">Education</label>
                                    <TextInput
                                        id="education"
                                        placeholder="e.g. B.Sc Computer Science"
                                        value={data.education}
                                        onChange={(e) => setData('education', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.education} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label htmlFor="bio">Bio</label>
                                    <textarea
                                        id="bio"
                                        placeholder="Tell us about yourself..."
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows="4"
                                    />
                                    <InputError message={errors.bio} />
                                </div>
                            </div>

<div className="section-title">
    <i className="fas fa-map-marker-alt text-orange-500 mr-2"></i>
    Location
</div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">City</label>
                                    <TextInput
                                        id="city"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        className="mt-1 block w-full"
                                    />

                                    <InputError message={errors.city} />

                                </div>

                                <div className="form-group">
                                    <label htmlFor="country">Country</label>
                                    <TextInput
                                        id="country"
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.country} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label htmlFor="address">Address</label>
                                    <TextInput
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.address} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="linkedin_url">LinkedIn</label>
                                    <TextInput
                                        id="linkedin_url"
                                        value={data.linkedin_url}
                                        onChange={(e) => setData('linkedin_url', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.linkedin_url} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="github_url">GitHub</label>
                                    <TextInput
                                        id="github_url"
                                        value={data.github_url}
                                        onChange={(e) => setData('github_url', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.github_url} />
                                </div>
                            </div>

                            <div className="card-actions">
                                <button type="button" className="btn-secondary" onClick={() => window.history.back()}>
                                    Cancel
                                </button>
                                <PrimaryButton className="btn-primary" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </PrimaryButton>
                                {user && (
                                    <a href="/dashboard" className="btn-secondary">
                                        View Dashboard →
                                    </a>
                                )}

                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

