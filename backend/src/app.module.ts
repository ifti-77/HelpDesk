import {  Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from './employee/employee.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { AgentModule } from './agent/agent.module';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { OrganizationModule } from './organization/organization.module';


@Module({
  imports: [EmployeeModule, AdminModule, AgentModule, AuthModule, OrganizationModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          type: 'postgres',
          url: configService.get<string>('DB_URL'),
          autoLoadEntities: true,
          synchronize: configService.get<string>('NODE_ENV') !== 'production',
          ssl: {
            rejectUnauthorized: false,
          },
        })
      })],
  controllers: [],
  providers: [],
})
export class AppModule { }
