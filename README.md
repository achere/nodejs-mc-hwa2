# Node js Master Class Homework assignment #2
## PIZZA LODGE

**API for making Pizza orders**

## Setup

### Prerequizites:
- Node.js LTS installed
- HTTPS certificates generated
- Stripe account
- Mailgun account

### Configuring the project
After cloning the repo create **config.js** file in the lib directory like so:

```Javascript

const environments = {};

environments.['/*environment name*/'] = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : '/*environment name*/',
  'hashingSecret' : 'topSecret',
  'stripeSecret' : '/*your secret*/',
  'currency' : '/*your currency*/',
  'mailgun' : {
    'sender' : '/*your mailgun address*/',
    'apiKey' : '/*your API key*/' ,
    'domain' : '/*your domain*/'
  }
};

const currentEnvironment = typeof process.env.NODE_ENV === 'string' ?
  process.env.NODE_ENV.toLowerCase() : '';

const environmentToExport = typeof environments[currentEnvironment] === 'object' ?
  environments[currentEnvironment] : environments.staging;

module.exports = environments;

```
Edit **menu.json** file in the /.data folder to update the menu with your own.


## Usage

Place your key.pem and cert.pem files inside https/ folder in the project directory.
Start the project by running **NODE_ENV=your_environment node index** in the terminal.
Now you have the following endpoints available by the ports you have specified in the config file.

### /users
Accepts POST, GET, PUT and DELETE requests.

- POST request to create a user should contain payload with following fields (all required):
```JSON
{
    "name" : "John Doe",
    "email" : "johndoe@mail.com",
    "address" : "1 Elm st.",
    "password" : "catGoesMeow"
}

```

- GET request should contain user email in the URL and header "token" : "/*token you got from logging in*/" - explained below.
Example: **users/?email=johndoe@mail.com**

- PUT request to edit a user should also contain header and payload with required email and optional name, address, password (similar to POST example).

- DELETE request should contain user email in the URL and eader "token" : "/*token you got from logging in*/" - explained below.


### /tokens
Accepts POST and DELETE requests.

- POST request to create a token or log in should contain email and password in the request payload:

```JSON
{
    "email": "johndoe@mail.com",
    "password" : "catGoesMeow"
}

```
The request returns you a token to use in the header and authorize the following requests and the menu. The token 

```JSON
{
    "email": "johndoe@mail.com",
    "token": "ados89ejf0qlavpl7ccc",
    "menu": [
        {"name" : "pepperoni", "price" : 20.00},
        {"name" : "seafood", "price" : 22.50},
        {"name" : "chili", "price" : 21.00}
    ]
}
```

- DELETE request to delete the token by id in query string (log out)


### /orders
Accepts POST, GET, PUT and DELETE requests.

- POST request to create an order should contain payload with following fields (all required) and the token in header:

```JSON
{
    "email": "johndoe@mail.com",
    "items":[
      {
        "name": "chili",
        "qty" : 2
      },
      {
        "name" : "seafood",
        "qty" : 1
      }
    ]
}
```

This will return an object like the following:

```JSON
{
    "id": "bm0y4fdgfe4sfh3hdf",
    "email": "johndoe@mail.com",
    "items": [/*ordered items*/],
    "total": 63,
    "paid": false
}
```
- GET request should contain order id in URL and token in header.

- PUT request allows to change the ordered items. Payload should be similar to POST example, token in header is required

- DELETE request allows to delete the order. Required order id in the URL and token in header.

### /pay

Accepts only POST

Required fields in the payload:

```JSON
{
    "id": "bm0y4fdgfe4sfh3hdf",
    "stripeToken": "/*stripe token of customer card*/",
}
```
Token in header is also required.


