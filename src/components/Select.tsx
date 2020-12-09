import { Icon } from './Icon';
import { sortOption } from '../types/sortOption';
import React from 'react';
import styled from 'styled-components';

interface Props {
  onSortChange: (value: sortOption) => void;
  options: Array<{ label: string; value: sortOption }>;
}

const StyledContainer = styled.label`
  align-items: center;
  background-color: #333;
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  position: relative;

  & svg {
    fill: #666;
    height: 20px;
    pointer-events: none;
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
  }
`;

const StyledSelect = styled.select`
  appearance: none;
  background-color: transparent;
  border: 0;
  color: #fff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  font-size: 14px;
  line-height: 1.1;
  outline: 0;
  padding: 8px 36px 8px 16px;
`;

export const Select = ({ onSortChange, options }: Props) => (
  <StyledContainer>
    <StyledSelect onChange={(e) => onSortChange(e.target.value as sortOption)}>
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </StyledSelect>
    <Icon type="chevron" />
  </StyledContainer>
);
