import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import '../../../css/CreateJob.css';

export default function CreateJob() {
    const [formData, setFormData] = useState({
        company_name: '',
        company_logo_url: '',
        company_location: '',
        job_title: '',
        job_type: 'Full-Time',
        salary_currency: 'NGN',
        salary_amount: '',
        salary_period: 'month',
        salary_range: '',
        tags: '',
        application_link: '',
        description: ''
    });

    const [processing, setProcessing] = useState(false);

    // Currency options
    const currencies = [
        { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'GBP', symbol: '£', name: 'British Pound' },
        { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
        { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
    ];

    // Period options
    const periods = [
        { value: 'hour', label: 'Per Hour' },
        { value: 'day', label: 'Per Day' },
        { value: 'week', label: 'Per Week' },
        { value: 'month', label: 'Per Month' },
        { value: 'year', label: 'Per Annum' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSalaryAmountChange = (e) => {
        const amount = e.target.value;
        setFormData(prev => ({
            ...prev,
            salary_amount: amount
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.salary_amount) {
            alert('Please enter a salary amount');
            return;
        }

        if (parseFloat(formData.salary_amount) <= 0) {
            alert('Please enter a valid salary amount greater than 0');
            return;
        }

        if (!formData.application_link) {
            alert('Please enter the application link where users can apply');
            return;
        }

        // Validate URL
        if (!formData.application_link.startsWith('http://') && !formData.application_link.startsWith('https://')) {
            alert('Please enter a valid URL starting with http:// or https://');
            return;
        }

        // Optional: Check if it's a valid number
        if (isNaN(parseFloat(formData.salary_amount))) {
            alert('Please enter a valid number');
            return;
        }

        setProcessing(true);

        // Format salary range with 2 decimal places for currency
        const formattedAmount = parseFloat(formData.salary_amount).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });

        // Format salary range
        const salaryRange = `${formData.salary_currency} ${formData.salary_amount} / ${formData.salary_period}`;

        // Process tags: convert comma-separated string to array
        const tagsArray = formData.tags
            ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
            : [];

        const submitData = {
            company_name: formData.company_name,
            company_logo_url: formData.company_logo_url,
            company_location: formData.company_location,
            job_title: formData.job_title,
            job_type: formData.job_type,
            salary_range: salaryRange,
            description: formData.description,
            tags: tagsArray,
            application_link: formData.application_link
        };

        router.post('/Admin/jobs', submitData, {
            onSuccess: () => {
                setProcessing(false);
                setFormData({
                    company_name: '',
                    company_logo_url: '',
                    company_location: '',
                    job_title: '',
                    job_type: 'Full-Time',
                    salary_currency: 'NGN',
                    salary_amount: '',
                    salary_period: 'month',
                    tags: '',
                    application_link: '',
                    description: ''
                });
                alert('Job created successfully!');
            },
            onError: (errors) => {
                setProcessing(false);
                alert('There was an error creating the job. Please try again.');
            }
        });
    };

    return (
        <>
            <Head title="Create Job - GiftedTalents" />

            <div className="create-job-container">
                <a href="/Admin/dashboard" className='button'>Back</a>
                <h1>Create New Job Post</h1>

                <form onSubmit={handleSubmit} className="job-form">

                    <div className="form-group">
                        <label>Company Logo URL (optional)</label>
                        <input
                            type="url"
                            name="company_logo_url"
                            value={formData.company_logo_url}
                            onChange={handleChange}
                            disabled={processing}
                            placeholder="https://example.com/logo.png"
                        />
                        <small className="form-hint">
                            Enter a URL for your company logo (e.g., https://company.com/logo.png)
                        </small>
                        {formData.company_logo_url && (
                            <div className="logo-preview">
                                <p>Preview:</p>
                                <img src={formData.company_logo_url} alt="Logo preview" className="logo-preview-img"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.previousSibling.innerText = 'Invalid image URL';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Company Name</label>
                        <input
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            required
                            disabled={processing}
                            placeholder="e.g., TechCorp Solutions"
                        />
                    </div>

                    <div className="form-group">
                        <label>Company Location</label>
                        <input
                            type="text"
                            name="company_location"
                            value={formData.company_location}
                            onChange={handleChange}
                            required
                            disabled={processing}
                            placeholder="e.g., Lagos, Nigeria"
                        />
                    </div>

                    <div className="form-group">
                        <label>Skills/Tags</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            disabled={processing}
                            placeholder="React, JavaScript, Laravel, Tailwind CSS"
                        />
                        <small className="form-hint">
                            Enter skills separated by commas
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Job Title</label>
                        <input
                            type="text"
                            name="job_title"
                            value={formData.job_title}
                            onChange={handleChange}
                            required
                            disabled={processing}
                            placeholder="e.g., Senior Frontend Developer"
                        />
                    </div>

                    <div className="form-group">
                        <label>Job Type</label>
                        <div className="select-wrapper">
                            <select
                                name="job_type"
                                value={formData.job_type}
                                onChange={handleChange}
                                disabled={processing}
                            >
                                <option value="Full-Time">Full-Time</option>
                                <option value="Part-Time">Part-Time</option>
                                <option value="Contract">Contract</option>
                                <option value="Remote">Remote</option>
                                <option value="Internship">Internship</option>
                            </select>
                            <svg className='form-group-svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path d="M300.3 440.8C312.9 451 331.4 450.3 343.1 438.6L471.1 310.6C480.3 301.4 483 287.7 478 275.7C473 263.7 461.4 256 448.5 256L192.5 256C179.6 256 167.9 263.8 162.9 275.8C157.9 287.8 160.7 301.5 169.9 310.6L297.9 438.6L300.3 440.8z" />
                            </svg>
                        </div>
                    </div>

                    {/* Salary Section */}
                    <div className="form-group">
                        <label>Salary *</label>
                        <div className="salary-input-group">
                            {/* Currency Selector */}
                            <div className="currency-select">
                                <div className="select-wrapper">
                                    <select
                                        name="salary_currency"
                                        value={formData.salary_currency}
                                        onChange={handleChange}
                                        disabled={processing}
                                    >
                                        {currencies.map(currency => (
                                            <option key={currency.code} value={currency.code}>
                                                {currency.symbol} {currency.code}
                                            </option>
                                        ))}
                                    </select>
                                    <svg className='form-group-svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                        <path d="M300.3 440.8C312.9 451 331.4 450.3 343.1 438.6L471.1 310.6C480.3 301.4 483 287.7 478 275.7C473 263.7 461.4 256 448.5 256L192.5 256C179.6 256 167.9 263.8 162.9 275.8C157.9 287.8 160.7 301.5 169.9 310.6L297.9 438.6L300.3 440.8z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div className="amount-input">
                                <input
                                    type="number"
                                    name="salary_amount"
                                    value={formData.salary_amount}
                                    onChange={handleSalaryAmountChange}
                                    required
                                    disabled={processing}
                                    placeholder="Amount"
                                    min="1"
                                />
                            </div>

                            {/* Period Selector */}
                            <div className="period-select">
                                <div className="select-wrapper">
                                    <select
                                        name="salary_period"
                                        value={formData.salary_period}
                                        onChange={handleChange}
                                        disabled={processing}
                                    >
                                        {periods.map(period => (
                                            <option key={period.value} value={period.value}>
                                                {period.label}
                                            </option>
                                        ))}
                                    </select>
                                    <svg className='form-group-svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                        <path d="M300.3 440.8C312.9 451 331.4 450.3 343.1 438.6L471.1 310.6C480.3 301.4 483 287.7 478 275.7C473 263.7 461.4 256 448.5 256L192.5 256C179.6 256 167.9 263.8 162.9 275.8C157.9 287.8 160.7 301.5 169.9 310.6L297.9 438.6L300.3 440.8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <small className="form-hint">
                            Example: {formData.salary_currency === 'NGN' ? '₦' : currencies.find(c => c.code === formData.salary_currency)?.symbol}
                            {formData.salary_amount || '50,000'}
                            {periods.find(p => p.value === formData.salary_period)?.label}
                        </small>
                    </div>

                    {/* Application Link Field */}
                    <div className="form-group">
                        <label>Application Link *</label>
                        <input
                            type="url"
                            name="application_link"
                            value={formData.application_link}
                            onChange={handleChange}
                            required
                            disabled={processing}
                            placeholder="https://company.com/careers/apply"
                        />
                        <small className="form-hint">
                            Enter the URL where users can apply for this job
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            rows="5"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            disabled={processing}
                            placeholder="Describe the role, responsibilities, and what the job entails..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={processing}
                    >
                        {processing ? 'Posting...' : 'Post Job'}
                    </button>
                </form>
            </div>
        </>
    );
}