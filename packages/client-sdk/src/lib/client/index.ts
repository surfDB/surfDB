import {
  AuthResponse,
  ClientOpts,
  CreateResponse,
  GetResponse,
  ServerFetchOpts,
  UpdateResponse,
  AuthSig,
} from '../../../index';

import axios from 'axios';

export class SurfClient {
  private _client: string;
  private _siweCookie: string;
  constructor({ client }: ClientOpts) {
    this._client = client;
    this._siweCookie = '';
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
        Cookie: this._siweCookie,
      },
    });
    if (res.headers['set-cookie']) {
      this._siweCookie = res.headers['set-cookie'][0];
    }
    return res;
  }

  public async create<T>(schema: string, data: T): Promise<CreateResponse<T>> {
    return await this._serverFetch({
      path: `data/${schema}`,
      method: 'POST',
      body: data as any,
    });
  }

  public async getAll<T>(schema: string): Promise<GetResponse<T>[]> {
    return await this._serverFetch({
      path: `data/${schema}`,
      method: 'GET',
    });
  }

  public async get<T>(schema: string, id: number): Promise<GetResponse<T>> {
    return await this._serverFetch({
      path: `data/${schema}/${id}`,
      method: 'GET',
    });
  }

  public async update<T>(
    schema: string,
    id: number,
    data: T,
    accessCondition?: number,
    entityAddress?: string
  ): Promise<UpdateResponse> {
    return await this._serverFetch({
      path: `data/${schema}/${id}`,
      method: 'PATCH',
      body: {
        ...data,
        accessCondition,
        entityAddress,
      },
    });
  }

  public async getAuthNonce(): Promise<string> {
    const res = await fetch(`${this._client}/user/nonce`, {
      credentials: 'include',
    });
    this._siweCookie = res.headers.get('set-cookie') || '';
    return await res.text();
  }

  public async authenticate(authSig: AuthSig): Promise<AuthResponse> {
    return await this._serverFetch({
      path: 'user/login',
      method: 'POST',
      body: authSig,
    });
  }
}
