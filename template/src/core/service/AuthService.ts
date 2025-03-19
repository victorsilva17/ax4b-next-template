import { msalConfig } from "@/config/authConfig";
import {
  PublicClientApplication,
  AccountInfo,
  AuthenticationResult,
} from "@azure/msal-browser";

interface LoginResponse {
  accessToken: string;
  account: AccountInfo;
}

class AuthService {
  private static instance: AuthService;
  private msalInstance: PublicClientApplication;
  private isInteractionInProgress = false;

  private constructor() {
    this.msalInstance = new PublicClientApplication({
      auth: {
        clientId: msalConfig.auth.clientId,
        redirectUri: msalConfig.auth.redirectUri,
        authority: msalConfig.auth.authority,
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true,
      },
    });

    this.initialize();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }
  public async initialize(): Promise<void> {
    if (this.msalInstance) {
      try {
        await this.msalInstance.initialize();
      } catch (error) {
        console.error("Erro ao inicializar o MSAL:", error);
        throw error;
      }
    }
  }

  public getActiveAccount(): AccountInfo | null {
    const accounts = this.msalInstance.getAllAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  }

  public async login(): Promise<LoginResponse> {
    if (this.isInteractionInProgress)
      return Promise.reject(new Error("Interaction already in progress"));
    this.isInteractionInProgress = true;

    console.log("MSA CONFIG AUTH: ", msalConfig.auth);

    try {
      const loginResponse: AuthenticationResult =
        await this.msalInstance.loginPopup({
          scopes: msalConfig.auth.scopes,
          prompt: "select_account",
        });

      console.log("Login Response: ", loginResponse);

      return {
        accessToken: loginResponse.accessToken,
        account: loginResponse.account,
      };
    } catch (error) {
      console.error("Erro de login:", error);
      throw error;
    } finally {
      this.isInteractionInProgress = false;
    }
  }

  public async logout(): Promise<void> {
    if (this.isInteractionInProgress)
      return Promise.reject(new Error("Interaction already in progress"));
    this.isInteractionInProgress = true;

    try {
      await this.msalInstance.logoutPopup();
    } catch (error) {
      console.error("Erro de logout:", error);
      throw error;
    } finally {
      this.isInteractionInProgress = false;
    }
  }
}

export const authService = AuthService.getInstance();
