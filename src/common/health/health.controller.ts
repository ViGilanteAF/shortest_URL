import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  get health(): HealthCheckService {
    return this._health;
  }
  constructor(
    private readonly _health: HealthCheckService,
    private readonly _database: MongooseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this._health.check([]);
    return this._health.check([() => this._database.pingCheck('database')]);
  }
}
