// resources/js/Components/AppNavbar.jsx
import { router } from '@inertiajs/react';
import Notification from './Notification';

const AppNavbar = ({ user, newJobsCount }) => {

    const getProfileImageUrl = () => {
        // FIRST: Check for base64 profile image
        if (user?.profile?.profile_image_base64) {
            return user.profile.profile_image_base64;
        }
        
        // SECOND: Check for avatar_url
        if (user?.profile?.avatar_url) {
            return user.profile.avatar_url;
        }
        
        // THIRD: Check for avatar path
        if (user?.profile?.avatar) {
            const avatarPath = user.profile.avatar;
            if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
                return avatarPath;
            }
            if (avatarPath.startsWith('data:image')) {
                return avatarPath;
            }
            const cleanPath = avatarPath.replace(/^\/+/, '');
            return `/storage/${cleanPath}`;
        }
        
        // FOURTH: Default avatar
        const userName = user?.name || 'User';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=40&bold=true`;
    };

    return (
        <header className="navbar">
            <div className="logo">
                <span className="blue">GiftedTalents</span>.Online
            </div>

            {/* Desktop Navigation - using nav tag to match CSS */}
            <nav>
                <a onClick={() => router.visit('/dashboard')}>Home</a>
                <a onClick={() => router.visit('/search-jobs')} className="active">Jobs</a>
                <a onClick={() => router.visit('/explore')}>Explore</a>
                <a onClick={() => router.visit('/hire')}>Hire</a>
            </nav>

            <div className="search">
                <input type="text" placeholder="search for jobs..." />
            </div>

            <div className="nav-icons">
                <i className="fa-regular fa-comment"></i>
                <div style={{ position: 'relative' }}>
                    <Notification />
                    {newJobsCount > 0 && (
                        <span className="notification-badge">{newJobsCount}</span>
                    )}
                </div>
                <img 
                    src={getProfileImageUrl()} 
                    alt={user?.name || 'Profile'} 
                    className="navbar-profile-image"
                    onClick={() => router.visit('/profile/edit')}
                    onError={(e) => {
                        const userName = user?.name || 'User';
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=40&bold=true`;
                    }}
                />
            </div>
        </header>
    );
};

export default AppNavbar;