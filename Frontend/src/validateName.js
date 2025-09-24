// utils/validateName.js
function isValidName(name) {
  // Allow only alphabets, no spaces, 6–20 characters
  const nameRegex = /^[A-Za-z]{5,10}$/;
  return nameRegex.test(name.trim());
}

module.exports = { isValidName };
