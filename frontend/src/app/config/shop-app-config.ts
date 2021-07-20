import { globalVariables } from './globals';

export default {
  oidc: {
    clientId: '0oa19jrim4nkTaihT5d7',
    issuer: 'https://dev-12228398.okta.com/oauth2/default',
    redirectUri: `${globalVariables.LOCAL_URL}/login/callback`,
    scopes: ['openid', 'profile', 'email'],
  },
};
