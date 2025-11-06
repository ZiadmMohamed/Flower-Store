import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

@Catch(mongoose.Error, MongoError)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Common MongoDB Error handling
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // Duplicate key error
    if (exception.code === 11000) {
      status = HttpStatus.CONFLICT;
      const fields = Object.keys(exception['keyValue'] || {});
      message = `Duplicate value for field(s): ${fields.join(
        ', ',
      )}. Already exists.`;
    }

    // Validation error (Mongoose)
    if (exception.name === 'ValidationError') {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    }

    // CastError (invalid ObjectId, etc.)
    if (
      exception.name === 'CastError' ||
      exception.message?.includes('Cast to ObjectId failed')
    ) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid identifier format';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
