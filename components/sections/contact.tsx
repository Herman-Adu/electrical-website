'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  Zap,
  CheckCircle
} from 'lucide-react';

const contactInfo = [
  {
    icon: MapPin,
    label: 'Location',
    value: '123 Industrial Parkway',
    subvalue: 'Melbourne, VIC 3000',
  },
  {
    icon: Phone,
    label: 'Emergency Line',
    value: '1800 NEX GEN',
    subvalue: '24/7 Available',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@nexgen.com.au',
    subvalue: 'Response within 2hrs',
  },
  {
    icon: Clock,
    label: 'Operations',
    value: 'Mon - Fri: 7AM - 6PM',
    subvalue: 'Emergency: 24/7',
  },
];

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [refCode, setRefCode] = useState('------');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    message: '',
  });

  // Generate ref code only on client to avoid hydration mismatch
  useEffect(() => {
    setRefCode(Date.now().toString().slice(-6));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-[var(--slate-dark)] overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 blueprint-grid opacity-3" />
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, var(--electric-cyan), transparent)',
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
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--electric-cyan)]/20 mb-6">
            <Zap size={12} className="text-[var(--electric-cyan)]" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--electric-cyan)]/80 uppercase">
              Get Connected
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-4">
            Start Your <span className="text-[var(--electric-cyan)]">Project</span>
          </h2>
          
          <p className="text-slate-400 max-w-2xl mx-auto text-base lg:text-lg font-light">
            Ready to power your next innovation? Get in touch with our engineering team 
            for a comprehensive consultation.
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
                className="group flex gap-4 p-4 border border-slate-800 hover:border-[var(--electric-cyan)]/30 transition-all duration-300"
              >
                <div className="relative">
                  <item.icon 
                    size={20} 
                    className="text-[var(--electric-cyan)]/60 group-hover:text-[var(--electric-cyan)] transition-colors" 
                  />
                  <div className="absolute -inset-2 bg-[var(--electric-cyan)]/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-slate-600 tracking-widest uppercase block mb-1">
                    {item.label}
                  </span>
                  <span className="text-white font-medium block">{item.value}</span>
                  <span className="text-slate-500 text-sm">{item.subvalue}</span>
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
              className="bg-[var(--deep-slate)]/50 border border-slate-800 p-6 lg:p-8"
            >
              {/* Form Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <span className="font-mono text-[10px] text-slate-500 tracking-widest uppercase">
                  Project Inquiry Form
                </span>
                <span className="font-mono text-[10px] text-[var(--electric-cyan)]/60 tracking-widest">
                  REF: NEX-{refCode}
                </span>
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
                    className="w-full bg-[var(--slate-dark)] border border-slate-700 px-4 py-3 text-white text-sm focus:border-[var(--electric-cyan)] focus:outline-none transition-colors"
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
                    className="w-full bg-[var(--slate-dark)] border border-slate-700 px-4 py-3 text-white text-sm focus:border-[var(--electric-cyan)] focus:outline-none transition-colors"
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
                    className="w-full bg-[var(--slate-dark)] border border-slate-700 px-4 py-3 text-white text-sm focus:border-[var(--electric-cyan)] focus:outline-none transition-colors"
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
                    className="w-full bg-[var(--slate-dark)] border border-slate-700 px-4 py-3 text-white text-sm focus:border-[var(--electric-cyan)] focus:outline-none transition-colors appearance-none cursor-pointer"
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
                  className="w-full bg-[var(--slate-dark)] border border-slate-700 px-4 py-3 text-white text-sm focus:border-[var(--electric-cyan)] focus:outline-none transition-colors resize-none"
                  placeholder="Describe your project requirements, timeline, and any specific needs..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitted}
                className={`w-full py-4 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all duration-300 ${
                  isSubmitted 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-[var(--electric-cyan)] text-[var(--deep-slate)] hover:shadow-[0_0_30px_rgba(0,242,255,0.3)]'
                }`}
              >
                {isSubmitted ? (
                  <>
                    <CheckCircle size={18} />
                    Inquiry Submitted
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Inquiry
                  </>
                )}
              </button>

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
