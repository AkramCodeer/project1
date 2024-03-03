const express = require('express');
const axios = require('axios');
const moment = require('moment');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());


// List all transactions with search and pagination
app.get('/transactions', async (req, res) => {
  try {
    // Extract query parameters
    const { search = '', page = 1, perPage = 60 } = req.query;

    // Fetch data from third-party API
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    // Apply search filter
    const filteredTransactions = transactions.filter(transaction =>
      transaction.title.toLowerCase().includes(search.toLowerCase()) ||
      transaction.description.toLowerCase().includes(search.toLowerCase()) ||
      String(transaction.price).toLowerCase().includes(search.toLowerCase())
    );

    // Apply pagination
    const startIndex = (page - 1) * perPage;
    const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + perPage);

    res.status(200).json(paginatedTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// API for statistics
app.get('/statistics', async (req, res) => {
  try {
    // Extract query parameter
    const { month } = req.query;

    // Ensure month is parsed as a string
    const selectedMonth = String(month);

    // Generate random data
    const getRandomData = () => Math.floor(Math.random() * 100) + 1;

    // Generate statistics
    const totalSaleAmount = getRandomData() * 1000;
    const totalSoldItems = getRandomData() * 10;
    const totalNotSoldItems = getRandomData() * 5;

    // Assign id for month
    const id = moment().month(selectedMonth).format('M');

    res.status(200).json({
      id,
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API for bar chart
app.get('/bar-chart', async (req, res) => {
  try {
    // Extract query parameter
    const { month } = req.query;

    // Ensure month is parsed as a string
    const selectedMonth = String(month);

    // Generate random data for different price ranges
    const priceRanges = {
      '0 - 100': Math.floor(Math.random() * 50) + 1,
      '101 - 200': Math.floor(Math.random() * 50) + 1,
      '201 - 300': Math.floor(Math.random() * 50) + 1,
      '301 - 400': Math.floor(Math.random() * 50) + 1,
      '401 - 500': Math.floor(Math.random() * 50) + 1,
      '501 - 600': Math.floor(Math.random() * 50) + 1,
      '601 - 700': Math.floor(Math.random() * 50) + 1,
      '701 - 800': Math.floor(Math.random() * 50) + 1,
      '801 - 900': Math.floor(Math.random() * 50) + 1,
      '901 - above': Math.floor(Math.random() * 50) + 1
    };

    // Assign id for month
    const id = moment().month(selectedMonth).format('M');

    res.status(200).json({
      id,
      priceRanges
    });
  } catch (error) {
    console.error('Error fetching bar chart data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API for pie chart
app.get('/pie-chart', async (req, res) => {
  try {
    // Extract query parameter
    const { month } = req.query;

    // Ensure month is parsed as a string
    const selectedMonth = String(month);

    // Generate random data for categories
    const categoryCounts = {
      'X category': Math.floor(Math.random() * 30) + 1,
      'Y category': Math.floor(Math.random() * 30) + 1,
      'Z category': Math.floor(Math.random() * 30) + 1
    };

    // Assign id for month
    const id = moment().month(selectedMonth).format('M');

    res.status(200).json({
      id,
      categoryCounts
    });
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
