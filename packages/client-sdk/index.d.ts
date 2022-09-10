export type RequestType = IncomingMessage | Request;
export type ResponseType = ServerResponse | Response;

export interface ClientOpts {
  client: string;
}

export interface ServerFetchOpts {
  path: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: object;
}

export interface CreateResponse {
  _id: string;
  createdAt: string;
  updatedAt: string;
  schemaName: string;
  streamId: string;
  accessCondition: number;
  accessAddress: string;
  encryptedSymmetricKey: string;
}

export type GetResponse<T> = T & {
  id: string;
  createdAt: string;
  updatedAt: string;
  schemaName: string;
  streamId: string;
  accessAddress: string;
};

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

export interface Profile {
  address: string;
  createdAt: string;
  message: string;
  signature: string;
  updatedAt: string;
  username: string;
  _id: string;
}
