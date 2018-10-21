import { Box, Flex } from 'grid-styled'
import { uniq } from 'ramda'
import * as React from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { injectGlobal } from 'styled-components'

import { getGamesIntersection, getSteamIDWithCache, IGamesResponse } from './api'
import { SteamNamesForm } from './form'
import { GameCard, H1, H2, indents, NotificationBody, Text } from './ui'

// tslint:disable-next-line no-unused-expression
injectGlobal`
  html {
    font-family: system-ui, sans-serif;
  }

  button, input {
    font-family: system-ui, sans-serif;
  }

  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  #root {
    height: 100%;
  }
`

interface IState {
  isLoading: boolean
  games: IGamesResponse['payload'] | null
  error: boolean
}

export class App extends React.Component<{}, IState> {
  state: IState = {
    isLoading: false,
    games: null,
    error: false,
  }

  handleResponse = ({ payload: games, warning }: IGamesResponse) => {
    const statePayload = warning ? { games: null } : { games }

    // tslint:disable-next-line no-unused-expression
    warning && toast.warn(<NotificationBody mentions={warning} message="Cannot obtain games from: " />)
    this.setState({
      isLoading: false,
      error: false,
      ...statePayload,
    })
  }

  handleCommonError = () =>
    this.setState({
      isLoading: false,
      error: true,
    })

  loadGames = async (urls: string[]) => {
    this.setState({ isLoading: true })
    try {
      const resolvedIds = await Promise.all(urls.map(getSteamIDWithCache))
      // ensure that there are no falsy values
      const ids = resolvedIds.map(({ steamid }) => steamid) as string[]
      const joinedUserData = ids.reduce(
        (acc, id, index) => ({
          [id]: urls[index],
          ...acc,
        }),
        {},
      )
      const { warning: rawWarning, ...rest } = await getGamesIntersection(ids)
      const warning = rawWarning ? uniq(rawWarning).map(id => joinedUserData[id]) : undefined

      this.handleResponse({ ...rest, warning })
    } catch (e) {
      this.handleCommonError()
    }
  }

  render() {
    const { isLoading, error, games } = this.state

    const mainContent =
      games &&
      (games.length > 0 ? (
        <Box my={indents.S}>
          <H2 centered>You can play following games together: </H2>
          <Flex flexDirection="row" flexWrap="wrap" p={indents.S} justifyContent="center">
            {games.map(game => (
              <Box is={GameCard} game={game} key={game.appid} mr={indents.XS} mb={indents.XS} />
            ))}
          </Flex>
        </Box>
      ) : (
        <H2 centered>Looks like you don't have common multiplayer games</H2>
      ))

    const errorContent = <H2 centered>Error occurred during data processing :( Please try again later</H2>

    return (
      <React.Fragment>
        <Box is={H1} centered mb="0">
          Enter Steam custom URLs:
        </Box>
        <Flex justifyContent="center">
          <Text>
            For example, you should enter <b>123</b>
          </Text>
        </Flex>
        <Flex is={Text} justifyContent="center">
          if your Steam profile's URL is https://steamcommunity.com/id/123/
        </Flex>
        <ToastContainer autoClose={15000} hideProgressBar />
        <SteamNamesForm onSubmit={this.loadGames} isLoading={isLoading} />
        {!isLoading && (error ? errorContent : mainContent)}
      </React.Fragment>
    )
  }
}
