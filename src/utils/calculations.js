export function calculateReturnPercent(currentPrice, entryPrice) {
  // Guard against division by zero or invalid data
  if (!entryPrice || entryPrice === 0 || !currentPrice) {
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