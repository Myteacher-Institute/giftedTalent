import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function Notification() {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            alertify.success(flash.success, 3);
        }
        if (flash?.error) {
            alertify.error(flash.error, 3);
        }
    }, [flash]);

    return null;
}
