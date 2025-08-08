export function calculateReturnPercent(currentPrice, entryPrice) {
  if (!currentPrice || !entryPrice || entryPrice === 0) { // Guard against invalid data
    return 0
  }

  const percentageChange = ((currentPrice - entryPrice) / entryPrice) * 100 // Formula for calculating percentage change
  
  return parseFloat(percentageChange.toFixed(2))
}

export function calculatePositionWeight(positionValue, totalPortfolioValue) {
  if (!positionValue || !totalPortfolioValue || totalPortfolioValue === 0) {
    return 0
  }

  const weight = (positionValue / totalPortfolioValue) * 100
  
  return parseFloat(weight.toFixed(2))
}

export function formatCurrency(value, currencyCode = 'USD') { // Default to 'USD'
  if (value === null || typeof value === 'undefined') {
    return 'N/A'
  }

  // Create a formatter with the specified currency.
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode, // Use the currency code passed into the function
  })

  return formatter.format(value)
}

export function formatDate(isoString) {
  if (!isoString) {
    return 'N/A'
  }
  
  const date = new Date(isoString)
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  
  return date.toLocaleDateString('en-US', options)
}

export function formatPercent(value) {
  if (value === null || typeof value === 'undefined') {
    return 'N/A'
  }

  return `${value.toFixed(1)}%` // Convert number to string with 2 decimal places and add the '%' sign
}

export const getReturnColor = (returnPercent) => (returnPercent < 0 ? 'text-rose-40000' : '')