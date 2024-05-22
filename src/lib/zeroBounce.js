import zeroBounceSDK from '@zerobounce/zero-bounce-sdk';
import config from '../config/config.js';
const zeroBounce = new zeroBounceSDK();
zeroBounce.init(config.zeroBounceApiKey);
export default zeroBounce;