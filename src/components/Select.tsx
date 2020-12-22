import { Icon } from './Icon';
import { SortOption } from '../types/SortOption';
import React from 'react';
import styled from 'styled-components';

interface Props {
  onSortChange: (value: SortOption) => void;
  options: Array<{ label: string; value: SortOption }>;
}

const StyledContainer = styled.label`
  align-items: center;
  background-color: ${({ theme }) => theme.inputBackgroundColor};
  border-radius: ${({ theme }) => theme.appBorderRadius};
  cursor: pointer;
  display: flex;
  position: relative;

  & svg {
    fill: ${({ theme }) => theme.inputIconColor};
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
  color: ${({ theme }) => theme.inputTextColor};
  font-family: ${({ theme }) => theme.appFontFamily};
  font-size: 14px;
  line-height: 1.1;
  outline: 0;
  padding: 8px 36px 8px 16px;
`;

export const Select = ({ onSortChange, options }: Props) => (
  <StyledContainer>
    <StyledSelect onChange={(e) => onSortChange(e.target.value as SortOption)}>
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </StyledSelect>
    <Icon type="chevron" />
  </StyledContainer>
);
