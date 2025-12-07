import React from 'react';
import { Shield, Sparkles, Truck } from 'lucide-react';

const About = () => {
    const features = [
        {
            name: 'Safety First',
            description: 'All our products meet strict safety standards and come with clear usage instructions for a safe celebration.',
            icon: Shield,
        },
        {
            name: 'Premium Quality',
            description: 'We source only the finest fireworks and seasonal goods, ensuring vibrant colors and reliable performance.',
            icon: Sparkles,
        },
        {
            name: 'Wholesale Pricing',
            description: 'Competitive bulk pricing with reliable delivery for retailers and event organizers across the region.',
            icon: Truck,
        },
    ];

    return (
        <div className="py-20 bg-cream" id="about">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2 className="text-base text-secondary font-bold tracking-wide uppercase font-sans">About Us</h2>
                    <p className="mt-2 text-4xl leading-8 font-extrabold tracking-tight text-primary sm:text-5xl font-serif">
                        Your Celebration Partner
                    </p>
                    <p className="mt-6 max-w-2xl text-xl text-slate-light lg:mx-auto font-light">
                        Gunda Srinivas Wholesale Fireworks has been bringing sparkle to celebrations for years. We specialize in premium fireworks and seasonal goods, serving retailers and event planners with quality products and exceptional service.
                    </p>
                </div>

                <div className="mt-16">
                    <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-12 md:gap-y-12">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                                <dt>
                                    <div className="absolute flex items-center justify-center h-14 w-14 rounded-full bg-primary text-secondary shadow-lg -top-7 left-8">
                                        <feature.icon className="h-7 w-7" aria-hidden="true" />
                                    </div>
                                    <p className="mt-8 text-xl leading-6 font-bold text-primary font-serif">{feature.name}</p>
                                </dt>
                                <dd className="mt-4 text-base text-slate-light leading-relaxed">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default About;
