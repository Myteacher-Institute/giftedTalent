import React, { useState } from 'react';

export default function Faq() {
    // Define the FAQ data array
    const faqs = [
        {
            question: "What is GiftedTalents?",
            answer: "GiftedTalents is a platform that connects talented professionals with companies looking for skilled workers. We make it easy for job seekers to find opportunities and for employers to discover top talent."
        },
        {
            question: "How do I apply for jobs?",
            answer: "To apply for jobs, simply create an account, browse through our featured jobs, and click the 'Apply Now' button on any job that interests you. You'll be guided through the application process."
        },
        {
            question: "Is it free to use GiftedTalents?",
            answer: "Yes! Creating an account and applying for jobs is completely free for job seekers. Employers can post jobs with our free tier or upgrade to premium features for enhanced visibility."
        },
        {
            question: "How can employers find talents?",
            answer: "Employers can browse our featured talents section, use search filters to find candidates with specific skills, and directly contact professionals who match their requirements."
        },
        {
            question: "How do I get featured as a talent?",
            answer: "Complete your profile with accurate information, skills, and experience. Our algorithm highlights top-rated and active professionals. Maintaining a high rating increases your chances of being featured."
        },
        {
            question: "What types of jobs are available?",
            answer: "We offer a wide range of opportunities including full-time, part-time, remote, contract, and freelance positions across various industries like tech, creative, marketing, and more."
        }
    ];

    // State to track which FAQ is open
    const [openFaq, setOpenFaq] = useState(null);

    // Function to toggle FAQ open/close
    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <section className="faq-section">
            <div className="faq-container">
                <div className="faq-header">
                    <span className="faq-badge">FAQ</span>
                    <h2>Frequently Asked Questions</h2>
                    <p>Everything you need to know about GiftedTalents</p>
                </div>

                <div className="faq-grid">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-card ${openFaq === index ? 'active' : ''}`}
                        >
                            <button
                                className="faq-card-header"
                                onClick={() => toggleFaq(index)}
                            >
                                <div className="faq-card-left">
                                    <span className="faq-title">{faq.question}</span>
                                </div>
                                <span className="faq-toggle">
                                    {openFaq === index ? '−' : '+'}
                                </span>
                            </button>
                            <div className="faq-card-content">
                                <div className="faq-card-inner">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}