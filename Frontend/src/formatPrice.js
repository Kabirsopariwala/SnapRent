const currencyRates = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
};

export function formatPrice(priceInINR, currency) {
  const rate = currencyRates[currency] || 1;
  const symbol =
    currency === "USD" ? "$" : currency === "EUR" ? "€" : "₹";
  return `${symbol}${(priceInINR * rate).toFixed(2)}`;
}
