import { Asset } from './types/Asset';
import { AssetModal } from './components/AssetModal';
import { DeleteModal } from './components/DeleteModal';
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
  const [activeExtensions, setActiveExtensions] = useState<Array<string>>([]);
  const [activeTags, setActiveTags] = useState<Array<string>>([]);
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [assetsToDelete, setAssetsToDelete] = useState<Array<Asset> | null>(null);
  const [assetToEdit, setAssetToEdit] = useState<Asset | null>(null);
  const [filteredAssets, setFilteredAssets] = useState<Array<Asset>>(assets);
  const [loading, setLoading] = useState<Boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sort, setSort] = useState<sortOption>('date');

  useEffect(() => {
    let newFilteredAssets = [...assets];

    if (searchQuery && searchQuery !== '') {
      newFilteredAssets = newFilteredAssets.filter(
        ({ alt, originalFilename, tags }) =>
          originalFilename.toUpperCase().indexOf(searchQuery.toUpperCase()) > -1 ||
          (alt || '').toUpperCase().indexOf(searchQuery.toUpperCase()) > -1 ||
          (tags?.join(',') || '').toUpperCase().indexOf(searchQuery.toUpperCase()) > -1
      );
    }

    if (activeExtensions.length > 0) {
      newFilteredAssets = newFilteredAssets.filter(({ extension }) => activeExtensions.indexOf(extension) > -1);
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
  }, [assets, activeExtensions, activeTags, sort, searchQuery]);

  useEffect(() => {
    fetchAssets();
  }, []);

  async function fetchAssets() {
    try {
      setLoading(true);
      // @TODO: also fetch files, like pdfs or word docs
      const newAssets: Array<Asset> = await client.fetch(
        `*[_type == "sanity.imageAsset"] { _createdAt, _id, alt, extension, metadata, originalFilename, size, tags, url }`,
        {}
      );
      setAssets(newAssets);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function onUpload(files: FileList) {
    try {
      setLoading(true);
      await Promise.all(
        Array.from(files).map((file) => client.assets.upload(file.type.indexOf('image') > -1 ? 'image' : 'file', file))
      );
      await fetchAssets();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const onExtensionClick = (value: string) => onFilterClick(value, activeExtensions, setActiveExtensions);
  const onTagClick = (value: string) => onFilterClick(value, activeTags, setActiveTags);

  const extensions: Array<{ isActive: boolean; value: string }> = getUniqueFiltersWithActive(
    assets,
    activeExtensions,
    (acc, { extension }) => [...acc, extension]
  );

  const tags: Array<{ isActive: boolean; value: string }> = getUniqueFiltersWithActive(
    assets,
    activeTags,
    (acc, { tags }) => (tags ? [...acc, ...tags] : acc)
  );

  return (
    <StyledContainer>
      <StyledSidebarGridContainer>
        <Sidebar
          extensions={extensions}
          loading={loading}
          onExtensionClick={onExtensionClick}
          onTagClick={onTagClick}
          onUpload={onUpload}
          tags={tags}
        />
        <MediaLibrary
          assets={filteredAssets}
          isModal={false}
          loading={loading}
          onDelete={setAssetsToDelete}
          onEdit={setAssetToEdit}
          onSortChange={setSort}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </StyledSidebarGridContainer>
      {assetToEdit && (
        <AssetModal
          asset={assetToEdit}
          loading={loading}
          onClose={() => setAssetToEdit(null)}
          onSaveComplete={() => {
            setAssetToEdit(null);
            fetchAssets();
          }}
          setLoading={setLoading}
        />
      )}
      {assetsToDelete && (
        <DeleteModal
          assets={assetsToDelete}
          loading={loading}
          onClose={() => setAssetsToDelete(null)}
          onDeleteComplete={() => {
            setAssetsToDelete(null);
            fetchAssets();
          }}
          setLoading={setLoading}
        />
      )}
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

  const newValues = [...stateValue];
  newValues.splice(index, 1);
  setStateValue(newValues);
}
