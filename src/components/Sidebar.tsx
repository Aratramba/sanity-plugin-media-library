import { FilterList } from './FilterList';
import { UploadButton } from './UploadButton';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Heading, Stack, Flex, Inline } from '@sanity/ui';
import { CloseIcon } from '@sanity/icons';

interface Props {
  extensions?: Array<{ isActive: boolean; value: string }>;
  loading: Boolean;
  onClearFilters: () => void;
  onExtensionClick: (value: string) => void;
  onTagClick: (value: string) => void;
  onTagDrop: (value: string) => void;
  onUpload: (files: FileList) => void;
  tags?: Array<{ isActive: boolean; value: string }>;
}

const StyledDivider = styled.div`
  opacity: 0.1;
  margin: '20px 0';
`;

export const Sidebar = ({
  extensions = [],
  loading,
  onClearFilters,
  onExtensionClick,
  onTagClick,
  onTagDrop,
  onUpload,
  tags = [],
}: Props) => {
  const [hasActiveTags, setHasActiveTags] = useState<boolean>(false);

  useEffect(() => {
    setHasActiveTags([...extensions, ...tags].filter(({ isActive }) => isActive).length === 0);
  }, [extensions, tags]);

  return (
    <Flex direction="column" style={{ width: 250 }}>
      <Stack padding={4} style={{ overflowY: 'auto' }}>
        <Stack space={3}>
          <Heading as="h2" size={1}>
            Filters
          </Heading>

          <Inline>
            <Button
              disabled={Boolean(loading) || hasActiveTags}
              onClick={onClearFilters}
              fontSize={[1]}
              icon={CloseIcon}
              mode="ghost"
              padding={2}
              text="Clear filters"
            />
          </Inline>
          <StyledDivider />
          <FilterList items={extensions} onItemClick={onExtensionClick} />
          <StyledDivider />
          <FilterList items={tags} onItemClick={onTagClick} onItemDrop={onTagDrop} />
        </Stack>
      </Stack>

      <Stack padding={3} space={3} style={{ marginTop: 'auto' }}>
        <UploadButton disabled={loading} onUpload={onUpload} />
      </Stack>
    </Flex>
  );
};
