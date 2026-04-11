import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Route, RouteSchema } from '../routesSchema/routes.schema';
import { RouteController } from '../routesController/route.Controller';
import { RoutesService } from '../routesService/routes.Servies';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Route.name, schema: RouteSchema }]),
  ],
  controllers: [RouteController],
  providers: [RoutesService],
  exports: [RoutesService],
})
export class RoutesModule {}
