import { Icon } from './Icon';
import { IconTypes } from '../types/IconTypes';
import React from 'react';
import styled from 'styled-components';

interface Props {
  iconType: IconTypes;
  items?: Array<{ isActive: boolean; value: string }>;
  onItemClick: (value: string) => void;
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
  color: ${({ isActive }) => (isActive ? '#fff' : '#666')};
  cursor: pointer;
  display: flex;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.1;
  outline: 0;
  padding: 8px 8px 8px 0;
  width: 100%;

  & svg {
    height: 20px;
    margin-right: 10px;
    width: 20px;
  }
`;

export const FilterList = ({ iconType, items = [], onItemClick }: Props) => (
  <StyledList>
    {items.map(({ isActive, value }) => (
      <li key={value}>
        <StyledButton isActive={isActive} onClick={() => onItemClick(value)}>
          <Icon type={iconType} />
          <span>{value}</span>
        </StyledButton>
      </li>
    ))}
  </StyledList>
);
