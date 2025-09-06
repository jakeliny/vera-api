import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';
import {
  ErrorMessages,
  ERROR_TRANSLATIONS,
} from '../enums/error-messages.enum';

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
    let message = String(
      ERROR_TRANSLATIONS[ErrorMessages.INTERNAL_SERVER_ERROR],
    );

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = this.translateMessage(exceptionResponse);
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as any;
        if (responseObj.message) {
          if (Array.isArray(responseObj.message)) {
            message = this.translateMessage(responseObj.message[0]);
          } else {
            message = this.translateMessage(responseObj.message);
          }
        }
      }
    } else if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      const firstError = exception.issues[0];
      message = this.translateZodError(firstError);
    } else if (exception instanceof Error) {
      message = this.translateMessage(exception.message);

      if (exception.message === ErrorMessages.REGISTRO_NOT_FOUND) {
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

  private translateMessage(message: string): string {
    const errorMessage = message as ErrorMessages;
    const translation = ERROR_TRANSLATIONS[errorMessage];
    return translation ? String(translation) : message;
  }

  private translateZodError(error: any): string {
    const errorMessage = error.message || ErrorMessages.VALIDATION_ERROR;
    return this.translateMessage(String(errorMessage));
  }
}
