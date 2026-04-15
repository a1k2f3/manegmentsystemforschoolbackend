// import { Vehicle } from "../VehicleSchema/vehicle.schema";
import { Vehicle } from "../VehicleSchema/vehicle.schema";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";


@Injectable()
export class VehicleServices {
  constructor(@InjectModel(Vehicle.name) private readonly vehicleModel: Model<Vehicle>) {}

  async createVehicle(vehicle: Vehicle) {
    const newVehicle = new this.vehicleModel(vehicle);
    return newVehicle.save();
  }

  //findAll Vehicles
  async findAllVehicles() {
    return this.vehicleModel.find().exec();  
  }
  //find Vehicle by id
  async findVehicleById(id: string) {
    return this.vehicleModel.findById(id).exec();
  }
  //update by id 
  async updateVehicleById(id: string, vehicle: Vehicle) {
    return this.vehicleModel.findByIdAndUpdate(id, vehicle, { new: true }).exec();
  }
  //delete by id
  async deleteVehicleById(id: string) {
    return this.vehicleModel.findByIdAndDelete(id).exec();
  }

}                                                               




