export const isAbsoluteUrl = (value) => {
    return typeof value === 'string' && /^(https?:)?\/\//i.test(value);
};

export const isDataImageUrl = (value) => {
    return typeof value === 'string' && /^data:image\/[a-zA-Z]+;base64,/i.test(value);
};

export const isBlobUrl = (value) => {
    return typeof value === 'string' && /^blob:/i.test(value);
};

export const resolveAvatarUrl = (value) => {
    if (!value || typeof value !== 'string') {
        return null;
    }

    const source = value.trim();
    if (!source) {
        return null;
    }

    if (source.toLowerCase().includes('.heic')) {
        return null;
    }

    if (isDataImageUrl(source) || isAbsoluteUrl(source) || isBlobUrl(source)) {
        return source;
    }

    const cleanPath = source.replace(/^\/+/, '');
    return cleanPath.startsWith('storage/') ? `/${cleanPath}` : `/storage/${cleanPath}`;
};

export const getAvatarUrl = ({ profile = {}, currentUser = {}, fallbackName = 'User', fallbackColor = '4F46E5' } = {}) => {
    if (profile.profile_image_base64 && typeof profile.profile_image_base64 === 'string') {
        return profile.profile_image_base64;
    }

    if (currentUser.profile?.profile_image_base64 && typeof currentUser.profile.profile_image_base64 === 'string') {
        return currentUser.profile.profile_image_base64;
    }

    const resolvedProfile = resolveAvatarUrl(profile.avatar_url || profile.avatar);
    if (resolvedProfile) {
        return resolvedProfile;
    }

    const resolvedUser = resolveAvatarUrl(currentUser.profile?.avatar_url || currentUser.profile?.avatar || currentUser.avatar);
    if (resolvedUser) {
        return resolvedUser;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=${fallbackColor}&color=fff`;
};
