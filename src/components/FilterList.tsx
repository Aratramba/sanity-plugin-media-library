import { FilterListDropArea } from './FilterListDropArea';
import React from 'react';
import { Stack, Text, Switch, Inline, Container } from '@sanity/ui';

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
          <Switch checked={isActive} onClick={() => onItemClick(value)} />
          <Text style={{ marginLeft: 6 }} size={2}>
            {value}
          </Text>
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
