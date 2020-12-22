import { Icon } from './Icon';
import { SearchBar } from './SearchBar';
import { Select } from './Select';
import { SortOption } from '../types/SortOption';
import { ViewTypes } from '../types/ViewTypes';
import React from 'react';
import styled from 'styled-components';

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
      <StyledListGridButton onClick={() => setViewType('grid')} isActive={viewType === 'grid'}>
        <Icon type="grid" />
      </StyledListGridButton>
      <StyledListGridButton onClick={() => setViewType('list')} isActive={viewType === 'list'}>
        <Icon type="list" />
      </StyledListGridButton>
    </StyledItemsContainer>
    <StyledItemsContainer>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Select
        onSortChange={onSortChange}
        options={[
          { label: 'Latest First', value: 'date' },
          { label: 'Filename A - Z', value: 'az' },
          { label: 'Filename Z - A', value: 'za' },
        ]}
      />
    </StyledItemsContainer>
  </StyledContainer>
);
