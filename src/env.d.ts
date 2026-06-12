// SPDX-License-Identifier: AGPL-3.0-or-later
// Ambient typings for the environment variables this package reads.
// Declaring each as a named optional property lets `process.env.FOO` type-check
// under noPropertyAccessFromIndexSignature while keeping the value
// `string | undefined` (callers must still guard for absence).
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_URI?: string;
      APP_URI?: string;
      AUTH_URI?: string;
      LANDING_ONLY?: string;
      LOG_VERBOSITY_SERVER?: string;
      NEXT_PUBLIC_ALLOW_EMAIL_SIGN_IN?: string;
      NEXT_PUBLIC_AMAZON_CLIENT_ID?: string;
      NEXT_PUBLIC_AOL_CLIENT_ID?: string;
      NEXT_PUBLIC_API_URI?: string;
      NEXT_PUBLIC_APPLE_CLIENT_ID?: string;
      NEXT_PUBLIC_APP_NAME?: string;
      NEXT_PUBLIC_APP_URI?: string;
      NEXT_PUBLIC_AUTH_URI?: string;
      NEXT_PUBLIC_AUTODESK_CLIENT_ID?: string;
      NEXT_PUBLIC_BASECAMP_CLIENT_ID?: string;
      NEXT_PUBLIC_BATTLENET_CLIENT_ID?: string;
      NEXT_PUBLIC_BITBUCKET_CLIENT_ID?: string;
      NEXT_PUBLIC_BITLY_CLIENT_ID?: string;
      NEXT_PUBLIC_BOX_CLIENT_ID?: string;
      NEXT_PUBLIC_CLEARSCORE_CLIENT_ID?: string;
      NEXT_PUBLIC_CLOUDFOUNDRY_CLIENT_ID?: string;
      NEXT_PUBLIC_COOKIE_DOMAIN?: string;
      NEXT_PUBLIC_DAILYMOTION_CLIENT_ID?: string;
      NEXT_PUBLIC_DEUTSCHETELEKOM_CLIENT_ID?: string;
      NEXT_PUBLIC_DEVIANTART_CLIENT_ID?: string;
      NEXT_PUBLIC_DISCORD_CLIENT_ID?: string;
      NEXT_PUBLIC_DROPBOX_CLIENT_ID?: string;
      NEXT_PUBLIC_FACEBOOK_CLIENT_ID?: string;
      NEXT_PUBLIC_FATSECRET_CLIENT_ID?: string;
      NEXT_PUBLIC_FITBIT_CLIENT_ID?: string;
      NEXT_PUBLIC_FORMSTACK_CLIENT_ID?: string;
      NEXT_PUBLIC_FOURSQUARE_CLIENT_ID?: string;
      NEXT_PUBLIC_GITHUB_CLIENT_ID?: string;
      NEXT_PUBLIC_GITHUB_SCOPES?: string;
      NEXT_PUBLIC_GITLAB_CLIENT_ID?: string;
      NEXT_PUBLIC_GOOGLE_CLIENT_ID?: string;
      NEXT_PUBLIC_GOOGLE_SCOPES?: string;
      NEXT_PUBLIC_HUDDLE_CLIENT_ID?: string;
      NEXT_PUBLIC_IMGUR_CLIENT_ID?: string;
      NEXT_PUBLIC_INSTAGRAM_CLIENT_ID?: string;
      NEXT_PUBLIC_INTELCLOUDSERVICES_CLIENT_ID?: string;
      NEXT_PUBLIC_JIVE_CLIENT_ID?: string;
      NEXT_PUBLIC_KEYCLOAK_CLIENT_ID?: string;
      NEXT_PUBLIC_LINKEDIN_CLIENT_ID?: string;
      NEXT_PUBLIC_LOG_VERBOSITY_CLIENT?: string;
      NEXT_PUBLIC_MICROSOFT_CLIENT_ID?: string;
      NEXT_PUBLIC_MICROSOFT_SCOPES?: string;
      NEXT_PUBLIC_NETIQ_CLIENT_ID?: string;
      NEXT_PUBLIC_OKTA_CLIENT_ID?: string;
      NEXT_PUBLIC_OPENAM_CLIENT_ID?: string;
      NEXT_PUBLIC_OPENSTREETMAP_CLIENT_ID?: string;
      NEXT_PUBLIC_ORCID_CLIENT_ID?: string;
      NEXT_PUBLIC_PAYPAL_CLIENT_ID?: string;
      NEXT_PUBLIC_PINGIDENTITY_CLIENT_ID?: string;
      NEXT_PUBLIC_PIXIV_CLIENT_ID?: string;
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY?: string;
      NEXT_PUBLIC_REDDIT_CLIENT_ID?: string;
      NEXT_PUBLIC_SALESFORCE_CLIENT_ID?: string;
      NEXT_PUBLIC_SINAWEIBO_CLIENT_ID?: string;
      NEXT_PUBLIC_SLACK_CLIENT_ID?: string;
      NEXT_PUBLIC_SPOTIFY_CLIENT_ID?: string;
      NEXT_PUBLIC_STACKEXCHANGE_CLIENT_ID?: string;
      NEXT_PUBLIC_STEAM_CLIENT_ID?: string;
      NEXT_PUBLIC_STRAVA_CLIENT_ID?: string;
      NEXT_PUBLIC_STRIPE_CLIENT_ID?: string;
      NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID?: string;
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
      NEXT_PUBLIC_TESLA_CLIENT_ID?: string;
      NEXT_PUBLIC_TWITCH_CLIENT_ID?: string;
      NEXT_PUBLIC_VIADEO_CLIENT_ID?: string;
      NEXT_PUBLIC_VIMEO_CLIENT_ID?: string;
      NEXT_PUBLIC_VK_CLIENT_ID?: string;
      NEXT_PUBLIC_WECHAT_CLIENT_ID?: string;
      NEXT_PUBLIC_WITHINGS_CLIENT_ID?: string;
      NEXT_PUBLIC_WSO2_CLIENT_ID?: string;
      NEXT_PUBLIC_XERO_CLIENT_ID?: string;
      NEXT_PUBLIC_XING_CLIENT_ID?: string;
      NEXT_PUBLIC_X_CLIENT_ID?: string;
      NEXT_PUBLIC_YAHOO_CLIENT_ID?: string;
      NEXT_PUBLIC_YAMMER_CLIENT_ID?: string;
      NEXT_PUBLIC_YANDEX_CLIENT_ID?: string;
      NEXT_PUBLIC_YELP_CLIENT_ID?: string;
      NEXT_PUBLIC_ZENDESK_CLIENT_ID?: string;
      SERVERSIDE_API_URI?: string;
    }
  }
}
