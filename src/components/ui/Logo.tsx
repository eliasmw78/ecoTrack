import React from 'react';
import { Leaf } from 'lucide-react';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'light';
}

const sizeConfig = {
    sm: { icon: 20, text: 'text-lg' },
    md: { icon: 28, text: 'text-2xl' },
    lg: { icon: 40, text: 'text-4xl' },
    xl: { icon: 56, text: 'text-6xl' },
};

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'default' }) => {
    const { icon, text } = sizeConfig[size];
    const textColor = variant === 'light' ? 'text-white' : 'text-dark-bg';

    return (
        <div className={`flex items-center gap-2 ${text} font-sans`}>
            <Leaf size={icon} className="text-eco-green" />
            <div className="flex items-center tracking-tight">
                <span className="text-eco-green font-bold">Eco</span>
                <span className={`${textColor} font-medium`}>Track</span>
            </div>
        </div>
    );
};
