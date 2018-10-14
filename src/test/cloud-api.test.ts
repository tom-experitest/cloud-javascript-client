import * as chai from 'chai';
import * as chai_promise from 'chai-as-promised';
import {CloudAPI} from '../lib/cloud-api';
import {Device} from "../lib/device-interaction";
import {DeviceModel} from "../modules/device";
import {ApplicationModel} from "../modules/application";

chai.use(chai_promise);

// tslint:disable-next-line:max-line-length
const ACCESS_KEY = '';
const CLOUD_DOMAIN = '';

describe('cloud-api tests', function () {

    before(() =>
    {
        const assert = chai.assert
        assert.isNotEmpty(ACCESS_KEY,'ACCESS KEY SHOULD NOT BE EMPTY');
        assert.isNotEmpty(CLOUD_DOMAIN, 'CLOUD DOMAIN SHOULD NOT BE EMPTY');
    })
    it('#fetchDevices', async function () {
        // const assert = chai.assert;
        const cloud = new CloudAPI(CLOUD_DOMAIN, ACCESS_KEY);
        const devices: DeviceModel [] = await cloud.fetchDevices();
        console.table(devices);
    });

    it('#open Web Socket', async function () {
        this.timeout(120 * 1000);
        const cloud = new CloudAPI(CLOUD_DOMAIN, ACCESS_KEY);
        const webSocketInfo = await (await cloud.getWebSocketInfo());
        const device = new Device(webSocketInfo.deviceId, cloud, webSocketInfo.externalLink);
        device.addScreenListner((screenshot) => console.log(screenshot));
    });

    it("# fetches applications", async function () {
        const cloud = new CloudAPI(CLOUD_DOMAIN, ACCESS_KEY);
        this.timeout(10 * 1000);
        const applications: ApplicationModel [] = await cloud.fetchApplications();
        console.table(applications);
    });

    it('#uploads applications to the cloud', async function () {
        const cloud = new CloudAPI(CLOUD_DOMAIN, ACCESS_KEY);
        this.timeout(120 * 1000);
        const applicationId = await cloud.uploadApplication("http://localhost:5000/src/bin/eribank.apk");
        console.log(applicationId);
    });
});
