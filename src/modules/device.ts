export enum DeviceOS {
    iOS = "iOS",
    Android ="Android"
}

export type DeviceCategory = "PHONE" | "TABLET";

export enum DeviceStatus {
    Available = 'Available',
    InUse = 'In Use',
    Offline = 'Offline',
    Cleanup = 'Cleanup',
    Unauthorized = 'Unauthorized',
    Error = 'Error',
    CleanupFailed = 'Cleanup Failed',
    Initialized = 'Initialized'
}

export interface DeviceModel {
    status: DeviceStatus;
    name: string;
    hostAddress: string;
    id: number;
    uid: string;
    osVersion: string;
    androidScreenshotMode: string;
    manufacturer: string;
    deviceModelName: string;
    initializeMode: boolean;
    emulator: boolean;
    deviceCategory: DeviceCategory;
    deviceModel: string;
    os: DeviceOS;
    nvEnabled: boolean;
    phoneNumber: string;
    deviceImageName: string;
    networkName: string;
    networkId: string;
    currentAgentName: string;
}
