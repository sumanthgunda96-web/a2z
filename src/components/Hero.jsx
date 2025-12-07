import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
    return (
        <div className="relative bg-night h-[700px] flex items-center overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                    alt="Colorful Fireworks Display"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-night/95 to-night/50 mix-blend-multiply"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left z-10">
                <h1 className="text-5xl tracking-tight font-serif font-bold text-cream sm:text-6xl md:text-7xl drop-shadow-lg">
                    <span className="block">Light Up Your</span>
                    <span className="block text-secondary">Celebrations</span>
                </h1>
                <p className="mt-6 text-lg text-cream-dark sm:mt-8 sm:text-xl sm:max-w-xl sm:mx-auto md:mt-8 md:text-2xl lg:mx-0 font-light leading-relaxed">
                    Premium wholesale fireworks and seasonal goods. From sparklers to spectacular displays, we bring joy to every celebration.
                </p>
                <div className="mt-10 sm:mt-12 sm:flex sm:justify-center lg:justify-start gap-4">
                    <div className="rounded-full shadow-lg">
                        <Link
                            to="/products"
                            className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-primary-dark transition-all duration-300 transform hover:-translate-y-1 md:text-lg md:px-10 shadow-primary/50"
                        >
                            Browse Collection
                        </Link>
                    </div>
                    <div className="mt-3 sm:mt-0">
                        <Link
                            to="/about"
                            className="w-full flex items-center justify-center px-8 py-4 border-2 border-cream text-base font-medium rounded-full text-cream hover:bg-cream hover:text-night transition-all duration-300 md:text-lg md:px-10"
                        >
                            Learn More <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
