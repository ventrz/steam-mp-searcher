import styled from 'styled-components'

import { indents, palette } from '../constants'

export const Link = styled.a.attrs({
  target: '_blank',
})`
  color: ${palette.darkGray};
  font-weight: bold;
`
