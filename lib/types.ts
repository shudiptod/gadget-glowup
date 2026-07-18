export interface AppSettings {
  [key: string]: unknown;
}

export interface SettingsResponse {
  data?: AppSettings;
  [key: string]: unknown;
}
