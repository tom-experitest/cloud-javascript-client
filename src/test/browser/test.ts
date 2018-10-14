//import tests we want to run in the browser
import '../fetch-util.test';
import '../cloud-api.test';
//start mocha
mocha.checkLeaks();
mocha.globals(['getFrameLocation', 'handler']);
mocha.run();
