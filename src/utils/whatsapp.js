/**
 * Utility to generate WhatsApp click-to-chat links.
 * Sanitizes the phone number and URL-encodes the message body.
 */

export const buildWhatsAppURL = (message, phone) => {
  const defaultPhone = import.meta.env.VITE_WHATSAPP_NUMBER || '919441030124';
  const targetPhone = phone || defaultPhone;
  
  // Remove non-digit characters from the phone number
  const sanitizedPhone = targetPhone.replace(/\D/g, '');
  
  const defaultMessage = "Hi Alankrita, I'd like to enquire about your services.";
  const finalMessage = message || defaultMessage;
  
  return `https://api.whatsapp.com/send?phone=${sanitizedPhone}&text=${encodeURIComponent(finalMessage)}`;
};

/**
 * Generates a pre-filled booking message for a specific service.
 * @param {string} serviceName - Name of the service.
 * @returns {string} Pre-filled message string.
 */
export const getServiceBookingMessage = (serviceName) => {
  return `Hi Alankrita, I'd like to book ${serviceName} for my event.`;
};
