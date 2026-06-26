import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { createInquiry } from '../firebase/inquiries';
import { servicesData } from '../utils/staticData';
import { Calendar, Phone, User, MessageSquare, Briefcase, CheckCircle, AlertCircle, Loader } from 'lucide-react';

/**
 * InquiryForm - Multi-field validated inquiry form.
 * Writes submissions to Firestore (with mock fallback) and alerts via EmailJS.
 * Dropdown options are populated using static local services data.
 */
const InquiryForm = () => {
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayDateString();
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    eventDate: '',
    serviceType: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [statusMessage, setStatusMessage] = useState('');

  // Load dropdown choices instantly from local static data
  useEffect(() => {
    setServices(servicesData);
    setServicesLoading(false);
  }, []);

  // Form field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'eventDate') {
      if (value.length === 10) {
        const selectedDate = new Date(value + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          setErrors((prev) => ({ 
            ...prev, 
            eventDate: 'Please select today or a future date. Past dates are not allowed.' 
          }));
        } else {
          setErrors((prev) => ({ ...prev, eventDate: '' }));
        }
      } else {
        setErrors((prev) => ({ ...prev, eventDate: '' }));
      }
    } else if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'eventDate' && value) {
      const selectedDate = new Date(value + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        setErrors((prev) => ({ 
          ...prev, 
          eventDate: 'Please select today or a future date. Past dates are not allowed.' 
        }));
      }
    }
  };

  // Input validation
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.trim().replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
    }

    // Event Date validation
    if (!formData.eventDate) {
      newErrors.eventDate = 'Event date is required';
    } else {
      const selectedDate = new Date(formData.eventDate + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.eventDate = 'Please select today or a future date. Past dates are not allowed.';
      }
    }

    // Service type validation
    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service type';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Inquiry message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide details (minimum 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setStatusMessage('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // 1. Write inquiry to Firestore (falls back to mock if Firebase not configured)
      await createInquiry(formData);

      // 2. Send email via EmailJS (if credentials exist)
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey && 
          serviceId !== 'your_emailjs_service_id_here' && 
          publicKey !== 'your_emailjs_public_key_here') {
        
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: formData.name,
            from_phone: formData.phone,
            event_date: formData.eventDate,
            service_type: formData.serviceType,
            message: formData.message
          },
          publicKey
        );
      } else {
        console.warn("EmailJS credentials not set. Skipping email trigger.");
      }

      setSubmitStatus('success');
      setStatusMessage("Your inquiry has been sent! We'll contact you within 24 hours.");
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        eventDate: '',
        serviceType: '',
        message: ''
      });
      setErrors({});
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmitStatus('error');
      setStatusMessage("Something went wrong. Please WhatsApp us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gold/10 p-4 xs:p-6 md:p-8 font-sans">
      <h3 className="font-display text-2xl md:text-3xl text-burgundy font-bold mb-6">
        Send Booking Inquiry
      </h3>

      {/* Success/Error Alerts */}
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{statusMessage}</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-rose-light/50 border border-rose-dark/20 rounded-xl text-burgundy flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-burgundy shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{statusMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-charcoal-light mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3.5 w-5 h-5 text-gold" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`w-full pl-11 pr-4 py-3 bg-ivory/30 border rounded-lg outline-none text-sm text-charcoal focus:bg-white transition-all duration-200 ${
                errors.name ? 'border-rose-dark focus:ring-1 focus:ring-rose-dark' : 'border-gold/20 focus:border-gold focus:ring-1 focus:ring-gold'
              }`}
            />
          </div>
          {errors.name && <p className="text-rose-dark text-xs mt-1.5 pl-1 font-medium">{errors.name}</p>}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-charcoal-light mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-gold" />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              className={`w-full pl-11 pr-4 py-3 bg-ivory/30 border rounded-lg outline-none text-sm text-charcoal focus:bg-white transition-all duration-200 ${
                errors.phone ? 'border-rose-dark focus:ring-1 focus:ring-rose-dark' : 'border-gold/20 focus:border-gold focus:ring-1 focus:ring-gold'
              }`}
            />
          </div>
          {errors.phone && <p className="text-rose-dark text-xs mt-1.5 pl-1 font-medium">{errors.phone}</p>}
        </div>

        {/* Event Date Field */}
        <div>
          <label htmlFor="eventDate" className="block text-xs font-bold uppercase tracking-wider text-charcoal-light mb-1.5">
            Event Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-3.5 w-5 h-5 text-gold pointer-events-none" />
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              onBlur={handleBlur}
              min={todayStr}
              className={`w-full pl-11 pr-4 py-3 bg-ivory/30 border rounded-lg outline-none text-sm text-charcoal focus:bg-white transition-all duration-200 ${
                errors.eventDate ? 'border-rose-dark focus:ring-1 focus:ring-rose-dark' : 'border-gold/20 focus:border-gold focus:ring-1 focus:ring-gold'
              }`}
            />
          </div>
          {errors.eventDate && <p className="text-rose-dark text-xs mt-1.5 pl-1 font-medium">{errors.eventDate}</p>}
        </div>

        {/* Service Type Dropdown */}
        <div>
          <label htmlFor="serviceType" className="block text-xs font-bold uppercase tracking-wider text-charcoal-light mb-1.5">
            Service Required
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3.5 top-3.5 w-5 h-5 text-gold pointer-events-none" />
            <select
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className={`w-full pl-11 pr-4 py-3 bg-ivory/30 border rounded-lg outline-none text-sm text-charcoal focus:bg-white transition-all duration-200 appearance-none ${
                errors.serviceType ? 'border-rose-dark focus:ring-1 focus:ring-rose-dark' : 'border-gold/20 focus:border-gold focus:ring-1 focus:ring-gold'
              }`}
            >
              <option value="">Select a service...</option>
              {servicesLoading ? (
                <option disabled>Loading services...</option>
              ) : services.length > 0 ? (
                services.map((svc) => (
                  <option key={svc.id} value={svc.name}>{svc.name}</option>
                ))
              ) : (
                <>
                  <option value="Bridal Mehendi">Bridal Mehendi</option>
                  <option value="Family & Guest Mehendi">Family & Guest Mehendi</option>
                  <option value="Premium Saree Draping">Premium Saree Draping</option>
                  <option value="Bridal Makeup & Styling Combo">Bridal Combo Package</option>
                </>
              )}
            </select>
          </div>
          {errors.serviceType && <p className="text-rose-dark text-xs mt-1.5 pl-1 font-medium">{errors.serviceType}</p>}
        </div>

        {/* Message Textarea */}
        <div>
          <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-charcoal-light mb-1.5">
            Describe Your Requirements
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3.5 top-3.5 w-5 h-5 text-gold" />
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about the number of guests, type of mehendi design, or saree draping style..."
              className={`w-full pl-11 pr-4 py-3 bg-ivory/30 border rounded-lg outline-none text-sm text-charcoal focus:bg-white transition-all duration-200 resize-none ${
                errors.message ? 'border-rose-dark focus:ring-1 focus:ring-rose-dark' : 'border-gold/20 focus:border-gold focus:ring-1 focus:ring-gold'
              }`}
            />
          </div>
          {errors.message && <p className="text-rose-dark text-xs mt-1.5 pl-1 font-medium">{errors.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gold hover:bg-gold-dark text-burgundy font-bold text-sm tracking-wide rounded-full shadow-md hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 cursor-pointer uppercase mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Inquiry'
          )}
        </button>
      </form>
    </div>
  );
};

export default InquiryForm;
