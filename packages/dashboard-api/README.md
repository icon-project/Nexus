# dashboard-api

## Development Environment

PostgreSQL container

`$ docker run --name postgres-btp -e POSTGRES_PASSWORD=test12345 -d postgres`

Connect to PostgreSQL with shell

`$ docker exec -it postgres-btp psql -h localhost -U postgres`

- Install packages:
  `yarn install`

- Start server:
  `yarn start`

- Access URL:
  `http://localhost:8000`

## Documentations

[API Design Guidelines](./docs/api.md)

[Coding Style Guide](https://google.github.io/styleguide/javascriptguide.xml) Generally we follow Google style guide, not exactly 100%.

[Git Commit Guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits) Generally we follow AngularJS style guide, not exactly 100%.
