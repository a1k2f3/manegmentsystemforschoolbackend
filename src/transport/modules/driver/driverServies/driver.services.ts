import { Injectable , NotFoundException } from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";


import {Driver, DriverDocument } from "../driverSchema/driver.schema"
import { Model } from "mongoose";


@Injectable()
export class DriverService{
    constructor(@InjectModel(Driver.name) private driverModel:Model<DriverDocument>,
)
    {}
    async create(driver:Driver){
        const createdDriver = new this.driverModel(driver);
        return createdDriver.save();
    }
    async findAll():Promise<Driver[]>

    {

        return this.driverModel.find().exec();

    }

    async findOne(id:string):Promise<Driver>{
        const driver = await this.driverModel.findById(id).exec();
        if(!driver){
            throw new NotFoundException(`Driver with ID ${id} not found`);
        }
        return driver;
    }

    async update(id:string,driver:Driver):Promise<Driver>{
        const updatedDriver = await this.driverModel.findByIdAndUpdate(id,driver,{new:true}).exec();
        if(!updatedDriver){
            throw new NotFoundException(`Driver with ID ${id} not found`);
        }
        return updatedDriver;
    }

    async remove(id:string):Promise<any>{
        const deletedDriver = await this.driverModel.findByIdAndDelete(id).exec();
        if(!deletedDriver){
            throw new NotFoundException(`Driver with ID ${id} not found`);
        }
        return {message:"Driver deleted successfully"};
    }



}

