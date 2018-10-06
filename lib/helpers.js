const helpers = {};
const crypto = require('crypto');
const config = require('./config');
const queryString = require('querystring');
const https = require('https');

helpers.hash = str => {
  if (typeof str === 'string' && str.length > 0) {
    const hash = crypto
      .createHmac('sha256', config.hashingSecret)
      .update(str)
      .digest('hex');
    return hash;
  } else {
    return false;
  }
};

helpers.parseJsonToObject = str => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch {
    return {};
  }
}

helpers.createRandomString = strLength => {
  strLength = typeof strLength === 'number' && strLength > 0 ?
    strLength : false;
  if (strLength) {
    const possibleChars = 'abcdefghiklmnopqrstuvwxyz0123456789';
    let str = '';
    let i;
    for (i = 0; i < strLength; i++) {
      const randomChar = possibleChars.charAt(
        Math.floor(Math.random() * possibleChars.length)
      );
      str += randomChar;
    }
    return str;
  } else {
    return false;
  }
};

helpers.payWithStripe = (amount, currency, description, source, callback) => {
  const payload = {
    'amount' : amount,
    'currency' : currency,
    'description' : description,
    'source' : source
  };
  const stringPayload = queryString.stringify(payload);
  const requestDetails = {
    'protocol' : 'https:',
    'hostname' : 'api.stripe.com',
    'method' : 'POST',
    'auth' : config.stripeSecret,
    'path' : '/v1/charges',
    'headers' : {
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Content-Length' : Buffer.byteLength(stringPayload)
    }
  };
  const req = https.request(requestDetails, res => {
    if (res.statusCode === 200 || res.statusCode === 201) {
      callback(false);
    } else {
      callback(`Stripe returned ${res}`);
    }
  });
  req.on('error', e => callback(e));
  req.write(stringPayload);
  req.end();
};

helpers.sendMailgunEmail = (to, subject, body, callback) => {
  const payload = {
    'from' : `Pizza Lodge ${config.mailgun.sender}`,
    'to' : to,
    'subject' : subject,
    'text' : body
  };
  const stringPayload = queryString.stringify(payload);
  const requestDetails = {
    'protocol' : 'https:',
    'hostname' : 'api.mailgun.net',
    'method' : 'POST',
    'auth' : config.mailgun.apiKey,
    'path' : `/v3/${config.mailgun.domainName}/messages`,
    'headers' : {
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Content-Length' : Buffer.byteLength(stringPayload)
    }
  }
  const req = https.request(requestDetails, res => {
    if (res.statusCode === 200 || res.statusCode === 201) {
      callback(false);
    } else {
      callback(`Mailgun returned ${res}`);
    }
  });
  req.on('error', e => callback(e));
  req.write(stringPayload);
  req.end();
};

module.exports = helpers;