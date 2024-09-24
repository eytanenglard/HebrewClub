import React from "react";
import Header from "../../components/Header/Header";
import HeroSection from "../../components/HeroSection/HeroSection";
import AboutUs from "../../components/AboutUs/AboutUs";
import Courses from "../../components/Courses/Courses";
import ContactForm from "../../components/ContactForm/ContactForm";
import LeadForm from "../../components/LeadForm/LeadForm";
import styles from "./HomePage.module.css";

interface HomePageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({
  onLoginClick,
  onRegisterClick,
}) => {

  return (
    <div className={styles.homePage}>
      <Header onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} />
      <main>
        <HeroSection />
        <AboutUs />
        <Courses />
        <ContactForm />
        <LeadForm />
      </main>
    </div>
  );
};

export default HomePage;
