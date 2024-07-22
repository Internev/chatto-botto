import React from 'react'
import styled from 'styled-components'
import BottomBar from './components/BottomBar'

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
      <BottomBar />
    </AppContainer>
  )
}

export default App
