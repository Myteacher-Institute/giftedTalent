import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import '../../css/userProfile.css';

export default function EditProfile({ user, availableSkills = [] }) {
    const { data, setData, patch, processing, errors, setError, clearErrors, reset } = useForm({
        first_name: user.name ? user.name.split(' ')[0] || '' : '',
        last_name: user.name ? user.name.split(' ').slice(1).join(' ') || '' : '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        position: '', // Add to Profile model if needed
        education: '', // Single input
        bio: user.profile?.bio || '',
        location: user.profile?.city || '',
        address: user.profile?.address || '',
        country: user.profile?.country || '',
        linkedin_url: user.profile?.linkedin_url || '',
        github_url: user.profile?.github_url || '',
        portfolio_url: user.profile?.portfolio_url || '',
    });

    const [uploading, setUploading] = useState(false);
    const [profileComplete, setProfileComplete] = useState(0);

    const submit = (e) => {
        e.preventDefault();
        clearErrors();
        patch(route('profile.updateExtended'), {
            onSuccess: (page) => {
                // Refresh props to update dashboard data when navigated back
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
            });
            // Refresh user props for immediate UI update
            router.reload({ only: ['user'] });
        } catch (error) {
            console.error('Upload failed', error);
        } finally {
            setUploading(false);
        }
    };

    const fullName = `${data.first_name} ${data.last_name}`.trim();

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Profile</h2>}>
            <Head title="Edit Profile" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="container">
                        <form onSubmit={submit}>
                            <div className="header">
                                <h2>Edit Profile</h2>
                                <p>Update your personal and professional details</p>
                            </div>

                            {/* Profile Picture */}
                            <div className="profile-pic">
                                <img 
                                    src={user.profile?.avatar_url || `https://i.pravatar.cc/100?img=${user.id}`} 
                                    alt="Profile" 
                                />
                                <label className="cursor-pointer">
                                    <span className={uploading ? 'opacity-50 cursor-not-allowed' : ''}>
                                        {uploading ? 'Uploading...' : 'Change Photo'}
                                    </span>
                                    <input 
                                        type="file" 
                                        onChange={uploadAvatar}
                                        accept="image/*"
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                </label>
                            </div>

                            <div className="section-title">Personal Information</div>

                            <div className="row">
                                <div className="form-group">
                                    <InputLabel htmlFor="first_name" value="First Name" />
                                    <TextInput
                                        id="first_name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        className="mt-1 block w-full"
                                        autoComplete="given-name"
                                    />
                                    <InputError message={errors.first_name} />
                                </div>

                                <div className="form-group">
                                    <InputLabel htmlFor="last_name" value="Last Name" />
                                    <TextInput
                                        id="last_name"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        className="mt-1 block w-full"
                                        autoComplete="family-name"
                                    />
                                    <InputError message={errors.last_name} />
                                </div>
                            </div>

                            <div className="form-group">
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 block w-full"
                                    autoComplete="email"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="form-group">
                                <InputLabel htmlFor="phone" value="Phone" />
                                <TextInput
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="section-title">Professional Details</div>

                            <div className="form-group">
                                <InputLabel htmlFor="position" value="Position" />
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
                                <InputLabel htmlFor="education" value="Education" />
                                <TextInput
                                    id="education"
                                    placeholder="e.g. B.Sc Computer Science"
                                    value={data.education}
                                    onChange={(e) => setData('education', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.education} />
                            </div>

                            <div className="form-group">
                                <InputLabel htmlFor="bio" value="Bio" />
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

                            <div className="section-title">Location</div>

                            <div className="form-group">
                                <InputLabel htmlFor="location" value="City" />
                                <TextInput
                                    id="location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.location} />
                            </div>

                            <div className="form-group">
                                <InputLabel htmlFor="address" value="Address" />
                                <TextInput
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.address} />
                            </div>

                            <div className="form-group">
                                <InputLabel htmlFor="country" value="Country" />
                                <TextInput
                                    id="country"
                                    value={data.country}
                                    onChange={(e) => setData('country', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.country} />
                            </div>

                            <div className="form-group">
                                <InputLabel htmlFor="linkedin_url" value="LinkedIn" />
                                <TextInput
                                    id="linkedin_url"
                                    value={data.linkedin_url}
                                    onChange={(e) => setData('linkedin_url', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.linkedin_url} />
                            </div>

                            <div className="buttons">
                                <button type="button" onClick={() => window.history.back()} className="cancel">
                                    Cancel
                                </button>
                                <PrimaryButton type="submit" className="save" disabled={processing}>
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

