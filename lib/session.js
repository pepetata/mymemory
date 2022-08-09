// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
// import type { IronSessionOptions } from 'iron-session'
// import type { User } from 'pages/api/user'

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'myidol',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

