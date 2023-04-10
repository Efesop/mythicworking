// src/electronRequest.js
const { net } = require('electron').remote;

const electronRequest = async (method, url, data) => {
  return new Promise((resolve, reject) => {
    const request = net.request({
      method,
      url,
      protocol: 'http:',
    });

    request.on('response', (response) => {
      let body = '';
      response.on('data', (chunk) => {
        body += chunk;
      });

      response.on('end', () => {
        const data = JSON.parse(body);
        resolve({ status: response.statusCode, data });
      });
    });

    request.on('error', (error) => {
      reject(error);
    });

    if (data) {
      request.setHeader('Content-Type', 'application/json');
      request.write(JSON.stringify(data));
    }

    request.end();
  });
};

module.exports = electronRequest;
