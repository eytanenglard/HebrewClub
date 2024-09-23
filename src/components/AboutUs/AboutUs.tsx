import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./AboutUs.module.css";

interface BubbleInfo {
  title: string;
  content: string;
  icon: string;
}

const AboutUs: React.FC = () => {
  const { t } = useTranslation();

  const bubbles: BubbleInfo[] = [
    { title: "whoWeAreTitle", content: "whoWeAreContent", icon: "🏫" },
    { title: "ourGoal", content: "ourGoalContent", icon: "🎯" },
    { title: "ourMethod1", content: "ourMethod1Content", icon: "💬" },
    { title: "ourMethod2", content: "ourMethod2Content", icon: "📚" },
    { title: "ourMethod3", content: "ourMethod3Content", icon: "🎭" },
    { title: "ourDream", content: "ourDreamContent", icon: "🌟" },
  ];

  return (
    <section id="about" className={styles.aboutSection}>
      <h2 className={styles.aboutTitle}>{t("whoWeAre")}</h2>
      <div className={styles.aboutBubbles}>
        {bubbles.map((bubble, index) => (
          <div key={index} className={styles.bubbleContainer}>
            <div className={styles.bubble}>
              <div className={styles.bubbleNumber}>{index + 1}</div>
              <div className={styles.bubbleIcon}>{bubble.icon}</div>
              <div className={styles.bubbleContent}>
                <h3>{t(bubble.title)}</h3>
                <p>{t(bubble.content)}</p>
              </div>
              <div className={styles.glowEffect}></div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.ctaWrapper}>
        <a href="#learn-more" className={styles.ctaButton}>
          Speak to Learn - Learn to Speak
        </a>
      </div>
    </section>
  );
};

export default AboutUs;
