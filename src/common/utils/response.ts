import { BadRequestException, HttpStatus } from '@nestjs/common';
import { HTTP_MESSAGE } from '../constants';

export class ResponseData<D> {
  data: D | D[];
  statusCode: number;
  message: string;
  constructor(data: D | D[], statusCode: number, message: string) {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message;
  }
}

export const CommonErrorResponse = (error: Error | string) => {
  throw new BadRequestException(error);
};

export const CommonSuccessResponse = <T>(
  data: T,
  statusCode?: number,
  message?: string,
) => {
  return {
    success: true,
    statusCode: statusCode || HttpStatus.OK,
    data: data,
    message: message || HTTP_MESSAGE.SUCCESSFULLY,
  };
};
