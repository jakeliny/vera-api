import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';

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
    let message = 'Erro interno do servidor';

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

      if (exception.message === 'Registro not found') {
        status = HttpStatus.BAD_REQUEST;
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
    const translations: Record<string, string> = {
      'Registro not found': 'Registro não encontrado',
      'Failed to update registro': 'Falha ao atualizar registro',
      'Salary must be positive': 'Salário deve ser um número positivo',
      'Salary must be at least 1300': 'Salário deve ser no mínimo 1300',
      'Salary cannot exceed 100,000': 'Salário não pode exceder 100.000',
      'Employee name is required': 'Nome do funcionário é obrigatório',
      'Employee name cannot exceed 30 characters':
        'Nome do funcionário não pode exceder 30 caracteres',
      'Date must be in YYYY-MM-DD format':
        'Data deve estar no formato AAAA-MM-DD',
      'Admission date cannot be in the future':
        'Data de admissão não pode ser no futuro',
      'Validation failed': 'Falha na validação',
      'ID must be a valid UUID': 'ID deve ser um UUID válido',
      'Calculated salary must be positive':
        'Salário calculado deve ser um número positivo',
    };

    return translations[message] || message;
  }

  private translateZodError(error: any): string {
    return this.translateMessage(error.message || 'Erro de validação');
  }
}
