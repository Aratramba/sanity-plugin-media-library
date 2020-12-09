import { Icon } from './Icon'
import React from 'react'
import styled from 'styled-components'

const StyledContainer = styled.label`
  align-items: center;
  background-color: #333;
  border-radius: 2px;
  display: flex;
  padding: 8px;

  & svg {
    fill: #666;
    height: 20px;
    margin-right: 10px;
    width: 20px;
  }
`

const StyledInput = styled.input`
  background-color: transparent;
  border: 0;
  color: #fff;
  font-family: system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",sans-serif;
  font-size: 14px;
  line-height: 1.1;
  outline: 0;
`

export const SearchBar = () => (
  <StyledContainer>
    <Icon type='search' />
    <StyledInput placeholder="Search by title" type='search' />
  </StyledContainer>
)