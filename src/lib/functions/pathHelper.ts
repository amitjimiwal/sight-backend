import config from "../../config/config.js";

function getAbsolutePath(endpoint: string) {
     return `${config.frontendUrl}/${endpoint}`
}
export { getAbsolutePath }