import { SortOption } from '../types/SortOption';
import { ViewTypes } from '../types/ViewTypes';
import React from 'react';
import { TextInput, Inline, Select, Flex, Switch, Label } from '@sanity/ui';
import { SearchIcon } from '@sanity/icons';

interface Props {
  onSortChange: (value: SortOption) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setViewType: (type: ViewTypes) => void;
  viewType: ViewTypes;
}

export const TopBar = ({ onSortChange, searchQuery, setSearchQuery, setViewType, viewType }: Props) => (
  <Flex padding={3} justify="space-between" align="center">
    <Inline space={2}>
      <Inline space={2}>
        <Label size={0}>Details</Label>
        <Switch onClick={() => setViewType(viewType === 'grid' ? 'list' : 'grid')} checked={viewType === 'list'} />
      </Inline>
    </Inline>
    <Inline space={3}>
      <SearchIcon />
      <TextInput
        fontSize={[2]}
        padding={[3]}
        placeholder="Search by filename, title, alt or tag"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
      />

      <Select
        fontSize={[2]}
        padding={[3]}
        space={[3, 3, 4]}
        onChange={(e) => onSortChange(e.currentTarget.value as SortOption)}
      >
        <option value="date">Latest first</option>
        <option value="az">Filename A - Z</option>
        <option value="za">Filename Z - A</option>
      </Select>
    </Inline>
  </Flex>
);
