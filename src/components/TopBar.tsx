import { SortOption } from '../types/SortOption';
import { ViewTypes } from '../types/ViewTypes';
import React from 'react';
import { TextInput, Inline, Select, Flex, Switch, Label } from '@sanity/ui';
import { SearchIcon, UlistIcon } from '@sanity/icons';

interface Props {
  onSortChange: (value: SortOption) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setViewType: (type: ViewTypes) => void;
  viewType: ViewTypes;
}

export const TopBar = ({ onSortChange, searchQuery, setSearchQuery, setViewType, viewType }: Props) => (
  <Flex padding={3} justify="space-between" align="center" wrap="wrap" gap={3}>
    <Inline space={2}>
      <Inline space={2} style={{ whiteSpace: 'nowrap' }}>
        <UlistIcon style={{ width: 18, height: 18 }} />
        <label htmlFor="detailsViewCheckbox">
          <Label>{viewType === 'grid' ? 'Show' : 'Hide'} details</Label>
        </label>
        <Switch
          id="detailsViewCheckbox"
          onClick={() => setViewType(viewType === 'grid' ? 'list' : 'grid')}
          checked={viewType === 'list'}
        />
      </Inline>
    </Inline>

    <Inline space={3}>
      <label htmlFor="searchField">
        <SearchIcon style={{ width: 24, height: 24, marginRight: -6 }} />
      </label>

      <TextInput
        id="searchField"
        style={{ width: 300 }}
        fontSize={[2]}
        padding={[3]}
        placeholder="Search by filename, title, alt or tag"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
      />

      <Select
        id="sortSelect"
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
