export interface ApplicationModel {
    id: number;
    name: string;
    packageName: string;
    version: string;
    releaseVersion: string;
    applicationName: string;
    uniqueName?: any;
    notes?: any;
    cameraSupport: boolean;
    osType: string;
    createdAt: number;
    createdAtFormatted: string;
    mainActivity?: any;
    productId: string;
    bundleIdentifier: string;
    instrumentByProfile?: any;
    nonInstrumented: boolean;
    hasCustomKeystore: boolean;
    isForSimulator: boolean;
    projectsInfo: any[];
}
