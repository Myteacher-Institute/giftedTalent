import { Link } from '@inertiajs/react';

export default function ApplicationLogo(props) {
    return (
        <Link href="/">
            <img src="/assets/img/GIFTEDTalent_LOGO.png" alt="GiftedTalents Logo" className="logo" {...props} />
        </Link>
    );
}