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

    constructor(readonly cloud_domain: string, readonly access_key: string) {
    }

    async doFetch(url: string, access_key: string, type: string): Promise<Response>{
        const headers = this.prepareHeaders(access_key, type);
        const res = await fetch(url, {headers, method: type, mode: 'cors'});
        // if (type === 'GET' && this.xsrf_token === '') {
        //     const set_cookie = String(res.headers.get("set-cookie"));
        //     console.log("Set cookie: " + set_cookie);
        //     this.xsrf_token = this.getCookie(set_cookie, "XSRF-TOKEN");
        //     this.jsessionid = this.getCookie(set_cookie, "Secure, JSESSIONID");
        // }
        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        return res;
    }

    async doFetchWithFormData(url: string, access_key: string, type: string, formData: FormData): Promise<Response>{
        const headers = this.prepareHeaders(access_key, type);
        const res = await fetch(url, {headers, method: type, mode: 'cors',body:formData});
        // if (type === 'GET' && this.xsrf_token === '') {
        //     const set_cookie = String(res.headers.get("set-cookie"));
        //     console.log("Set cookie: " + set_cookie);
        //     this.xsrf_token = this.getCookie(set_cookie, "XSRF-TOKEN");
        //     this.jsessionid = this.getCookie(set_cookie, "Secure, JSESSIONID");
        // }
        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        return res;
    }

    getCookie(cookies: string, name: string): string {
        if (!cookies) {
            return '';
        }

        const xsrfCookies = cookies.split(';')
            .map((c) => c.trim())
            .filter((c) => c.startsWith(name + '='));

        if (xsrfCookies.length === 0) {
            return '';
        }

        return decodeURIComponent(xsrfCookies[0].split('=')[1]);
    }

    prepareHeaders(access_key: string, type: string) {
        const headers = new Headers();
        headers.set('Authorization', `Bearer ${access_key}`);
        headers.set('cache-control', 'no-cache');
        headers.set('pragma', 'no-cache');
        if (type !== 'GET' && this.xsrf_token !== '') {
            headers.set('cookie', "XSRF-TOKEN=" + this.xsrf_token + ";JSESSIONID=" + this.jsessionid);
        }
        return headers;
    }
}