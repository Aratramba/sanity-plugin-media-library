import { Icon } from './Icon';
import React from 'react';
import styled from 'styled-components';

interface Props {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const StyledContainer = styled.label`
  align-items: center;
  background-color: ${({ theme }) => theme.inputBackgroundColor};
  border-radius: ${({ theme }) => theme.appBorderRadius};
  display: flex;
  padding: 8px;

  & svg {
    fill: ${({ theme }) => theme.inputIconColor};
    height: 20px;
    margin-right: 10px;
    width: 20px;
  }
`;

const StyledInput = styled.input`
  background-color: transparent;
  border: 0;
  color: ${({ theme }) => theme.inputTextColor};
  font-family: ${({ theme }) => theme.appFontFamily};
  font-size: 14px;
  line-height: 1.1;
  outline: 0;
`;

export const SearchBar = ({ searchQuery, setSearchQuery }: Props) => (
  <StyledContainer>
    <Icon type="search" />
    <StyledInput
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search by filename, title, alt or tag"
      type="search"
    />
  </StyledContainer>
);
