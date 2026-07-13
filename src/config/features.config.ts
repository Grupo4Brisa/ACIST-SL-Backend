import { registerAs } from '@nestjs/config';

export default registerAs(
  'features',
  () => ({

    associateArea:
      process.env.ASSOCIATE_AREA === 'true',

    associateLogin:
      process.env.ASSOCIATE_LOGIN === 'true',

    associateEvents:
      process.env.ASSOCIATE_EVENTS === 'true',

    landingPassword:
      process.env.LANDING_PASSWORD === 'true',

    completionToken:
      process.env.COMPLETION_TOKEN === 'false',

  }),
);
