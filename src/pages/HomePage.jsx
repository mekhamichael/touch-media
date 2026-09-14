import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/common/Navbar';
import { Hero } from '../components/home/Hero';
import { Concepts } from '../components/home/Concepts';
import { MarqueeLogos } from '../components/home/MarqueeLogos';
import { About } from '../components/home/About';
import { ServicesGrid } from '../components/home/ServicesGrid';
import { Portfolio } from '../components/home/Portfolio';
import { ClientsPhysics } from '../components/home/ClientsPhysics';
import { ContactSection } from '../components/home/ContactSection';
import { Footer } from '../components/common/Footer';
import { BackToTop } from '../components/common/BackToTop';
import { useSEO } from '../hooks/useSEO';

export function HomePage() {
  useSEO({
    title: 'TouchMedia — We Turn Brands Into Experiences',
    description: 'Leading marketing and production agency specializing in BTL campaigns, creative branding, and end-to-end event solutions since 2006.',
    ogTitle: 'TouchMedia — We Turn Brands Into Experiences'
  });

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Concepts />
        <MarqueeLogos />
        <About />
        <ServicesGrid />
        <Portfolio />
        <ClientsPhysics />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
