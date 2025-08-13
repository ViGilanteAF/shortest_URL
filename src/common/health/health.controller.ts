import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  get health(): HealthCheckService {
    return this._health;
  }
  constructor(private readonly _health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  check() {
    return this._health.check([]);
  }
}
