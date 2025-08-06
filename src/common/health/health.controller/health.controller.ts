import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';

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
