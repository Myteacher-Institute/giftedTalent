import { Head } from '@inertiajs/react';
import AppNavbar from '../Components/AppNavbar';

export default function ProfileRestricted({ auth, user, message }) {
    return (
        <>
            <Head title="Profile Restricted - GiftedTalent" />
            <AppNavbar user={auth.user} />
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
                padding: '40px'
            }}>
                <div style={{
                    textAlign: 'center',
                    maxWidth: '500px',
                    background: 'white',
                    padding: '40px',
                    borderRadius: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <i className="fas fa-lock" style={{ fontSize: '48px', color: '#4F46E5', marginBottom: '20px' }}></i>
                    <h2 style={{ marginBottom: '10px', color: '#1f2937' }}>Profile Restricted</h2>
                    <p style={{ color: '#6b7280', marginBottom: '20px' }}>{message || 'This user has set their profile to private.'}</p>
                    <button 
                        onClick={() => window.history.back()}
                        style={{
                            padding: '10px 24px',
                            background: '#4F46E5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </>
    );
}