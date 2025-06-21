import cors from 'cors'
import cron from 'node-cron'
import dotenv from 'dotenv'
import express from 'express'
import fetch from 'node-fetch'
import path from 'path'
import { fileURLToPath } from 'url' // For __dirname equivalent in ES Modules
import { promises as fs } from 'fs' // Use promises version of fs for async/await

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const positionsFilePath = path.join(__dirname, 'public', 'db', 'positions.json')

const app = express()
const port = process.env.PORT || 3000
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY

if (!ALPHA_VANTAGE_API_KEY) {
  console.error('ALPHA_VANTAGE_API_KEY is not set in the .env file. Please add it.')
  process.exit(1)
}

app.use(cors()) // Enable CORS for all origins (for development, restrict in production)
app.use(express.json()) // To parse JSON request bodies
app.use(express.static('public')) // This middleware serves files from the 'public' directory at the root URL.

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)) // Helper function to introduce a delay for API rate limits

const fetchAndStoreDailyPrices = async () => {
  console.log('--- Starting daily position update process ---')
  try {
    // Read the single source of truth
    const positionsData = await fs.readFile(positionsFilePath, 'utf8')
    const positions = JSON.parse(positionsData)

    // Filter for only the open positions to avoid useless API calls
    const openPositions = positions.filter(p => p.exitDate === null)
    console.log(`Found ${openPositions.length} open positions to update.`)

    const delayBetweenCalls = 12 * 1000 // 12 seconds to stay under 5 calls/min

    // Loop through only the open positions
    for (const position of openPositions) {
      console.log(`Fetching latest price for ${position.ticker}...`)
      const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${position.ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`

      try {
        const response = await fetch(apiUrl)
        const data = await response.json()
        const globalQuote = data['Global Quote']

        if (globalQuote && Object.keys(globalQuote).length > 0) {
          const closePrice = globalQuote['05. price']

          // Update the position object directly in memory. This works because 'position' is a reference to an object in the original 'positions' array.
          position.currentPrice = parseFloat(closePrice)
          position.lastUpdated = new Date().toISOString() // Store the update time
          console.log(`Updated ${position.ticker} price to ${position.currentPrice}`)
          
        } else {
          // Handle cases where the API doesn't return data for a ticker
          console.warn(`No price data returned for ${position.ticker}. Skipping update.`)
          if(data['Error Message']) console.error(`API Error for ${position.ticker}: ${data['Error Message']}`)
          if(data['Note']) console.warn(`API Note for ${position.ticker}: ${data['Note']}`)
        }
      } catch (apiError) {
        console.error(`Failed to fetch or update data for ${position.ticker}:`, apiError)
      }

      // Wait before the next API call
      if (openPositions.indexOf(position) < openPositions.length - 1) {
        await sleep(delayBetweenCalls)
      }
    }

    await fs.writeFile(positionsFilePath, JSON.stringify(positions, null, 2), 'utf8') // Write the entire modified 'positions' array back to the same file
    console.log(`Successfully updated positions and saved to ${positionsFilePath}`)

  } catch (error) {
    console.error('An error occurred during the update process:', error)
  }
  console.log('--- Daily position update process complete ---')
}

cron.schedule('44 21 * * *', () => {
  console.log('Running scheduled daily price fetch...')
  fetchAndStoreDailyPrices()
}, {
  timezone: "America/Chicago" // Set timezone, this example runs at 21:00 (5:00 PM CST) every day
})

app.listen(port, () => {
  console.log(`Server starting on http://localhost:${port}`)
})