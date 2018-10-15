# API for OEM Experitest platform
This Javascript / Node API will enable you to embed real mobile devcies as well as browsers in side your platform.

Project is written in typescript and supports both running in the browser and node.

The entery point is the CloudAPI class. To init it you will need the URL to one of Experitest clouds as well as an access key.
You will find an use example in cloud-api.test.ts file.
To run the test you need to create under /src/test/ a file name cloud-info.js, this file should contain look like:
```javascript
const ACCESS_KEY = '<YOUR ACCESS KEY>';
const CLOUD_URL = '<CLOUD URL>';
```

# Setup 
`npm install`

# Building
To run a build use:
```
npm run compile
```

# Testing
Project includes 2 types of unit tests:

 * **Node**: tests meant to be run via nodejs and not dependent upon browser environment.
 * **Browser**: tests meant to be run with-in the browser.

## Running Tests:
Run node tests (will compile and run the tests):
```
npm run test
```

To test in the browser build we use webpack to run a web server and run mocha test. Run the following:
```
npm run start:dev
```

Then to run the test access the file at the following url: http://localhost:5000/test/run.html

