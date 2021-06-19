import { Geopoint } from '../types/Asset';
import React, { ChangeEvent } from 'react';
import { TextInput, Select, TextArea, Label, Checkbox, Inline, Stack } from '@sanity/ui';

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
    | 'select'
    | 'tel'
    | 'text'
    | 'time'
    | 'url';
  value?: string | number | boolean | readonly string[] | undefined;
}

export const LabelWithInput = ({ label, onChange, type = 'text', ...rest }: Props) => {
  const elementsMap: { [key: string]: any } = {
    checkbox: CustomCheckbox,
    location: Location,
    textArea: TextArea,
    select: CustomSelect,
  };

  const onChangeMap: { [key: string]: (e: any) => void } = {
    checkbox: (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.checked),
    location: (value: Geopoint | undefined) => onChange(value),
    number: (e: ChangeEvent<HTMLInputElement>) => onChange(parseFloat(e.target.value)),
    select: (e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value),
  };

  const defaultOnChange = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value);
  const handleOnChange = onChangeMap[type] || defaultOnChange;
  const Element = elementsMap[type] || TextInput;

  return (
    <Stack space={3}>
      <label htmlFor={label}>
        <Label size={2}>{label}</Label>
      </label>
      <Element id={label} onChange={handleOnChange} type={type} {...rest} />
    </Stack>
  );
};

const CustomCheckbox = ({ value, ...rest }: { value: boolean | undefined }) => <Checkbox checked={!!value} {...rest} />;

const Location = ({
  onChange,
  value = {},
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
    <Stack space={3}>
      {fields.map(({ label, name, ...rest }: { label: string; name: keyof Geopoint }) => (
        <Inline key={name} space={3}>
          <label htmlFor={label}>
            <Label size={1}>{label}</Label>
          </label>
          <TextInput id={label} onChange={handleInputchange} name={name} value={value ? value[name] : ''} {...rest} />
        </Inline>
      ))}
    </Stack>
  );
};

type SelectOption = {
  title: string;
  value: string;
};

const CustomSelect = ({
  options,
  placeholder,
  value,
  label,
  ...rest
}: {
  options: Array<SelectOption>;
  placeholder: string | undefined;
  label: string;
  value: string | undefined;
}) => {
  return (
    <Select id={label} {...rest}>
      <option value="">{placeholder}</option>
      {options?.map((option: SelectOption) => (
        <option key={option.value} value={option.value} selected={option.value === value}>
          {option.title}
        </option>
      ))}
    </Select>
  );
};
