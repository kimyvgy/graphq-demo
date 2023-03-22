import fs from 'fs'
import fastify from 'fastify'
import { sign } from 'jsonwebtoken'
import jwk from './assets/jwks.json'

const server = fastify()

server.get('/ping', async () => {
  return {
    message: 'PONG',
  }
});

server.get('/.well-known/jwks.json', () => jwk);

server.post('/auth/token', async () => {
  const payload: JWTPayload = {
    iss: 'auth',
    sub: '1',
    aud: 'demo',
    name: 'Nguyen Huu Kim',
    preferred_username: 'kimyvgy',
    picture: 'https://images.viblo.asia/avatar/xxx.jpg',
    email: 'kim@yopmail.com',
    email_verified: true,
    gender: 'male',
    birthdate: new Date().toISOString(),
    updated_at: new Date().setFullYear(2020),
    user_id: '1',
    default_role: 'user',
    allowed_roles: ['user', 'author', 'contributor', 'admin'],
  }

  const privateKey = fs.readFileSync('certs/private.key');
  const token = sign(payload, privateKey, {algorithm: 'RS256', expiresIn: '1h'});

  return {
    access_token: token,
  }
});

server.listen({ port: 4000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
