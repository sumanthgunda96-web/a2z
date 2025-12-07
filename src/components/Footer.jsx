import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-night text-white pt-16 pb-8 border-t border-night-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-2xl font-bold mb-6 font-serif text-cream">Gunda Srinivas</h3>
                        <p className="text-cream-dark mb-6 leading-relaxed font-light">
                            Wholesale Fireworks & Seasonal Goods. Bringing sparkle and joy to celebrations across the region with premium quality products and exceptional service.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-cream-dark hover:text-secondary transition-colors"><Facebook className="h-6 w-6" /></a>
                            <a href="#" className="text-cream-dark hover:text-secondary transition-colors"><Twitter className="h-6 w-6" /></a>
                            <a href="#" className="text-cream-dark hover:text-secondary transition-colors"><Instagram className="h-6 w-6" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6 font-serif text-cream">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><a href="/" className="text-cream-dark hover:text-secondary transition-colors inline-block transform hover:translate-x-1">Home</a></li>
                            <li><a href="/products" className="text-cream-dark hover:text-secondary transition-colors inline-block transform hover:translate-x-1">Our Products</a></li>
                            <li><a href="/about" className="text-cream-dark hover:text-secondary transition-colors inline-block transform hover:translate-x-1">About Us</a></li>
                            <li><a href="/contact" className="text-cream-dark hover:text-secondary transition-colors inline-block transform hover:translate-x-1">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6 font-serif text-cream">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <MapPin className="h-6 w-6 mr-3 text-secondary mt-1 flex-shrink-0" />
                                <div className="text-cream-dark">
                                    <p className="font-bold text-cream mb-1">Shop Address:</p>
                                    <p className="mb-2">
                                        r.p road, r.p road, Muncipal Office Rd,<br />
                                        Mancherial, Telangana 504208, India
                                    </p>
                                    <a href="https://maps.app.goo.gl/Kax6XQXhXGBDRdfJA" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline text-sm">View on Map</a>

                                    <p className="font-bold text-cream mt-4 mb-1">Godown Address:</p>
                                    <p className="mb-2">
                                        Gayatri Temple Road,<br />
                                        Mancherial, Telangana 504208, India
                                    </p>
                                    <a href="https://maps.app.goo.gl/P2pjtVGARDG3D9dTA" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline text-sm">View on Map</a>
                                </div>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-6 w-6 mr-3 text-secondary flex-shrink-0" />
                                <span className="text-cream-dark">+91 99490 23883</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-6 w-6 mr-3 text-secondary flex-shrink-0" />
                                <span className="text-cream-dark">gundasrinivas883@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-night-light mt-16 pt-8 text-center text-cream-dark/60 text-sm">
                    <p>&copy; {new Date().getFullYear()} Gunda Srinivas Wholesale Fireworks. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
