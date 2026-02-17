import React from 'react';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'light';
}

const sizeConfig = {
    sm: { icon: 40, imgClass: 'w-10 h-10', text: 'text-lg' },
    md: { icon: 64, imgClass: 'w-16 h-16', text: 'text-2xl' },
    lg: { icon: 80, imgClass: 'w-20 h-20', text: 'text-4xl' },
    xl: { icon: 96, imgClass: 'w-24 h-24', text: 'text-6xl' },
};

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'default' }) => {
    const { icon, imgClass, text } = sizeConfig[size];
    const textColor = variant === 'light' ? 'text-white' : 'text-dark-bg';

    return (
        <div className={`flex items-center gap-2 ${text} font-sans`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/logo-removebg-preview.png"
                alt="EcoTrack Logo"
                width={icon}
                height={icon}
                className={`${imgClass} object-contain`}
            />
            <div className="flex items-center tracking-tight">
                <span className="text-eco-green font-bold">Eco</span>
                <span className={`${textColor} font-medium`}>Track</span>
            </div>
        </div>
    );
};
