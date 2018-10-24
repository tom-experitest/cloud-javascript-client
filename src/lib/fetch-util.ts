import 'cross-fetch/polyfill';

/**
 * Will throw an error if fetch doesn't return ok
 */
export enum MethodType {
    GET = "GET",
    POST = "POST",
    PUT = "PUT"
}

export class RestAPI {
    xsrf_token: string = '';
    jsessionid: string = '';

    constructor(readonly access_key: string) {
    }

    async doGet(url: string): Promise<Response> {
        return await this.doFetch(url, {method: MethodType.GET});
    }

    async doFetch(url: string, options: RequestInit): Promise<Response> {

        options.headers= this.prepareHeaders(this.access_key, options.method);
        options.mode = 'cors';
        const res = await fetch(url, options);

        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        return res;
    }

    // async doFetchWithFormData(url: string, access_key: string, type: string, formData: FormData): Promise<Response> {
    //     const headers = this.prepareHeaders(access_key, type);
    //     const res = await fetch(url, {headers, method: type, mode: 'cors', body: formData});
    //     if (!res.ok) {
    //         throw new Error(`${res.status} ${res.statusText}`);
    //     }
    //     return res;
    // }

    prepareHeaders(access_key: string, type: string | undefined) {
        const headers = new Headers();
        headers.set('Authorization', `Bearer ${access_key}`);
        headers.set('cache-control', 'no-cache');
        //headers.set('x-xss-protection','1; mode=block');
        headers.set('pragma', 'no-cache');
        if (type !== 'GET' && this.xsrf_token !== '') {
            headers.set('cookie', "XSRF-TOKEN=" + this.xsrf_token + ";JSESSIONID=" + this.jsessionid);
        }
        return headers;
    }
}