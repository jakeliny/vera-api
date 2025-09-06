import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ZodSchema } from 'zod';

export const ZodBody = (schema: ZodSchema) =>
  createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const body = request.body;

    const result = schema.safeParse(body);

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  })();
