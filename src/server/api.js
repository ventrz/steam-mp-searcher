const { getJSON } = require('./utils/helpers')
const { STEAM_API_KEY } = require('./utils/constants')

const defaultSteamParams = {
  key: STEAM_API_KEY,
  format: 'json',
}

const getSteamID = vanityurl =>
  getJSON('http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001', {
    ...defaultSteamParams,
    vanityurl,
  }).then(({ response }) => response)

const getGameList = steamid =>
  getJSON('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001', {
    ...defaultSteamParams,
    steamid,
  }).then(({ response: { games } }) => games)

const getAppInfo = appid =>
  getJSON('http://steamspy.com/api.php', {
    request: 'appdetails',
    appid,
  })

module.exports = {
  getSteamID,
  getGameList,
  getAppInfo,
}
