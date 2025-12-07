import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { logContactToSheets } from '../utils/sheetsService';

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Log to Google Sheets
        await logContactToSheets(formData);

        // Show success message
        alert('Thank you! Your message has been sent successfully.');

        // Reset form
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            message: ''
        });
    };

    return (
        <div className="bg-cream py-20 px-4 overflow-hidden sm:px-6 lg:px-8" id="contact">
            <div className="relative max-w-xl mx-auto">
                <div className="text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl font-serif">Get in Touch</h2>
                    <p className="mt-4 text-lg leading-6 text-slate-light font-light">
                        Interested in wholesale pricing or have questions about our products? We're here to help.
                    </p>
                </div>
                <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-primary">
                                First name
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="firstName"
                                    id="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    autoComplete="given-name"
                                    className="py-3 px-4 block w-full shadow-sm focus:ring-secondary focus:border-secondary border-gray-200 rounded-xl bg-gray-50 transition-colors focus:bg-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-primary">
                                Last name
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="lastName"
                                    id="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    autoComplete="family-name"
                                    className="py-3 px-4 block w-full shadow-sm focus:ring-secondary focus:border-secondary border-gray-200 rounded-xl bg-gray-50 transition-colors focus:bg-white"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="email" className="block text-sm font-medium text-primary">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    className="py-3 px-4 block w-full shadow-sm focus:ring-secondary focus:border-secondary border-gray-200 rounded-xl bg-gray-50 transition-colors focus:bg-white"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="phone" className="block text-sm font-medium text-primary">
                                Phone Number
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    autoComplete="tel"
                                    className="py-3 px-4 block w-full focus:ring-secondary focus:border-secondary border-gray-200 rounded-xl bg-gray-50 transition-colors focus:bg-white"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="message" className="block text-sm font-medium text-primary">
                                Message
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="py-3 px-4 block w-full shadow-sm focus:ring-secondary focus:border-secondary border border-gray-200 rounded-xl bg-gray-50 transition-colors focus:bg-white"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <button
                                type="submit"
                                className="w-full inline-flex items-center justify-center px-6 py-4 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 transform hover:-translate-y-1"
                            >
                                Send Message <Send className="ml-2 h-5 w-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
