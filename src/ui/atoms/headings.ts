import styled, { css } from 'styled-components'

import { indents, palette } from '../constants'

interface ICommonProps {
  centered?: boolean
}

const commonStyles = css<ICommonProps>`
  color: ${palette.darkGray};
  text-align: ${({ centered }) => (centered ? 'center' : 'left')};
`

export const H1 = styled.h1<ICommonProps>`
  ${commonStyles};
`

export const H2 = styled.h2<ICommonProps>`
  ${commonStyles};
`

export const H3 = styled.h3<ICommonProps>`
  ${commonStyles};
  margin: ${indents.XS} 0;
`
