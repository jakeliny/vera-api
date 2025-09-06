export enum ErrorMessages {
  REGISTRO_NOT_FOUND = 'Registro not found',
  FAILED_TO_UPDATE_REGISTRO = 'Failed to update registro',
  SALARY_MUST_BE_POSITIVE = 'Salary must be positive',
  SALARY_MINIMUM = 'Salary must be at least 1300',
  SALARY_MAXIMUM = 'Salary cannot exceed 100,000',
  EMPLOYEE_NAME_REQUIRED = 'Employee name is required',
  EMPLOYEE_NAME_MAX_LENGTH = 'Employee name cannot exceed 30 characters',
  DATE_FORMAT_INVALID = 'Date must be in YYYY-MM-DD format',
  ADMISSION_DATE_FUTURE = 'Admission date cannot be in the future',
  VALIDATION_FAILED = 'Validation failed',
  INVALID_UUID = 'ID must be a valid UUID',
  CALCULATED_SALARY_POSITIVE = 'Calculated salary must be positive',
  INTERNAL_SERVER_ERROR = 'Internal server error',
  VALIDATION_ERROR = 'Validation error',
}

export enum ErrorMessagesPortuguese {
  REGISTRO_NOT_FOUND = 'Registro não encontrado',
  FAILED_TO_UPDATE_REGISTRO = 'Falha ao atualizar registro',
  SALARY_MUST_BE_POSITIVE = 'Salário deve ser um número positivo',
  SALARY_MINIMUM = 'Salário deve ser no mínimo 1300',
  SALARY_MAXIMUM = 'Salário não pode exceder 100.000',
  EMPLOYEE_NAME_REQUIRED = 'Nome do funcionário é obrigatório',
  EMPLOYEE_NAME_MAX_LENGTH = 'Nome do funcionário não pode exceder 30 caracteres',
  DATE_FORMAT_INVALID = 'Data deve estar no formato AAAA-MM-DD',
  ADMISSION_DATE_FUTURE = 'Data de admissão não pode ser no futuro',
  VALIDATION_FAILED = 'Falha na validação',
  INVALID_UUID = 'ID deve ser um UUID válido',
  CALCULATED_SALARY_POSITIVE = 'Salário calculado deve ser um número positivo',
  INTERNAL_SERVER_ERROR = 'Erro interno do servidor',
  VALIDATION_ERROR = 'Erro de validação',
}

export const ERROR_TRANSLATIONS: Record<
  ErrorMessages,
  ErrorMessagesPortuguese
> = {
  [ErrorMessages.REGISTRO_NOT_FOUND]:
    ErrorMessagesPortuguese.REGISTRO_NOT_FOUND,
  [ErrorMessages.FAILED_TO_UPDATE_REGISTRO]:
    ErrorMessagesPortuguese.FAILED_TO_UPDATE_REGISTRO,
  [ErrorMessages.SALARY_MUST_BE_POSITIVE]:
    ErrorMessagesPortuguese.SALARY_MUST_BE_POSITIVE,
  [ErrorMessages.SALARY_MINIMUM]: ErrorMessagesPortuguese.SALARY_MINIMUM,
  [ErrorMessages.SALARY_MAXIMUM]: ErrorMessagesPortuguese.SALARY_MAXIMUM,
  [ErrorMessages.EMPLOYEE_NAME_REQUIRED]:
    ErrorMessagesPortuguese.EMPLOYEE_NAME_REQUIRED,
  [ErrorMessages.EMPLOYEE_NAME_MAX_LENGTH]:
    ErrorMessagesPortuguese.EMPLOYEE_NAME_MAX_LENGTH,
  [ErrorMessages.DATE_FORMAT_INVALID]:
    ErrorMessagesPortuguese.DATE_FORMAT_INVALID,
  [ErrorMessages.ADMISSION_DATE_FUTURE]:
    ErrorMessagesPortuguese.ADMISSION_DATE_FUTURE,
  [ErrorMessages.VALIDATION_FAILED]: ErrorMessagesPortuguese.VALIDATION_FAILED,
  [ErrorMessages.INVALID_UUID]: ErrorMessagesPortuguese.INVALID_UUID,
  [ErrorMessages.CALCULATED_SALARY_POSITIVE]:
    ErrorMessagesPortuguese.CALCULATED_SALARY_POSITIVE,
  [ErrorMessages.INTERNAL_SERVER_ERROR]:
    ErrorMessagesPortuguese.INTERNAL_SERVER_ERROR,
  [ErrorMessages.VALIDATION_ERROR]: ErrorMessagesPortuguese.VALIDATION_ERROR,
};
