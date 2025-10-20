import dotenv from 'dotenv';
dotenv.config();
import express, { Application } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { PORT } from '@/common/config';
import errorHandler from '@/middleware/error.hnadler';
import { notFoundHandler } from '@/middleware/not.found.handler';
import logger from '@/common/utils/logger';

const app: Application = express();

//middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//rate limitng
const endpointRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Endpoint rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests',
    });
  },
});

app.use(endpointRateLimit);

//Error handler
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
