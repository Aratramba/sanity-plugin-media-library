import { acceptedFileTypes } from '../shared/acceptedFileTypes';
import { Button } from './Button';
import React, { useRef } from 'react';
import styled from 'styled-components';

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
      <Button disabled={disabled} grow onClick={() => inputRef?.current?.click()} icon="upload">
        Upload
      </Button>
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
