import { Canvas } from '@react-three/fiber'
import Scene from '@/components/Scene/Scene'
import UIOverlay from '@/components/UI/UIOverlay'
import NetworkInitializer from '@/components/NetworkInitializer'
import { RailwayProvider } from '@/stores/RailwayStore'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4fc3f7',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#1a1a2e',
      paper: '#16213e',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RailwayProvider>
        <NetworkInitializer />
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
          <Canvas
            camera={{ position: [36, 25, 30], fov: 50 }}
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}
          >
            <Scene />
          </Canvas>
          <UIOverlay />
        </div>
      </RailwayProvider>
    </ThemeProvider>
  )
}

export default App