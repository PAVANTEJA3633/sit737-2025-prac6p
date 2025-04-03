const express = require('express');
const winston = require('winston');
const app = express();
const PORT = 3000;

// Setup Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculator-microservice' },
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

// Middleware to parse query parameters
app.use(express.json());

// Function to handle calculation
const calculate = (req, res, operation) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);

    if (isNaN(num1) || isNaN(num2)) {
        logger.error(`Invalid input: num1=${req.query.num1}, num2=${req.query.num2}`);
        return res.status(400).json({ error: "Invalid numbers provided." });
    }

    let result;
    switch (operation) {
        case 'add':
            result = num1 + num2;
            break;
        case 'subtract':
            result = num1 - num2;
            break;
        case 'multiply':
            result = num1 * num2;
            break;
        case 'divide':
            if (num2 === 0) {
                logger.error("Attempted division by zero.");
                return res.status(400).json({ error: "Cannot divide by zero." });
            }
            result = num1 / num2;
            break;
        default:
            return res.status(400).json({ error: "Invalid operation." });
    }

    logger.info(`New ${operation} operation: ${num1} ${operation} ${num2} = ${result}`);
    res.json({ operation, num1, num2, result });
};

// API endpoints
app.get('/add', (req, res) => calculate(req, res, 'add'));
app.get('/subtract', (req, res) => calculate(req, res, 'subtract'));
app.get('/multiply', (req, res) => calculate(req, res, 'multiply'));
app.get('/divide', (req, res) => calculate(req, res, 'divide'));

// Root route for default home page
app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to the Calculator Microservice</h1>
        <p>Use the following endpoints with query parameters ?num1= & num2= :</p>
        <ul>
            <li><a href="/add?num1=10&num2=5">/add</a></li>
            <li><a href="/subtract?num1=10&num2=5">/subtract</a></li>
            <li><a href="/multiply?num1=10&num2=5">/multiply</a></li>
            <li><a href="/divide?num1=10&num2=5">/divide</a></li>
        </ul>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`Calculator microservice running on http://localhost:${PORT}`);
});

