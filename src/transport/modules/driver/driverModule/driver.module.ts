import { Module } from "@nestjs/common";

import { MongooseModule } from "@nestjs/mongoose";

import { Driver, DriverSchema } from "../driverSchema/driver.schema";

import { DriverController } from "../driverController/driver.controller";

import { DriverService } from "../driverServies/driver.services";

@Module({
    imports:[
        MongooseModule.forFeature([{name:Driver.name,schema:DriverSchema}])
    ],
    controllers:[DriverController],
    providers:[DriverService],
    exports:[DriverService]
})
export class DriverModule {}