import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Products from '../components/Products';
import Contact from '../components/Contact';

const Home = () => {
    return (
        <div>
            <Hero />
            <About />
            <Products />
            <Contact />
        </div>
    );
};

export default Home;
