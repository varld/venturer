import { Input, Options } from 'ky';
import ky from 'ky-universal';

export interface VenturerOptions extends Options {
  authorization?: string;
  headers?: Record<string, string>;
  authorizationHeader?: string;
  authorizationScheme?: string;
  name?: string;
}

let currentId: number = 0;
let loggingEnabled = true;

export let setRequestLogging = (enabled: boolean) => (loggingEnabled = enabled);

let log = (level: 'log' | 'warn', value: string) => {
  if (!loggingEnabled) return;
  console[level](value);
};

export let baseRequest = async <T extends any = any, R extends any = any>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head',
  url: Input,
  optionsOrData?: R | VenturerOptions,
  options?: VenturerOptions
) => {
  let kyOptions: VenturerOptions = Object.assign({ method, headers: {} }, options, {
    name: 'venturer',
    authorizationScheme: 'bearer',
    authorizationHeader: 'authorization'
  });

  if (
    optionsOrData != undefined &&
    (method == 'post' || method == 'put' || method == 'patch')
  ) {
    kyOptions.json = optionsOrData;
  } else if (optionsOrData != undefined) {
    kyOptions = Object.assign(kyOptions, optionsOrData);
  }

  if (typeof kyOptions.authorization == 'string') {
    // @ts-ignore
    kyOptions.headers[kyOptions.authorizationHeader] =
      kyOptions.authorizationScheme + ' ' + kyOptions.authorization;
  }

  let id = currentId;
  currentId++;

  log('log', `[${kyOptions.name}/start]: #${id} ${method.toUpperCase()} ${url}`);

  let startTime = performance.now();

  try {
    let res = await ky(url, kyOptions);

    let endTime = performance.now();
    let elapsedTime = endTime - startTime;

    log(
      'log',
      `[${kyOptions.name}/finish]: #${id} ${method.toUpperCase()} ${url} (${
        res.status
      }) ${elapsedTime.toFixed(2)}ms`
    );

    return (res.json() as unknown) as T;
  } catch (err) {
    let endTime = performance.now();
    let elapsedTime = endTime - startTime;
    let status = err?.response?.status || 'error';

    log(
      'warn',
      `[${
        kyOptions.name
      }/error]: #${id} ${method.toUpperCase()} ${url} (${status}) ${elapsedTime.toFixed(2)}ms`
    );

    throw err;
  }
};

export let createClient = (baseUrl?: string, baseOptions?: VenturerOptions) => {
  let getUrl = (url: string) => {
    if (!baseUrl) return url;
    return new URL(url, baseUrl).toString();
  };

  return {
    get: <T extends any = any>(url: string, options?: VenturerOptions) =>
      baseRequest<T>('get', getUrl(url), Object.assign({}, options, baseOptions)),
    delete: <T extends any = any>(url: string, options?: VenturerOptions) =>
      baseRequest<T>('delete', getUrl(url), Object.assign({}, options, baseOptions)),
    post: <T extends any = any, R extends any = any>(
      url: string,
      data?: R,
      options?: VenturerOptions
    ) => baseRequest<T, R>('post', getUrl(url), data, Object.assign({}, options, baseOptions)),
    put: <T extends any = any, R extends any = any>(
      url: string,
      data?: R,
      options?: VenturerOptions
    ) => baseRequest<T, R>('put', getUrl(url), data, Object.assign({}, options, baseOptions)),
    patch: <T extends any = any, R extends any = any>(
      url: string,
      data?: R,
      options?: VenturerOptions
    ) => baseRequest<T, R>('patch', getUrl(url), data, Object.assign({}, options, baseOptions))
  };
};

export let request = createClient();
