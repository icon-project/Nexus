# dashboard-api

## Development Environment

PostgreSQL container

`$ docker run --name postgres-btp -e POSTGRES_PASSWORD=test12345 -d postgres`

Connect to PostgreSQL with shell

`$ docker exec -it postgres-btp psql -h localhost -U postgres`

- Install packages:
  `yarn install`

- Start development server:
  `yarn start`

- Access URL:
  `http://localhost:8000`

## Production

`yarn start:pm2`

Configure cron job to update tokens to USD conversion rate.

```bash
$ crontab -e

# add this script and save changes.
# ref: https://crontab.guru/
0 0 * * * COIN_MARKET_CAP_URL=https://sandbox-api.coinmarketcap.com/v1 COIN_MARKET_CAP_KEY=b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c POSTGRES_DB_URL=postgresql://postgres:test123@localhost:5432/postgres node <dashboard-api folder>/scripts/cmc_conversion.js > cmc_conversion.log

$ crontab -l
```

## Documentations

[API Design Guidelines](./docs/api.md)

[Coding Style Guide](https://google.github.io/styleguide/javascriptguide.xml) Generally we follow Google style guide, not exactly 100%.

[Git Commit Guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits) Generally we follow AngularJS style guide, not exactly 100%.
