import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';
import { ErrorMessages } from '../enums/error-messages.enum';

export interface ErrorResponse {
  status: number;
  message: string;
  timeStamp: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const now = new Date();
    const timeStamp = now.toISOString().replace('T', ' ').substring(0, 19);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = ErrorMessages.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as any;
        if (responseObj.message) {
          if (Array.isArray(responseObj.message)) {
            message = responseObj.message[0];
          } else {
            message = responseObj.message;
          }
        }
      }
    } else if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      const firstError = exception.issues[0];
      message = firstError.message || ErrorMessages.VALIDATION_ERROR;
    } else if (exception instanceof Error) {
      message = exception.message;

      if (exception.message === ErrorMessages.RECORD_NOT_FOUND) {
        status = HttpStatus.NOT_FOUND;
      } else {
        status = HttpStatus.BAD_REQUEST;
      }
    }

    const errorResponse: ErrorResponse = {
      status,
      message,
      timeStamp,
    };

    response.status(status).json(errorResponse);
  }
}
