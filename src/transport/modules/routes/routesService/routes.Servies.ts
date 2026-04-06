import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Route, RouteDocument } from '../routesSchema/routes.schema';

@Injectable()
export class RoutesService {
  constructor(
    @InjectModel(Route.name) private routeModel: Model<RouteDocument>,
  ) {}

  async create(createRouteDto: any): Promise<Route> {
    const createdRoute = new this.routeModel(createRouteDto);
    return createdRoute.save();
  }

  async findAll(): Promise<Route[]> {
    return this.routeModel
      .find()
      .populate('vehicle')
      .populate('driver')
      .exec();
  }

  async findOne(id: string): Promise<Route> {
    const route = await this.routeModel
      .findById(id)
      .populate('vehicle')
      .populate('driver')
      .exec();
    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
    return route;
  }

  async update(id: string, updateRouteDto: any): Promise<Route> {
    const updatedRoute = await this.routeModel
      .findByIdAndUpdate(id, updateRouteDto, { new: true })
      .populate('vehicle')
      .populate('driver')
      .exec();
    if (!updatedRoute) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
    return updatedRoute;
  }

  async remove(id: string): Promise<any> {
    const deletedRoute = await this.routeModel.findByIdAndDelete(id).exec();
    if (!deletedRoute) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
    return { message: 'Route deleted successfully' };
  }
}
