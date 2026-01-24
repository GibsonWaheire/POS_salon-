// Currency utility functions
export const CURRENCIES = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    decimalPlaces: 2
  },
  KES: {
    code: 'KES',
    symbol: 'KES',
    name: 'Kenyan Shilling',
    locale: 'en-KE',
    decimalPlaces: 2
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'en-EU',
    decimalPlaces: 2
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
    decimalPlaces: 2
  }
}

// Exchange rates (can be updated from API in production)
export const EXCHANGE_RATES = {
  USD: 1.0,
  KES: 130.0, // 1 USD = 130 KES (approximate)
  EUR: 0.92,  // 1 USD = 0.92 EUR (approximate)
  GBP: 0.79   // 1 USD = 0.79 GBP (approximate)
}

/**
 * Format amount in the specified currency
 * @param {number} amount - Amount in base currency (USD)
 * @param {string} currency - Currency code (USD, KES, EUR, GBP)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === undefined || amount === null || Number.isNaN(amount) || amount === '') {
    return formatCurrency(0, currency)
  }
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount)
  if (Number.isNaN(numAmount) || !isFinite(numAmount)) {
    return formatCurrency(0, currency)
  }
  
  const currencyInfo = CURRENCIES[currency] || CURRENCIES.USD
  const rate = EXCHANGE_RATES[currency] || 1.0
  const convertedAmount = numAmount * rate
  
  if (currency === 'KES') {
    return `${currencyInfo.symbol} ${convertedAmount.toLocaleString(currencyInfo.locale, { 
      minimumFractionDigits: currencyInfo.decimalPlaces, 
      maximumFractionDigits: currencyInfo.decimalPlaces 
    })}`
  }
  
  return `${currencyInfo.symbol}${convertedAmount.toLocaleString(currencyInfo.locale, { 
    minimumFractionDigits: currencyInfo.decimalPlaces, 
    maximumFractionDigits: currencyInfo.decimalPlaces 
  })}`
}

/**
 * Convert amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {number} Converted amount
 */
export const convertCurrency = (amount, fromCurrency = 'USD', toCurrency = 'USD') => {
  if (fromCurrency === toCurrency) return amount
  
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1.0
  const toRate = EXCHANGE_RATES[toCurrency] || 1.0
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate
  return usdAmount * toRate
}

/**
 * Get currency symbol
 * @param {string} currency - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currency = 'USD') => {
  return CURRENCIES[currency]?.symbol || '$'
}
