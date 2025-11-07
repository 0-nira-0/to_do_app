export function config() {
  return {
    session: {
      cookieKey: 'session_token',
      maxAge: 1000 * 60 * 60 * 24 * 30,
      saltHash: 10,
    },
  };
}
