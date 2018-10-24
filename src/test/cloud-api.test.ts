import * as chai from 'chai';
import * as chai_promise from 'chai-as-promised';
import {CloudAPI} from '../lib/cloud-api';
import {Device} from "../lib/device-interaction";
import {DeviceModel, DeviceOS} from "../modules/device";
import {ApplicationModel} from "../modules/application";
import {ACCESS_KEY, CLOUD_URL} from "./cloud-info";

chai.use(chai_promise);

// tslint:disable-next-line:max-line-length

describe('cloud-api tests', function () {

    before(() => {
        const assert = chai.assert;
        assert.isNotEmpty(ACCESS_KEY, 'ACCESS KEY SHOULD NOT BE EMPTY - PLEASE EDIT ./src/test/cloud-info.ts');
        assert.isNotEmpty(CLOUD_URL, 'CLOUD DOMAIN SHOULD NOT BE EMPTY -  PLEASE EDIT ./src/test/cloud-info.ts');
    })
    it('#fetchDevices', async function () {
        // const assert = chai.assert;
        const cloud = new CloudAPI(CLOUD_URL, ACCESS_KEY);
        const devices: DeviceModel [] = await cloud.fetchDevices();
        console.table(devices);
    });

    it("# fetches applications", async function () {
        const cloud = new CloudAPI(CLOUD_URL, ACCESS_KEY);
        this.timeout(10 * 1000);
        const applications: ApplicationModel [] = await cloud.fetchApplications();
        console.table(applications);
    });

    it('#uploads applications to the cloud', async function () {
        const cloud = new CloudAPI(CLOUD_URL, ACCESS_KEY);
        this.timeout(120 * 1000);
        const applicationId = await cloud.uploadApplication("https://s3-us-west-2.amazonaws.com/seetest-io-demo-apps/EriBank.ipa");
        console.log(applicationId);
    });

    /*it('#open Web Socket', async function () {
        this.timeout(120 * 1000);
        const cloud = new CloudAPI(CLOUD_URL, ACCESS_KEY);
        const deviceInfo = await cloud.findAvailableDevice(DeviceOS.Android);
        if (deviceInfo === undefined) {
            console.warn("SKIPPED TEST - NO AVAILABLE DEVICE")
        }
        else {
            setTimeout(async () => {
                const webSocketInfo = await (await cloud.getWebSocketInfo(deviceInfo));
                const device = new Device(webSocketInfo.deviceId, cloud, webSocketInfo.externalLink);
                await device.addScreenListner((screenshot) => console.log(screenshot));
            },10*1000);

        }
    });*/
    it('#start logs', async function () {
        this.timeout(120 * 1000);
        const cloud = new CloudAPI(CLOUD_URL, ACCESS_KEY);
        const deviceInfo = await cloud.findAvailableDevice(DeviceOS.Android);
        if (deviceInfo === undefined) {
            console.warn("SKIPPED TEST - NO AVAILABLE DEVICE")
        }
        else {
            setTimeout(async () => {
                const webSocketInfo =await cloud.getWebSocketInfo(deviceInfo);
                const device = new Device(webSocketInfo.deviceId, cloud, webSocketInfo.externalLink);
                await device.open();
                await device.addScreenListner((screenshot) => console.log(screenshot));
                await device.addLogListener((log) => console.log("log: " + log));
                await device.startLog();
            },10*1000);

        }
    });
});
