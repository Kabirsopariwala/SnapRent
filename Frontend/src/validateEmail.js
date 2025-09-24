// utils/validateEmail.js
function isValidEmail(email) {
  const allowedDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) return false;

  const domain = email.split("@")[1];
  return allowedDomains.includes(domain.toLowerCase());
}

module.exports = { isValidEmail };
