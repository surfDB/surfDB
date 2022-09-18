import LitJsSdk = require('lit-js-sdk');
import { getAccessConditions } from './AccessConditions';
import Cryptr = require('cryptr');

export class SurfEncrypt {
  async encrypt(chain: string, data: any, address: string) {
    const client = new LitJsSdk.LitNodeClient();
    await client.connect();
    (window as any).litNodeClient = client;
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain,
    });
    const { symmetricKey } = await LitJsSdk.encryptString('surf');
    const cryptr = new Cryptr(
      LitJsSdk.uint8arrayToString(symmetricKey, 'base16')
    );
    const encryptedDataArray = Object.keys(data).map((key) => {
      return {
        [key]: cryptr.encrypt(data[key]),
      };
    });
    const encryptedData = Object.assign({}, ...encryptedDataArray);
    const encryptedSymmetricKey = await client.saveEncryptionKey({
      accessControlConditions: getAccessConditions(0, address, chain),
      symmetricKey,
      authSig,
      chain,
    });
    return {
      encryptedData,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
        encryptedSymmetricKey,
        'base16'
      ),
    };
  }

  async decrypt(
    data: any,
    encryptedSymmetricKey: string,
    chain: string,
    address: string
  ) {
    const client = new LitJsSdk.LitNodeClient();
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });

    await client.connect();
    const symmetricKey = await client.getEncryptionKey({
      accessControlConditions: getAccessConditions(0, address, chain),
      toDecrypt: encryptedSymmetricKey,
      authSig,
      chain,
    });
    const cryptr = new Cryptr(
      LitJsSdk.uint8arrayToString(symmetricKey, 'base16')
    );
    const decryptedData = Object.keys(data).map((key) => {
      return {
        [key]: cryptr.decrypt(data[key]),
      };
    });

    return { decryptedData };
  }
}
