import { identity, memoizeWith } from 'ramda'

import { enhancedStringify } from './utils'

const getJSON = <R extends {}>(url: string, params = {}): Promise<R> =>
  fetch(`${url}${enhancedStringify(params)}`, { method: 'GET' }).then(res => res.json())

interface ISteamIDResponse {
  steamid?: string
  errorMessage?: string
}

export interface IGameInfo {
  appid: string
  name: string
  genre: string
  positive: number
  negative: number
  userscore: number
}

export interface IGamesResponse {
  payload?: IGameInfo[]
  warning?: string[]
}

export const getSteamID = (customURL: string) => getJSON<ISteamIDResponse>('/api/getSteamID', { customURL })

// cover/optimize the following cases:
// 1. formik starts full form re-validation on push field action, so it could be pretty laggy
// 2. on form submit we should grab again resolved steam IDs
// how to improve: add cache lifetime
export const getSteamIDWithCache: typeof getSteamID = memoizeWith(identity, getSteamID)

export const getGamesIntersection = (ids: string[]) => getJSON<IGamesResponse>('/api/getGamesIntersection', { ids })
