import { Button } from './Button';
import React, { useRef } from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  left: -9999999999px;
  position: absolute;
  visibility: hidden;
`;

interface Props {
  onUpload: (files: FileList) => void;
}

export const UploadButton = ({ onUpload }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <Button grow onClick={() => inputRef?.current?.click()} icon="upload">
        Upload
      </Button>
      <StyledInput
        accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf, image/*"
        multiple
        onChange={(e) => onUpload(e.target.files as FileList)}
        ref={inputRef}
        type="file"
      />
    </div>
  );
};
