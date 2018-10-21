import styled from 'styled-components'
import { bottom, fontSize, fontWeight, left, position, right, top } from 'styled-system'

interface IProps {
  position?: 'static' | 'relative' | 'absolute' | 'fixed'
  top?: string
  bottom?: string
  right?: string
  left?: string
  fontSize?: string
  fontWeight?: string
}

export const Container = styled.div<IProps>`
  ${position};
  ${top};
  ${bottom};
  ${right};
  ${left};
  ${fontSize};
  ${fontWeight};
`
