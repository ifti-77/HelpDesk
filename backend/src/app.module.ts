import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from './employee/employee.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { AgentModule } from './agent/agent.module';
import { ConfigModule} from '@nestjs/config'
import { OrganizationModule } from './organization/organization.module';


@Module({
  imports: [EmployeeModule,AdminModule, AgentModule, AuthModule, OrganizationModule,
     TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '0000',
    database: 'help_desk',
    autoLoadEntities: true,
    synchronize: true,
  }), ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [],
})
export class AppModule {}
