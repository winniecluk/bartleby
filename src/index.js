import Resolver from '@forge/resolver';
import jwt from 'jsonwebtoken';

const resolver = new Resolver();

resolver.define('getJwt', (req) => {
  const claims = {
    iat: Math.floor(Date.now() / 1000) - 60,
    exp: Math.floor(Date.now() / 1000) + (10 * 60),
    iss: process.env.APP_ID,
    alg: 'RS256'
  };
  const token = jwt.sign(claims, process.env.PRIVATE_KEY, { algorithm: 'RS256' });
  return token;
});

resolver.define('getInstallationId', (req) => {
  return process.env.INSTALLATION_ID;
});

export const handler = resolver.getDefinitions();
