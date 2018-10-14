import {ProjectModel} from "./project";

export interface UserModel {
        id: number;
        name: string;
        userCanUploadDeleteApplications: boolean;
        tokens: number;
        maxReservations: number;
        maxReservationTime: number;
        maxSessions: number;
        amountOfRequests: number;
        maxQueuedTests: number;
        createdAt: number;
        allowSMS: boolean;
        allowCalls: boolean;
        maxSeleniumSessions: number;
        createdAtFormatted: string;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        failedLoginAttempts: number;
        lastLoginProjectId: number;
        projectRole: string;
        projects: ProjectModel[];
        currentProjectId: number;
        currentProjectName: string;

}
