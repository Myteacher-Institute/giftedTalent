import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
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
        position: '',
        education: '',
        bio: '',
        city: '',
        address: '',
        country: '',
        linkedin_url: '',
        github_url: '',
        portfolio_url: '',
        profile_image: null,
    });
    
    const { data, setData, patch, processing, errors, clearErrors } = useForm({
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
        profile_image: null,
    });
    
    const [hasChanges, setHasChanges] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

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
            
            // Get avatar URL from profile accessor
            const avatarUrl = user.profile?.avatar_url || null;
            
            const formData = {
                first_name: firstName,
                last_name: lastName,
                email: user.email || '',
                phone: user.profile?.phone || profile?.phone || '',
                position: user.profile?.position || '',
                education: user.profile?.education || '',
                bio: user.profile?.bio || '',
                city: user.profile?.city || '',
                address: user.profile?.address || '',
                country: user.profile?.country || '',
                linkedin_url: user.profile?.linkedin_url || '',
                github_url: user.profile?.github_url || '',
                portfolio_url: user.profile?.portfolio_url || '',
                profile_image: null,
            };
            
            setData(formData);
            initialData.current = { ...formData };
            setPreviewImage(avatarUrl);
        }
    }, [user]);

    // Track changes
    useEffect(() => {
        const hasAnyChanges = Object.keys(data).some(
            key => data[key] !== initialData.current[key]
        );
        setHasChanges(hasAnyChanges);
    }, [data]);

    const submit = (e) => {
        e.preventDefault();
        
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
        
        // Send only the changed fields
        patch(route('profile.updateExtended'), changedFields, {
            preserveState: false,
            preserveScroll: true,
            onSuccess: (response) => {
                console.log('Success response:', response);
                alertify.success('Profile updated successfully! Redirecting to dashboard...');
                
                // Dispatch custom event for real-time updates
                window.dispatchEvent(new CustomEvent('profileUpdated', { 
                    detail: {
                        user: user,
                        profile: {
                            ...user.profile,
                            avatar_url: previewImage
                        },
                        timestamp: Date.now()
                    }
                }));
                
                // Redirect to dashboard with a full page refresh
                setTimeout(() => {
                    // Use window.location for a full page refresh to ensure all data is fresh
                    window.location.href = '/dashboard';
                }, 1000);
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                const errorMessages = Object.values(errors).flat().join('\n');
                alertify.error(errorMessages || 'Please fix the errors and try again.');
            }
        });
    };

    // Reset form function
    const resetForm = () => {
        setData(initialData.current);
        setPreviewImage(user.profile?.avatar_url || null);
        alertify.message('Changes discarded');
    };

    // Handle image upload with base64 conversion
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            alertify.error('Please upload a valid image file (JPEG, PNG, or GIF)');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alertify.error('Image size should be less than 2MB');
            return;
        }

        setUploading(true);

        try {
            // Convert to base64
            const base64 = await convertToBase64(file);
            
            // Update form data with base64 image
            setData('profile_image', base64);
            setPreviewImage(base64);
            alertify.success('Image ready for upload. Click Save Changes to apply.');
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

    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'JD';
    const recentExperience = user?.experiences?.[0] || { company: 'No experience added', job_title: 'Add experience' };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Profile</h2>}>
            <Head title="Edit Profile" />
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
                                    {previewImage ? (
                                        <img 
                                            src={previewImage} 
                                            alt="Profile" 
                                            className="profile-image"
                                        />
                                    ) : user?.profile?.avatar_url ? (
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
                                    <div className="profile-name">{user?.name || 'User'}</div>
                                    <div className="profile-experience">
                                        {recentExperience.company} - {recentExperience.job_title}
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
                                            accept="image/jpeg,image/jpg,image/png,image/gif"
                                            className="hidden"
                                            disabled={uploading}
                                        />
                                    </label>
                                    {(previewImage || user?.profile?.avatar) && (
                                        <button 
                                            type="button"
                                            onClick={removeAvatar} 
                                            className="btn-remove" 
                                            disabled={uploading}
                                        >
                                            <i className="fa-solid fa-trash"></i> Remove
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Max size: 2MB. Supported formats: JPG, PNG, GIF
                                </p>
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

                            <div className="section-title">
                                <i className="fas fa-link text-purple-500 mr-2"></i>
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
                                    />
                                    <InputError message={errors.portfolio_url} />
                                </div>
                            </div>

                            <div className="card-actions">
                                <button 
                                    type="button" 
                                    className="btn-secondary" 
                                    onClick={resetForm}
                                    disabled={!hasChanges || processing}
                                >
                                    Cancel
                                </button>
                                <PrimaryButton 
                                    className="btn-primary" 
                                    disabled={processing || !hasChanges}
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}