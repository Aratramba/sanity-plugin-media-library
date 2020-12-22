import React from 'react';
import styled from 'styled-components';

interface Props {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text';
  value?: string | number | readonly string[] | undefined;
}

const StyledContainer = styled.label`
  cursor: pointer;
  display: block;
  width: 100%;
`;

const StyledLabel = styled.span`
  color: ${({ theme }) => theme.inputLabelColor};
  display: block;
  font-family: ${({ theme }) => theme.appFontFamily};
  font-size: 16px;
  font-weight: 500;
  line-height: 1.1;
  margin: 0 0 0.5em;
  width: 100%;
`;

const StyledInput = styled.input`
  background-color: ${({ theme }) => theme.inputBackgroundColor};
  border-radius: ${({ theme }) => theme.appBorderRadius};
  border: 0;
  color: ${({ theme }) => theme.inputTextColor};
  font-family: ${({ theme }) => theme.appFontFamily};
  font-size: 16px;
  line-height: 1.1;
  outline: 0;
  padding: 16px;
  width: 100%;
`;

export const LabelWithInput = ({ label, onChange, placeholder, value = '', type = 'text' }: Props) => (
  <StyledContainer>
    <StyledLabel>{label}</StyledLabel>
    <StyledInput onChange={(e) => onChange(e.target.value)} placeholder={placeholder} value={value} type={type} />
  </StyledContainer>
);
