import { Icon } from './Icon';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  position: fixed;
  bottom: 100px;
  right: 100px;
  z-index: 100;
`;

const StyledNotification = styled.div`
  background-color: ${({ theme }) => theme.errorNotificationBackgroundColor};
  border-radius: ${({ theme }) => theme.appBorderRadius};
  color: ${({ theme }) => theme.errorNotifcationTextColor};
  display: flex;
  font-family: ${({ theme }) => theme.appFontFamily};
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  max-width: 500px;
  padding: 20px;

  & strong {
    display: block;
    font-weight: 500;
    margin: 0 0 0.5em;
  }
`;

const Closebutton = styled.button`
  background-color: transparent;
  border: 0;
  cursor: pointer;
  height: 20px;
  outline: 0;
  padding: 0;
  width: 20px;

  & svg {
    fill: ${({ theme }) => theme.errorNotificationCloseColor};
    height: 20px;
    width: 20px;
  }
`;

interface Props {
  errors: Array<string>;
  removeError: (error: string) => void;
}

interface NotificationProps {
  children: ReactNode;
  onClose: () => void;
}

export const ErrorNotifications = ({ errors, removeError }: Props) => (
  <StyledContainer>
    {errors.map((message, index) => (
      <Notification key={index} onClose={() => removeError(message)}>
        {message}
      </Notification>
    ))}
  </StyledContainer>
);

const Notification = ({ children, onClose }: NotificationProps) => (
  <StyledNotification>
    <div>
      <strong>Something went wrong:</strong>
      {children}
    </div>
    <Closebutton onClick={() => onClose()}>
      <Icon type="close" />
    </Closebutton>
  </StyledNotification>
);
