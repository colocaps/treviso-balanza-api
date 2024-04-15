import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';


import { SupabaseGuard, SupabaseModule } from './common/supabase';
import { PersonService } from './person/person_service';
import { PersonController } from './person/person_controller';

@Module({
  imports: [ConfigModule.forRoot(), PassportModule, SupabaseModule,],
  controllers: [PersonController],
  providers: [
    PersonService,
    {
      provide: APP_GUARD,
      useClass: SupabaseGuard,
    },
  ],
})
export class AppModule {}
