import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import HeroSection from '../components/HomePageSections/HeroSection';
import FeaturedJobs from '../components/HomePageSections/FeaturedJobs';
import AIFilterSection from '../components/HomePageSections/AIFilterSection';
import TopCompanies from '../components/HomePageSections/TopCompanies';
import PopularCategories from '../components/HomePageSections/PopularCategories';
import CareerAdviceSection from '../components/HomePageSections/CareerAdviceSection';
import CVBuilderIntro from '../components/HomePageSections/CVBuilderIntro';
import UsefulToolsIntro from '../components/HomePageSections/UsefulToolsIntro';

const HomePage = ({ setCurrentPage, isLoggedIn, user, handleLogout, showAlert }) => {
  return (
    <div className="bg-gray-100 flex flex-col min-h-screen">
      <Header setCurrentPage={setCurrentPage} isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <HeroSection />
        <FeaturedJobs />
        <AIFilterSection showAlert={showAlert} />
        <TopCompanies />
        <PopularCategories />
        <CareerAdviceSection />
        <CVBuilderIntro />
        <UsefulToolsIntro />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;