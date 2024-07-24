import React from 'react'
import styled from 'styled-components'
import BottomBar from './components/BottomBar'
import MessageWindow from './components/MessageWindow'

const AppContainer = styled.div`
  width: 800px;
  height: 600px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #ffb8da 0%, #b7d3fb 100%);
`

const App = () => {
  return (
    <AppContainer>
      <MessageWindow />
      <BottomBar />
    </AppContainer>
  )
}

export default App
