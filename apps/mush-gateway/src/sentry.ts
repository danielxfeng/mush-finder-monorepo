import * as Sentry from '@sentry/cloudflare';

import app, { MyEnv } from '.';

export default Sentry.withSentry(
  (env: MyEnv) => ({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,

    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
  }),
  {
    async fetch(request, env, ctx) {
      return app.fetch(request, env, ctx);
    },
  } satisfies ExportedHandler<Env>,
);
