import React from 'react';
import { Geopoint } from 'src/types/Asset';
import styled from 'styled-components';

interface Props {
  label: string;
  placeholder?: string;
  onChange: (value: any) => void;
  value?: string | number | boolean | readonly string[] | undefined;
}
interface PropsText extends Props {
  type?: 'text' | 'textarea';
  onChange: (value: string) => void;
  value?: string | readonly string[] | undefined;
}
interface PropsNumber extends Props {
  onChange: (value: number) => void;
  value?: number;
    max?: number;
    min?: number;
    step?: number | 'any';
}
interface PropsCheckbox extends Props {
  onChange: (value: boolean) => void;
  value?: boolean | undefined;
}


const StyledContainer = styled.label`
  cursor: pointer;
  display: block;
  width: 100%;
`;

const StyledContainerRow = styled(StyledContainer)`
  display: flex;
  align-items: center;

  & > input {
    margin-left: 16px;
  }
`;

const StyledWrapper = styled(StyledContainerRow)`
  margin-bottom: 8px;

  & > span {
    font-size: 14px;
    margin: 0;
    opacity: 0.8;
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

const StyledTextarea = styled.textarea`
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

export const LabelWithInput = ({ label, onChange, placeholder, value = '', type = 'text'}: PropsText) => (
  <StyledContainer>
    <StyledLabel>{label}</StyledLabel>
    {type === 'textarea'
      ? <StyledTextarea onChange={(e) => onChange(e.target.value)} value={value} placeholder={placeholder} />
      : <StyledInput onChange={(e) => onChange(e.target.value)} placeholder={placeholder} value={value} type={type} />
    }
  </StyledContainer>
);
export const LabelWithNumericalInput = ({ label, onChange, placeholder, value,  min, max, step}: PropsNumber) => (
  <StyledContainer>
    <StyledLabel>{label}</StyledLabel>
    <StyledInput onChange={(e) => onChange(parseFloat(e.target.value))} placeholder={placeholder} value={value} type='number' min={min} max={max} step={step}/>
  </StyledContainer>
);
export const LabelWithCheckbox = ({ label, onChange, value = undefined }: PropsCheckbox) => (
  <StyledContainerRow>
    <StyledLabel>{label}</StyledLabel>
    <input onChange={(e) => onChange(e.target.checked)} checked={value} type='checkbox' />
  </StyledContainerRow>
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
    <StyledContainer as="div">
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