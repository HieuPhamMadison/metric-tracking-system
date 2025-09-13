/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ErrorResponse implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const responseData = exception.getResponse();
      let status = exception?.getStatus();

      const allowedStatuses = [401];
      if (!allowedStatuses.includes(status)) {
        status = 400;
      }

      return response.status(status).json({
        success: false,
        message: Array.isArray(responseData['message'])
          ? responseData['message'].join('\n')
          : responseData['message'],
        type: responseData['type'],
        data: null,
        statusCode: status,
      });
    } else {
      return response.status(400).json({
        success: false,
        message: 'Something went wrong',
        type: 'Unexpected Error',
        data: null,
        statusCode: 500,
      });
    }
  }
}
