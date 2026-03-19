export const getSessionCookie = () => {
  return process.env.EASYDIARY_SESSION ?? '';
};
