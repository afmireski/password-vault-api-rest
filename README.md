# Password Vault Rest API
> API developed to management PasswordVault application

## Initial Setup
> Run in a terminal
```bash
# Install any packages dependencies
yarn install

# Create your .env file with your informations
cp .env.example .env

# Create and sync database
yarn prisma migrate deploy

# Generate Prisma files
yarn prisma generate

# Run the project in development mode
yarn start:dev
```

## Project Details
### Tecnologies
- ORM: [**Prisma**](https://www.prisma.io)
- Database: [**Postgres**](https://www.postgresql.org)
- Language: **TypeScript**
- [**NestJS**](https://nestjs.com)

### Documentation
The project documentation is make using the integration into *NestJS* and *Swagger*.  
The documentation can be access [here](http://localhost:3000/password-vault/api-rest/api/).  
>To access the link documentation the project *must be running*.