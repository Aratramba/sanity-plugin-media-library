import React from 'react';
import { Geopoint } from 'src/types/Asset';
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

const StyledWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;

  & > span {
    font-size: 14px;
    margin: 0;
    opacity: 0.8;
  }
  & > input {
    margin-left: 16px;
  }
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

interface LocationProps {
  label: string;
  onChange: (value: (Geopoint | ((prevState: Geopoint) => Geopoint))) => void
  value?: Geopoint | undefined;
}

export const LabelWithLocationInput = ({ label, onChange, value = { lat: undefined, lng: undefined, alt: undefined } }: LocationProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onChange(prevState => ({
        ...prevState,
        [name]: parseFloat(value)
    }))
  }
  return (
    <StyledContainer>
      <StyledLabel>{label}</StyledLabel>
      <StyledWrapper>
        <StyledLabel>Latitude</StyledLabel>
        <StyledInput name="lat" onChange={handleChange} value={value.lat || ''} type="number" step="any" />
      </StyledWrapper>
      <StyledWrapper>
        <StyledLabel>Longitude</StyledLabel>
        <StyledInput name="lng" onChange={handleChange} value={value.lng || ''} type="number" step="any" />
      </StyledWrapper>
      <StyledWrapper>
        <StyledLabel>Altitude</StyledLabel>
        <StyledInput name="alt" onChange={handleChange} value={value.alt || ''} type="number" step="any" />
      </StyledWrapper>
    </StyledContainer>
  )
};