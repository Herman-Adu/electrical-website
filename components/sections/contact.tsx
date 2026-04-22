"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Turnstile } from "react-turnstile";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Zap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { submitContactInquiry } from "@/lib/actions/contact";
import { contactFormSchema } from "@/lib/schemas/contact";
import { ZodError } from "zod";

type ProjectType =
  | ""
  | "commercial"
  | "industrial"
  | "maintenance"
  | "consultation"
  | "other";

const contactInfo = [
  {
    icon: MapPin,
    label: "Location",
    value: "123 Industrial Parkway",
    subvalue: "Melbourne, VIC 3000",
  },
  {
    icon: Phone,
    label: "Emergency Line",
    value: "1800 NEX GEN",
    subvalue: "24/7 Available",
  },
  {
    icon: Mail,
    label: "Email",
    value: "contact@nexgen.com.au",
    subvalue: "Response within 2hrs",
  },
  {
    icon: Clock,
    label: "Operations",
    value: "Mon - Fri: 7AM - 6PM",
    subvalue: "Emergency: 24/7",
  },
];

export function Contact() {
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refCode, setRefCode] = useState("------");
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({});

  // Form state with proper initial values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "" as ProjectType,
    message: "",
  });

  // Clean, explicit input handler
  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.currentTarget; // Use currentTarget instead of target
      setFormData((prev) => ({
        ...prev,
        [name]: value, // Direct assignment without type checking in handler
      }));
      if (turnstileToken) {
        setTurnstileToken("");
      }
      if (captchaError) {
        setCaptchaError("");
      }
      // Clear field error when user starts typing
      if (fieldErrors[name]) {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    },
    [captchaError, fieldErrors, turnstileToken],
  );

  // Client-side validation using Zod
  const validateForm = useCallback((): boolean => {
    try {
      contactFormSchema.parse(formData);
      setFieldErrors({}); // Clear all errors on successful validation
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          newErrors[field] = err.message;
        });
        setFieldErrors(newErrors);
      }
      return false;
    }
  }, [formData]);

  // Turnstile captcha callback
  const handleCaptchaChange = useCallback((token: string) => {
    setTurnstileToken(token);
    setCaptchaError(""); // Clear captcha error when user completes it
  }, []);

  // Form submission handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setServerError("");
      setFieldErrors({});
      setCaptchaError("");

      // Validate before submission
      if (!validateForm()) {
        return; // Stop if validation fails
      }

      // Check for captcha token
      if (!turnstileToken) {
        setCaptchaError("Please complete the CAPTCHA verification");
        return;
      }

      setIsLoading(true);

      try {
        const result = await submitContactInquiry(formData, turnstileToken);

        if (result.success) {
          setRefCode(result.referenceCode);
          setSuccessMessage(result.message);
          setIsSubmitted(true);

          // Reset form after successful submission
          setFormData({
            name: "",
            email: "",
            company: "",
            projectType: "" as ProjectType,
            message: "",
          });
          setTurnstileToken("");

          // Auto-clear success state after 8 seconds
          const timer = setTimeout(() => {
            setIsSubmitted(false);
            setSuccessMessage("");
            setRefCode("------");
          }, 8000);

          return () => clearTimeout(timer);
        } else {
          // Handle field-specific errors from server
          if (result.field) {
            setFieldErrors((prev) => ({
              ...prev,
              [result.field!]: result.error,
            }));
          } else {
            // Generic server error
            setServerError(result.error);
          }
        }
      } catch {
        setServerError(
          "Unexpected error occurred. Please check your connection and try again.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validateForm, turnstileToken],
  );

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative bg-slate-dark py-24 lg:py-32 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 blueprint-grid opacity-3 pointer-events-none" />
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, hsl(174 100% 50%), transparent)",
          opacity: 0.2,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group flex gap-4 border border-foreground/20 dark:border-slate-800 p-4 transition-all duration-300 hover:border-[hsl(174_100%_35%)] dark:hover:border-electric-cyan/30"
              >
                <div className="relative">
                  <item.icon
                    size={20}
                    className="text-foreground/70 dark:text-electric-cyan/60 transition-colors group-hover:text-[hsl(174_100%_35%)] dark:group-hover:text-electric-cyan"
                  />
                  <div className="absolute -inset-2 bg-electric-cyan/10 blur-lg opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-foreground/70 dark:text-foreground/70 tracking-widest uppercase block mb-1">
                    {item.label}
                  </span>
                  <span className="text-foreground dark:text-white font-medium block">
                    {item.value}
                  </span>
                  <span className="text-foreground/70 dark:text-slate-300 text-sm">
                    {item.subvalue}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Emergency CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
              className="p-4 bg-red-500/10 dark:bg-red-500/10 border border-red-500/30 dark:border-red-500/30"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-red-500 animate-pulse rounded-full" />
                <span className="font-mono text-[10px] text-red-500 dark:text-red-500 tracking-widest uppercase">
                  Emergency Services
                </span>
              </div>
              <p className="text-foreground/70 dark:text-slate-300 text-sm">
                Electrical emergency? Our rapid response team is available 24/7.
              </p>
              <button className="mt-3 text-red-600 dark:text-red-400 font-bold text-sm hover:text-red-700 dark:hover:text-red-300 transition-colors">
                Call Emergency Line
              </button>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="border border-foreground/20 dark:border-slate-800 bg-foreground/5 dark:bg-deep-slate/50 p-6 lg:p-8"
              noValidate
            >
              {/* Form Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-foreground/20 dark:border-slate-800">
                <span className="font-mono text-[10px] text-foreground/70 dark:text-slate-500 tracking-widest uppercase">
                  Project Inquiry Form
                </span>
                {isSubmitted ? (
                  <span className="font-mono text-[10px] text-emerald-500/80 dark:text-emerald-500/80 tracking-widest font-bold">
                    ✓ {refCode}
                  </span>
                ) : (
                  <span className="font-mono text-[10px] text-foreground/50 dark:text-slate-600/50 tracking-widest">
                    REF: PENDING
                  </span>
                )}
              </div>

              {/* Server Error Alert */}
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded flex gap-3"
                >
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-500"
                  />
                  <p className="text-red-300 text-sm">{serverError}</p>
                </motion.div>
              )}

              {/* Name Field */}
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="font-mono text-[10px] text-foreground/70 tracking-widest uppercase block mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full border ${
                      fieldErrors.name
                        ? "border-red-500 focus:border-red-400"
                        : "border-foreground/20 dark:border-slate-700"
                    } bg-foreground/5 dark:bg-slate-dark px-4 py-3 text-sm text-foreground dark:text-white transition-colors focus:border-[hsl(174_100%_35%)] dark:focus:border-electric-cyan focus:outline-none disabled:opacity-50`}
                    placeholder="John Smith"
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-red-400 text-xs">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="font-mono text-[10px] text-foreground/70 tracking-widest uppercase block mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full border ${
                      fieldErrors.email
                        ? "border-red-500 focus:border-red-400"
                        : "border-foreground/20 dark:border-slate-700"
                    } bg-foreground/5 dark:bg-slate-dark px-4 py-3 text-sm text-foreground dark:text-white transition-colors focus:border-[hsl(174_100%_35%)] dark:focus:border-electric-cyan focus:outline-none disabled:opacity-50`}
                    placeholder="john@company.com"
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-red-400 text-xs">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Company & Project Type */}
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="contact-company"
                    className="font-mono text-[10px] text-foreground/70 tracking-widest uppercase block mb-2"
                  >
                    Company
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full border border-foreground/20 dark:border-slate-700 bg-foreground/5 dark:bg-slate-dark px-4 py-3 text-sm text-foreground dark:text-white transition-colors focus:border-[hsl(174_100%_35%)] dark:focus:border-electric-cyan focus:outline-none disabled:opacity-50"
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-project-type"
                    className="font-mono text-[10px] text-foreground/70 tracking-widest uppercase block mb-2"
                  >
                    Project Type *
                  </label>
                  <select
                    id="contact-project-type"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full cursor-pointer appearance-none border ${
                      fieldErrors.projectType
                        ? "border-red-500 focus:border-red-400"
                        : "border-foreground/20 dark:border-slate-700"
                    } bg-foreground/5 dark:bg-slate-dark px-4 py-3 text-sm text-foreground dark:text-white transition-colors focus:border-[hsl(174_100%_35%)] dark:focus:border-electric-cyan focus:outline-none disabled:opacity-50`}
                  >
                    <option value="">Select Type</option>
                    <option value="commercial">Commercial Installation</option>
                    <option value="industrial">Industrial Systems</option>
                    <option value="maintenance">Maintenance & Repair</option>
                    <option value="consultation">Consultation</option>
                    <option value="other">Other</option>
                  </select>
                  {fieldErrors.projectType && (
                    <p className="mt-1 text-red-400 text-xs">
                      {fieldErrors.projectType}
                    </p>
                  )}
                </div>
              </div>

              {/* Message Field */}
              <div className="mb-6">
                <label
                  htmlFor="contact-message"
                  className="font-mono text-[10px] text-foreground/70 tracking-widest uppercase block mb-2"
                >
                  Project Details *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  rows={4}
                  className={`w-full resize-none border ${
                    fieldErrors.message
                      ? "border-red-500 focus:border-red-400"
                      : "border-foreground/20 dark:border-slate-700"
                  } bg-foreground/5 dark:bg-slate-dark px-4 py-3 text-sm text-foreground dark:text-white transition-colors focus:border-[hsl(174_100%_35%)] dark:focus:border-electric-cyan focus:outline-none disabled:opacity-50`}
                  placeholder="Describe your project requirements, timeline, and any specific needs..."
                />
                {fieldErrors.message && (
                  <p className="mt-1 text-red-400 text-xs">
                    {fieldErrors.message}
                  </p>
                )}
              </div>

              {/* Turnstile CAPTCHA */}
              <div className="mb-6 flex justify-center">
                {turnstileSiteKey ? (
                  <Turnstile
                    sitekey={turnstileSiteKey}
                    onSuccess={handleCaptchaChange}
                    theme="dark"
                    size="normal"
                  />
                ) : (
                  <p className="text-center text-sm text-slate-300">
                    Verification widget loads automatically in configured
                    environments.
                  </p>
                )}
              </div>

              {/* Captcha Error Alert */}
              {captchaError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded flex gap-3"
                >
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-500"
                  />
                  <p className="text-red-300 text-sm">{captchaError}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitted || isLoading}
                className={`w-full py-4 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all duration-300 ${
                  isSubmitted
                    ? "bg-emerald-500 text-white dark:bg-emerald-600"
                    : isLoading
                      ? "cursor-not-allowed bg-[hsl(174_100%_35%)]/50 dark:bg-electric-cyan/50 text-deep-slate dark:text-deep-slate"
                      : "bg-[hsl(174_100%_35%)] dark:bg-electric-cyan text-white dark:text-deep-slate hover:shadow-[0_0_30px_rgba(0,243,189,0.3)] dark:hover:shadow-[0_0_30px_rgba(0,243,189,0.3)]"
                }`}
              >
                {isSubmitted ? (
                  <>
                    <CheckCircle size={18} />
                    Inquiry Submitted
                  </>
                ) : isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Zap size={18} />
                    </motion.div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Inquiry
                  </>
                )}
              </button>

              {/* Success Message */}
              {isSubmitted && successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded"
                >
                  <p className="text-emerald-300 text-sm mb-2">
                    {successMessage}
                  </p>
                  <p className="text-emerald-400/70 font-mono text-xs">
                    Reference:{" "}
                    <span className="font-bold text-emerald-400">
                      {refCode}
                    </span>
                  </p>
                </motion.div>
              )}

              {/* Form Footer */}
              <div className="mt-4 text-center">
                <span className="font-mono text-[9px] text-foreground/70 tracking-widest">
                  ENCRYPTED TRANSMISSION // RESPONSE TIME: 2HRS
                </span>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
