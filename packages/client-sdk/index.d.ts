export interface ClientOpts {
  client: string;
}

export interface ServerFetchOpts {
  path: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: object;
}

export interface CreateResponse<T> {
  id: string;
  createdAt: string;
  updatedAt: string;
  schemaName: string;
  streamId: string;
  accessCondition: number;
  accessAddress: string;
  encryptedSymmetricKey: string;
  data: T;
}

export interface GetResponse<T> {
  id: string;
  createdAt: string;
  updatedAt: string;
  schemaName: string;
  streamId: string;
  accessAddress: string;
  data: T;
}

export interface UpdateResponse {
  id: string;
  success: boolean;
}

export interface AuthSig {
  message: {
    domain: string;
    address: string;
    statement: string;
    uri: string;
    version: string;
    chainId: number;
    nonce: string;
    issuedAt: string;
  };
  signature: string;
  signedMessage: string;
}

export interface AuthResponse {
  ok: boolean;
}
