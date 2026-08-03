import { registerAs } from '@nestjs/config';

export default registerAs('features', () => ({
  associateArea: process.env.ASSOCIATE_AREA !== 'false',

  associateLogin: process.env.ASSOCIATE_LOGIN !== 'false',

  associateEvents: process.env.ASSOCIATE_EVENTS !== 'false',

  landingPassword: process.env.LANDING_PASSWORD === 'true',

  completionToken: process.env.COMPLETION_TOKEN === 'false',
}));
