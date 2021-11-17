import { Asset } from '../types/Asset';
import { DraggableMediaItem } from './DraggableMediaItem';
import { formatDate, formatSize } from '../shared/utils';
import React, { MouseEvent } from 'react';
import styled from 'styled-components';
import { Label, Text, Box, Checkbox } from '@sanity/ui';
import { DocumentIcon } from '@sanity/icons';

interface Props {
  assets?: Array<Asset>;
  onDoubleClick: (asset: Asset) => void;
  onDragStart: (asset: Asset) => void;
  onMediaItemClick: (e: MouseEvent, asset: Asset) => void;
  selectedAssets: Array<Asset>;
  setIsDraggingMediaItem: (value: Boolean) => void;
}

const StyledThumbnailContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  height: 100px;
  margin: 0 20px 0 0;
  overflow: hidden;
  position: relative;
  width: 100px;
  border-radius: 5px;
  border: 1px solid whitesmoke;
  padding: 2px;
  background: white;
`;

const StyledFile = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  left: 0;
  line-height: 1.2;
  padding: 20px;
  position: absolute;
  top: 0;
  width: 100%;
  background: white;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 0;

  tbody tr:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, 0.01);
  }

  td:nth-of-type(2) {
    width: 120px;
    padding: 4px 10px;
  }
`;

const StyledTh = styled.th`
  text-align: left;
  padding: 10px 0;
`;

export const MediaList = ({
  assets = [],
  onDoubleClick,
  onDragStart,
  onMediaItemClick,
  selectedAssets,
  setIsDraggingMediaItem,
}: Props) => (
  <Box padding={3}>
    <StyledTable>
      <thead>
        <tr>
          {['', '', 'Title', 'Alt', 'Tags', 'Dimensions', 'Type', 'Size', 'Created at'].map((label) => (
            <StyledTh key={label}>
              <Label>{label}</Label>
            </StyledTh>
          ))}
        </tr>
      </thead>

      <tbody>
        {assets.map((asset: Asset) => {
          const {
            _createdAt,
            _type,
            alt,
            _id,
            extension,
            metadata,
            originalFilename,
            size,
            tags = [],
            title,
            url,
          } = asset;

          return (
            <tr key={_id} onClick={(e) => onMediaItemClick(e, asset)} onDoubleClick={() => onDoubleClick(asset)}>
              <td>
                <Checkbox
                  onClick={(e) => {
                    e.stopPropagation();
                    onMediaItemClick(e, asset);
                  }}
                  checked={selectedAssets.findIndex((selectedAsset) => _id === selectedAsset._id) > -1}
                />
              </td>
              <td>
                <DraggableMediaItem
                  _type={_type}
                  onDragEnd={() => setIsDraggingMediaItem(false)}
                  onDragStart={() => {
                    onDragStart(asset);
                    setIsDraggingMediaItem(true);
                  }}
                  selectedAmount={selectedAssets.length}
                  url={url}
                >
                  <StyledThumbnailContainer>
                    {_type === 'sanity.imageAsset' ? (
                      <img alt={alt} src={`${url}?w=100&h=100&fit=crop&auto=format&q=80`} loading="lazy" />
                    ) : (
                      <StyledFile>
                        <DocumentIcon style={{ width: 24, height: 24 }} />
                      </StyledFile>
                    )}
                  </StyledThumbnailContainer>
                </DraggableMediaItem>
              </td>
              <td>
                <Text size={1}>{title || originalFilename}</Text>
              </td>
              <td>
                <Text size={1}>{alt}</Text>
              </td>
              <td>
                <Text size={1} muted>
                  {tags?.join(', ')}
                </Text>
              </td>
              <td>
                <Text size={1}>
                  {metadata?.dimensions && `${metadata?.dimensions.width} x ${metadata?.dimensions.height}`}
                </Text>
              </td>
              <td>
                <Text size={1}>{extension.toUpperCase()}</Text>
              </td>
              <td>
                <Text size={1}>{formatSize(size)}</Text>
              </td>
              <td>
                <Text size={1}>{formatDate(_createdAt)}</Text>
              </td>
            </tr>
          );
        })}
      </tbody>
    </StyledTable>
  </Box>
);
