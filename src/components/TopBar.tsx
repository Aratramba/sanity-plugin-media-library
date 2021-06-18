import { Icon } from './Icon';
import { SortOption } from '../types/SortOption';
import { ViewTypes } from '../types/ViewTypes';
import React from 'react';
import styled from 'styled-components';
import { TextInput, Inline, Select } from '@sanity/ui';
import { SearchIcon } from '@sanity/icons';

interface Props {
  onSortChange: (value: SortOption) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setViewType: (type: ViewTypes) => void;
  viewType: ViewTypes;
}

const StyledContainer = styled.div`
  align-items: center;
  border-bottom: solid 1px ${({ theme }) => theme.topBarBorderColor};
  display: flex;
  justify-content: space-between;
  padding: 40px;
`;

const StyledItemsContainer = styled.div`
  display: flex;

  & > :not(:last-child) {
    margin: 0 20px 0 0;
  }
`;

const StyledListGridButton = styled.button<{ isActive?: Boolean }>`
  background-color: transparent;
  border: 0;
  cursor: pointer;
  height: 20px;
  outline: 0;
  padding: 0;
  width: 20px;

  & svg {
    fill: ${({ isActive, theme }) => (isActive ? theme.topBarButtonActiveColor : theme.topBarButtonInactiveColor)};
    height: 20px;
    width: 20px;
  }
`;

export const TopBar = ({ onSortChange, searchQuery, setSearchQuery, setViewType, viewType }: Props) => (
  <StyledContainer>
    <StyledItemsContainer>
      <StyledListGridButton onClick={() => setViewType('grid')} isActive={viewType === 'grid'} aria-label="grid">
        <Icon type="grid" />
      </StyledListGridButton>
      <StyledListGridButton onClick={() => setViewType('list')} isActive={viewType === 'list'} aria-label="list">
        <Icon type="list" />
      </StyledListGridButton>
    </StyledItemsContainer>
    <Inline space={3}>
      <SearchIcon />
      <TextInput
        fontSize={[2]}
        padding={[3]}
        placeholder="Search by filename, title, alt or tag"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
      />

      <Select
        fontSize={[2]}
        padding={[3]}
        space={[3, 3, 4]}
        onChange={(e) => onSortChange(e.currentTarget.value as SortOption)}
      >
        <option value="date">Latest first</option>
        <option value="az">Filename A - Z</option>
        <option value="za">Filename Z - A</option>
      </Select>
    </Inline>
  </StyledContainer>
);
