import Iron from '@hapi/iron'
import { MAX_AGE, setTokenCookie, getTokenCookie } from './auth-cookies'

const TOKEN_SECRET = process.env.SECRET_COOKIE_PASSWORD

export async function setLoginSession(res, session) {
//  console.log('setLoginSession');
  const createdAt = Date.now()
  // Create a session object with a max age that we can validate later
  const obj = { ...session, createdAt, maxAge: MAX_AGE }
//  console.log('setLoginSession obj=', obj)
  const token = await Iron.seal(obj, TOKEN_SECRET, Iron.defaults)
//  console.log('setLoginSession token=', token)
  
  setTokenCookie(res, token)
}

export async function getLoginSession(req) {
//  console.log('getLoginSession')
  const token = getTokenCookie(req)

  if (!token) return

  const session = await Iron.unseal(token, TOKEN_SECRET, Iron.defaults)
  const expiresAt = session.createdAt + session.maxAge * 1000

  // Validate the expiration date of the session
  if (Date.now() > expiresAt) {
    throw new Error('Session expired')
  }

  return session
}
