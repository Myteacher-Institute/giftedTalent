import { Head, Link } from '@inertiajs/react';
import '../../css/welcome.css';
import '../../css/feature_talent_section.css';

import starIcon from '../../assets/svg/star.svg';
import halfStarIcon from '../../assets/svg/half-star.svg';

import sample1 from '../../assets/img/sample1.jpg';
import sample2 from '../../assets/img/sample2.jpg';
import sample3 from '../../assets/img/sample3.jpg';
import sample4 from '../../assets/img/sample4.jpg';


const featuresData = [
    {
        name: "Micheal Chen",
        image: sample1,
        role: "Full Stack Developer",
        tech: ['Node.js', 'React', 'mongoDB'],
        bg: { background: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 70.71%)' },
        border: {border: '1px solid #DBEAFE'},
        rating: 48,
        stars: 5,
        fullStar: true,
        icon: starIcon
    },
    {
        name: "Sarah Johnson",
        image: sample2,
        role: "UI/UX Designer",
        tech: ['Figma', 'Adobe', 'Prototyping'],
        border: {border: '1px solid #F3E8FF'},
        bg: { background: 'linear-gradient(135deg, #FAF5FF 0%, #FFFFFF 70.71%)' },
        stars: 4,
        rating: 35,
        fullStar: false,
        halfStar: true,
        icon: starIcon,
        halfStarIcon: halfStarIcon
    },
    {
        name: "David Martinez",
        role: "Data Analyst",
        bg: { background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 70.71%)' },
        image: sample3,
        rating: 52,
        border: {border: '1px solid #DCFCE7'},
        tech: ['Python', 'SQL', 'Tebleau'],
        stars: 5,
        fullStar: true,
        icon: starIcon
    },
    {
        name: "Emily Wilson",
        role: "Content Writer",
        bg: { background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 70.71%)' },
        rating: 41,
        image: sample4,
        tech: ['SEO', 'CopyWriting', 'Blogging'],
        border: {border: '1px solid #FFEDD5'},
        stars: 5,
        fullStar: true,
        icon: starIcon
    }
]

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Welcome" />

            <div className="home-screen">
                {/* Henry */}
                <nav className="navbar">
                    
                </nav>

                <div className="hero">

                </div>
                

                {/* christopher */}
                <div className="feature-jobs">
                    
                </div>

                <div className="featured-talents">
                    <div className="feature-talent-header">
                        <h3>Featured Talents</h3>
                        <p>Connect with skilled professionals ready to work</p>
                    </div>

                    <div className="feature-talent-content">
                        {featuresData.map((feature, index) => (
                            <div className="feature-talent-card" key={index} style={{...feature.bg, ...feature.border}}>
                                <div className="feature-talent-card-header">
                                    <img src={feature.image} alt="" />
                                </div>

                                <div className="feature-talent-card-body">
                                    <h3>{feature.name}</h3>
                                    <p>{feature.role}</p>
                                </div>

                                <div className="feature-talent-card-stars">
                                    {[...Array(5)].map((_, starIndex) => {
                                        if (starIndex < feature.stars) {
                                            return <img key={starIndex} src={feature.icon} alt="star" />;
                                        } else if (starIndex === feature.stars && feature.halfStar) {
                                            return <img key={starIndex} src={feature.halfStarIcon} alt="half star" />;
                                        }
                                        return null;
                                    })}
                                    <span>{`(${feature.rating})`}</span>
                                </div>

                                <div className="feature-talent-card-roles">
                                    {feature.tech.map((tech, techIndex) => (
                                        <span key={techIndex}>{tech}</span>
                                    ))}
                                </div>

                                <div className="feature-talent-card-footer">
                                    <Link href="">View Profile</Link>
                                </div>
                            </div>
                        ))}

                    </div>
                    
                    <Link href="" className='browse-all-btn'>Browse All Talents</Link>
                </div>


            </div>
        </>
    );
}
