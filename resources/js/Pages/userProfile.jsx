import { Head, useForm, router, Link } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import '../../css/userProfile.css';

export default function EditProfile({ user, flash, profile }) {
    // Store initial values to compare changes
    const initialData = useRef({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        title: '',
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
        profile_image: null,
    });
    
    const { data, setData, patch, processing, errors, clearErrors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        title: '',
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
        profile_image: null,
    });
    
    const [hasChanges, setHasChanges] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Employment type options
    const employmentTypes = ['Full-Time', 'Part-Time', 'Contract', 'Freelance', 'Internship', 'Remote'];

    // Show success message from flash if any
    useEffect(() => {
        if (flash?.success) {
            alertify.success(flash.success);
        }
    }, [flash]);

    // Populate form with current values on mount
    useEffect(() => {
        if (user) {
            const nameParts = user.name ? user.name.trim().split(' ') : [];
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            // Get profile data from the profile prop
            const profileData = profile || user.profile || {};
            
            // Get avatar URL from profile
            const avatarUrl = profileData.profile_image_base64 || profileData.avatar_url || null;
            
            const formData = {
                first_name: firstName,
                last_name: lastName,
                email: user.email || '',
                phone: profileData.phone || '',
                title: profileData.title || profileData.position || '',
                company: profileData.company || '',
                education: profileData.education || '',
                bio: profileData.bio || '',
                city: profileData.city || '',
                address: profileData.address || '',
                country: profileData.country || '',
                linkedin_url: profileData.linkedin_url || '',
                github_url: profileData.github_url || '',
                portfolio_url: profileData.portfolio_url || '',
                employment_type: profileData.employment_type || '',
                start_date: profileData.start_date || '',
                profile_image: null,
            };
            
            setData(formData);
            initialData.current = { ...formData };
            setPreviewImage(avatarUrl);
        }
    }, [user, profile]);

    // Track changes
    useEffect(() => {
        const hasAnyChanges = Object.keys(data).some(
            key => data[key] !== initialData.current[key]
        );
        setHasChanges(hasAnyChanges);
    }, [data]);

    const submit = (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        // Find only the fields that have changed
        const changedFields = {};
        Object.keys(data).forEach(key => {
            if (data[key] !== initialData.current[key]) {
                changedFields[key] = data[key];
            }
        });
        
        // Check if there are any changes
        if (Object.keys(changedFields).length === 0) {
            alertify.message('No changes to update');
            return;
        }
        
        console.log('Sending changed fields:', changedFields);
        clearErrors();
        setIsSubmitting(true);
        
        // Send only the changed fields to the extended profile endpoint
        patch(route('profile.updateExtended'), changedFields, {
            preserveState: false,
            preserveScroll: true,
            onSuccess: (response) => {
                console.log('Success response:', response);
                
                alertify.success('Profile updated successfully!');
                
                // Store a flag in sessionStorage to show success message on dashboard
                sessionStorage.setItem('profileUpdated', 'true');
                sessionStorage.setItem('profileUpdateTime', Date.now().toString());
                
                // Redirect to dashboard
                router.visit('/dashboard', {
                    preserveState: false,
                    preserveScroll: false,
                    onSuccess: () => {
                        setIsSubmitting(false);
                    },
                    onError: () => {
                        setIsSubmitting(false);
                    }
                });
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                const errorMessages = Object.values(errors).flat().join('\n');
                alertify.error(errorMessages || 'Please fix the errors and try again.');
                setIsSubmitting(false);
            }
        });
    };

    // Reset form function
    const resetForm = () => {
        setData(initialData.current);
        setPreviewImage(profile?.profile_image_base64 || profile?.avatar_url || null);
        alertify.message('Changes discarded');
    };

    // Handle image upload with base64 conversion
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alertify.error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alertify.error('Image size should be less than 5MB');
            return;
        }

        setUploading(true);

        try {
            // Convert to base64
            const base64 = await convertToBase64(file);
            
            // Update form data with base64 image
            setData('profile_image', base64);
            setPreviewImage(base64);
            alertify.success('Image ready. Click Save Changes to apply.');
        } catch (error) {
            console.error('Error converting image:', error);
            alertify.error('Failed to process image');
        } finally {
            setUploading(false);
        }
    };

    // Helper function to convert file to base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const removeAvatar = () => {
        if (!confirm('Remove profile picture?')) return;
        
        // Set profile_image to empty string to trigger removal
        setData('profile_image', '');
        setPreviewImage(null);
        alertify.message('Image will be removed when you save changes');
    };

    // Function to get profile image URL with proper fallback
    const getProfileImageUrl = () => {
        // If there's a preview image (new upload), show that
        if (previewImage) {
            return previewImage;
        }
        // Check if profile has base64 image
        if (profile?.profile_image_base64) {
            return profile.profile_image_base64;
        }
        // Check if profile has avatar_url
        if (profile?.avatar_url) {
            return profile.avatar_url;
        }
        // Check if there's an avatar path
        if (profile?.avatar) {
            const avatarPath = profile.avatar;
            if (avatarPath.startsWith('/storage/')) {
                return avatarPath;
            }
            return `/storage/${avatarPath}`;
        }
        // Check user profile fallback
        if (user?.profile?.avatar_url) {
            return user.profile.avatar_url;
        }
        // Fallback to UI Avatars with user's name
        const userName = user?.name || 'User';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=150&bold=true`;
    };

    const recentExperience = user?.experiences?.[0] || { company: 'No experience added', job_title: 'Add experience' };

    return (
        <>
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
                                    <PrimaryButton 
                                        className="btn-primary" 
                                        disabled={processing || !hasChanges || isSubmitting}
                                    >
                                        {isSubmitting ? 'Saving...' : (processing ? 'Saving...' : 'Save Changes')}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}