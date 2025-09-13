import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  exports: [ConfigModule],
  providers: [Logger],
})
export class ConfigsModule {}
