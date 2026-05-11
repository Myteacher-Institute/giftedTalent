
import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Footer() {
    return (
        <footer>
            <div className="footer-top">
                <div className="footer-left">
                    <a href="/" className="brand" onClick={(e) => { e.preventDefault(); navigateTo('/'); }}>
                        <ApplicationLogo className="logo w-[520px] h-[200px] mt-8" />
                    </a>
                </div>

                <div className="footer-right">
                    <a href="/about">About</a>
                    <a href="/contact">Contact</a>
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/guidelines">Community Guideline</a>
                </div>
            </div>

            <div className="footer-bottom">
                <div className='copyright'>
                    <p>©</p>
                    <span>2026</span>
                </div>

                <p>
                    <span>Powered by:</span> MyTeacher Institute. All rights reserved.
                </p>
            </div>

        </footer>
    );
}