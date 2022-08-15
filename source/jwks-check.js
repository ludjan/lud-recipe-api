const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 100,
      jwksUri: `https://dev-z293vi6n.us.auth0.com/.well-known/jwks.json`
    }),
  
    // Validate the audience and the issuer.
    audience: 'https://https://lud-recipe-api.herokuapp.com',
    issuer: `https://dev-z293vi6n.us.auth0.com/`,
    algorithms: ['RS256']
});

module.exports = {
    checkJwt
}