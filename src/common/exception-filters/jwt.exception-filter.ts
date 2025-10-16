import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

@Catch(JsonWebTokenError, TokenExpiredError)
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: JsonWebTokenError | TokenExpiredError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();
    const status = HttpStatus.UNAUTHORIZED;

    const message =
      exception instanceof TokenExpiredError
        ? exception.message
        : 'Invalid JWT token.';

    if (process.env.NODE_ENV !== 'test') {
      console.error(exception.message);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
