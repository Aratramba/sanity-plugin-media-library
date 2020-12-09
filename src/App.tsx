import { Asset } from './types/Asset';
import { MediaLibrary } from './components/MediaLibrary';
import { Sidebar } from './components/Sidebar';
import { sortOption } from './types/sortOption';
import client from 'part:@sanity/base/client';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  background-color: #000;
  color: #ffffff;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
`;

const StyledSidebarGridContainer = styled.div`
  display: flex;
  height: 100%;
`;

export const App = () => {
  const [activeMimeTypes, setActiveMimeTypes] = useState<Array<string>>([]);
  const [activeTags, setActiveTags] = useState<Array<string>>([]);
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [filteredAssets, setFilteredAssets] = useState<Array<Asset>>(assets);
  const [loading, setLoading] = useState<Boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sort, setSort] = useState<sortOption>('date');

  useEffect(() => {
    let newFilteredAssets = [...assets];

    if (searchQuery && searchQuery !== '') {
      newFilteredAssets = newFilteredAssets.filter(
        ({ originalFilename }) => originalFilename.indexOf(searchQuery) > -1
      );
    }

    if (activeMimeTypes.length > 0) {
      newFilteredAssets = newFilteredAssets.filter(({ mimeType }) => activeMimeTypes.indexOf(mimeType) > -1);
    }

    if (activeTags.length > 0) {
      newFilteredAssets = newFilteredAssets.filter(({ tags }) => tags?.some((tag) => activeTags.indexOf(tag) > -1));
    }

    if (sort === 'date') {
      newFilteredAssets.sort((a, b) => (a._createdAt > b._createdAt ? -1 : 1));
    }

    if (sort === 'az') {
      newFilteredAssets.sort((a, b) => (a.originalFilename.localeCompare(b.originalFilename) ? 1 : -1));
    }

    if (sort === 'za') {
      newFilteredAssets.sort((a, b) => (a.originalFilename.localeCompare(b.originalFilename) ? -1 : 1));
    }

    setFilteredAssets(newFilteredAssets);
  }, [assets, activeMimeTypes, activeTags, sort, searchQuery]);

  useEffect(() => {
    (async function asyncFunction() {
      try {
        const newAssets: Array<Asset> = await client.fetch(`*[_type == "sanity.imageAsset"]`, {});
        setAssets(newAssets);
        console.log(newAssets);

        // const response = await client.patch(newAssets[0]._id).set({ tags: ['Cats', 'Photos', 'Projects', '2020'], alt: 'Cat', }).commit()
        // console.log(response)
      } catch (e) {
        console.error(e);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    })();
  }, []);

  const onMimeTypeClick = (value: string) => onFilterClick(value, activeMimeTypes, setActiveMimeTypes);
  const onTagClick = (value: string) => onFilterClick(value, activeTags, setActiveTags);
  const mimeTypes: Array<{ isActive: boolean; value: string }> = getUniqueFiltersWithActive(
    assets,
    activeMimeTypes,
    (acc, { mimeType }) => [...acc, mimeType]
  );
  const tags: Array<{ isActive: boolean; value: string }> = getUniqueFiltersWithActive(
    assets,
    activeTags,
    (acc, { tags }) => (tags ? [...acc, ...tags] : acc)
  );

  return (
    <StyledContainer>
      <StyledSidebarGridContainer>
        <Sidebar mimeTypes={mimeTypes} onMimeTypeClick={onMimeTypeClick} onTagClick={onTagClick} tags={tags} />
        <MediaLibrary
          assets={filteredAssets}
          loading={loading}
          isModal={false}
          onSortChange={setSort}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </StyledSidebarGridContainer>
    </StyledContainer>
  );
};

function getUniqueFiltersWithActive(
  array: Array<any>,
  activeArray: Array<any>,
  reduceFn: (acc: Array<any>, cur: any) => Array<any>
): Array<{ isActive: boolean; value: any }> {
  return Array.from(new Set(array.reduce(reduceFn, [])))
    .filter(Boolean)
    .sort()
    .map((value) => ({ isActive: activeArray.indexOf(value) > -1, value }));
}

function onFilterClick(value: string, stateValue: Array<string>, setStateValue: (value: Array<string>) => void) {
  const index = stateValue.indexOf(value);

  if (index === -1) {
    return setStateValue([...stateValue, value]);
  }

  const newMimeTypes = [...stateValue];
  newMimeTypes.splice(index, 1);
  setStateValue(newMimeTypes);
}
