import { Icon } from './Icon';
import { IconTypes } from '../types/IconTypes';
import React from 'react';
import styled from 'styled-components';

type Props = {
  children: React.ReactNode;
  disabled?: Boolean;
  grow?: Boolean;
  icon?: IconTypes;
  onClick?: (event: React.MouseEvent) => void;
  secondary?: Boolean;
};

const StyledButton = styled.button<{ disabled?: Boolean; grow?: Boolean; secondary?: Boolean }>`
  background-color: ${({ secondary, theme }) =>
    secondary ? theme.buttonSecondaryBackgroundColor : theme.buttonPrimaryBackgroundColor};
  border-radius: ${({ theme }) => theme.appBorderRadius};
  border: solid 1px
    ${({ secondary, theme }) => (secondary ? theme.buttonSecondaryBorderColor : theme.buttonPrimaryBorderColor)};
  cursor: pointer;
  color: ${({ secondary, theme }) => (secondary ? theme.buttonSecondaryColor : theme.buttonPrimaryColor)};
  font-family: ${({ theme }) => theme.appFontFamily};
  font-size: 16px;
  font-weight: 500;
  line-height: 1.1;
  padding: 12px 16px;
  width: ${({ grow }) => (grow ? '100%' : 'auto')};

  &:disabled,
  &[disabled] {
    opacity: 0.4;
  }
`;

const StyledButtonInner = styled.span<{ grow?: Boolean }>`
  align-items: center;
  display: flex;
  justify-content: ${({ grow }) => (grow ? 'center' : 'flex-start')};

  & svg {
    height: 20px;
    margin-right: 10px;
    width: 20px;
  }
`;

export const Button = ({ children, disabled, grow, icon, onClick, secondary }: Props) => (
  <StyledButton disabled={!!disabled} grow={grow} onClick={onClick} secondary={secondary}>
    <StyledButtonInner grow={grow}>
      {icon && <Icon type={icon} />}
      {children}
    </StyledButtonInner>
  </StyledButton>
);
