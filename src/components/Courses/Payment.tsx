import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { associateCourseWithUser as apiAssociateCourseWithUser } from "../../services/api";
import axios, { AxiosResponse } from "axios";
import {
  fetchEnrollmentDetails,
  fetchCourseDetails,
  updateLead,
} from "../../services/api";
import {
  Lead,
  ApiResponse,
  Course,
  User,
  UserData,
} from "../../admin/types/models";
import styles from "./Payment.module.css";
import { login, register, getCurrentUser } from "../../services/auth";
import emailService from "../../services/emailService";

// Interfaces for SUMIT API
interface SumitPaymentRequest {
  Customer: {
    ExternalIdentifier: string | null;
    NoVAT: boolean | null;
    SearchMode: number;
    Name: string;
    Phone: string | null;
    EmailAddress: string | null;
    City: string | null;
    Address: string | null;
    ZipCode: string | null;
    CompanyNumber: string | null;
    ID: string | null;
    Folder: string | null;
    Properties: any | null;
  };
  PaymentMethod: {
    ID: string | null;
    CustomerID: string | null;
    CreditCard_Number: string;
    CreditCard_LastDigits: string | null;
    CreditCard_ExpirationMonth: number;
    CreditCard_ExpirationYear: number;
    CreditCard_CVV: string;
    CreditCard_Track2: string | null;
    CreditCard_CitizenID: string;
    CreditCard_CardMask: string | null;
    CreditCard_Token: string | null;
    DirectDebit_Bank: string | null;
    DirectDebit_Branch: string | null;
    DirectDebit_Account: string | null;
    DirectDebit_ExpirationDate: string | null;
    DirectDebit_MaximumAmount: number | null;
    Type: number;
  };
  SingleUseToken: string | null;
  CreditCardAuthNumber: string | null;
  Items: Array<{
    Item: {
      ID: string | null;
      Name: string;
      Description: string | null;
      Price: number | null;
      Currency: string | null;
      Cost: number | null;
      ExternalIdentifier: string | null;
      SKU: string | null;
      SearchMode: number | null;
      Properties: any | null;
    };
    Quantity: number;
    UnitPrice: number;
    Total: number | null;
    Currency: string | null;
    Description: string | null;
  }>;
  Payments_Credit: number | null;
  Payments_Count: number | null;
  Payments_FirstAmount: number | null;
  Payments_NonFirstAmount: number | null;
  UpdateCustomerByEmail: boolean | null;
  UpdateCustomerByEmail_AttachDocument: boolean | null;
  UpdateCustomerByEmail_Language: string | null;
  SendDocumentByEmail: boolean;
  SendDocumentByEmail_Language: string | null;
  DocumentLanguage: string | null;
  DocumentDescription: string | null;
  VATIncluded: boolean;
  VATRate: number | null;
  AuthoriseOnly: boolean | null;
  DraftDocument: boolean | null;
  DocumentType: string | null;
  SupportCredit: boolean | null;
  MerchantNumber: string | null;
  SendCopyToOrganization: boolean | null;
  CardTokenNotNeeded: boolean | null;
  AutoCapture: boolean | null;
  AuthorizeAmount: number | null;
  PreventStandingOrder: boolean | null;
  Credentials: {
    CompanyID: number;
    APIKey: string;
  };
  ResponseLanguage: string | null;
}

interface SumitPaymentResponse {
  Data: {
    PaymentId?: number;
    CustomerId?: number;
    Date?: string;
    Amount?: number;
    Last4Digits?: string;
    ConfirmationNumber?: string;
    DocumentID?: number;
    DocumentNumber?: number;
    PdfUrl?: string;
  };
  Status: number;
  UserErrorMessage: string | null;
  TechnicalErrorDetails: string | null;
}

interface DocumentDownloadRequest {
  Credentials: {
    CompanyID: number;
    APIKey: string;
  };
  DocumentID: number;
  DocumentType: string;
  DocumentNumber: number;
  Original: boolean;
}

interface EnrollmentDetails {
  _id: string;
  courseId: string[];
  email: string;
  promoCode?: string;
}

interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  name: string;
  citizenId: string;
}

// Constants
const SUMIT_API_BASE_URL = "https://api.sumit.co.il";
const SUMIT_CHARGE_ENDPOINT = `${SUMIT_API_BASE_URL}/billing/payments/charge/`;
const SUMIT_DOCUMENT_ENDPOINT = `${SUMIT_API_BASE_URL}/accounting/documents/getpdf/`;
const COMPANY_ID = 252257037;
const API_KEY = "qMlfvIRBPy8CUoOyY50HvDYoM7XxlR4EeYVn7reITKtDB6H1SG";

const PaymentPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    citizenId: "",
  });
  const [enrollmentDetails, setEnrollmentDetails] =
    useState<EnrollmentDetails | null>(null);
  const [courseDetails, setCourseDetails] = useState<Course | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionDetails, setTransactionDetails] =
    useState<SumitPaymentResponse | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [paymentOption, setPaymentOption] = useState<"full" | "installments">(
    "full"
  );
  const [installmentsCount, setInstallmentsCount] = useState(1);
  const [payingForCourseId, setPayingForCourseId] = useState<string | null>(
    null
  );

  useEffect(() => {
    console.log("PaymentPage component mounted");
    const fetchDetails = async (enrollmentId: string) => {
      try {
        console.log("Fetching enrollment details for:", enrollmentId);
        const enrollmentResponse: ApiResponse<Lead> =
          await fetchEnrollmentDetails(enrollmentId);
        if (enrollmentResponse.success && enrollmentResponse.data) {
          const lead = enrollmentResponse.data;
          setEnrollmentDetails({
            _id: lead._id,
            courseId: lead.courseInterest,
            email: lead.email,
            promoCode: lead.promoCode,
          });

          if (lead.courseInterest && lead.courseInterest.length > 0) {
            const courseResponse: ApiResponse<Course> =
              await fetchCourseDetails(lead.courseInterest[0]);
            if (courseResponse.success && courseResponse.data) {
              setCourseDetails(courseResponse.data);
              setPayingForCourseId(courseResponse.data._id);
            } else {
              throw new Error(t("paymentPage.errors.fetchCourseFailed"));
            }
          }
        } else {
          throw new Error(t("paymentPage.errors.fetchFailed"));
        }
      } catch (error) {
        console.error("Error fetching details:", error);
        setError(t("paymentPage.errors.fetchFailed"));
      } finally {
        setIsLoading(false);
      }
    };

    const enrollmentId = new URLSearchParams(location.search).get(
      "enrollmentId"
    );
    if (enrollmentId) {
      fetchDetails(enrollmentId);
    } else {
      setError(t("paymentPage.errors.noEnrollmentId"));
      setIsLoading(false);
    }
  }, [location, t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value);
  };

  const handlePaymentOptionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPaymentOption(e.target.value as "full" | "installments");
  };

  const handleInstallmentsCountChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setInstallmentsCount(Number(e.target.value));
  };

  const processSumitPayment = async (
    paymentData: PaymentDetails
  ): Promise<SumitPaymentResponse> => {
    try {
      const request: SumitPaymentRequest = {
        Customer: {
          ExternalIdentifier: null,
          NoVAT: null,
          SearchMode: 0,
          Name: paymentData.name,
          Phone: null,
          EmailAddress: enrollmentDetails?.email || null,
          City: null,
          Address: null,
          ZipCode: null,
          CompanyNumber: null,
          ID: null,
          Folder: null,
          Properties: null,
        },
        PaymentMethod: {
          ID: null,
          CustomerID: null,
          CreditCard_Number: paymentData.cardNumber,
          CreditCard_LastDigits: null,
          CreditCard_ExpirationMonth: parseInt(
            paymentData.expiryDate.split("/")[0]
          ),
          CreditCard_ExpirationYear: parseInt(
            "20" + paymentData.expiryDate.split("/")[1]
          ),
          CreditCard_CVV: paymentData.cvv,
          CreditCard_Track2: null,
          CreditCard_CitizenID: paymentData.citizenId,
          CreditCard_CardMask: null,
          CreditCard_Token: null,
          DirectDebit_Bank: null,
          DirectDebit_Branch: null,
          DirectDebit_Account: null,
          DirectDebit_ExpirationDate: null,
          DirectDebit_MaximumAmount: null,
          Type: 1,
        },
        SingleUseToken: null,
        CreditCardAuthNumber: null,
        Items: [
          {
            Item: {
              ID: null,
              Name: courseDetails?.title || t("paymentPage.courseEnrollment"),
              Description: null,
              Price: null,
              Currency: null,
              Cost: null,
              ExternalIdentifier: null,
              SKU: null,
              SearchMode: null,
              Properties: null,
            },
            Quantity: 1,
            UnitPrice: courseDetails?.price || 0,
            Total: null,
            Currency: null,
            Description: null,
          },
        ],
        Payments_Credit: null,
        Payments_Count:
          paymentOption === "installments" ? installmentsCount : null,
        Payments_FirstAmount: null,
        Payments_NonFirstAmount: null,
        UpdateCustomerByEmail: null,
        UpdateCustomerByEmail_AttachDocument: null,
        UpdateCustomerByEmail_Language: null,
        SendDocumentByEmail: true,
        SendDocumentByEmail_Language: null,
        DocumentLanguage: null,
        DocumentDescription: null,
        VATIncluded: true,
        VATRate: null,
        AuthoriseOnly: null,
        DraftDocument: null,
        DocumentType: null,
        SupportCredit: null,
        MerchantNumber: null,
        SendCopyToOrganization: null,
        CardTokenNotNeeded: null,
        AutoCapture: null,
        AuthorizeAmount: null,
        PreventStandingOrder: null,
        Credentials: {
          CompanyID: COMPANY_ID,
          APIKey: API_KEY,
        },
        ResponseLanguage: null,
      };

      console.log(
        "Sending request to SUMIT API:",
        JSON.stringify(request, null, 2)
      );

      const response = await axios.post<SumitPaymentResponse>(
        SUMIT_CHARGE_ENDPOINT,
        request
      );

      console.log(
        "Received response from SUMIT API:",
        JSON.stringify(response.data, null, 2)
      );

      return response.data;
    } catch (error) {
      console.error("SUMIT payment processing error:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data);
      }
      throw error;
    }
  };

  const downloadReceipt = async () => {
    if (!transactionDetails || !transactionDetails.Data) {
      console.error("No transaction details available");
      setDownloadError(t("paymentPage.errors.noTransactionDetails"));
      return;
    }

    setIsDownloading(true);
    setDownloadError(null);

    try {
      const request: DocumentDownloadRequest = {
        Credentials: {
          CompanyID: COMPANY_ID,
          APIKey: API_KEY,
        },
        DocumentID: transactionDetails.Data.DocumentID || 0,
        DocumentType: "Invoice",
        DocumentNumber: transactionDetails.Data.DocumentNumber || 0,
        Original: true,
      };

      console.log(
        "Sending request to SUMIT:",
        JSON.stringify(request, null, 2)
      );

      const response = await axios.post<ArrayBuffer>(
        SUMIT_DOCUMENT_ENDPOINT,
        request,
        {
          responseType: "arraybuffer",
          headers: {
            Accept: "application/pdf",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response headers:", response.headers);
      console.log("Response status:", response.status);

      const contentType = response.headers["content-type"];

      if (contentType && contentType.includes("application/json")) {
        const decoder = new TextDecoder("utf-8");
        const jsonString = decoder.decode(response.data);
        const jsonResponse = JSON.parse(jsonString);

        console.error("Received JSON response:", jsonResponse);

        if (jsonResponse.UserErrorMessage) {
          throw new Error(jsonResponse.UserErrorMessage);
        } else if (jsonResponse.TechnicalErrorDetails) {
          throw new Error(jsonResponse.TechnicalErrorDetails);
        } else {
          throw new Error(t("paymentPage.errors.unexpectedJsonResponse"));
        }
      }

      if (!contentType || !contentType.includes("application/pdf")) {
        throw new Error(`Unexpected content type: ${contentType}`);
      }

      const blob = new Blob([response.data], { type: "application/pdf" });

      if (blob.size === 0) {
        throw new Error(t("paymentPage.errors.emptyPdfFile"));
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `receipt_${transactionDetails.Data.DocumentNumber}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      console.log("Receipt downloaded successfully");
    } catch (error) {
      console.error("Error downloading receipt:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setDownloadError(
            `Error ${error.response.status}: ${error.response.statusText}`
          );
        } else if (error.request) {
          setDownloadError(t("paymentPage.errors.noResponse"));
        } else {
          setDownloadError(error.message);
        }
      } else if (error instanceof Error) {
        setDownloadError(error.message);
      } else {
        setDownloadError(t("paymentPage.errors.unknownError"));
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUserAndCourseAssociation = async (courseId: string) => {
    if (!enrollmentDetails || !courseDetails) return;

    try {
      // Check if user exists
      const existingUser = await getCurrentUser();

      let user: User;
      let temporaryPassword: string | null = null;

      if (existingUser) {
        // User exists, associate course with the existing user
        user = existingUser;
        await apiAssociateCourseWithUser(user._id, courseId);
      } else {
        // User doesn't exist, create a new user
        temporaryPassword = generateTemporaryPassword();
        const newUser = await createNewUser(temporaryPassword);
        if (newUser) {
          user = newUser;
          await apiAssociateCourseWithUser(user._id, courseId);
        } else {
          throw new Error("Failed to create new user");
        }
      }

      // Update lead status
      await updateLead(enrollmentDetails._id, {
        status: "qualified",
        paymentCompleted: true,
      });

      // Send welcome email with course details
      await emailService.sendWelcomeEmailWithCourseDetails(
        user.email,
        user.name,
        user.email,
        temporaryPassword || "Your existing password",
        courseDetails.title,
        dayjs(courseDetails.startDate).format("MMMM D, YYYY")
      );
    } catch (error) {
      console.error("Error handling user and course association:", error);
      setError(t("paymentPage.errors.userAssociationFailed"));
    }
  };

  function generateUsername(name: string, email: string): string {
    // Remove spaces and special characters from the name
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "");

    // Take the first part of the email (before @)
    const emailPart = email.split("@")[0];

    // Combine the clean name with part of the email
    const username = `${cleanName}_${emailPart}`.slice(0, 20); // Limit to 20 characters

    return username;
  }

  const createNewUser = async (
    temporaryPassword: string
  ): Promise<User | null> => {
    if (!enrollmentDetails) return null;

    const userData: UserData = {
      name: paymentDetails.name,
      email: enrollmentDetails.email,
      username: generateUsername(paymentDetails.name, enrollmentDetails.email),
      password: temporaryPassword,
      role: { name: "user" as const, permissions: [] },
      status: "active",
    };

    try {
      const response = await register(userData);
      if (response.user) {
        return response.user;
      }
      throw new Error("User registration failed");
    } catch (error) {
      console.error("Error creating new user:", error);
      throw error;
    }
  };

  const generateTemporaryPassword = () => {
    // Implement a function to generate a secure temporary password
    return Math.random().toString(36).slice(-8);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollmentDetails || !courseDetails || !payingForCourseId) return;

    setIsProcessing(true);
    setError(null);

    try {
      const sumitResponse = await processSumitPayment(paymentDetails);
      console.log("Raw SUMIT API response:", sumitResponse);

      if (
        sumitResponse &&
        typeof sumitResponse === "object" &&
        "Data" in sumitResponse
      ) {
        const { Data, Status, UserErrorMessage } = sumitResponse;

        if (Status === 0 && Data) {
          setPaymentSuccess(true);
          setTransactionDetails(sumitResponse);

          // After successful payment, associate only the paid course
          await handleUserAndCourseAssociation(payingForCourseId);
        } else {
          throw new Error(
            UserErrorMessage || t("paymentPage.errors.paymentNotSuccessful")
          );
        }
      } else {
        console.error("Unexpected response structure:", sumitResponse);
        throw new Error(t("paymentPage.errors.unexpectedResponseStructure"));
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(t("paymentPage.errors.unknownError"));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingSpinner}>{t("paymentPage.loading")}</div>
    );
  }
  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  if (!enrollmentDetails || !courseDetails) {
    return (
      <div className={styles.errorMessage}>
        {t("paymentPage.errors.noEnrollmentDetails")}
      </div>
    );
  }

  if (paymentSuccess && transactionDetails) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successMessage}>
          <h2>{t("paymentPage.paymentSuccessful")}</h2>
          <div className={styles.transactionDetails}>
            <p>
              <strong>{t("paymentPage.transactionId")}:</strong>{" "}
              {transactionDetails.Data.PaymentId}
            </p>
            <p>
              <strong>{t("paymentPage.authNumber")}:</strong>{" "}
              {transactionDetails.Data.ConfirmationNumber}
            </p>
            <p>
              <strong>{t("paymentPage.amount")}:</strong>{" "}
              {transactionDetails.Data.Amount} ILS
            </p>
            <p>
              <strong>{t("paymentPage.date")}:</strong>{" "}
              {dayjs(transactionDetails.Data.Date).format("MMMM D, YYYY HH:mm")}
            </p>
          </div>
          <div className={styles.actionButtons}>
            <button
              onClick={downloadReceipt}
              className={styles.downloadButton}
              disabled={isDownloading}
            >
              {isDownloading
                ? t("paymentPage.downloading")
                : t("paymentPage.downloadReceipt")}
            </button>
            {downloadError && (
              <div className={styles.errorMessage}>{downloadError}</div>
            )}
            <button
              onClick={() => navigate("/dashboard")}
              className={styles.returnButton}
            >
              {t("paymentPage.returnToDashboard")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.paymentPageContainer}>
      <h2 className={styles.pageTitle}>{t("paymentPage.title")}</h2>
      <div className={styles.enrollmentSummary}>
        <h3>{t("paymentPage.enrollmentSummary")}</h3>
        <p>
          {t("paymentPage.course")}: {courseDetails.title}
        </p>
        <p>
          {t("paymentPage.startDate")}:{" "}
          {dayjs(courseDetails.startDate).format("MMMM D, YYYY")}
        </p>
        <p>
          {t("paymentPage.totalAmount")}: ₪{courseDetails.price.toFixed(2)}
        </p>
        {enrollmentDetails.promoCode && (
          <p>
            {t("paymentPage.promoCode")}: {enrollmentDetails.promoCode}
          </p>
        )}
      </div>
      <div className={styles.courseDetails}>
        <h3>{t("paymentPage.courseDetails")}</h3>
        <p>
          {t("paymentPage.level")}: {courseDetails.level}
        </p>
        <p>
          {t("paymentPage.duration")}: {courseDetails.duration}
        </p>
        <p>
          {t("paymentPage.format")}: {courseDetails.courseFormat}
        </p>
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <form onSubmit={handleSubmit} className={styles.paymentForm}>
        <div className={styles.formGroup}>
          <label htmlFor="cardNumber">{t("paymentPage.cardNumber")}</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={paymentDetails.cardNumber}
            onChange={handleInputChange}
            required
            placeholder="1234 5678 9012 3456"
          />
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="expiryDate">{t("paymentPage.expiryDate")}</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={paymentDetails.expiryDate}
              onChange={handleInputChange}
              required
              placeholder="MM/YY"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="cvv">{t("paymentPage.cvv")}</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={paymentDetails.cvv}
              onChange={handleInputChange}
              required
              placeholder="123"
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="name">{t("paymentPage.cardholderName")}</label>
          <input
            type="text"
            id="name"
            name="name"
            value={paymentDetails.name}
            onChange={handleInputChange}
            required
            placeholder={t("paymentPage.fullNamePlaceholder")}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="citizenId">{t("paymentPage.citizenId")}</label>
          <input
            type="text"
            id="citizenId"
            name="citizenId"
            value={paymentDetails.citizenId}
            onChange={handleInputChange}
            required
            placeholder={t("paymentPage.citizenIdPlaceholder")}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="paymentOption">
            {t("paymentPage.paymentOption")}
          </label>
          <select
            id="paymentOption"
            name="paymentOption"
            value={paymentOption}
            onChange={handlePaymentOptionChange}
          >
            <option value="full">{t("paymentPage.fullPayment")}</option>
            <option value="installments">
              {t("paymentPage.installments")}
            </option>
          </select>
        </div>
        {paymentOption === "installments" && (
          <div className={styles.formGroup}>
            <label htmlFor="installmentsCount">
              {t("paymentPage.installmentsCount")}
            </label>
            <select
              id="installmentsCount"
              name="installmentsCount"
              value={installmentsCount}
              onChange={handleInstallmentsCountChange}
            >
              {[1, 2, 3, 4, 5, 6].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className={styles.formGroup}>
          <label htmlFor="promoCode">{t("paymentPage.promoCode")}</label>
          <input
            type="text"
            id="promoCode"
            name="promoCode"
            value={promoCode}
            onChange={handlePromoCodeChange}
            placeholder={t("paymentPage.promoCodePlaceholder")}
          />
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isProcessing}
        >
          {isProcessing ? t("paymentPage.processing") : t("paymentPage.payNow")}
        </button>
      </form>
      <div className={styles.securePaymentNote}>
        <i className="fas fa-lock"></i> {t("paymentPage.securePaymentNote")}
      </div>
    </div>
  );
};

export default PaymentPage;
