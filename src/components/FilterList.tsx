import { FilterListDropArea } from './FilterListDropArea';
import { Icon } from './Icon';
import { IconTypes } from '../types/IconTypes';
import React from 'react';
import styled from 'styled-components';

interface Props {
  iconType: IconTypes;
  items?: Array<{ isActive: boolean; value: string }>;
  onItemClick: (value: string) => void;
  onItemDrop?: (value: string) => void;
}

const StyledList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  :not(:last-child) {
    margin: 0 0 20px;
  }
`;

const StyledButton = styled.button<{ isActive?: Boolean }>`
  align-items: center;
  background-color: transparent;
  border: 0;
  color: ${({ isActive, theme }) => (isActive ? theme.filterListActiveColor : theme.filterListInactiveColor)};
  cursor: pointer;
  display: flex;
  font-family: ${({ theme }) => theme.appFontFamily};
  font-size: 14px;
  font-weight: 500;
  line-height: 1.1;
  outline: 0;
  padding: 8px 0;
  width: 100%;

  & svg {
    height: 20px;
    margin-right: 10px;
    width: 20px;
  }
`;

export const FilterList = ({ iconType, items = [], onItemClick, onItemDrop }: Props) => (
  <StyledList>
    {items.map(({ isActive, value }) => {
      const inner = (
        <StyledButton isActive={isActive} onClick={() => onItemClick(value)}>
          <Icon type={iconType} />
          <span>{value}</span>
        </StyledButton>
      );

      return (
        <li key={value}>
          {onItemDrop ? (
            <FilterListDropArea loading={false} onDrop={() => onItemDrop(value)}>
              {inner}
            </FilterListDropArea>
          ) : (
            inner
          )}
        </li>
      );
    })}
  </StyledList>
);
