import React from 'react';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Footer() {
    return (
        <footer>
            <div className="footer-top">
                <div className="footer-left">
                    {/* Remove the outer Link - ApplicationLogo already has one */}
                    <ApplicationLogo className="logo w-[520px] h-[200px] mt-8" />
                </div>

                <div className="footer-right">
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                    <Link href="/privacy">Privacy Policy</Link>
                    <Link href="/guidelines">Community Guideline</Link>
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