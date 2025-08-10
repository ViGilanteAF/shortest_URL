import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { IsNumber } from 'class-validator';
import { ResponseValidationInterceptor } from '../validation/response-validation';

class Test {
  @IsNumber()
  status: number;
}
@ApiTags('Health')
@Controller('health')
export class HealthController {
  get health(): HealthCheckService {
    return this._health;
  }
  constructor(private readonly _health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  @UseInterceptors(new ResponseValidationInterceptor(Test))
  check() {
    return this._health.check([]);
  }
}
