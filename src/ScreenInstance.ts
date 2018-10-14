export class ScreenInstance {
    constructor(readonly width: number, 
                readonly height: number, 
                readonly orientation: any, 
                readonly rate: number,
                readonly timestamp: number,
                readonly body: any, 
                readonly mime: any, 
                readonly binary: any) {
    }
}
