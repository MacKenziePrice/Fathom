import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()
const port = 3000
app.use(express.json())
app.use(cors())

// Function to get current stock price and info
async function getStockData(ticker) {
  const apiKey = 'HH21RI5NFJAK87A3' // Your Alpha Vantage API key
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`
  
  try {
    console.log(`Fetching data for ${ticker}`)
    const response = await fetch(url)
    const data = await response.json()
    
    if (data['Error Message']) {
      throw new Error(data['Error Message'])
    }
    
    return data['Global Quote'] || { error: 'No data found' }
  } catch (err) {
    console.error('Error fetching price:', err)
    throw err
  }
}

// Basic root route
app.get('/', (req, res) => {
  res.send('Stock API Server - Use /api/stock/[TICKER] to get stock data')
})

// Dynamic route for stock data
app.get('/api/stock/:ticker', async (req, res) => {
  const ticker = req.params.ticker.toUpperCase()
  
  try {
    const stockData = await getStockData(ticker)
    res.json(stockData)
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch stock data' })
  }
})

// Search endpoint to find stocks matching a keyword
app.get('/api/search/:query', async (req, res) => {
  const query = req.params.query
  const apiKey = 'HH21RI5NFJAK87A3'
  const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${apiKey}`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    res.json(data.bestMatches || [])
  } catch (err) {
    res.status(500).json({ error: 'Failed to search stocks' })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})