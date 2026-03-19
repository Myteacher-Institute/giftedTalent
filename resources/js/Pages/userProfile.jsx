import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import '../../css/userProfile.css';

export default function EditProfile({ user }) {
    const { data, setData, patch, processing, errors, clearErrors } = useForm({
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

    const [uploading, setUploading] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        clearErrors();
        patch(route('profile.updateExtended'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['user'] });
            }
        });
    };

    const uploadAvatar = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            await router.post(route('profile.avatar.upload'), formData, {
                forceFormData: true,
                preserveState: true,
                onSuccess: () => {
                    router.visit(route('dashboard'), { replace: true });
                }
            });
        } catch (error) {
            console.error('Upload failed', error);
        } finally {
            setUploading(false);
        }
    };

    const removeAvatar = async () => {
        if (!confirm('Remove profile picture?')) return;
        
        try {
            await router.delete(route('profile.avatar.remove'), {
                preserveState: true,
            });
            router.reload({ only: ['user'] });
        } catch (error) {
            console.error('Remove failed', error);
        }
    };

    const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'JD';

    const recentExperience = user.experiences?.[0] || { company: 'No experience added', job_title: 'Add experience' };

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
                            <div className="profile-pic-container">
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
                                </div>
                                <div className="profile-info">
                                    <div className="profile-name">{user.name}</div>
                                    <div className="profile-experience">
                                        {recentExperience.company} - {recentExperience.job_title}
                                    </div>
                                    <div className="profile-verified">
                                        <span className="verified-badge">
                                            <i className="fa-solid fa-check-circle"></i> Verified
                                        </span>
                                    </div>
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

                        <form onSubmit={submit}>
                            <div className="section-title">Personal Information</div>

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

                            <div className="section-title">Professional Details</div>

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

                            <div className="section-title">Location</div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">City</label>
                                    <TextInput
                                        id="city"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        className="mt-1 block w-full"
                                    />

                                    <InputError message={errors.location} />
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
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

