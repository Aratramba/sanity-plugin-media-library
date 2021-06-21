import { acceptedFileTypes } from '../shared/acceptedFileTypes';
import React, { useRef } from 'react';
import styled from 'styled-components';
import { Button } from '@sanity/ui';
import { UploadIcon } from '@sanity/icons';

const StyledInput = styled.input`
  left: -9999999999px;
  position: absolute;
  visibility: hidden;
`;

interface Props {
  disabled: Boolean;
  onUpload: (files: FileList) => void;
}

export const UploadButton = ({ disabled, onUpload }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <Button
        style={{ width: '100%' }}
        fontSize={[2]}
        icon={UploadIcon}
        padding={[3, 3, 4]}
        text="Upload"
        tone="primary"
        disabled={Boolean(disabled)}
        onClick={() => inputRef?.current?.click()}
      />
      <StyledInput
        accept={acceptedFileTypes.join(',')}
        multiple
        onChange={(e) => onUpload(e.target.files as FileList)}
        ref={inputRef}
        type="file"
      />
    </div>
  );
};
