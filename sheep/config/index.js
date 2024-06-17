// 开发环境配置
export let baseUrl;
export let version;
if (process.env.NODE_ENV === 'development') {
  baseUrl = import.meta.env.SHOPRO_DEV_BASE_URL;
} else {
  baseUrl = import.meta.env.SHOPRO_BASE_URL;
}
version = import.meta.env.SHOPRO_VERSION;
console.log(`[方便签 ${version}]`);

export const apiPath = import.meta.env.SHOPRO_API_PATH;
export const staticUrl = import.meta.env.SHOPRO_STATIC_URL;
export const signUrl = import.meta.env.SHOPRO_SIGN_URL;

export default {
  baseUrl,
  apiPath,
  staticUrl,
  signUrl,
};
