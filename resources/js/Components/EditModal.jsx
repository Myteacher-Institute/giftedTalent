import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function EditModal({ isOpen, onClose, title, children, submitUrl, submitMethod = 'post' }) {
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        router[submitMethod](submitUrl, {
            onFinish: () => {
                setProcessing(false);
                onClose();
            },
            preserveState: true,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    {children}
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <button type="submit" disabled={processing} className="btn-primary">
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
