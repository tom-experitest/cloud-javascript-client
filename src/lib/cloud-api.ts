import {MethodType, RestAPI} from "./fetch-util";
import {DeviceModel, DeviceOS, DeviceStatus} from "../modules/device";
import {ApplicationModel} from "../modules/application";
import {ProjectModel} from "../modules/project";
import {UserModel} from "../modules/User";

export type APIVersion = "v1" | "v2";

export class CloudAPI {
    rest: RestAPI;

    constructor(readonly cloud_domain: string, readonly access_key: string) {
        this.rest = new RestAPI(cloud_domain, access_key);
    }

    _getBaseUrl(path: string, version: APIVersion) {
        if (this.cloud_domain.startsWith('http')) { //if starts with http we use url as is
            return `${this.cloud_domain}/api/${version}` + path;
        }
        return `https://${this.cloud_domain}/api/${version}` + path;
    }

    async fetchDevices(): Promise<any> {
        const base_url = this._getBaseUrl('/devices', "v2");

        //fetch selenium  endpoints and devices
        const resp = await this.rest.doFetch(base_url, this.access_key, 'GET');
        return await resp.json();
    }

    async fetchUser(): Promise<UserModel> {
        const url = this._getBaseUrl('/status/user', "v2");
        const res = await this.rest.doFetch(url, this.access_key, 'GET');
        const user = await res.json();
        // if (!user.username) {
        //     throw new Error('Failed fetching user details. Expected username field for json: ' + JSON.stringify(user, undefined, 2));
        // }
        return user;
    }

    async getCurrentProject(): Promise<ProjectModel> {
        const user = await this.fetchUser();
        return user.projects.filter((project) => project.id === user.currentProjectId)[0];
    }

    async getWebSocketInfo(): Promise<any> {
        const currentProject = await this.getCurrentProject();
        const deviceId = await this.findAvailableDevice(DeviceOS.iOS);
        const path = "/devices/" + deviceId + "/webControl/" + currentProject + "/"
            + new Date().getTime() + "/xxx/1/true";
        return (await this.rest.doFetch(this._getBaseUrl(path, "v2"), this.access_key, MethodType.PUT)).json();
    }

    getCloudDomain() {
        return this.cloud_domain;
    }

    async findAvailableDevice(os: DeviceOS) {
        let selectedDevice = null;
        const devices: DeviceModel [] = await this.fetchDevices();
        for (let i = 0; devices.length; i++) {
            if (devices[i].status === DeviceStatus.Available && devices[i].os === os) {
                selectedDevice = devices[i];
                console.log("Found a device: " + selectedDevice.name + " with id: " + selectedDevice.id);
                //console.log(device);
                return selectedDevice.id;
            }
        }
    }

    async fetchApplications(): Promise<ApplicationModel[]> {
        const url = `${this._getBaseUrl('/applications', "v1")}`;
        return await (await this.rest.doFetch(url, this.access_key, MethodType.GET)).json();
    }

    async uploadApplication(applicationUrl: string) {

        const data = new FormData();
        data.append('url', applicationUrl);
        const projectId = (await this.getCurrentProject()).id;
        data.append('projectId', projectId.toString());
        const url = `${this._getBaseUrl('/applications/new-from-url', "v1")}`;
        return await this.rest.doFetchWithFormData(url, this.access_key, MethodType.POST, data);

    }

}
