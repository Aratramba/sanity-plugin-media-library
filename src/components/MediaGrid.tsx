import { Asset } from '../types/Asset'
import React from 'react'
import styled from 'styled-components'

interface Props {
  assets?: Array<Asset>
}

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 40px;

  & > * {
    margin: 0 15px 15px 0;
  }
`

export const MediaGrid = ({ assets = [] }: Props) => (
  <StyledContainer>
    {assets.map(({ _id, alt, url }) => <img key={_id} alt={alt} src={`${url}?w=150&h=150&fit=crop`} />)}
  </StyledContainer>
)