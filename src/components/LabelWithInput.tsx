import { Geopoint } from '../types/Asset';
import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

interface Props {
  label: string;
  onChange: (value: any) => void;
  placeholder?: string;
  type?:
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'location'
    | 'number'
    | 'tel'
    | 'text'
    | 'time'
    | 'url';
  value?: string | number | boolean | readonly string[] | undefined;
}

const StyledContainer = styled.label`
  cursor: pointer;
  display: block;
  width: 100%;
`;

const StyledWrapper = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  margin-bottom: 8px;
  width: 100%;

  & > input {
    margin-left: 16px;
  }

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

const StyledTextArea = styled.textarea`
  background-color: ${({ theme }) => theme.inputBackgroundColor};
  border-radius: ${({ theme }) => theme.appBorderRadius};
  border: 0;
  color: ${({ theme }) => theme.inputTextColor};
  font-family: ${({ theme }) => theme.appFontFamily};
  font-size: 16px;
  line-height: 1.1;
  outline: 0;
  padding: 16px;
  resize: vertical;
  rows: 2;
  width: 100%;
`;

export const LabelWithInput = ({ label, onChange, type = 'text', ...rest }: Props) => {
  const elementsMap: { [key: string]: any } = {
    checkbox: Checkbox,
    location: Location,
    textArea: StyledTextArea,
  };

  const onChangeMap: { [key: string]: (e: any) => void } = {
    checkbox: (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.checked),
    location: (value: Geopoint | undefined) => onChange(value),
    number: (e: ChangeEvent<HTMLInputElement>) => onChange(parseFloat(e.target.value)),
  };

  const defaultOnChange = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value);
  const handleOnChange = onChangeMap[type] || defaultOnChange;
  const Element = elementsMap[type] || StyledInput;

  return (
    <StyledContainer>
      <StyledLabel>{label}</StyledLabel>
      <Element onChange={handleOnChange} type={type} {...rest} />
    </StyledContainer>
  );
};

const Checkbox = ({ value, ...rest }: { value: boolean | undefined }) => <input checked={!!value} {...rest} />;

const Location = ({
  onChange,
  value = {},
  ...rest
}: {
  onChange: (value: Geopoint | ((prevState: Geopoint) => Geopoint)) => void;
  value?: Geopoint | undefined;
}) => {
  const fields: Array<{ label: string; name: keyof Geopoint; type: string; step: string }> = [
    { label: 'Latitude', name: 'lat', type: 'number', step: 'any' },
    { label: 'Longitude', name: 'lng', type: 'number', step: 'any' },
    { label: 'Altitude', name: 'alt', type: 'number', step: 'any' },
  ];

  const handleInputchange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...(value || {}), [e.target.name]: parseFloat(e.target.value) });
  };

  return (
    <StyledContainer as="div" {...rest}>
      {fields.map(({ label, name, ...rest }: { label: string; name: keyof Geopoint }) => (
        <StyledWrapper key={name}>
          <StyledLabel>{label}</StyledLabel>
          <StyledInput onChange={handleInputchange} name={name} value={value[name]} {...rest} />
        </StyledWrapper>
      ))}
    </StyledContainer>
  );
};
