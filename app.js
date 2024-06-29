const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const path = require('path');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const orderRouter = require('./routes/orderRoutes');
const coachRouter = require('./routes/coachRoutes');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');

// const corsOptions = {
//   origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
// };

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin) {
//       return callback(null, true);
//     }
//     if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
//       return callback(null, true);
//     }
//     return callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
// };

const app = express();

app.set('trust proxy', 'loopback');

const allowedOrigins = [
  'https://boosters-imn9ut3gn-merkius-projects.vercel.app',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions)); // Ustawienie CORS na akceptowanie wybranych pochodzeń
// app.use(cors(corsOptions));
// app.use(cors()); // Ustawienie CORS na akceptowanie wszystkich pochodzeń

app.options('*', cors(corsOptions)); // Obsługa preflight requests

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cookieParser());

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
  skipFailedRequests: true,
  keyGenerator: (req, res) => req.ip,
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use((req, res, next) => {
  if (req.originalUrl.includes('/webhook')) {
    next();
  } else {
    express.json({ limit: '10kb' })(req, res, next);
  }
});

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({}));

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});
app.get('/', (req, res) => {
  res.send('Hello');
});

// 3) ROUTES
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/coaches', coachRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
