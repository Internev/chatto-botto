import React from 'react'
import styled from 'styled-components'
import BottomBar from './components/BottomBar'
import MessageWindow from './components/MessageWindow'
import { AppProvider } from './context/AppContext'

const AppContainer = styled.div`
  width: 800px;
  height: 600px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #ffb8da 0%, #b7d3fb 100%);
`

const App = () => {
  return (
    <AppProvider>
      <AppContainer>
        <MessageWindow />
        <BottomBar />
      </AppContainer>
    </AppProvider>
  )
}

export default App
