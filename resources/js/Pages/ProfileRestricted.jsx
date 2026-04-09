import { useState } from 'react';
import { Link, router } from '@inertiajs/react';

export default function ProfileRestricted({ children, auth, requiredAction, actionData = null }) {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [intendedAction, setIntendedAction] = useState(null);
    const [intendedData, setIntendedData] = useState(null);

    const isAuthenticated = () => {
        return auth && auth.user !== null;
    };

    const handleProtectedAction = (action, event, data = null) => {
        if (!isAuthenticated()) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            setIntendedAction(action);
            setIntendedData(data);
            setShowAuthModal(true);
            return false;
        }
        return true;
    };

    const closeModal = () => {
        setShowAuthModal(false);
        setIntendedAction(null);
        setIntendedData(null);
    };

    return (
        <>
            {/* Pass the handler to children */}
            {children(handleProtectedAction)}

            {/* Auth Modal */}
            {showAuthModal && (
                <div className="auth-modal-overlay" onClick={closeModal}>
                    <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="auth-modal-close" onClick={closeModal}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        
                        <div className="auth-modal-content">
                            <div className="auth-modal-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                                    <circle cx="12" cy="12" r="4"/>
                                </svg>
                            </div>
                            
                            <h2>Join GiftedTalent to Continue</h2>
                            <p>You need to be a member to access this feature. It only takes a minute!</p>
                            
                            {intendedAction && (
                                <div className="auth-modal-action">
                                    <p>You were trying to:</p>
                                    <strong>
                                        {intendedAction === 'apply_job' && 'Apply for a job'}
                                        {intendedAction === 'save_job' && 'Save a job'}
                                        {intendedAction === 'view_profile' && 'View talent profile'}
                                        {intendedAction === 'contact_talent' && 'Contact talent'}
                                        {intendedAction === 'post_job' && 'Post a job'}
                                        {intendedAction || 'Access this feature'}
                                    </strong>
                                </div>
                            )}
                            
                            <div className="auth-modal-buttons">
                                <Link href={route('login')} className="auth-modal-btn auth-modal-btn-primary">
                                    Sign In
                                </Link>
                                <Link href={route('register')} className="auth-modal-btn auth-modal-btn-secondary">
                                    Create Account
                                </Link>
                            </div>
                            
                            <p className="auth-modal-footer">
                                By continuing, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}