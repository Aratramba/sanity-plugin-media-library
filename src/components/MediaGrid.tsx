import { Asset } from '../types/Asset';
import { DraggableMediaItem } from './DraggableMediaItem';
import React, { MouseEvent } from 'react';
import styled from 'styled-components';
import { Flex, Card, Text, Tooltip, Box } from '@sanity/ui';
import { DocumentIcon } from '@sanity/icons';

interface Props {
  assets?: Array<Asset>;
  onDoubleClick: (asset: Asset) => void;
  onDragStart: (asset: Asset) => void;
  onMediaItemClick: (e: MouseEvent, asset: Asset) => void;
  selectedAssets: Array<Asset>;
  setIsDraggingMediaItem: (value: Boolean) => void;
}

const StyledMediaInfo = styled.div`
  padding: 30px 10px;
  text-align: center;
  width: 150px;
  height: 150px;
  max-width: 100%;
  max-height: 100%;
  border: 1px solid whitesmoke;
  border-radius: 5px;
  overflow: hidden;
`;

const StyledThumbnail = styled.img`
  display: block;
  border-radius: 5px;
  max-width: 150px;
  max-height: 150px;
  width: 150px;
  height: 150px;
  border: 1px solid whitesmoke;
  padding: 2px;
`;

const StyledFilename = styled.span`
  word-break: break-all;
`;

export const MediaGrid = ({
  assets = [],
  onDoubleClick,
  onDragStart,
  onMediaItemClick,
  selectedAssets,
  setIsDraggingMediaItem,
}: Props) => (
  <Flex wrap="wrap" gap={3} padding={3}>
    {assets.map((asset) => (
      <DraggableMediaItem
        key={asset._id}
        _type={asset._type}
        onDragEnd={() => setIsDraggingMediaItem(false)}
        onDragStart={() => {
          onDragStart(asset);
          setIsDraggingMediaItem(true);
        }}
        selectedAmount={selectedAssets.length}
        url={asset.url}
      >
        <Card
          style={{
            outlineOffset: -4,
            outline: selectedAssets.findIndex(({ _id }) => _id === asset._id) > -1 ? '4px solid currentColor' : 0,
          }}
          onClick={(e) => onMediaItemClick(e, asset)}
          onDoubleClick={() => onDoubleClick(asset)}
        >
          {asset._type === 'sanity.imageAsset' ? (
            <Tooltip
              portal={true}
              content={
                <Box padding={2}>
                  <Text muted size={1}>
                    {asset.title || asset.originalFilename}
                  </Text>
                </Box>
              }
              fallbackPlacements={['top', 'bottom']}
              placement="top"
            >
              <StyledThumbnail
                alt={asset.alt}
                src={`${asset.url}?w=150&h=150&fit=crop&auto=format&q=80`}
                loading="lazy"
              />
            </Tooltip>
          ) : (
            <StyledMediaInfo>
              <DocumentIcon />
              <Text muted size={1}>
                <StyledFilename>{asset.title || asset.originalFilename}</StyledFilename>
              </Text>
            </StyledMediaInfo>
          )}
        </Card>
      </DraggableMediaItem>
    ))}
  </Flex>
);
