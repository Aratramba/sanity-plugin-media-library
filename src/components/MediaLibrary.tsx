import { Asset } from '../types/Asset'
import { BottomBar } from './BottomBar'
import { MediaGrid } from './MediaGrid'
import { sortOption } from '../types/sortOption'
import { TopBar } from './TopBar'
import React from 'react'
import styled from 'styled-components'

interface Props {
  assets?: Array<Asset>,
  isModal: Boolean,
  loading: Boolean,
  onSortChange: (value: sortOption) => void,
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

export const MediaLibrary = ({ assets = [], isModal, loading, onSortChange, searchQuery, setSearchQuery }: Props) => (
  <StyledContainer>
    <TopBar onSortChange={onSortChange} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    <StyledMediaGridContainer>
      <MediaGrid assets={assets} />
    </StyledMediaGridContainer>
    <BottomBar loading={loading} isModal={isModal} />
  </StyledContainer>
)
