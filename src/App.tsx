import { acceptedFileTypes } from './shared/acceptedFileTypes';
import { Asset } from './types/Asset';
import { AssetModal } from './components/AssetModal';
import { customFields } from './config';
import { DeleteModal } from './components/DeleteModal';
import { MediaLibrary } from './components/MediaLibrary';
import { Sidebar } from './components/Sidebar';
import { SortOption } from './types/SortOption';
import { UploadDropArea } from './components/UploadDropArea';
import sanityClient from 'part:@sanity/base/client';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card, useToast } from '@sanity/ui';
import { ToolType } from './types/ToolType';
const client = sanityClient.withConfig({ apiVersion: '2021-06-19' });

type Props = {
  onClose?: () => void;
  onSelect?: (assets: Array<any>) => void;
  selectedAssets?: Asset[];
  tool?: string;
  mode?: ToolType;
};

const StyledContainer = styled.div`
  background-color: var(--white);
  color: var(--body-text);
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;

  & *,
  & *:before,
  & *:after {
    box-sizing: border-box;
  }
`;

const StyledSidebarGridContainer = styled.div`
  display: flex;
  height: 100%;
`;

export const App = ({ onClose, onSelect, selectedAssets, tool, mode }: Props) => {
  const [activeExtensions, setActiveExtensions] = useState<Array<string>>([]);
  const [activeTags, setActiveTags] = useState<Array<string>>([]);
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [assetsToDelete, setAssetsToDelete] = useState<Array<Asset> | null>(null);
  const [assetToEdit, setAssetToEdit] = useState<Asset | null>(null);
  const [filteredAssets, setFilteredAssets] = useState<Array<Asset>>(assets);
  const [isDraggingMediaItem, setIsDraggingMediaItem] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(true);
  const [localSelectedAssets, setLocalSelectedAssets] = useState<Array<Asset>>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sort, setSort] = useState<SortOption>('date');
  const toast = useToast();

  const types = tool ? '"sanity.imageAsset", "sanity.fileAsset"' : '"sanity.imageAsset"';
  const includedFields = [
    '_createdAt',
    '_id',
    '_type',
    'alt',
    'extension',
    'metadata',
    'originalFilename',
    'title',
    'size',
    'tags',
    'url',
    '"usedBy": *[references(^._id)] { _id, _type }',
    ...customFields.map(({ name }: { name: string }) => name),
  ];

  const query = `*[_type in [${types}]] { ${includedFields.join(',')} }`;

  useEffect(() => {
    let newFilteredAssets = [...assets];

    if (searchQuery && searchQuery !== '') {
      newFilteredAssets = newFilteredAssets.filter(({ alt = '', originalFilename = '', title = '', tags = [] }) =>
        [originalFilename, title, alt, tags?.join('')].some(
          (value) => value?.toUpperCase().indexOf(searchQuery.toUpperCase()) > -1
        )
      );
    }

    if (activeExtensions.length > 0) {
      newFilteredAssets = newFilteredAssets.filter(({ extension }) => activeExtensions.indexOf(extension) > -1);
    }

    if (activeTags.length > 0) {
      newFilteredAssets = newFilteredAssets.filter(
        ({ tags, usedBy }) =>
          tags?.some((tag) => activeTags.indexOf(tag) > -1) ||
          (activeTags.indexOf('used') > -1 && usedBy.length) ||
          (activeTags.indexOf('unused') > -1 && !usedBy.length)
      );
    }

    if (sort === 'date') {
      newFilteredAssets.sort((a, b) => (a._createdAt > b._createdAt ? -1 : 1));
    }

    if (sort === 'az') {
      newFilteredAssets.sort((a, b) => (a.title || a.originalFilename).localeCompare(b.title || b.originalFilename));
    }

    if (sort === 'za') {
      newFilteredAssets.sort((a, b) => (b.title || b.originalFilename).localeCompare(a.title || a.originalFilename));
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

  useEffect(subscribeToAssetChanges, []);
  useEffect(() => {
    fetchAssets();
  }, []);

  async function fetchAssets() {
    try {
      setLoading(true);
      const newAssets: Array<Asset> = await client.fetch(query, {});
      setAssets(newAssets);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  }

  function subscribeToAssetChanges() {
    const subscription = client
      .listen(query)
      .subscribe(
        ({
          documentId,
          result,
          transition,
        }: {
          documentId: string;
          result: Asset;
          transition: 'disappear' | 'update' | 'appear';
        }) => {
          if (transition === 'disappear') {
            return setAssets((assets) => [...assets].filter(({ _id }) => _id !== documentId));
          }

          if (transition === 'update') {
            return setAssets((assets) => [...assets].map((asset) => (asset._id === documentId ? result : asset)));
          }

          if (transition === 'appear') {
            return setAssets((assets) => [...assets, result]);
          }
        }
      );

    return () => subscription.unsubscribe();
  }

  async function onUpload(files: FileList) {
    try {
      setLoading(true);

      const filesWithAllowedFileType: Array<File> = Array.from(files).filter(({ type }) =>
        acceptedFileTypes.some((fileType) => new RegExp(fileType, 'gi').test(type))
      );

      const notAllowedFiles = Array.from(files).filter((file) => filesWithAllowedFileType.indexOf(file) === -1);
      notAllowedFiles.forEach(({ name }) => {
        handleError(`File '${name}' will not be uploaded because its filetype is not supported.`);
      });

      await Promise.all(
        filesWithAllowedFileType.map((file) =>
          client.assets.upload(file.type.indexOf('image') > -1 ? 'image' : 'file', file)
        )
      );
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
    toast.push({
      status: 'error',
      title: error.toString(),
    });
  }

  const onExtensionClick = (value: string) => onFilterClick(value, activeExtensions, setActiveExtensions);
  const onTagClick = (value: string) => onFilterClick(value, activeTags, setActiveTags);

  function onClearFilters() {
    setActiveExtensions([]);
    setActiveTags([]);
  }

  async function onTagDrop(tag: string) {
    try {
      if (loading || localSelectedAssets.length === 0) {
        return;
      }

      setLoading(true);

      const idsAndTags = localSelectedAssets.map(({ _id, tags }) => ({ _id, tags }));
      const idsWithNewTags = idsAndTags.map(({ _id, tags }) => ({
        _id,
        tags: tags?.includes(tag) ? tags : [...(tags || []), tag],
      }));

      await Promise.all(idsWithNewTags.map(({ _id, tags }) => client.patch(_id).set({ tags }).commit()));
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  }

  const extensions: Array<{ isActive: boolean; value: string }> = getUniqueFiltersWithActive(
    assets,
    activeExtensions,
    (acc, { extension }) => [...acc, extension]
  );

  const tags: Array<{ isActive: boolean; value: string }> = [
    { isActive: activeTags.indexOf('used') > -1, value: 'used' },
    { isActive: activeTags.indexOf('unused') > -1, value: 'unused' },
    ...getUniqueFiltersWithActive(assets, activeTags, (acc, { tags }) => (tags ? [...acc, ...tags] : acc)),
  ];

  return (
    <StyledContainer>
      <Card style={{ height: '100%' }}>
        <UploadDropArea disabled={isDraggingMediaItem} loading={loading} onUpload={onUpload}>
          <StyledSidebarGridContainer>
            {mode === 'tool' && (
              <Sidebar
                extensions={extensions}
                loading={loading}
                onClearFilters={onClearFilters}
                onExtensionClick={onExtensionClick}
                onTagClick={onTagClick}
                onTagDrop={onTagDrop}
                onUpload={onUpload}
                tags={tags}
              />
            )}
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
              setIsDraggingMediaItem={setIsDraggingMediaItem}
              setSearchQuery={setSearchQuery}
              setSelectedAssets={setLocalSelectedAssets}
              mode={mode}
            />
          </StyledSidebarGridContainer>
          {mode === 'tool' && (
            <>
              {assetToEdit && (
                <AssetModal
                  asset={assetToEdit}
                  handleError={handleError}
                  loading={loading}
                  onClose={() => setAssetToEdit(null)}
                  onSaveComplete={() => {
                    setAssetToEdit(null);
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
                  }}
                  setLoading={setLoading}
                />
              )}
            </>
          )}
        </UploadDropArea>
      </Card>
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
