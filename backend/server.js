require('dotenv').config()

const express = require('express')
const chitRoutes = require('./routes/chits.js')
const userRoutes = require('./routes/users.js')
const path = require('path')

const mongoose = require('mongoose')

// app
const app = express()

// middleware
app.use(express.json())
app.use('/pfp', express.static(path.join(__dirname, 'public/pfp')));
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000', 'https://chitter-app-g7wp.onrender.com'],
  credentials: true
}));

// --- Layer 1: User-Agent Blocking ---

// A list of common, simple bot User-Agents.
// In a real app, this list would be much larger.
const BAD_USER_AGENTS = [
    'python-requests',
    'Scrapy',
    'Wget',
    'curl'
];

const blockBadUserAgents = (req, res, next) => {
    const userAgent = req.headers['user-agent'] || '';

    // Check if the User-Agent contains any of our bad strings
    const isBadAgent = BAD_USER_AGENTS.some(agent => userAgent.toLowerCase().includes(agent.toLowerCase()));

    if (isBadAgent) {
        console.log(`[FORBIDDEN] Blocked bad User-Agent: ${userAgent}`);
        return res.status(403).send('Access Forbidden: Your client is not permitted.');
    }

    // If the User-Agent is fine, continue to the next middleware
    next();
};

// --- Layer 2: Rate Limiting ---

// This is a simple in-memory store.
// For production, use Redis or a similar external store.
const ipRequestCounts = {};

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100; // Max 10 requests per IP per minute

const rateLimiter = (req, res, next) => {
    const ip = req.ip; // Get the user's IP address
    const now = Date.now();

    // Initialize record for this IP if it doesn't exist
    if (!ipRequestCounts[ip]) {
        ipRequestCounts[ip] = {
            count: 0,
            firstRequestTime: now
        };
    }

    const ipData = ipRequestCounts[ip];

    // Check if the window has reset
    if (now - ipData.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
        // Reset the count and time
        ipData.count = 1;
        ipData.firstRequestTime = now;
    } else {
        // Increment the count
        ipData.count++;
        console.log(ipData.count);
    }

    // Enforce the limit
    if (ipData.count > MAX_REQUESTS_PER_WINDOW) {
        console.log(`[RATE LIMIT] Throttling IP: ${ip}`);
        return res.status(429).send('Too Many Requests. Please try again later.');
    }

    req.requestCountData = ipData;
    // If the user is within limits, continue
    next();
};

app.use('/user', blockBadUserAgents);
app.use('/user', rateLimiter);

// -------------------------------------


//routes
app.use('/chit', chitRoutes)
app.use('/user', userRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen
        app.listen(process.env.PORT, () => {
            console.log(`connected to database & listening on port ${process.env.PORT}...`);
        })
    })
    .catch((err) => {
        console.log(err);
    })