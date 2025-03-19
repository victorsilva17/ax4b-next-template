export const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID as string, // Substitua pelo seu Client ID do Microsoft Entra ID
    authority: process.env.NEXT_PUBLIC_AUTH_AUTHORITY, // Substitua pelo Tenant ID
    scopes: process.env.NEXT_PUBLIC_AUTH_SCOPES?.split(",") || [],
    redirectUri: process.env.NEXT_PUBLIC_AUTH_REDIRECT_URI,
  },
};
