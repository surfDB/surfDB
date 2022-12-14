/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  AuthResponse,
  ClientOpts,
  CreateResponse,
  GetResponse,
  ServerFetchOpts,
  UpdateResponse,
  AuthSig,
  RequestType,
  ResponseType,
  Profile,
} from '../../../index';

import axios, { AxiosResponse } from 'axios';
import { addToCookies, deleteCookie, getCookie } from '../../utils';

import * as FormData from 'form-data';

export class SurfClient {
  private _client: string;
  private _cookie: string | undefined;
  constructor({ client }: ClientOpts) {
    this._client = client;
  }

  private async _serverFetch({
    path,
    method,
    body,
  }: ServerFetchOpts): Promise<any> {
    const res = await axios({
      method,
      url: `${this._client}/${path}`,
      data: body,
      headers: {
        'Content-Type': 'application/json',
        Cookie: this._cookie || '',
      },
    });
    return res;
  }

  public async create<T>(
    req: RequestType,
    res: ResponseType,
    options: { schema: string; data: T }
  ): Promise<CreateResponse> {
    this._cookie = getCookie(req);
    const axiosRes = await this._serverFetch({
      path: `data/${options.schema}`,
      method: 'POST',
      body: options.data as any,
    });
    return axiosRes.data;
  }

  public async getAll<T>(
    req: RequestType,
    res: ResponseType,
    options: { schema: string; accessAddress?: string }
  ): Promise<GetResponse<T>[]> {
    this._cookie = getCookie(req);
    const axiosRes = await this._serverFetch({
      path: `data/${options.schema}?accessAddress=${options.accessAddress}`,
      method: 'GET',
    });
    return axiosRes.data;
  }

  public async get<T>(
    req: RequestType,
    res: ResponseType,
    options: { schema: string; id: string }
  ): Promise<GetResponse<T>> {
    this._cookie = getCookie(req);
    const axiosRes = await this._serverFetch({
      path: `data/${options.schema}/${options.id}`,
      method: 'GET',
    });
    return axiosRes.data;
  }

  public async update<T>(
    req: RequestType,
    res: ResponseType,
    options: {
      schema: string;
      id: string;
      data: T;
      accessCondition?: number;
      entityAddress?: string;
    }
  ): Promise<UpdateResponse> {
    this._cookie = getCookie(req);
    const axiosRes = await this._serverFetch({
      path: `data/${options.schema}/${options.id}`,
      method: 'PATCH',
      body: {
        ...options.data,
        accessCondition: options.accessCondition,
        entityAddress: options.entityAddress,
      },
    });
    return axiosRes.data;
  }

  public async getAuthNonce(
    req: RequestType,
    res: ResponseType
  ): Promise<string> {
    const nonce = await fetch(`${this._client}/user/nonce`, {
      credentials: 'include',
    });
    addToCookies(nonce.headers.get('set-cookie') as string, res);
    return await nonce.text();
  }

  public async authenticate(
    req: RequestType,
    res: ResponseType,
    options: {
      authSig: AuthSig;
    }
  ): Promise<AuthResponse> {
    this._cookie = getCookie(req);
    const resp: AxiosResponse = await this._serverFetch({
      path: 'user/login',
      method: 'POST',
      body: options.authSig,
    });
    if (resp.headers['set-cookie']) {
      addToCookies(resp.headers['set-cookie'][0], res);
    }
    return resp.data;
  }

  public async getProfile(
    req: RequestType,
    res: ResponseType
  ): Promise<Profile> {
    this._cookie = getCookie(req);
    const resp = await this._serverFetch({
      path: 'user/me',
      method: 'GET',
    });
    return resp.data;
  }

  public async logout(req: RequestType, res: ResponseType): Promise<void> {
    this._cookie = getCookie(req);
    const resp = await this._serverFetch({
      path: 'user/logout',
      method: 'POST',
    });
    deleteCookie(res);
    this._cookie = undefined;
    return resp.data;
  }

  public async uploadFile<T>(
    req: RequestType,
    res: ResponseType,
    options: { file: any }
  ): Promise<any> {
    this._cookie = getCookie(req);
    const formData = new FormData();
    formData.append('file', options.file);
    const axiosRes = await axios({
      method: 'POST',
      url: `${this._client}/file`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Cookie: this._cookie || '',
      },
    });
    // remove port from url
    const url = this._client.replace(/:\d+/, '');

    return {
      hash: axiosRes.data.hash,
      url: `${url}:8080/ipfs/${axiosRes.data.hash}`,
    };
  }
}
