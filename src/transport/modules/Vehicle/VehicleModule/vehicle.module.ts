import { Module } from '@nestjs/common';
import { VehicleController } from '../VehicleController/vehicle.controller';
import { VehicleServices } from '../VehicleServices/vehicle.services';
import { Vehicle, VehicleSchema } from '../VehicleSchema/vehicle.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module
(
  {
    imports: [MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }])],     
    controllers: [VehicleController],
    providers: [VehicleServices],
    exports: [VehicleServices]
  }
)
export class VehicleModule {}   