import { Button } from './Button'
import { FilterList } from './FilterList'
import React from 'react'
import styled from 'styled-components'

interface Props {
  categories?: Array<string>,
  tags?: Array<string>,
}

const StyledContainer = styled.div`
  background-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 300px;
`

const StyledPartContainer = styled.div`
  padding: 40px;
`

const StyledTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 1em;
`

export const Sidebar = ({ categories = [], tags = [] }: Props) => (
  <StyledContainer>
    <StyledPartContainer>
      <StyledTitle>Filters</StyledTitle>
      <FilterList items={categories} iconType='file' />
      <FilterList items={[...tags, 'Untagged']} iconType='tag' />
    </StyledPartContainer>
    <StyledPartContainer>
      <Button grow onClick={() => alert('joe')} icon='upload'>Upload</Button>
    </StyledPartContainer>
  </StyledContainer>
)