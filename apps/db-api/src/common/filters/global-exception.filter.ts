import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest()

    let status: HttpStatus
    let message: string

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse
      } else {
        const responseObj = exceptionResponse as Record<string, unknown>
        message = (responseObj.message as string) || exception.message
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR
      message = 'Internal server error'

      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack
      )
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR
      message = 'Unknown error occurred'

      this.logger.error('Unknown exception type', exception)
    }

    const errorResponse = {
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    }

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`
    )

    response.status(status).json(errorResponse)
  }
}
