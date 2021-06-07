# API Design Guidelines

## HTTP status code for responses

`200`: Successful request, client might not responded with valid data, but request was sent and handled by server successfully.

`201`: Successfull POST request

`400`: Bad request, for all input parameter validation errors

`401`: Unauthorized

`404`: Not found, for example getting a product by an invalid ID

`500`: All server errors, unhandled exceptions

## Response data

### Data for successful requests

Respond a single object

```json
{
  type: "Product",
  content: {
    name: "ABC",
    year: 2015
  }
}
```

or a collection of objects

```json
{
  type: "ProductCollection",
  content: [product1, product2...]
}
```

### Error

```json
{
  error: {
    code: 505, // custom error code, not HTTP status code
    message: "Error description"
  }
}
```

## Request types

### GET

Only for reading data requests. Input data is in query string.

Examples:

`GET /products/1ee8fb5b2307`

`GET /products?type=abc`

### POST

For creating new data requests. Input data is in request body.

Response:

- HTTP status code: 201
- HTTP header: `Location: created object location`
- Response data: depends on client needs

Examples:

Request:

```json
POST /products

{
  name: "ABC",
  year: 2015
}
```

Response:

```json
201
Location: http://localhost/v1/products/1ee8fb5b2307

{
  content: {
    id: "1ee8fb5b2307"
  }
}
```

### PUT

For updating an existing data requests. It's a full update, existing data is fully replaced with received data.

Examples:

```json
PUT /products/1ee8fb5b2307

{
  name: "ABC",
  year: 2015
}
```

### DELETE

For deleting an existing data requests.

`DELETE /products/1ee8fb5b2307`

### Actions

For other actions that don't feet with above requests, using a specific action name.

`GET /products/syncInventory`

`GET /users/login?userName=tiendq&password=lecle`

## Implementation

### route.js

All route configuration and middlewares.

### controller.js

All route handlers, logging requests, input data validation, pre-processing input data, and post-processing for response data.

Data validation is done with `@hapi/joi`

### model.js

All business rules implementation, data validation which requires business rules that not available in controllers e.g. checking if an email is already used.

### repository.js

Data access implementation, decouples model from data access logic.
