import { serialize, parse } from 'cookie'

const TOKEN_NAME = 'myidol'

export const MAX_AGE = 60 * 60 * 8 // 8 hours

export function setTokenCookie(res, token) {
  const option = {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  }
  const cookie = serialize(TOKEN_NAME, token, option)
  console.log('setTokenCookie option=',option)// teste
  console.log('setTokenCookie cookie=',cookie)// teste

  res.setHeader('Set-Cookie', cookie)
}

export function removeTokenCookie(res) {
  console.log('removeTokenCookie')
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  })
console.log('removeTokenCookie cookie =', cookie)
  res.setHeader('Set-Cookie', cookie)
}

export function parseCookies(req) {
  console.log('parseCookies')
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie
  return parse(cookie || '')
}

export function getTokenCookie(req) {
  console.log('getTokenCookie')
  const cookies = parseCookies(req)
  return cookies[TOKEN_NAME]
}
