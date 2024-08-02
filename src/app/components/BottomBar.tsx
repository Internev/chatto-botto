import React from 'react'
import styled from 'styled-components'
import AudioRecorder from '../recording/AudioRecorder'

const BottomBarContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 66px;
  border-top: 3px solid #ffffff;
  background: linear-gradient(135deg, #94efff 0%, #9effed 100%);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`

const BottomBar: React.FC = () => {
  return (
    <BottomBarContainer>
      <AudioRecorder />
    </BottomBarContainer>
  )
}

export default BottomBar
