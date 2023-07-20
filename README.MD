# SwipeTube Backend

## Description

---

The Backend service for SwipeTube application

## Build Local Environment for development

---

To build local environment please follow instructions below:
Before running router to be sure that all services are running via docker-compose

1. Install dependencies

   `npm ci`

2. Ensure that all required ENV variables are correct and present in .env file

   > (You can check format of environment variables in .env.example )

3. Build services

   `docker-compose up`

4. Run the application

   `npm run watch`

---

## ENV Variables

| Name                   | is required | description                          | example                       |
| ---------------------- | ----------- | ------------------------------------ | ----------------------------- |
| #SYSTEM                |             |                                      |                               |
| NODE_ENV               | YES         | Specifies environment of application | development, test, production |
|                        |             |                                      |                               |
| #SERVER                |             |                                      |                               |
| PORT                   | YES         | Port of server                       | 8080                          |
|                        |             |                                      |                               |
| #DATABASE              |             |                                      |                               |
| DB_HOST                | YES         | database host                        | localhost                     |
| DB_PORT                | YES         | database port                        | 5432                          |
| DB_NAME                | YES         | database name                        | config                        |
| DB_USER                | YES         | database user                        | postgres                      |
| DB_PASSWORD            | YES         | database password                    | postgres                      |
| DB_DIALECT             | YES         | database type                        | postgres                      |
| DB_SCHEMA              | YES         | database schema                      | config                        |
| DB_SEEDER_STORAGE      | YES         | seeders storage                      | sequelize                     |
| ALLOW_CONFIG_MUTATIONS | YES         | configuration for migrations         | true                          |
|                        |             |                                      |                               |
| #S3                    |             |                                      |                               |
| S3_ACCESS_KEY          | YES         | Access key for AWS S3 Bucket         | S3_ACCESS_KEY                 |
| S3_SECRET_ACCESS_KEY   | YES         | Secret Access key for AWS S3 Bucket  | S3_SECRET_ACCESS_KEY          |
| S3_BUCKET_NAME         | YES         | AWS S3 Bucket Name                   | S3_BUCKET_NAME                |
| S3_BUCKET_REGION       | YES         | AWS S3 Bucket Region                 | S3_BUCKET_REGION              |
|                        |             |                                      |                               |
| #SESSION               |             |                                      |                               |
| JWT_SECRET             | YES         | Secret key for token generation      | JWT_SECRET                    |
| JWT_EXPIRES_IN         | YES         | The time in which token expires      | 24h                           |
