import React from 'react';
import HeroSection from '../components/HomePageSections/HeroSection';
import FeaturedJobs from '../components/HomePageSections/FeaturedJobs';
import AIFilterSection from '../components/HomePageSections/AIFilterSection';
import TopCompanies from '../components/HomePageSections/TopCompanies';
import PopularCategories from '../components/HomePageSections/PopularCategories';
import CareerAdviceSection from '../components/HomePageSections/CareerAdviceSection';
import CVBuilderIntro from '../components/HomePageSections/CVBuilderIntro';
import UsefulToolsIntro from '../components/HomePageSections/UsefulToolsIntro';


const HomePage = ({ showAlert }) => {
  return (
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
  );
};

export default HomePage;
