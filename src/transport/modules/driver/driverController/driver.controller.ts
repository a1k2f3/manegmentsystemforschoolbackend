import { Controller ,Post ,Body ,Get ,Param ,Put ,Delete} from "@nestjs/common";

import { DriverService } from "../driverServies/driver.services";
import { Driver } from "../driverSchema/driver.schema";

@Controller('driver')
export class DriverController{
    constructor (private readonly driverService: DriverService){}

    @Post()
    async create(@Body() driver: Driver){
        return this.driverService.create(driver);
    }

    @Get()
    async findAll():Promise<Driver[]>{
        return this.driverService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id:string):Promise<Driver>{
        return this.driverService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id:string,@Body() driver: Driver):Promise<Driver>{
        return this.driverService.update(id,driver);
    }

    @Delete(':id')
    async remove(@Param('id') id:string):Promise<any>{
        return this.driverService.remove(id);
    }
}