import {Controller,Post,Get,Put,Delete,Param, Body} from '@nestjs/common';
import {VehicleServices} from '../VehicleServices/vehicle.services';
import {Vehicle} from '../VehicleSchema/vehicle.schema';

@Controller('vehicle')
export class VehicleController {
    constructor(private vehicleService:VehicleServices){}
    @Post() 
    async createVehicle(@Body() vehicle: Vehicle) {
        return this.vehicleService.createVehicle(vehicle);
    }   
    @Get()
    async findAllVehicles() {
        return this.vehicleService.findAllVehicles();
    }
    @Get(':id')
    async findVehicleById(@Param('id') id: string) {
        return this.vehicleService.findVehicleById(id);
    }
    @Put(':id')
    async updateVehicleById(@Param('id') id: string, @Body() vehicle: Vehicle) {
        return this.vehicleService.updateVehicleById(id, vehicle);
    }
    @Delete(':id')
    async deleteVehicleById(@Param('id') id: string) {
        return this.vehicleService.deleteVehicleById(id);
    }
}
