import {CloudAPI} from "./cloud-api";
import {clearInterval} from "timers";
import {ScreenInstance} from "../ScreenInstance";

export class Device {
    firestScreen: boolean = false;
    webSockets: any = {};
    intervals: any = {};
    screenCallback: (screen: ScreenInstance) => void = () => (null);
    infoCallback: (data: any) => void = () => (null);
    logCallback: (log: string) => void = () => (null);
    messageId: number = 1;

    constructor(readonly device_id: string, readonly cloud: CloudAPI, readonly externalLink: string) {
    }

    async open() {
        await this._createWSConnections();
    }

    _createWsUrl(token: string, externalLink: string, connection: string): string {
        const url = this.cloud.getCloudDomain().replace("http:", "ws:").replace("https:", "wss:") + externalLink.split("#")[0] + connection + "?token=" + token;
        return url;
    }

    _extractToken(): string {
        const values = this.externalLink.split("/");
        return values[values.length - 1].split("?")[0];
    }

    async _createWSConnections() {
        const token = this._extractToken();
        const screenUrl = this._createWsUrl(token, this.externalLink, 'screen');
        const fileUrl = this._createWsUrl(token, this.externalLink, 'file');
        const commandUrl = this._createWsUrl(token, this.externalLink, 'command');
        const infoUrl = this._createWsUrl(token, this.externalLink, 'information');

        this.webSockets['screen'] = new WebSocket(screenUrl);
        this._handleScreenOnMessage();

        this.webSockets['file'] = new WebSocket(fileUrl);
        this.webSockets['command'] = new WebSocket(commandUrl);
        this.webSockets['info'] = new WebSocket(infoUrl);
        await this._waitForFirstScreen();
        await this._waitForSocketConnection(this.webSockets['info'], 'info');
        await this._waitForSocketConnection(this.webSockets['command'], 'command');
        this._handleInfoOnMessage();
        this._startMonitorWs();
    }
    _waitForSocketConnection(socket:WebSocket, connectionName:string): Promise<any>{
        var self = this;
        return new Promise(
            (resolve,reject) =>{
                
                setTimeout(
                    function () {
                        if (socket.readyState === 1) {
                            console.log("Connection is open: " + connectionName)
                            resolve();
                            return;
                        } else {
                            console.log("wait for connection...")
                            resolve(self._waitForSocketConnection(socket, connectionName));
                        }
                    }, 500); // wait 200 milisecond for the connection...
            }
        );
        
    }

    _waitForFirstScreen(): Promise<any>{
        var self = this;
        return new Promise(
            (resolve,reject) =>{   
                setTimeout(
                    function () {
                        if (self.firestScreen) {
                            console.log("First Screen wait end");
                            resolve();
                            return;
                        } else {
                            console.log("wait for connection...")
                            resolve(self._waitForFirstScreen());
                        }
                    }, 500); // wait 200 milisecond for the connection...
            }
        );
        
    }

    _startMonitorWs() {
        this.intervals['screen'] = setInterval(() => {
            if (this.webSockets['screen'].readyState == 1) {
                this.webSockets['screen'].send("ping");
            }
        }, 20 * 1000);
        this.intervals['command'] = setInterval(() => {
            if (this.webSockets['command'].readyState == 1) {
                this.webSockets['command'].send("ping");
            }
        }, 20 * 1000);
        this.intervals['file'] = setInterval(() => {
            if (this.webSockets['file'].readyState == 1) {
                this.webSockets['file'].send("ping");
            }
        }, 20 * 1000);
        this.intervals['info'] = setInterval(() => {
            if (this.webSockets['info'].readyState == 1) {
                this.webSockets['info'].send("ping");
            }
        }, 20 * 1000);
    }

    close() {
        clearInterval(this.intervals['screen']);
        this.webSockets['screen'].close();
        clearInterval(this.intervals['info']);
        this.webSockets['info'].close();
        clearInterval(this.intervals['command']);
        this.webSockets['command'].close();
        clearInterval(this.intervals['file']);
        this.webSockets['file'].close();
    }

    addScreenListner(callback: (screenshot: ScreenInstance) => void) {
        this.screenCallback = callback;
    }
    addLogListener(callback: (log: string) => void){
        this.logCallback = callback;
    }

    _handleScreenOnMessage() {
        this.webSockets['screen'].onmessage = async (event: any) => {
            this.firestScreen = true;
            const obj =  await this._parseMessage(event.data);
            const screen = new ScreenInstance(obj.config.width, obj.config.height, obj.config.orientation, obj.config.rate, obj.timestamp, obj.body, obj.mime, obj.binary);
            this._sendMessage('screenReceivedAck', {timestamp: screen.timestamp})
            this.screenCallback(screen);
        };
    }

    _handleInfoOnMessage() {
        this.webSockets['info'].onmessage = (event: any) => {
            if('log' == event.data.type){
                this.logCallback(event.data.content);
            }
            this.infoCallback(event.data);
        };
    }

    _sendMessage(action: string, body: any) {
        const message: any = {};
        message['action'] = action;
        message['type'] = 'event';
        message['body'] = body;
        message['messageId'] = this.messageId;
        message['timestamp'] = (new Date()).getTime();
        this.messageId++;
        this.webSockets['command'].send(JSON.stringify(message));
    }
    _sendMessageAdvance(action: string, body: any, shift:boolean, meta:boolean, alt:boolean, ctrl:boolean, ack:boolean) {
        const message: any = {};
        message['action'] = action;
        message['type'] = 'event';
        message['body'] = body;
        message['shiftKey'] = shift;
        message['metaKey'] = meta;
        message['altKey'] = alt;
        message['ctrlKey'] = ctrl;
        message['sendAck'] = ack;
        
        message['messageId'] = this.messageId;
        message['timestamp'] = (new Date()).getTime();
        this.messageId++;
        this.webSockets['command'].send(JSON.stringify(message));
    }

    home(){
        this._sendMessage('keyup', '{home}');
    }
    unlock(){
        this._sendMessage('keyup', '{unlock}');
    }
    //{change_orientation}
    change_orientation(){
        this._sendMessage('keyup', '{change_orientation}');
    }
    volumeup(){
        this._sendMessage('keyup', '{volumeup}');
    }
    volumedown(){
        this._sendMessage('keyup', '{volumedown}');
    }
    close_app(){
        this._sendMessage('keyup', '{close_app}');
    }
    back(){
        this._sendMessage('keyup', '{esc}');
    }

    recentapps(){
        this._sendMessage('keyup', '{recent_apps}');
    }

    startLog(){
        this._sendMessageAdvance('startlog','',false, false, false, false, false);
    }

    stopLog(){
        this._sendMessage('stoplog','');
    }

    setlocation(latitude:number, longitude:number){
        this._sendMessage('setlocation', String(latitude) + ";" + String(longitude));
    }

    setRate(framesPerSecond:number){
        if(framesPerSecond < 1 || framesPerSecond > 10){
            throw "Frame per second is out of range, should be between 1 and 10, actual " + framesPerSecond; 
        }
        this._sendMessage('setrefresh', parseInt('' + (1000/framesPerSecond)));
    }
    _readBlob(buffer: Blob): Promise<ArrayBuffer>{

        return new Promise((resolve) => {

            const fileReader = new FileReader();

            fileReader.onload = (event: any) => {
                resolve(event.target.result);
            };

            fileReader.readAsArrayBuffer(buffer);
        });
    }

    async _parseMessage(buffer: any) {

        const arrayBuffer = await this._readBlob(buffer);

        const arr = new Int8Array(arrayBuffer);

        // 4 bytes to integer
        const amount = (arr[3]) + (arr[2] * 256) + (arr[1] * 256 * 256) + (arr[0] * 256 * 256 * 256);

        let configStr = "";

        for (let i = 0; i < amount; i++) {
            configStr = configStr + String.fromCharCode(arr[i + 4]);
        }

        const result = JSON.parse(configStr);

        const decodeRes = this._decodeArrayBuffer(arrayBuffer, amount + 4);

        if (decodeRes === null) {
            throw new Error("failed to decode image");
        }

        result.body = decodeRes.image;
        result.mime = decodeRes.mime;
        result.binary = decodeRes.binary;

        return result;
    }

    _decodeArrayBuffer(buffer: any, offset: number) {
        let mime;

        const arr = new Uint8Array(buffer);
        const nb = arr.length - offset;

        if (nb < 4) {
            return null;
        }

        const b0 = arr[offset];
        const b1 = arr[offset + 1];
        const b2 = arr[offset + 2];
        const b3 = arr[offset + 3];

        if (b0 === 0x89 && b1 === 0x50 && b2 === 0x4E && b3 === 0x47) {
            mime = 'image/png';
        }

        else if (b0 === 0xff && b1 === 0xd8) {
            mime = 'image/jpeg';
        }

        else if (b0 === 0x47 && b1 === 0x49 && b2 === 0x46) {
            mime = 'image/gif';
        }

        else {
            console.error("failed to identify the mime type, image is broken");
            return null;
        }

        let binary = "";

        for (let i = 0; i < nb; i++) {
            binary += String.fromCharCode(arr[offset + i]);
        }

        const base = window.btoa(binary);

        const sliceArr = arr.slice(offset);

        return {
            binary: sliceArr,
            image: base,
            mime: mime
        };
    }

    sendMouseEvent(type: string, x: number, y: number, canvasWidth: number, canvasHeight: number, wheelDeltaX: number, wheelDeltaY: number) {
        const message: any = {};
        message['action'] = type;
        message['type'] = 'event';
        message['messageId'] = this.messageId;
        message['timestamp'] = (new Date()).getTime();
        message['x'] = x;
        message['y'] = y;
        message['absoluteX'] = canvasWidth;
        message['absoluteY'] = canvasHeight;
        message['wheelDeltaX'] = wheelDeltaX;
        message['wheelDeltaY'] = wheelDeltaY;
        this.messageId++;
        this.webSockets['info'].send(message);
    }
    keypress(key:string){
        this._sendMessage('keypress', key);
    }

    keypressAdvance(key:string, shift:boolean, meta:boolean, alt: boolean, ctrl:boolean, ack:boolean){
        this._sendMessageAdvance('keypress',key, shift, meta, alt, ctrl, ack);
    }


}
