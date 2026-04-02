import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import '../../css/contact.css';
import '../../css/nav.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Nav Component
function Nav() {
    const [isActive, setIsActive] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="logo">
                GiftedTalent<span>.Online</span>
            </div>
            <ul className={`nav-links ${isActive ? 'active' : ''}`}>
                <li><Link href="/" className="nav-link">Home</Link></li>
                <li><Link href="/jobs" className="nav-link">Find Jobs</Link></li>
                <li><Link href="/find-talents" className="nav-link">Find Talents</Link></li>
                <li><Link href="/how-it-works" className="nav-link">How It Works</Link></li>
                <li><Link href="/about" className="nav-link">About</Link></li>
                <li><Link href="/contact" className="nav-link active">Contact</Link></li>
            </ul>
            <div className="nav-right">
                <div className="auth-links">
                    <Link href={route('login')} className="nav-auth-link">Sign In</Link>
                    <Link href={route('register')} className="get-started">Get Started</Link>
                </div>
                <div className={`hamburger ${isActive ? 'active' : ''}`} onClick={() => setIsActive(!isActive)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    );
}

export default function Contact() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => {
                setSuccess(true);
                reset();
                setTimeout(() => setSuccess(false), 5000);
            }
        });
    };

    const contactInfo = [
        {
            icon: <i className="fas fa-map-marker-alt contact-icon-font"></i>,
            title: "Visit Us",
            details: ["Myteacher-Institute", "Rumuagholu, Port Harcourt", "Rivers State, Nigeria"]
        },
        {
            icon: <i className="fas fa-envelope contact-icon-font"></i>,
            title: "Email Us",
            details: ["support@giftedtalents.online"],
            link: "mailto:support@giftedtalents.online",
            linkText: "Send Email"
        },
        {
            icon: <i className="fas fa-phone-alt contact-icon-font"></i>,
            title: "Call Us",
            details: ["+234 801 234 5678"],
            link: "tel:+23480*******",
            linkText: "Call Now"
        },
        {
            icon: <i className="fab fa-whatsapp contact-icon-font"></i>,
            title: "WhatsApp",
            details: ["Chat with us 24/7"],
            link: "https://wa.me/2348012345678?text=Hello%20GiftedTalents",
            linkText: "Chat Now"
        }
    ];

    return (
        <>
            <Head title="Contact Us - GiftedTalents" />

            <div className="contact-page">
                <Nav />

                <section className="contact-hero">
                    <div className="contact-hero-content">
                        <h1>Get in Touch</h1>
                        <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                    </div>
                </section>

                <section className="contact-info">
                    <div className="contact-info-grid">
                        {contactInfo.map((info, index) => (
                            <div key={index} className="contact-info-card">
                                <div className="contact-icon-wrapper">
                                    {info.icon}
                                </div>
                                <h3>{info.title}</h3>
                                {info.details.map((detail, i) => (
                                    <p key={i}>{detail}</p>
                                ))}
                                {info.link && (
                                    <a href={info.link} target="_blank" rel="noopener noreferrer" className="contact-link">
                                        {info.linkText}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="contact-form-section">
                    <div className="contact-form-container">
                        <div className="contact-form-left">
                            <h2>Send us a Message</h2>
                            <p>Have questions? Need help? We're here for you.</p>

                            {success && (
                                <div className="success-message">
                                    <i className="fas fa-check-circle"></i>
                                    Message sent successfully! We'll get back to you soon.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label>Your Name *</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        disabled={processing}
                                        placeholder="John Doe"
                                    />
                                    {errors.name && <span className="error">{errors.name}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Email Address *</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        disabled={processing}
                                        placeholder="john@example.com"
                                    />
                                    {errors.email && <span className="error">{errors.email}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Subject *</label>
                                    <input
                                        type="text"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        required
                                        disabled={processing}
                                        placeholder="How can we help?"
                                    />
                                    {errors.subject && <span className="error">{errors.subject}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Message *</label>
                                    <textarea
                                        rows="5"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        required
                                        disabled={processing}
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                    {errors.message && <span className="error">{errors.message}</span>}
                                </div>

                                <button type="submit" className="submit-btn" disabled={processing}>
                                    {processing ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>

                        <div className="contact-form-right">
                            <div className="map-container">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.4835!2d6.9834!3d4.9011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069c7b9a83b9b9d%3A0x8c5b9f9c8b5b9f9c!2sRumuagholu%2C%20Port%20Harcourt%2C%20Rivers%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1699999999999!5m2!1sen!2sng"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Myteacher-Institute, Rumuagholu, Rivers State, Nigeria"
                                ></iframe>
                            </div>
                            <div className="office-hours">
                                <h4>Office Hours</h4>
                                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                                <p>Saturday: 10:00 AM - 2:00 PM</p>
                                <p>Sunday: Closed</p>
                            </div>
                        </div>
                    </div>
                </section>

                <footer>
                    <div className="footer-left">
                        <a href="/" className="brand">GiftedTalents<span>.online</span></a>
                        <div>
                            <p>©</p>
                            <span>2026</span>
                        </div>
                    </div>
                    <div className="footer-right">
                        <a href="/about">About</a>
                        <a href="/contact">Contact</a>
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/guidelines">Community Guideline</a>
                    </div>
                </footer>
            </div>
        </>
    );
}