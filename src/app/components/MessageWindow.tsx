import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { MessageDisplay } from './MessageDisplay'

const MessageWindowContainer = styled.div`
  top: 0;
  max-height: 500px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
  padding: 50px 10px;
  flex: 1;
`

const MessageWindow: React.FC = () => {
  return (
    <MessageWindowContainer>
      <MessageDisplay />
    </MessageWindowContainer>
  )
}

export default MessageWindow
