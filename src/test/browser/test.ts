//import tests we want to run in the browser
import '../cloud-api.test';
import '../device-interaction.test';
//start mocha
mocha.checkLeaks();
mocha.globals(['getFrameLocation', 'handler']);
mocha.run();
