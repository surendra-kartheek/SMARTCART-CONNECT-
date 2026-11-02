export function getWhatsAppLink(phone, message) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (!digits) return '';
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
