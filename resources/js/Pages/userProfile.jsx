import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import '../../css/userProfile.css';

export default function EditProfile({ user, profile }) {
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
        title: '',
        company: '',
        employment_type: '',
        start_date: '',
        profile_image: '', // This will store base64 image
    });

    // State variables
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const initialData = useRef({});

    // Employment types for dropdown
    const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship', 'Freelance'];

    // Populate form with current values on mount
    useEffect(() => {
        if (user) {
            // Get profile data from either profile or user.profile
            const userProfile = profile || user.profile || {};
            
            const formData = {
                first_name: user.name ? user.name.split(' ')[0] || '' : '',
                last_name: user.name ? user.name.split(' ').slice(1).join(' ') || '' : '',
                email: user.email || '',
                phone: userProfile.phone || user.phone || '',
                position: userProfile.position || '',
                education: userProfile.education || '',
                bio: userProfile.bio || '',
                city: userProfile.city || '',
                address: userProfile.address || '',
                country: userProfile.country || '',
                linkedin_url: userProfile.linkedin_url || '',
                github_url: userProfile.github_url || '',
                portfolio_url: userProfile.portfolio_url || '',
                title: userProfile.title || userProfile.position || '',
                company: userProfile.company || '',
                employment_type: userProfile.employment_type || '',
                start_date: userProfile.start_date || '',
                profile_image: '',
            };
            setData(formData);
            initialData.current = { ...formData };
            
            // Set preview image from existing avatar (check for base64 first)
            if (userProfile.profile_image_base64) {
                setPreviewImage(userProfile.profile_image_base64);
            } else if (userProfile.avatar_url) {
                setPreviewImage(userProfile.avatar_url);
            } else if (userProfile.avatar) {
                if (userProfile.avatar.startsWith('data:image')) {
                    setPreviewImage(userProfile.avatar);
                } else if (userProfile.avatar.startsWith('/storage/')) {
                    setPreviewImage(userProfile.avatar);
                } else {
                    setPreviewImage(`/storage/${userProfile.avatar}`);
                }
            } else if (user.avatar) {
                if (user.avatar.startsWith('data:image')) {
                    setPreviewImage(user.avatar);
                } else {
                    setPreviewImage(user.avatar);
                }
            }
        }
    }, [user, profile, setData]);

    // Track changes
    useEffect(() => {
        const hasAnyChanges = Object.keys(data).some(
            key => data[key] !== initialData.current[key]
        );
        setHasChanges(hasAnyChanges);
    }, [data]);

    // Convert file to base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const submit = (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        // Find only the fields that have changed
        const changedFields = {};
        Object.keys(data).forEach(key => {
            if (data[key] !== initialData.current[key] && data[key] !== '') {
                changedFields[key] = data[key];
            }
        });
        
        // Always include profile_image if it was changed
        if (data.profile_image !== initialData.current.profile_image && data.profile_image !== '') {
            changedFields.profile_image = data.profile_image;
        }
        
        // Check if there are any changes
        if (Object.keys(changedFields).length === 0) {
            if (window.alertify) {
                alertify.message('No changes to update');
            } else {
                alert('No changes to update');
            }
            return;
        }
        
        clearErrors();
        setIsSubmitting(true);
        
        // Show loading message
        if (window.alertify) {
            alertify.message('Saving your changes...');
        }
        
        // Use PATCH method
        patch(route('profile.updateExtended'), changedFields, {
            preserveState: false,
            preserveScroll: true,
            onSuccess: (response) => {
                if (window.alertify) {
                    alertify.success('Profile updated successfully!');
                }
                sessionStorage.setItem('profileUpdated', 'true');
                sessionStorage.setItem('profileUpdateTime', Date.now().toString());
                
                // FORCE FULL PAGE RELOAD - This ensures navbar and dashboard get fresh data
                window.location.href = '/dashboard';
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                if (window.alertify) {
                    alertify.error('Please check the form for errors.');
                }
                setIsSubmitting(false);
            }
        });
    };

    // Reset form function
    const resetForm = () => {
        setData(initialData.current);
        const userProfile = profile || user?.profile || {};
        if (userProfile.profile_image_base64) {
            setPreviewImage(userProfile.profile_image_base64);
        } else if (userProfile.avatar_url) {
            setPreviewImage(userProfile.avatar_url);
        } else {
            setPreviewImage(null);
        }
        if (window.alertify) {
            alertify.message('Changes discarded');
        }
        setHasChanges(false);
    };

    // Handle image upload with base64 conversion
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            if (window.alertify) {
                alertify.error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
            }
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            if (window.alertify) {
                alertify.error('Image size should be less than 5MB');
            }
            return;
        }

        setUploading(true);
        try {
            const base64 = await convertToBase64(file);
            setData('profile_image', base64);
            setPreviewImage(base64);
            if (window.alertify) {
                alertify.success('Image ready. Click Save Changes to apply.');
            }
        } catch (error) {
            console.error('Upload failed', error);
            if (window.alertify) {
                alertify.error('Failed to process image');
            }
        } finally {
            setUploading(false);
        }
    };

    const removeAvatar = () => {
        if (window.confirm('Remove profile picture?')) {
            setData('profile_image', '');
            setPreviewImage(null);
            if (window.alertify) {
                alertify.message('Image will be removed when you save changes');
            }
        }
    };

    // Function to get profile image URL with proper fallback
    const getProfileImageUrl = () => {
        if (previewImage) {
            return previewImage;
        }
        const userProfile = profile || user?.profile || {};
        if (userProfile.profile_image_base64) {
            return userProfile.profile_image_base64;
        }
        if (userProfile.avatar_url) {
            return userProfile.avatar_url;
        }
        if (userProfile.avatar) {
            const avatarPath = userProfile.avatar;
            if (avatarPath.startsWith('data:image')) {
                return avatarPath;
            }
            if (avatarPath.startsWith('/storage/')) {
                return avatarPath;
            }
            return `/storage/${avatarPath}`;
        }
        if (user?.avatar) {
            if (user.avatar.startsWith('data:image')) {
                return user.avatar;
            }
            return user.avatar;
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

                            {/* Profile Image Section */}
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
                                            {data.title || data.position || 'Add your title'} at {data.company || 'Add company'}
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
                                {/* Personal Information */}
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
                                        <label htmlFor="phone">Phone Number</label>
                                        <TextInput
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="e.g. 08012345678"
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
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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

                                {/* Professional Details */}
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
                                        <label htmlFor="company">Company Name</label>
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
                                        <label htmlFor="position">Position/Title (Alternative)</label>
                                        <TextInput
                                            id="position"
                                            placeholder="e.g. Frontend Developer"
                                            value={data.position}
                                            onChange={(e) => setData('position', e.target.value)}
                                            className="mt-1 block w-full"
                                            disabled={isSubmitting}
                                        />
                                        <InputError message={errors.position} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group full-width">
                                        <label htmlFor="education">Education</label>
                                        <TextInput
                                            id="education"
                                            placeholder="e.g. B.Sc Computer Science, MIT"
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
                                        <label htmlFor="bio">Professional Bio</label>
                                        <textarea
                                            id="bio"
                                            placeholder="Tell us about yourself, your experience, and what you're looking for..."
                                            value={data.bio}
                                            onChange={(e) => setData('bio', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            rows="4"
                                            disabled={isSubmitting}
                                        />
                                        <InputError message={errors.bio} />
                                    </div>
                                </div>

                                {/* Location */}
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
                                            placeholder="e.g. Lagos, Abuja"
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
                                            placeholder="e.g. Nigeria"
                                            disabled={isSubmitting}
                                        />
                                        <InputError message={errors.country} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group full-width">
                                        <label htmlFor="address">Street Address</label>
                                        <TextInput
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="e.g. 12, Unity Road, Ikeja"
                                            disabled={isSubmitting}
                                        />
                                        <InputError message={errors.address} />
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="section-title">
                                    <i className="fas fa-link"></i>
                                    Social Links
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="linkedin_url">LinkedIn Profile</label>
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
                                        <label htmlFor="github_url">GitHub Profile</label>
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
                                        <label htmlFor="portfolio_url">Portfolio / Personal Website</label>
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

                                {/* Form Actions */}
                                <div className="card-actions">
                                    <button 
                                        type="button" 
                                        className="btn-secondary" 
                                        onClick={resetForm}
                                        disabled={!hasChanges || processing || isSubmitting}
                                    >
                                        Cancel Changes
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn-primary"
                                        disabled={isSubmitting || processing}
                                    >
                                        {isSubmitting || processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <Link href="/dashboard" className="btn-secondary">
                                        Back to Dashboard
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}