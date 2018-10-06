const environments = {};

environments.staging = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : 'staging',
  'hashingSecret' : 'topSecret',
  'stripeSecret' : 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
  'currency' : 'usd',
  'mailgun' : {
    'sender' : 'sandbox381eda0cde214c6eb5961602486f68ec.mailgun.org',
    'apiKey' : '92cadddc8a71d4d3e3fc94a889db2a80-c8e745ec-3e4140fb' ,
    'domain' : 'sandbox381eda0cde214c6eb5961602486f68ec.mailgun.org'
  }
};

environments.production = {
  'httpPort' : 8080,
  'httpsPort' : 9080,
  'envName' : 'production',
  'hashingSecret' : 'topSecret',
  'stripeSecret' : 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
  'currency' : 'usd',
  'mailgun' : {
    'sender' : 'sandbox381eda0cde214c6eb5961602486f68ec.mailgun.org',
    'apiKey' : '92cadddc8a71d4d3e3fc94a889db2a80-c8e745ec-3e4140fb' ,
    'domain' : 'sandbox381eda0cde214c6eb5961602486f68ec.mailgun.org'
  }
}

const currentEnvironment = typeof process.env.NODE_ENV === 'string' ?
  process.env.NODE_ENV.toLowerCase() : '';

const environmentToExport = typeof environments[currentEnvironment] === 'object' ?
  environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;