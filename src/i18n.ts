import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      header: {
        home: "Home",
        courses: "Courses",
        about: "About",
        blog: "Blog",
        contact: "Contact",
        startLearning: "Start Learning",
        login: "Log In",
        register: "Sign Up",
        userDashboard: "My Dashboard",
        adminDashboard: "Admin Dashboard",
        adminPanel: "Admin Panel"
      },
      profile: {
        title: "Your Profile",
        name: "Name",
        email: "Email",
        username: "Username",
        save: "Save Changes",
        edit: "Edit Profile",
        deleteAccount: "Delete Account",
        deleteConfirmation: "Are you sure you want to delete your account? This action cannot be undone.",
        updateError: "Failed to update profile. Please try again.",
        deleteError: "Failed to delete account. Please try again.",
        noUserEmail: "No user email found. Please try logging out and logging in again.",
      },
      languageSwitch: {
        he: "עברית",
        en: "English"
      },
      hero: {
        title: "Master Hebrew: Your Gateway to Israeli Culture",
        subtitle: "Innovative Learning, Real Conversations, Rapid Results",
        description: "Join Israel's Premier Language Community • Tailored Courses • Native Speakers",
        cta: "Unlock Your Hebrew Potential"
      },
      leadForm: {
        title: "Embark on Your Hebrew Journey Today",
        subtitle: "Get personalized course information tailored to your goals",
        fullName: "Full Name",
        email: "Email Address",
        phone: "Phone Number",
        submit: "Start My Hebrew Adventure",
        thankYou: "Thank you! We'll be in touch with your personalized plan soon."
      },
      footer: {
        rights: "All Rights Reserved",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service"
      },
      whoWeAre: "WHO WE ARE",
      whoWeAreTitle: "Who We Are",
      whoWeAreContent: "The Hebrew Club offers a unique learning experience that combines advanced teaching methods with personal support. We believe in the potential of every student to succeed in learning the Hebrew language.",
      ourGoal: "Our Goal",
      ourGoalContent: "We aim to create an encouraging learning environment that helps students overcome language barriers and use Hebrew confidently in everyday life.",
      ourMethod1: "Our Method #1",
      ourMethod1Content: "Our method is based on dialogues and role-playing. We believe that practicing through practical conversations is the key to improving language skills efficiently and quickly.",
      ourMethod2: "Our Method #2",
      ourMethod2Content: "In addition to dialogues, we use reading and writing techniques to strengthen the linguistic foundation. Students learn to read diverse texts and write clearly.",
      ourMethod3: "Our Method #3",
      ourMethod3Content: "We believe in the importance of cultural experience in language learning. Our students are exposed to Israeli culture through music, movies, stories, and events.",
      ourDream: "Our Dream",
      ourDreamContent: "Our dream is to see our students using Hebrew confidently and joyfully in their daily lives. We aspire to make The Hebrew Club a place where everyone feels they belong and can learn, grow, and succeed.",
      courses: {
        titleMain: "Our Hebrew Courses",
        titleSub: "Choose Your Path to Fluency",
        levels: {
          all: "All Levels",
          beginner: "Beginner",
          intermediate: "Intermediate",
          advanced: "Advanced"
        },
        beginner: {
          title: "Hebrew for Beginners",
          description: "Start your Hebrew journey with confidence",
          highlight: "Perfect for newcomers",
          features: [
            "Master the Hebrew alphabet",
            "Build basic vocabulary",
            "Learn everyday phrases"
          ]
        },
        intermediate: {
          title: "Intermediate Hebrew",
          description: "Enhance your Hebrew skills and fluency",
          highlight: "Boost your conversation skills",
          features: [
            "Complex grammar structures",
            "Expand your vocabulary",
            "Cultural insights"
          ]
        },
        advanced: {
          title: "Advanced Hebrew",
          description: "Refine your Hebrew to near-native proficiency",
          highlight: "Achieve language mastery",
          features: [
            "Nuanced expressions",
            "Literary Hebrew",
            "Advanced writing skills"
          ]
        },
        business: {
          title: "Business Hebrew",
          description: "Hebrew for professional environments",
          highlight: "Excel in Israeli business world",
          features: [
            "Business terminology",
            "Professional communication",
            "Cultural business etiquette"
          ]
        },
        price: "Course Price: {{price}}",
        enroll: "Enroll Now"
      },
      auth: {
        login: "Log In",
        register: "Sign Up",
        email: "Email",
        password: "Password",
        name: "Name",
        username: "Username",
        confirmPassword: "Confirm Password",
        rememberMe: "Remember Me",
        forgotPassword: "Forgot Password?",
        loginFailed: "Login failed. Please check your credentials.",
        emailExists: "A user with this email already exists.",
        usernameExists: "This username is already taken. Please choose another.",
        registrationFailed: "Registration failed. Please try again.",
        unexpectedError: "An unexpected error occurred. Please try again later.",
        loggingIn: "Logging in...",
        registering: "Registering...",
        passwordMismatch: "Passwords do not match.",
        invalidEmail: "Please enter a valid email address.",
        requiredField: "This field is required.",
        passwordTooShort: "Password must be at least 8 characters long.",
        nameTooShort: "Name must be at least 2 characters long.",
        usernameTooShort: "Username must be at least 3 characters long.",
        usernameInvalid: "Username can only contain letters, numbers, and underscores.",
        socialLoginFailed: "Social login failed. Please try again.",
        orLoginWith: "Or login with",
        noAccount: "Don't have an account?",
        alreadyHaveAccount: "Already have an account?",
        closeModal: "Close modal"
      },
      courseManagement: {
        title: "Course Management",
        loading: "Loading courses...",
        error: "An error occurred while loading courses. Please try again.",
        noCourses: "No courses available.",
        loginRequired: "Please log in to view your courses.",
        duration: "Duration: {{weeks}} weeks",
        level: "Level: {{level}}",
        estimatedTime: "Estimated time: {{hours}} hours",
        instructors: "Instructors:",
        viewCourse: "View Course"
      },
      paymentPage: {
        title: "Payment",
        enrollmentSummary: "Enrollment Summary",
        course: "Course",
        startDate: "Start Date",
        paymentOption: "Payment Option",
        fullPayment: "Full Payment",
        installments: "Installments",
        totalAmount: "Total Amount",
        courseDetails: "Course Details",
        level: "Level",
        duration: "Duration",
        format: "Format",
        cardNumber: "Card Number",
        expiryDate: "Expiry Date",
        cvv: "CVV",
        cardholderName: "Cardholder Name",
        fullNamePlaceholder: "Enter your full name",
        promoCode: "Promo Code",
        promoCodePlaceholder: "Enter promo code",
        payNow: "Pay Now",
        processing: "Processing...",
        securePaymentNote: "Your payment is secure and encrypted",
        loading: "Loading...",
        paymentSuccessful: "Payment Successful!",
        transactionId: "Transaction ID",
        authNumber: "Authorization Number",
        amount: "Amount",
        date: "Date",
        downloadReceipt: "Download Receipt",
        returnToDashboard: "Return to Dashboard",
        errors: {
          fetchFailed: "Failed to fetch enrollment details. Please try again.",
          fetchCourseFailed: "Failed to fetch course details. Please try again.",
          noEnrollmentId: "No enrollment ID provided.",
          noEnrollmentDetails: "No enrollment details found.",
          paymentNotSuccessful: "Payment was not successful. Please try again.",
          unexpectedPaymentStructure: "Unexpected payment structure received.",
          noPaymentInResponse: "No payment information in the response.",
          unexpectedResponseType: "Unexpected response type received.",
          unknownError: "An unknown error occurred. Please try again."
        }
      },
      enrollModal: {
        title: "Enroll in {{course}}",
        subtitle: "Take the first step towards Hebrew fluency!",
        name: "Full Name",
        email: "Email Address",
        phone: "Phone Number (optional)",
        submit: "Start My Hebrew Journey",
        benefits: {
          title: "Why Choose Our Course?",
          item1: "Expert native Hebrew instructors",
          item2: "Flexible learning schedule",
          item3: "Interactive and engaging lessons"
        },
        satisfiedStudents: "{{count, number}} satisfied students",
        securePayment: "Secure Payment",
        limitedTimeOffer: "Limited Time Offer!",
        courseHighlights: "Course Highlights",
        benefit1: "Personalized learning experience",
        benefit2: "Access to exclusive learning materials",
        benefit3: "Live practice sessions with native speakers",
        videoNotSupported: "Your browser does not support the video tag.",
        testimonial: "This course has transformed my Hebrew skills!",
        testimonialAuthor: "Sarah L., Satisfied Student",
        pricingOptions: "Pricing Options",
        fullPayment: "Full Payment",
        installments: "Installments",
        promoCodePlaceholder: "Enter promo code",
        promoApplied: "Promo code applied",
        applyPromo: "Apply Promo",
        moneyBackGuarantee: "30-day money-back guarantee",
        confirmation: "Confirmation",
        confirmationText: "Please review your enrollment details below:",
        enrollmentSummary: "Enrollment Summary",
        course: "Course",
        paymentPlan: "Payment Plan",
        totalPrice: "Total Price",
        fullPrice: "$999",
        installmentPrice: "3 x $333",
        agreeToTerms: "I agree to the terms and conditions",
        processing: "Processing...",
        enroll: "Enroll Now",
        previous: "Previous",
        next: "Next",
        faqTitle: "Frequently Asked Questions",
        faq1Question: "How long do I have access to the course?",
        faq1Answer: "You have lifetime access to all course materials after enrollment.",
        faq2Question: "Is there a money-back guarantee?",
        faq2Answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with the course.",
        whatOthersSay: "What Others Say About Our Courses"
      }

      
    }
    
  },
  
  he: {
    translation: {
      header: {
        home: "דף הבית",
        courses: "קורסים",
        about: "אודות",
        blog: "בלוג",
        contact: "צור קשר",
        startLearning: "התחל ללמוד",
        login: "התחברות",
        register: "הרשמה",
        userDashboard: "הדשבורד שלי",
        adminDashboard: "דשבורד מנהל",
        adminPanel: "פאנל ניהול"
      },
      profile: {
        title: "הפרופיל שלך",
        name: "שם",
        email: "אימייל",
        username: "שם משתמש",
        save: "שמור שינויים",
        edit: "ערוך פרופיל",
        deleteAccount: "מחק חשבון",
        deleteConfirmation: "האם אתה בטוח שברצונך למחוק את החשבון שלך? פעולה זו אינה ניתנת לביטול.",
        updateError: "עדכון הפרופיל נכשל. אנא נסה שנית.",
        deleteError: "מחיקת החשבון נכשלה. אנא נסה שנית.",
      },
      languageSwitch: {
        he: "עברית",
        en: "English"
      },
      hero: {
        title: "שלוט בעברית: השער שלך לתרבות הישראלית",
        subtitle: "למידה חדשנית, שיחות אמיתיות, תוצאות מהירות",
        description: "הצטרף לקהילת הלומדים המובילה בישראל • קורסים מותאמים אישית • מורים דוברי שפת אם",
        cta: "גלה את הפוטנציאל שלך בעברית"
      },
      leadForm: {
        title: "התחל את מסע העברית שלך היום",
        subtitle: "קבל מידע מותאם אישית על הקורס המתאים למטרות שלך",
        fullName: "שם מלא",
        email: "כתובת אימייל",
        phone: "מספר טלפון",
        submit: "התחל את הרפתקת העברית שלי",
        thankYou: "תודה רבה! ניצור איתך קשר בקרוב עם תוכנית מותאמת אישית."
      },
      footer: {
        rights: "כל הזכויות שמורות",
        privacyPolicy: "מדיניות פרטיות",
        termsOfService: "תנאי שימוש"
      },
      whoWeAre: "מי אנחנו",
      whoWeAreTitle: "מי אנחנו",
      whoWeAreContent: "המועדון העברי מציע חוויית למידה ייחודית המשלבת שיטות הוראה מתקדמות עם תמיכה אישית. אנו מאמינים בפוטנציאל של כל תלמיד להצליח בלימוד השפה העברית.",
      ourGoal: "המטרה שלנו",
      ourGoalContent: "אנו שואפים ליצור סביבת למידה מעודדת שעוזרת לתלמידים להתגבר על מחסומי שפה ולהשתמש בעברית בביטחון בחיי היומיום.",
      ourMethod1: "השיטה שלנו #1",
      ourMethod1Content: "השיטה שלנו מבוססת על דיאלוגים ומשחקי תפקידים. אנו מאמינים שתרגול באמצעות שיחות מעשיות הוא המפתח לשיפור מיומנויות השפה ביעילות ובמהירות.",
      ourMethod2: "השיטה שלנו #2",
      ourMethod2Content: "בנוסף לדיאלוגים, אנו משתמשים בטכניקות קריאה וכתיבה לחיזוק הבסיס הלשוני. התלמידים לומדים לקרוא טקסטים מגוונים ולכתוב בבהירות.",
      ourMethod3: "השיטה שלנו #3",
      ourMethod3Content: "אנו מאמינים בחשיבות החוויה התרבותית בלמידת שפה. התלמידים שלנו נחשפים לתרבות הישראלית דרך מוזיקה, סרטים, סיפורים ואירועים.",
      ourDream: "החלום שלנו",
      ourDreamContent: "החלום שלנו הוא לראות את התלמידים שלנו משתמשים בעברית בביטחון ובשמחה בחיי היומיום. אנו שואפים להפוך את המועדון העברי למקום שבו כולם מרגישים שייכים ויכולים ללמוד, לצמוח ולהצליח.",
      courses: {
        titleMain: "הקורסים שלנו",
        titleSub: "בחר את המסלול שלך לשליטה בעברית",
        levels: {
          all: "כל הרמות",
          beginner: "מתחילים",
          intermediate: "בינוניים",
          advanced: "מתקדמים"
        },
        beginner: {
          title: "עברית למתחילים",
          description: "התחל את מסע העברית שלך בביטחון",
          highlight: "מושלם למתחילים",
          features: [
            "שליטה באלף-בית העברי",
            "בניית אוצר מילים בסיסי",
            "לימוד ביטויים יומיומיים"
          ]
        },
        intermediate: {
          title: "עברית ברמה בינונית",
          description: "שפר את מיומנויות העברית והשטף שלך",
          highlight: "חזק את כישורי השיחה שלך",
          features: [
            "מבנים דקדוקיים מורכבים",
            "הרחבת אוצר המילים",
            "תובנות תרבותיות"
          ]
        },
        advanced: {
          title: "עברית מתקדמת",
          description: "שכלל את העברית שלך לרמה כמעט של שפת אם",
          highlight: "השג שליטה מלאה בשפה",
          features: [
            "ביטויים מדויקים",
            "עברית ספרותית",
            "מיומנויות כתיבה מתקדמות"
          ]
        },
        business: {
          title: "עברית עסקית",
          description: "עברית לסביבות מקצועיות",
          highlight: "הצטיין בעולם העסקים הישראלי",
          features: [
            "מונחים עסקיים",
            "תקשורת מקצועית",
            "אתיקה עסקית תרבותית"
          ]
        },
        price: "מחיר הקורס: {{price}}",
        enroll: "הירשם עכשיו"
      },
      auth: {
        login: "התחברות",
        register: "הרשמה",
        email: "אימייל",
        password: "סיסמה",
        name: "שם",
        username: "שם משתמש",
        confirmPassword: "אימות סיסמה",
        rememberMe: "זכור אותי",
        forgotPassword: "שכחת סיסמה?",
        loginFailed: "ההתחברות נכשלה. אנא בדוק את פרטי ההתחברות שלך.",
        emailExists: "משתמש עם אימייל זה כבר קיים במערכת.",
        usernameExists: "שם המשתמש כבר תפוס. אנא בחר שם משתמש אחר.",
        registrationFailed: "ההרשמה נכשלה. אנא נסה שנית.",
        unexpectedError: "אירעה שגיאה בלתי צפויה. אנא נסה שנית מאוחר יותר.",
        loggingIn: "מתחבר...",
        registering: "נרשם...",
        passwordMismatch: "הסיסמאות אינן תואמות.",
        invalidEmail: "אנא הזן כתובת אימייל תקינה.",
        requiredField: "שדה זה הוא חובה.",
        passwordTooShort: "הסיסמה חייבת להיות לפחות 8 תווים.",
        nameTooShort: "השם חייב להכיל לפחות 2 תווים.",
        usernameTooShort: "שם המשתמש חייב להכיל לפחות 3 תווים.",
        usernameInvalid: "שם המשתמש יכול להכיל רק אותיות, מספרים וקו תחתון.",
        socialLoginFailed: "ההתחברות החברתית נכשלה. אנא נסה שנית.",
        orLoginWith: "או התחבר באמצעות",
        noAccount: "אין לך חשבון?",
        alreadyHaveAccount: "כבר יש לך חשבון?",
        closeModal: "סגור חלון"
      },
      courseManagement: {
        title: "ניהול קורסים",
        loading: "טוען קורסים...",
        error: "אירעה שגיאה בטעינת הקורסים. אנא נסה שנית.",
        noCourses: "אין קורסים זמינים.",
        loginRequired: "אנא התחבר כדי לצפות בקורסים שלך.",
        duration: "משך: {{weeks}} שבועות",
        level: "רמה: {{level}}",
        estimatedTime: "זמן משוער: {{hours}} שעות",
        instructors: "מדריכים:",
        viewCourse: "צפה בקורס"
      },
      paymentPage: {
        title: "תשלום",
        enrollmentSummary: "סיכום הרשמה",
        course: "קורס",
        startDate: "תאריך התחלה",
        paymentOption: "אפשרות תשלום",
        fullPayment: "תשלום מלא",
        installments: "תשלומים",
        totalAmount: "סכום כולל",
        courseDetails: "פרטי הקורס",
        level: "רמה",
        duration: "משך",
        format: "פורמט",
        cardNumber: "מספר כרטיס",
        expiryDate: "תאריך תפוגה",
        cvv: "קוד אבטחה",
        cardholderName: "שם בעל הכרטיס",
        fullNamePlaceholder: "הכנס את שמך המלא",
        promoCode: "קוד קופון",
        promoCodePlaceholder: "הכנס קוד קופון",
        payNow: "שלם עכשיו",
        processing: "מעבד...",
        securePaymentNote: "התשלום שלך מאובטח ומוצפן",
        loading: "טוען...",
        paymentSuccessful: "התשלום בוצע בהצלחה!",
        transactionId: "מזהה עסקה",
        authNumber: "מספר אישור",
        amount: "סכום",
        date: "תאריך",
        downloadReceipt: "הורד קבלה",
        returnToDashboard: "חזור ללוח הבקרה",
        downloading: "מוריד...",
receiptDownloaded: "הקבלה הורדה בהצלחה!",
receiptDownloadFailed: "הורדת הקבלה נכשלה. אנא נסה שנית.",
welcomeEmailSent: "אימייל ברוכים הבאים נשלח בהצלחה!",
welcomeEmailFailed: "שליחת אימייל ברוכים הבאים נכשלה. אנא צור קשר עם התמיכה.",
welcomeEmailMessage: "ברוכים הבאים לקורס {{courseName}}! אנו שמחים שהצטרפת אלינו.",
        errors: {
          fetchFailed: "נכשל בהבאת פרטי ההרשמה. אנא נסה שנית.",
          fetchCourseFailed: "נכשל בהבאת פרטי הקורס. אנא נסה שנית.",
          noEnrollmentId: "לא סופק מזהה הרשמה.",
          noEnrollmentDetails: "לא נמצאו פרטי הרשמה.",
          paymentNotSuccessful: "התשלום לא הצליח. אנא נסה שנית.",
          unexpectedPaymentStructure: "התקבל מבנה תשלום בלתי צפוי.",
          noPaymentInResponse: "אין מידע על תשלום בתגובה.",
          unexpectedResponseType: "התקבל סוג תגובה בלתי צפוי.",
          unknownError: "אירעה שגיאה לא ידועה. אנא נסה שנית."
        }
      },
      enrollModal: {
        title: "הרשמה ל{{course}}",
        subtitle: "עשה את הצעד הראשון לקראת שליטה בעברית!",
        name: "שם מלא",
        email: "כתובת אימייל",
        phone: "מספר טלפון (אופציונלי)",
        submit: "התחל את מסע העברית שלי",
        benefits: {
          title: "למה לבחור בקורס שלנו?",
          item1: "מדריכים מומחים דוברי עברית שפת אם",
          item2: "לוח זמנים גמיש ללמידה",
          item3: "שיעורים אינטראקטיביים ומעניינים"
        },
        satisfiedStudents: "{{count}} תלמידים מרוצים",
        securePayment: "תשלום מאובטח",
        limitedTimeOffer: "הצעה מוגבלת בזמן!",
        courseHighlights: "נקודות מפתח בקורס",
        benefit1: "חוויית למידה מותאמת אישית",
        benefit2: "גישה לחומרי לימוד בלעדיים",
        benefit3: "מפגשי תרגול חיים עם דוברים ילידים",
        videoNotSupported: "הדפדפן שלך אינו תומך בתג הווידאו.",
        testimonial: "הקורס הזה שינה את יכולות העברית שלי!",
        testimonialAuthor: "שרה ל., תלמידה מרוצה",
        pricingOptions: "אפשרויות תשלום",
        fullPayment: "תשלום מלא",
        installments: "תשלומים",
        promoCodePlaceholder: "הכנס קוד קופון",
        promoApplied: "קוד קופון הופעל",
        applyPromo: "הפעל קופון",
        moneyBackGuarantee: "30 יום אחריות החזר כספי",
        confirmation: "אישור",
        confirmationText: "אנא בדוק את פרטי ההרשמה שלך להלן:",
        enrollmentSummary: "סיכום הרשמה",
        course: "קורס",
        paymentPlan: "תכנית תשלום",
        totalPrice: "מחיר כולל",
        fullPrice: "₪3,999",
        installmentPrice: "3 x ₪1,333",
        agreeToTerms: "אני מסכים לתנאים וההגבלות",
        processing: "מעבד...",
        enroll: "הירשם עכשיו",
        previous: "הקודם",
        next: "הבא",
        faqTitle: "שאלות נפוצות",
        faq1Question: "לכמה זמן יש לי גישה לקורס?",
        faq1Answer: "יש לך גישה לכל חומרי הקורס לכל החיים לאחר ההרשמה.",
        faq2Question: "האם יש אחריות להחזר כספי?",
        faq2Answer: "כן, אנו מציעים אחריות להחזר כספי של 30 יום אם אינך מרוצה מהקורס.",
        whatOthersSay: "מה אומרים אחרים על הקורסים שלנו"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'he',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;