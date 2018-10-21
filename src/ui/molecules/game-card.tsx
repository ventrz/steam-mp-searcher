import { Box, Flex } from 'grid-styled'
import * as React from 'react'

import { IGameInfo } from '../../api'
import { CardContainer, Link, Text } from '../atoms'
import { indents, palette } from '../constants'

interface IProps {
  game: IGameInfo
  className?: string
}

export const GameCard: React.SFC<IProps> = ({
  game: { appid, genre, name, negative, positive, userscore },
  className,
}) => {
  return (
    <Box is={CardContainer} p={indents.XS} className={className} width="23rem">
      <Box is={Link} mb={indents.L} href={`https://store.steampowered.com/app/${appid}`}>
        {name}
      </Box>
      <Box>
        <Text>{`Genre: ${genre || '–'}`}</Text>
        <Text>{`Userscore: ${userscore || '–'}`}</Text>
        <Text>
          {'Rate: '}
          <Text fontWeight="bold" color={palette.green} display="inline">
            {positive || '–'}
          </Text>
          {', '}
          <Text fontWeight="bold" color={palette.danger} display="inline">
            {negative || '–'}
          </Text>
        </Text>
      </Box>
    </Box>
  )
}
