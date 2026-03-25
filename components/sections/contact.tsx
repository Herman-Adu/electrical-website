"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
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
import { type ContactFormData } from "@/lib/schemas/contact";

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
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refCode, setRefCode] = useState("------");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await submitContactInquiry(formData);

      if (result.success) {
        setRefCode(result.referenceCode);
        setSuccessMessage(result.message);
        setIsSubmitted(true);

        // Clear form
        setFormData({
          name: "",
          email: "",
          company: "",
          projectType: "",
          message: "",
        });

        // Auto-clear success state after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setSuccessMessage("");
        }, 5000);
      } else {
        setErrorMessage(result.error);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error("Contact form error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative bg-slate-dark py-24 lg:py-32 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 blueprint-grid opacity-3" />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--electric-cyan), transparent)",
          opacity: 0.2,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="mb-6 inline-flex items-center gap-2 border border-electric-cyan/20 px-4 py-2">
            <Zap size={12} className="text-electric-cyan" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-electric-cyan/80 uppercase">
              Get Connected
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-4">
            Start Your <span className="text-electric-cyan">Project</span>
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto text-base lg:text-lg font-light">
            Ready to power your next innovation? Get in touch with our
            engineering team for a comprehensive consultation.
          </p>
        </motion.div>

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
                className="group flex gap-4 border border-slate-800 p-4 transition-all duration-300 hover:border-electric-cyan/30"
              >
                <div className="relative">
                  <item.icon
                    size={20}
                    className="text-electric-cyan/60 transition-colors group-hover:text-electric-cyan"
                  />
                  <div className="absolute -inset-2 bg-electric-cyan/10 blur-lg opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-slate-600 tracking-widest uppercase block mb-1">
                    {item.label}
                  </span>
                  <span className="text-white font-medium block">
                    {item.value}
                  </span>
                  <span className="text-slate-500 text-sm">
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
              className="p-4 bg-red-500/10 border border-red-500/30"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-red-500 animate-pulse rounded-full" />
                <span className="font-mono text-[10px] text-red-500 tracking-widest uppercase">
                  Emergency Services
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                Electrical emergency? Our rapid response team is available 24/7.
              </p>
              <button className="mt-3 text-red-400 font-bold text-sm hover:text-red-300 transition-colors">
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
              className="border border-slate-800 bg-(--deep-slate)/50 p-6 lg:p-8"
            >
              {/* Form Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <span className="font-mono text-[10px] text-slate-500 tracking-widest uppercase">
                  Project Inquiry Form
                </span>
                {isSubmitted ? (
                  <span className="font-mono text-[10px] text-emerald-500/80 tracking-widest font-bold">
                    ✓ {refCode}
                  </span>
                ) : (
                  <span className="font-mono text-[10px] text-slate-600/50 tracking-widest">
                    REF: PENDING
                  </span>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="font-mono text-[10px] text-slate-500 tracking-widest uppercase block mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-700 bg-slate-dark px-4 py-3 text-sm text-white transition-colors focus:border-electric-cyan focus:outline-none"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-slate-500 tracking-widest uppercase block mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-700 bg-slate-dark px-4 py-3 text-sm text-white transition-colors focus:border-electric-cyan focus:outline-none"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="font-mono text-[10px] text-slate-500 tracking-widest uppercase block mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full border border-slate-700 bg-slate-dark px-4 py-3 text-sm text-white transition-colors focus:border-electric-cyan focus:outline-none"
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-slate-500 tracking-widest uppercase block mb-2">
                    Project Type
                  </label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full cursor-pointer appearance-none border border-slate-700 bg-slate-dark px-4 py-3 text-sm text-white transition-colors focus:border-electric-cyan focus:outline-none"
                  >
                    <option value="">Select Type</option>
                    <option value="commercial">Commercial Installation</option>
                    <option value="industrial">Industrial Systems</option>
                    <option value="maintenance">Maintenance & Repair</option>
                    <option value="consultation">Consultation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="font-mono text-[10px] text-slate-500 tracking-widest uppercase block mb-2">
                  Project Details *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full resize-none border border-slate-700 bg-slate-dark px-4 py-3 text-sm text-white transition-colors focus:border-electric-cyan focus:outline-none"
                  placeholder="Describe your project requirements, timeline, and any specific needs..."
                />
              </div>

              {/* Error Message */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded flex gap-3"
                >
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-500"
                  />
                  <p className="text-red-300 text-sm">{errorMessage}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitted || isLoading}
                className={`w-full py-4 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all duration-300 ${
                  isSubmitted
                    ? "bg-emerald-500 text-white"
                    : isLoading
                      ? "cursor-not-allowed bg-(--electric-cyan)/50 text-deep-slate"
                      : "bg-electric-cyan text-deep-slate hover:shadow-[0_0_30px_rgba(0,242,255,0.3)]"
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
                <span className="font-mono text-[9px] text-slate-600 tracking-widest">
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
