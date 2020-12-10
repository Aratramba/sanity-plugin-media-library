import { FilterList } from './FilterList';
import { UploadButton } from './UploadButton';
import React from 'react';
import styled from 'styled-components';

interface Props {
  extensions?: Array<{ isActive: boolean; value: string }>;
  onExtensionClick: (value: string) => void;
  onTagClick: (value: string) => void;
  onUpload: (files: FileList) => void;
  tags?: Array<{ isActive: boolean; value: string }>;
}

const StyledContainer = styled.div`
  background-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 300px;
`;

const StyledFlexGrowContainer = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const StyledPartContainer = styled.div`
  padding: 40px;
`;

const StyledFilterContainer = styled(StyledPartContainer)`
  -ms-overflow-style: none; /* IE and Edge */
  height: 100%;
  left: 0;
  overflow-y: scroll;
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

export const Sidebar = ({ extensions = [], onExtensionClick, onTagClick, onUpload, tags = [] }: Props) => (
  <StyledContainer>
    <StyledFlexGrowContainer>
      <StyledFilterContainer>
        <StyledTitle>Filters</StyledTitle>
        <FilterList items={extensions} iconType="file" onItemClick={onExtensionClick} />
        <FilterList items={tags} iconType="tag" onItemClick={onTagClick} />
      </StyledFilterContainer>
    </StyledFlexGrowContainer>
    <StyledPartContainer>
      <UploadButton onUpload={onUpload} />
    </StyledPartContainer>
  </StyledContainer>
);
