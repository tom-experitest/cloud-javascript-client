import * as chai from 'chai';
import * as chai_promise from 'chai-as-promised';
//import { doFetch } from '../lib/fetch-util';

chai.use(chai_promise);
//const assert = chai.assert;

// describe('fetch-util tests', function() {
//   this.timeout(30000);

//   it('#doFetch', async function() {        
//     const res = await doFetch('https://jsonplaceholder.typicode.com/todos/1');
//     const headers = await res.json();
//     assert.isNotEmpty(headers);
//   });

//   it('#doFetch invalid fetch requests', async function() {        
//     await assert.isRejected(doFetch('https://postman-echo.com/status/404'));
//     await assert.isRejected(doFetch('http://blabla-stam.io'));
//   });

// });
