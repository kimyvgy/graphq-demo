## Khởi tạo project

1. Init project với yarn hoặc npm:
```bash
yarn init -y
```

2. Cài đặt dependencies:
```bash
yarn add fastify
yarn add -D typescript @types/node
yarn add -D @tsconfig/node16
```

3. Cấu hình typescript:
```json
{
  "include": ["src/**/*.ts", "generate-jwk.js"],
  "exclude": ["node_modules"],
  "extends": "@tsconfig/node16/tsconfig.json",
  "compilerOptions": {
    "rootDirs": ["src"],
    "declaration": true,
    "resolveJsonModule": true,
    "outDir": "dist",
    "types": ["node"],
    "typeRoots": ["./node_modules/@types", "./src/types"]
  }
}
```

> https://www.fastify.io/docs/latest/Reference/TypeScript/

4. Thêm scripts cho package.json:

```json
{
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "start": "node index.js"
  }
}
```

5. Viết code server

```bash
mkdir src
touch index.ts
```

```typescript
import fastify from 'fastify'

const server = fastify()

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
```

Bây giờ chạy thử lệnh `yarn build` và `yarn start`:
```bash
~/k/g/h/auth-server *master> yarn build
yarn run v1.22.19
$ tsc -p tsconfig.json
Done in 1.60s.
~/k/g/h/auth-server *master> yarn start
yarn run v1.22.19
$ node ./dist/index.js
Server listening at http://127.0.0.1:8080
```
6. Thêm dev script:
```bash
yarn add -D npm-run-all nodemon
```

```json
{
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "start": "node index.js",
    "dev": "run-p \"dev:*\"",
    "dev:ts": "npm run build -- --watch",
    "dev:start": "nodemon dist/index.js"
  }
}
```

Chạy thử lệnh `yarn dev`:
```bash
~/k/g/h/auth-server *master> yarn dev
yarn run v1.22.19
$ run-p "dev:*"
$ nodemon dist/index.js
$ npm run build -- --watch
[nodemon] 2.0.21
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node dist/index.js`
Server listening at http://127.0.0.1:8080

> build
> tsc --watch
[11:14:02 AM] Starting compilation in watch mode...

[11:14:04 AM] Found 0 errors. Watching for file changes.

[nodemon] restarting due to changes...
[nodemon] starting `node dist/index.js`
Server listening at http://127.0.0.1:8080
```

## 2. Tạo RSA keys

- Tạo thư mục `certs`:
```bash
mkdir certs
```

- Generate `private.key` RSA-3072 (bits):
```bash
openssl genrsa --out certs/private.key 3072
```

- Generate `public.key` from `private.key`:
```bash
openssl rsa --pubout --in certs/private.key --out certs/public.key
```

## 3. Issue JWT token

- Sử dụng package `jsonwebtoken`:
```bash
yarn add jsonwebtoken
yarn add -D @types/jsonwebtoken
```
- Payload structure: https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
- Issue token:
```typescript
import { sign } from 'jsonwebtoken'
import fs from 'fs'

const payload = {
  // your payload
}

const privateKey = fs.readFileSync('certs/private.key');
const jwtToken = sign(payload, privateKey, {
  algorithm: 'RS256',
  expiresIn: '1h',
});
```

Các fields `iat` và `exp` được tự tạo ra khi thực hiện hàm ký.

- Final code sau khi khai báo routing sẽ có mẫu như sau:
```typescript
server.post('/id-token', async () => {
  const payload: JWTPayload = {
    iss: 'https://accounts.viblo.asia',
    sub: '1',
    aud: 'https://viblo.asia',
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
```

Gửi thử request sẽ thấy response có mẫu sau:

```bash
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8
content-length: 1153
Date: Wed, 22 Mar 2023 07:33:36 GMT
Connection: close

{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLnZpYmxvLmFzaWEiLCJzdWIiOiIxIiwiYXVkIjoiaHR0cHM6Ly92aWJsby5hc2lhIiwibmFtZSI6Ik5ndXllbiBIdXUgS2ltIiwicHJlZmVycmVkX3VzZXJuYW1lIjoia2lteXZneSIsInBpY3R1cmUiOiJodHRwczovL2ltYWdlcy52aWJsby5hc2lhL2F2YXRhci94eHguanBnIiwiZW1haWwiOiJraW1AeW9wbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZ2VuZGVyIjoibWFsZSIsImJpcnRoZGF0ZSI6IjIwMjMtMDMtMjJUMDc6MzM6MzYuNjU3WiIsInVwZGF0ZWRfYXQiOjE1ODQ4NjI0MTY2NTcsInVzZXJfaWQiOiIxIiwiZGVmYXVsdF9yb2xlIjoidXNlciIsImFsbG93ZWRfcm9sZXMiOlsidXNlciIsImF1dGhvciIsImNvbnRyaWJ1dG9yIiwiYWRtaW4iXSwiaWF0IjoxNjc5NDcwNDE2LCJleHAiOjE2Nzk0NzQwMTZ9.RojRoQ62p-0Dsd-uF6SbF0Uqx-5ln07OkcMsjLHGHaFpHEfSoVYYEJWPswLUYeZUSNliXA5zxds2xvqSSq4dsnEfiKn1bVUCbuGpWBtG1-jxj3mx2YRb0dA9468hzDg4L9PlKXxl0ILHEMDLL6pjRi8aDobE76nuHoh_XLzrdxI91xJs1klhtu6bc-IMUvkFUIHNUnygoYrXc9gO1mfRJZln8GFZUJ3zO-Vc99NjCF5_Ve3tzbUvPBXBLv4J4bW31_i1-In3kUgHkIDBjhJyip1qdbqORnc7tcFnsVyPQJR0PoPDwGQgk3BKp5q6CFyD-YP_XayiGE9oLlV3FUvxyfG9-Y8mlDJq-WXGox_OD9X788a0spSFR5pXcUsZv-LvVaQHO_p2w4rd5VA7oO9gEY2h8lQnjadAFP-GSMtOWdx2WBEEruFw70ayHBWoN8k3hjgYBMNv3lXVWx_Y3AfmpJZY8hS4aQ5rkpKqSWvu657cZ9f0DXLCmRomOEf3MMl4"
}
```

## 4. Generate JWK


Truy cập trang này để tạo JWK với public key:
https://russelldavies.github.io/jwk-creator/

Copy vào lưu lại thành file json `src/assets/jwks.json` theo mẫu:
```json
{
  "keys": [
    <JWK_Object>
  ]
}
```

https://www.rfc-editor.org/rfc/rfc7517#section-5.1

VD:
```json
{
  "keys": [
    {
      "kty": "RSA",
      "use": "sig",
      "n": "AMOmW7ziyI2ptHErENt08_5TP5-GxWOGI19iXxmi_nM4wvf5V7ALGJ0pVJQg6O0cHB9G3fAuI3gfYoZxLSQCh5qVLFBdv94sTSg0crR9fOgzwsoFjC26zi0uMgT6awTuDYz8b6-sVhvD5dMkmvrz6S4eTbW7rMvON3f8Jb_6CV3ZunthK8ljCQiZPN4eU3OJNi_qnCk6VOefC1sCiJOCoBA9erXSCgDNb56MeCTn5DgPw_27zxnM0isZnDJfv7d12_B9LLszHBBUgSbPNwe89OOzHGMK24yvcKSXGKxmS-n2htepBYRPOOmPc0l0NshSprdBrA3kdTihXNcZhLbl9ql_lJr47iCsfIO7wF-RcK27ze-UhHMHcw1JiMWEAOpnS8Xvc8ZgSxpDAPdKmDT99ooSRR_NcuJ-XdKDSbksyNry9cUno4NTHt4VN5wilwhQ7RCGpvSi_7D4Fj2LXy2jY32bR8_b28yrbA7Tm8NFTX3x70UeiZC4-2fAPe_LzhlZGw",
      "e": "AQAB"
    }
  ]
}
```

- Tạo JWKS URI để cho các microservices có thể request lấy JWK:
```typescript
import jwk from './assets/jwks.json'

server.get('/.well-known/jwks.json', () => jwk);
```

```bash
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8
content-length: 568
Date: Wed, 22 Mar 2023 07:49:12 GMT
Connection: close

{
  "keys": [
    {
      "kty": "RSA",
      "use": "sig",
      "n": "AMOmW7ziyI2ptHErENt08_5TP5-GxWOGI19iXxmi_nM4wvf5V7ALGJ0pVJQg6O0cHB9G3fAuI3gfYoZxLSQCh5qVLFBdv94sTSg0crR9fOgzwsoFjC26zi0uMgT6awTuDYz8b6-sVhvD5dMkmvrz6S4eTbW7rMvON3f8Jb_6CV3ZunthK8ljCQiZPN4eU3OJNi_qnCk6VOefC1sCiJOCoBA9erXSCgDNb56MeCTn5DgPw_27zxnM0isZnDJfv7d12_B9LLszHBBUgSbPNwe89OOzHGMK24yvcKSXGKxmS-n2htepBYRPOOmPc0l0NshSprdBrA3kdTihXNcZhLbl9ql_lJr47iCsfIO7wF-RcK27ze-UhHMHcw1JiMWEAOpnS8Xvc8ZgSxpDAPdKmDT99ooSRR_NcuJ-XdKDSbksyNry9cUno4NTHt4VN5wilwhQ7RCGpvSi_7D4Fj2LXy2jY32bR8_b28yrbA7Tm8NFTX3x70UeiZC4-2fAPe_LzhlZGw",
      "e": "AQAB"
    }
  ]
}
```

### 5. Cấu hình Hasura

1. Bật hasura container

```bash
docker compose up
```

- Hasura: http://localhost:8080
- Auth service: http://localhost:4000

2. Tạo Actions

Sau khi chạy Hasura lên. Do auth service là REST API nên sẽ tạo Action:
- Define GraphQL schema của action
```graphql
type Mutation {
  signIn(username: String!, password: String!): SignInResponse!
}

type SignInResponse {
  accessToken: String!
}
```
- Điền các trường URL: {{AUTH_SERVICE_URL}}/auth/token
- Transform lại payload:
```json
{
  "username": {{$body.input.username}},
  "password": {{$body.input.password}}
}
```

- Transform lại response:

```json
{
  "accessToken": {{$body.access_token}}
}
```
- Nhấn lưu thành công

Bây giờ vào tab Hasura > API để tạo thử access_token. Khi tạo xong, mặc dù thêm Authorization vào header nhưng tool chưa decode JWT do chưa bật mode đăng nhập bằng JWT.

3. Bật JWT Authentication Mode

Thêm environment variables:

```yaml
services:
  graphql-engine:
    environment:
      # Đặt mật khẩu trang Hasura
      HASURA_GRAPHQL_ADMIN_SECRET: "secret"
      # Tạo role mặc định khi chưa đăng nhập
      HASURA_GRAPHQL_UNAUTHORIZED_ROLE: "anonymous"
      # Bật remote schema
      HASURA_GRAPHQL_ENABLE_REMOTE_SCHEMA_PERMISSIONS: "true"
      # Cấu hình JWT Authentication mode
      HASURA_GRAPHQL_JWT_SECRET: |
        {
          "type": "RS256",
          "jwk_url": "http://auth:4000/.well-known/jwks.json",
          "issuer": "auth",
          "audience": "demo",
          "claims_namespace_path": "$",
          "claims_format": "json",
          "claims_map": {
            "x-hasura-allowed-roles": { "path": "$.allowed_roles" },
            "x-hasura-default-role": { "path": "$.default_role" },
            "x-hasura-user-id": { "path": "$.user_id" }
          }
        }
```
