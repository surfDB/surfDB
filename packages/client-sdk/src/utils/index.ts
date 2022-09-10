import { RequestType, ResponseType } from '../../index';
import * as cookie from 'cookie';

export function addToCookies(cookieValue: string, res: ResponseType) {
  if ('headers' in res) {
    res.headers.append('set-cookie', cookieValue);
    return;
  }

  let existingSetCookie =
    (res.getHeader('set-cookie') as string[] | string) ?? [];
  if (typeof existingSetCookie === 'string') {
    existingSetCookie = [existingSetCookie];
  }
  res.setHeader('set-cookie', [...existingSetCookie, cookieValue]);
}

export function deleteCookie(res: ResponseType) {
  const cookieName = process.env['COOKIE_NAME'] || 'surfdb-session';
  const cookieValue = cookie.serialize(cookieName, '', {
    maxAge: -1,
    path: '/',
  });
  addToCookies(cookieValue, res);
}

export function getCookie(req: RequestType) {
  const value = cookie.parse(
    'credentials' in req
      ? req.headers.get('cookie') || ''
      : req.headers.cookie || ''
  )[process.env['COOKIE_NAME'] || 'surfdb-session'];
  return cookie.serialize(
    process.env['COOKIE_NAME'] || 'surfdb-session',
    value,
    {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'lax',
      path: '/',
    }
  );
}
