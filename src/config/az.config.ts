import { registerAs } from '@nestjs/config';
import {
  ConsumerConfig,
  logLevel,
  Partitioners,
  ProducerConfig,
} from 'kafkajs';

export const azConfig = registerAs('az', () => ({
  kafka: {
    brokers: process.env.KAFKA_BROKERS?.split(','),
    logLevel: logLevel.NOTHING,
  },
  producer: <ProducerConfig>{
    createPartitioner: Partitioners.LegacyPartitioner,
    idempotent: true,
  },
  consumer: <ConsumerConfig>{
    groupId: 'shortest-url-consumer',
  },
  retry: {
    retries: 5,
    initialRetryTime: 3000,
  },
}));
