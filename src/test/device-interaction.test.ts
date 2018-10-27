import * as chai from 'chai';
import * as chai_promise from 'chai-as-promised';
import {CloudAPI} from "../lib/cloud-api";
import {ACCESS_KEY, CLOUD_URL} from "./cloud-info";
import {Device} from "../lib/device-interaction";
import {DeviceOS} from "../modules/device";

chai.use(chai_promise);

describe('device-interaction-tests', function () {
    let device: Device;
    let cloud: CloudAPI;
    const releaseDuration = 10*1000;

    function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    before("# Open device session", async function () {
        this.timeout(120 * 1000);
        cloud = new CloudAPI(CLOUD_URL, ACCESS_KEY);
        const deviceInfo = await cloud.findAvailableDevice(DeviceOS.Android);
        if (deviceInfo === undefined) {
            console.warn("SKIPPED TEST - NO AVAILABLE DEVICE");
        }
        const webSocketInfo = await cloud.getWebSocketInfo(deviceInfo);
        device = new Device(webSocketInfo.deviceId, cloud, webSocketInfo.externalLink);
        await device.open();
    });

    it('# start Screen Listener', async function () {
        await device.addScreenListner((screenshot) => console.log(screenshot));
    });

    it('# starts logs', async function () {
        await device.startLog();
        await device.addLogListener((log) => console.log(log));
    });

    after("# Release Device", async function f() {
        this.timeout(releaseDuration + 3000);
        console.log(`ABOUT TO FINISH UP TESTS - WILL WAIT FOR ${releaseDuration} seconds`);
        await sleep(releaseDuration);
        await device.close();
        // await cloud.releaseDevice(device);

    });

});
