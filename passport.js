window.passport = new window.immutable.passport.Passport({
    baseConfig: new window.immutable.config.ImmutableConfiguration({
      environment: window.immutable.config.Environment.SANDBOX,
    }),
    clientId: 'mO6UEn4Fexcu4pyD2vtFn3PDnHXQQuqL',
    redirectUri: 'https://teaching-causal-pangolin.ngrok-free.app',
    logoutRedirectUri: 'https://teaching-causal-pangolin.ngrok-free.app/logout.html',
    audience: 'platform_api',
    scope: 'openid offline_access email transact'
  });

