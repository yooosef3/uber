import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AdminModule } from 'src/rest/admin/admin.module';
import { DriverModule } from 'src/rest/driver/driver.module';
import { PassengerModule } from 'src/rest/passenger/passenger.module';

interface SwaggerModuleItem {
  path: string;
  module?: any;
  bearer: boolean;
}

export function setupSwagger(app: INestApplication, cfg) {
  const apiVersion = cfg.get('App.version');
  const swaggerTitle = cfg.get('Swagger.title');
  const swaggerDescription = cfg.get('Swagger.description');
  const swaggerVersion = cfg.get('Swagger.version');

  const mainOptions = new DocumentBuilder()
    .setTitle(`${swaggerTitle} - Admin`)
    .setDescription(swaggerDescription)
    .setVersion(swaggerVersion)
    .build();

  const maindocument = SwaggerModule.createDocument(app, mainOptions, {
    include: [AdminModule],
  });
  SwaggerModule.setup(`${apiVersion}/docs`, app, maindocument);

  const modules: SwaggerModuleItem[] = [
    { path: 'admin', module: AdminModule, bearer: false },
    { path: 'driver', module: DriverModule, bearer: true },
    { path: 'passenger', module: PassengerModule, bearer: true },
  ];

  modules.forEach(({ path, module, bearer }) => {
    let optionsBuilder = new DocumentBuilder()
      .setTitle(`${swaggerTitle} - ${path}`)
      .setDescription(swaggerDescription)
      .setVersion(swaggerVersion);

    if (bearer) {
      optionsBuilder = optionsBuilder.addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'Authorization',
      );
    }

    const options = optionsBuilder.build();
    const doc = SwaggerModule.createDocument(app, options, {
      include: [module],
    });
    SwaggerModule.setup(`${apiVersion}/docs/${path}`, app, doc);
  });
}
