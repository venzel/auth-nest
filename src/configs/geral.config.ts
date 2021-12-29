const { env } = process;

const geral = {
    environment: env.NODE_ENV || 'development',
    port: env.SERVER_PORT || 3001,
    emailAdmin: env.EMAIL_ADMIN || 'eneas.eng@yahoo.com',
    tokenSecret: env.TOKEN_SECRET || 'qxkk212kdoo12dd0012d',
    tokenExpires: env.TOKEN_EXPIRES || '2d',
};

const { environment, port, emailAdmin, tokenSecret, tokenExpires } = geral;

export { environment, port, emailAdmin, tokenSecret, tokenExpires };
