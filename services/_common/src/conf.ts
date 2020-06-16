/** 
 * Static config values based on environement. 
 * - Re-exported from config.ts
 * - Allows to safely access those value in a synchronous manner in application code
 * - For more complex value, use the config `getConfig` method (which also return those property/values)
 **/


export const __version__ = "DROP-002-SNAPSHOT";

// should HOST environment should be set by kuberenetes.
export const KHOST = process.env.HOSTNAME ?? 'no-host';

export const SERVICE_NAME = process.env.service_name ?? 'no-service';

//// HTTP
export const HTTPS_MODE = (process.env.https_mode === 'true') ? true : false;
export const PWD_SCHEME_01_SALT = process.env.pwd_scheme_01_salt;
export const PWD_SCHEME_02_SALT = process.env.pwd_scheme_02_salt;
export const WEB_TOKEN_SALT = PWD_SCHEME_02_SALT;
export const WEB_TOKEN_DURATION = 3600; // in sec (this could come from a env/config)

//// Database
export const DB_PASSWORD = process.env.db_password!;
export const DB_HOST = process.env.db_host!;
export const DB_DATABASE = process.env.db_database!;
export const DB_USER = process.env.db_user!;
export const DB = Object.freeze({ host: DB_HOST, database: DB_DATABASE, user: DB_USER, password: DB_PASSWORD });

//// GOOGLE OAUTH
export const GOOGLE_OAUTH_REDIRECT_URL = process.env.google_oauth_redirect_url!;
export const GOOGLE_OAUTH_CLIENT_ID = process.env.google_oauth_client_id!;
export const GOOGLE_OAUTH_CLIENT_SECRET = process.env.google_oauth_client_secret!;
export const GOOGLE_OAUTH = GOOGLE_OAUTH_CLIENT_ID ? Object.freeze({ client_id: GOOGLE_OAUTH_CLIENT_ID, redirect_url: GOOGLE_OAUTH_REDIRECT_URL, client_secret: GOOGLE_OAUTH_CLIENT_SECRET }) : null;


//// LOG
export const LOG_DIR = './logs/';
export const LOG_MAX_COUNT = Number(process.env.log_max_count!);
export const LOG_MAX_TIME = Number(process.env.log_max_time!);
export const LOG = Object.freeze({ maxCount: LOG_MAX_COUNT, maxTime: LOG_MAX_TIME });

//// OTHERS
export const PERF_LOG_THRESHOLD_WEB = 1000; // in ms. Threshold when utx.perfContext.items should be logged