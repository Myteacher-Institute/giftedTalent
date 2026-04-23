import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppNavbar from '../Components/AppNavbar';

export default function Applications({ auth, applications }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const currentUser = auth?.user;

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <>
            <Head title="My Applications - GiftedTalent" />
            
            <AppNavbar 
                user={currentUser} 
                onMenuToggle={toggleSidebar}
                isMenuOpen={sidebarOpen}
            />

            {sidebarOpen && <div className="mobile-overlay" onClick={closeSidebar}></div>}

            <div className="applications-container">
                <div className="applications-header">
                    <h1><i className="fa-solid fa-file"></i> My Applications</h1>
                    <p>Track all the jobs you've applied for</p>
                </div>

                {applications && applications.length === 0 ? (
                    <div className="no-applications">
                        <i className="fa-regular fa-file"></i>
                        <h3>No Applications Yet</h3>
                        <p>You haven't applied to any jobs yet. Start browsing and apply to your first job!</p>
                        <Link href="/search-jobs" className="browse-jobs-btn">
                            <i className="fa-solid fa-magnifying-glass"></i> Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="applications-list">
                        {applications.map((app) => (
                            <div key={app.id} className="application-card">
                                <div className="application-header">
                                    <h3>{app.title}</h3>
                                    <span className={`status-badge ${app.status}`}>{app.status}</span>
                                </div>
                                <p className="company-name">
                                    <i className="fa-solid fa-building"></i> {app.company}
                                </p>
                                <p className="location">
                                    <i className="fa-solid fa-location-dot"></i> {app.location}
                                </p>
                                <p className="applied-date">
                                    <i className="fa-regular fa-calendar"></i> Applied on {new Date(app.applied_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .applications-container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }
                
                .applications-header {
                    margin-bottom: 30px;
                }
                
                .applications-header h1 {
                    font-size: 28px;
                    color: #1f2937;
                    margin-bottom: 8px;
                }
                
                .applications-header h1 i {
                    color: #0A2463;
                    margin-right: 10px;
                }
                
                .applications-header p {
                    color: #6b7280;
                }
                
                .no-applications {
                    text-align: center;
                    padding: 80px 20px;
                    background: white;
                    border-radius: 20px;
                    border: 1px solid #e5e7eb;
                }
                
                .no-applications i {
                    font-size: 64px;
                    color: #cbd5e1;
                    margin-bottom: 16px;
                }
                
                .no-applications h3 {
                    font-size: 20px;
                    color: #1f2937;
                    margin-bottom: 8px;
                }
                
                .no-applications p {
                    color: #6b7280;
                    margin-bottom: 24px;
                }
                
                .browse-jobs-btn {
                    display: inline-block;
                    padding: 12px 28px;
                    background: #0A2463;
                    color: white;
                    text-decoration: none;
                    border-radius: 30px;
                    transition: all 0.3s;
                }
                
                .browse-jobs-btn:hover {
                    background: #1e3a5f;
                    transform: translateY(-2px);
                }
                
                .applications-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                
                .application-card {
                    background: white;
                    border-radius: 16px;
                    padding: 20px;
                    border: 1px solid #e5e7eb;
                    transition: all 0.3s;
                }
                
                .application-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    border-color: #0A2463;
                }
                
                .application-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                
                .application-header h3 {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1f2937;
                    margin: 0;
                }
                
                .status-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 500;
                    text-transform: capitalize;
                }
                
                .status-badge.pending {
                    background: #fef3c7;
                    color: #d97706;
                }
                
                .status-badge.accepted {
                    background: #d1fae5;
                    color: #059669;
                }
                
                .status-badge.rejected {
                    background: #fee2e2;
                    color: #dc2626;
                }
                
                .status-badge.reviewed {
                    background: #dbeafe;
                    color: #2563eb;
                }
                
                .company-name, .location, .applied-date {
                    font-size: 14px;
                    color: #6b7280;
                    margin: 8px 0;
                }
                
                .company-name i, .location i, .applied-date i {
                    color: #0A2463;
                    width: 20px;
                    margin-right: 8px;
                }
                
                .mobile-overlay {
                    position: fixed;
                    top: 60px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 1001;
                }
                
                @media (max-width: 768px) {
                    .applications-container {
                        padding: 20px 16px;
                    }
                    
                    .application-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .no-applications {
                        padding: 50px 20px;
                    }
                    
                    .no-applications i {
                        font-size: 48px;
                    }
                }
            `}</style>
        </>
    );
}