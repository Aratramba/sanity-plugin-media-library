import { acceptedFileTypes } from './shared/acceptedFileTypes';
import { Asset } from './types/Asset';
import { AssetModal } from './components/AssetModal';
import { DeleteModal } from './components/DeleteModal';
import { DragArea } from './components/DragArea';
import { ErrorNotifications } from './components/ErrorNotifications';
import { MediaLibrary } from './components/MediaLibrary';
import { Sidebar } from './components/Sidebar';
import { SortOption } from './types/SortOption';
import client from 'part:@sanity/base/client';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

type Props = {
  onClose?: () => void;
  onSelect?: (assets: Array<any>) => void;
  selectedAssets?: Asset[];
  tool?: string;
};

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

export const App = ({ onClose, onSelect, selectedAssets, tool }: Props) => {
  const [activeExtensions, setActiveExtensions] = useState<Array<string>>([]);
  const [activeTags, setActiveTags] = useState<Array<string>>([]);
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [assetsToDelete, setAssetsToDelete] = useState<Array<Asset> | null>(null);
  const [assetToEdit, setAssetToEdit] = useState<Asset | null>(null);
  const [errors, setErrors] = useState<Array<string>>([]);
  const [filteredAssets, setFilteredAssets] = useState<Array<Asset>>(assets);
  const [loading, setLoading] = useState<Boolean>(true);
  const [localSelectedAssets, setLocalSelectedAssets] = useState<Array<Asset>>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sort, setSort] = useState<SortOption>('date');

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
      newFilteredAssets.sort((a, b) => (a.originalFilename.localeCompare(b.originalFilename) ? -1 : 1));
    }

    if (sort === 'za') {
      newFilteredAssets.sort((a, b) => (a.originalFilename.localeCompare(b.originalFilename) ? 1 : -1));
    }

    setFilteredAssets(newFilteredAssets);

    // Update selected assets so it does not include assets that are no longer visible
    const newAssetIds = newFilteredAssets.map(({ _id }) => _id);
    const newAssetsToSelect = localSelectedAssets.filter(({ _id }) => newAssetIds.indexOf(_id) > -1);
    setLocalSelectedAssets(newAssetsToSelect);
  }, [assets, activeExtensions, activeTags, sort, searchQuery]);

  useEffect(() => {
    if (assets.length === 0 || localSelectedAssets.length > 0 || selectedAssets?.length === 0) {
      return;
    }

    const selectedAssetsIds = (selectedAssets || []).map(({ _id }) => _id);
    const assetsToSelect = [...assets].filter(({ _id }) => selectedAssetsIds.indexOf(_id) > -1);
    setLocalSelectedAssets(assetsToSelect);
  }, [assets, selectedAssets]);

  useEffect(() => {
    fetchAssets();
  }, []);

  async function fetchAssets() {
    try {
      setLoading(true);
      const types = tool ? '"sanity.imageAsset", "sanity.fileAsset"' : '"sanity.imageAsset"';
      const newAssets: Array<Asset> = await client.fetch(
        `*[_type in [${types}]] { _createdAt, _id, _type, alt, extension, metadata, originalFilename, size, tags, url }`,
        {}
      );
      setAssets(newAssets);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  }

  async function onUpload(files: FileList) {
    try {
      setLoading(true);

      const filesWithAllowedFileType: Array<File> = Array.from(files).filter(({ name, type }) =>
        acceptedFileTypes.some((fileType) => {
          const isAccepted = new RegExp(fileType, 'gi').test(type);

          if (!isAccepted) {
            handleError(`File '${name}' will not be uploaded because its filetype is not supported.`);
          }

          return isAccepted;
        })
      );

      await Promise.all(
        filesWithAllowedFileType.map((file) =>
          client.assets.upload(file.type.indexOf('image') > -1 ? 'image' : 'file', file)
        )
      );
      await fetchAssets();
    } catch (e: any) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(selectedAssets: Array<Asset>) {
    if (onSelect && selectedAssets.length > 0) {
      const assetsWithDocumentIds = selectedAssets.map(({ _id }) => ({ kind: 'assetDocumentId', value: _id }));
      onSelect(assetsWithDocumentIds);
    }
  }

  function handleError(error: any) {
    console.error(error);
    setErrors([...errors, error.toString()]);
  }

  function onRemoveError(error: string) {
    const index = errors.indexOf(error);
    const newErrors = [...errors];
    newErrors.splice(index, 1);
    setErrors(newErrors);
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
      <DragArea loading={loading} onUpload={onUpload}>
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
            handleSelect={handleSelect}
            isAssetSource={!tool}
            loading={loading}
            onClose={onClose}
            onDelete={setAssetsToDelete}
            onEdit={setAssetToEdit}
            onSortChange={setSort}
            searchQuery={searchQuery}
            selectedAssets={localSelectedAssets}
            setSearchQuery={setSearchQuery}
            setSelectedAssets={setLocalSelectedAssets}
          />
        </StyledSidebarGridContainer>
        {assetToEdit && (
          <AssetModal
            asset={assetToEdit}
            handleError={handleError}
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
            handleError={handleError}
            loading={loading}
            onClose={() => setAssetsToDelete(null)}
            onDeleteComplete={() => {
              setAssetsToDelete(null);
              fetchAssets();
            }}
            setLoading={setLoading}
          />
        )}
        {errors && <ErrorNotifications errors={errors} removeError={onRemoveError} />}
      </DragArea>
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
