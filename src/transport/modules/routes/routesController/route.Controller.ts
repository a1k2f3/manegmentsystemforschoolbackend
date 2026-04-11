import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { RoutesService } from '../routesService/routes.Servies';

@Controller('routes')
export class RouteController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  async create(@Body() createRouteDto: any, @Res() res) {
    const route = await this.routesService.create(createRouteDto);
    return res.status(HttpStatus.CREATED).json({
      message: 'Transport route created successfully',
      route,
    });
  }

  @Get()
  async findAll(@Res() res) {
    const routes = await this.routesService.findAll();
    return res.status(HttpStatus.OK).json(routes);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const route = await this.routesService.findOne(id);
    return res.status(HttpStatus.OK).json(route);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRouteDto: any,
    @Res() res,
  ) {
    const route = await this.routesService.update(id, updateRouteDto);
    return res.status(HttpStatus.OK).json({
      message: 'Transport route updated successfully',
      route,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    await this.routesService.remove(id);
    return res.status(HttpStatus.OK).json({
      message: 'Transport route deleted successfully',
    });
  }
}
