const { NestFactory } = require('@nestjs/core');
const { DocumentBuilder, SwaggerModule } = require('@nestjs/swagger');

let app;

async function bootstrap() {
  if (app) {
    return app;
  }

  const { AppModule } = require(require('path').resolve(process.cwd(), 'dist', 'app.module.js'));

  app = await NestFactory.create(AppModule, {
    logger: false,
  });
  
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Vera API')
    .setDescription('NestJS API for managing employee registros with salary calculations and date tracking')
    .setVersion('1.0')
    .addTag('registros', 'Employee registry management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.init();
  
  return app;
}

module.exports = async (req, res) => {
  try {
    const nestApp = await bootstrap();
    const httpAdapter = nestApp.getHttpAdapter();
    const expressApp = httpAdapter.getInstance();
    
    return expressApp(req, res);
    
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};
