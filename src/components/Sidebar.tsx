import { Button } from './Button';
import { FilterList } from './FilterList';
import { UploadButton } from './UploadButton';
import React from 'react';
import styled from 'styled-components';

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

const StyledContainer = styled.div`
  background-color: ${({ theme }) => theme.sidebarBackgroundColor};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  justify-content: space-between;
  width: 300px;
`;

const StyledFlexGrowContainer = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const StyledFilterContainer = styled.div`
  -ms-overflow-style: none; /* IE and Edge */
  height: 100%;
  left: 0;
  overflow-y: scroll;
  padding: 40px;
  position: absolute;
  scrollbar-width: none; /* Firefox */
  top: 0;
  width: 100%;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 1em;
`;

const StyledButtonContainer = styled.div`
  padding: 40px;

  & > :not(:last-child) {
    margin: 0 0 20px;
  }
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
}: Props) => (
  <StyledContainer>
    <StyledFlexGrowContainer>
      <StyledFilterContainer>
        <StyledTitle>Filters</StyledTitle>
        <FilterList items={extensions} iconType="file" onItemClick={onExtensionClick} />
        <FilterList items={tags} iconType="tag" onItemClick={onTagClick} onItemDrop={onTagDrop} />
      </StyledFilterContainer>
    </StyledFlexGrowContainer>
    <StyledButtonContainer>
      <Button
        disabled={loading || [...extensions, ...tags].filter(({ isActive }) => isActive).length === 0}
        grow
        icon="close"
        onClick={onClearFilters}
        secondary
      >
        Clear all filters
      </Button>
      <UploadButton disabled={loading} onUpload={onUpload} />
    </StyledButtonContainer>
  </StyledContainer>
);
