import { Button } from './Button'
import { Loader } from './Loader'
import React, { Fragment } from 'react'
import styled from 'styled-components'

interface BottomBarProps {
  isModal: Boolean,
  loading: Boolean,
}

const StyledContainer = styled.div`
  align-items: center;
  border-top: solid 1px #222;
  display: flex;
  justify-content: space-between;
  padding: 40px;
`

const StyledItemsContainer = styled.div`
  display: flex;

  & > :not(:last-child) {
    margin: 0 20px 0 0;
  }
`

export const BottomBar = ({ isModal, loading }: BottomBarProps) => (
  <StyledContainer>
    <div>
      {loading && <Loader />}
    </div>

    <StyledItemsContainer>
      {isModal ? (
        <Fragment>
          <Button secondary onClick={() => alert('joe')}>Cancel</Button>
          <Button onClick={() => alert('joe')}>Insert</Button>
        </Fragment>
      ) : (
          <Fragment>
            <Button secondary onClick={() => alert('joe')}>Delete Image</Button>
            <Button secondary onClick={() => alert('joe')}>View Image</Button>
            <Button onClick={() => alert('joe')}>Edit Image</Button>
          </Fragment>
        )}
    </StyledItemsContainer>
  </StyledContainer>
)