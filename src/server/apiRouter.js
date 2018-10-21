const { Router } = require('express')
const Bottleneck = require('bottleneck')

const { STEAM_SUCCESS_CODE } = require('./utils/constants')
const { getIntersection, send500, simpleMemoize } = require('./utils/helpers')
const { getSteamID, getGameList, getAppInfo } = require('./api')

const apiRouter = Router()

const limiter = new Bottleneck({
  minTime: 250,
})

const enhancedGetAppInfo = simpleMemoize(limiter.wrap(getAppInfo))

apiRouter.get('/getSteamID', async ({ query: { customURL } }, res) => {
  try {
    const { success, steamid, errorMessage } = await getSteamID(customURL)
    if (success === STEAM_SUCCESS_CODE && steamid) {
      res.json({ steamid })
    } else {
      res.json({ errorMessage: 'No match found' })
    }
  } catch (e) {
    send500(res)
  }
})

apiRouter.get('/getGamesIntersection', async ({ query: { ids } }, res) => {
  try {
    const gamesByAccount = await Promise.all(ids.map(getGameList))
    const emptyAccounts = gamesByAccount.reduce((acc, curr, index) => (!curr ? [...acc, ids[index]] : acc), [])

    if (emptyAccounts.length > 0) {
      return res.json({ warning: emptyAccounts })
    }

    const commonAppIds = getIntersection('appid', ...gamesByAccount.map(v => v || []))
    const commonApps = await Promise.all(commonAppIds.map(enhancedGetAppInfo))
    res.json({
      payload: commonApps.filter(app => app.tags.Multiplayer),
    })
  } catch (e) {
    send500(res)
  }
})

module.exports = apiRouter
