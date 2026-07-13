import { registerAs } from '@nestjs/config';

export default registerAs(
  'features',
  () => ({

    associateArea: true,

    associateLogin: true,

    associateEvents: true,

    landingPassword: true,

    completionToken: false,

  }),
);
