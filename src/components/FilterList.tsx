import { FilterListDropArea } from './FilterListDropArea';
import React from 'react';
import { Stack, Switch, Inline, Container, Text } from '@sanity/ui';

interface Props {
  items?: Array<{ isActive: boolean; value: string }>;
  onItemClick: (value: string) => void;
  onItemDrop?: (value: string) => void;
}

export const FilterList = ({ items = [], onItemClick, onItemDrop }: Props) => (
  <Stack space={3}>
    {items.map(({ isActive, value }) => {
      const inner = (
        <Inline>
          <Switch checked={isActive} id={value} onClick={() => onItemClick(value)} style={{ marginRight: 8 }} />
          <label htmlFor={value}>
            <Text size={1}>{value}</Text>
          </label>
        </Inline>
      );

      const preventDrop = value === 'used' || value === 'unused';

      return (
        <Container key={value}>
          {onItemDrop && !preventDrop ? (
            <FilterListDropArea loading={false} onDrop={() => onItemDrop(value)}>
              {inner}
            </FilterListDropArea>
          ) : (
            inner
          )}
        </Container>
      );
    })}
  </Stack>
);
