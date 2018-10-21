import styled from 'styled-components'
import { display, fontWeight } from 'styled-system'

import { palette } from '../constants'

interface IProps {
  color?: string
  fontWeight?: string
  display?: string
}

export const Text = styled.div<IProps>`
  color: ${({ color = palette.darkGray }) => color};
  font-size: 0.8rem;
  ${fontWeight};
  ${display};
`
