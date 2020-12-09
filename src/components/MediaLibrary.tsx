import { Asset } from '../types/Asset'
import { BottomBar } from './BottomBar'
import { MediaGrid } from './MediaGrid'
import { TopBar } from './TopBar'
import React from 'react'
import styled from 'styled-components'

interface Props {
  assets?: Array<Asset>,
  isModal: Boolean,
  loading: Boolean,
  searchQuery: string,
  setSearchQuery: (value: string) => void,
}

const StyledContainer = styled.div`
  background-color: #111;
  display: flex;
  flex-direction: column;
  width: 100%;
`

const StyledMediaGridContainer = styled.div`
  flex: 1;
`

export const MediaLibrary = ({ assets = [], isModal, loading, searchQuery, setSearchQuery }: Props) => (
  <StyledContainer>
    <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    <StyledMediaGridContainer>
      <MediaGrid assets={assets} />
    </StyledMediaGridContainer>
    <BottomBar loading={loading} isModal={isModal} />
  </StyledContainer>
)
