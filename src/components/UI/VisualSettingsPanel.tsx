/**
 * Visual Settings Panel
 * Controls for day/night cycle and visual effects
 */

import React from 'react'
import {
  Typography,
  Paper,
  Slider,
  Switch,
  FormControlLabel,
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  Collapse,
} from '@mui/material'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import NightsStayIcon from '@mui/icons-material/NightsStay'
import WbTwilightIcon from '@mui/icons-material/WbTwilight'
import SettingsIcon from '@mui/icons-material/Settings'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useEnvironmentStore } from '@/stores/EnvironmentStore'

const VisualSettingsPanel: React.FC = () => {
  const [expanded, setExpanded] = React.useState(false)

  const {
    timeOfDay,
    autoProgressTime,
    setTimeOfDay,
    toggleAutoProgress,
    enableBloom,
    bloomIntensity,
    enableVignette,
    toggleBloom,
    setBloomIntensity,
    toggleVignette,
    showGrid,
    showBuildings,
    toggleGrid,
    toggleBuildings,
    setDayPreset,
    setNightPreset,
    setSunsetPreset,
  } = useEnvironmentStore()

  const formatTime = (time: number) => {
    const hours = Math.floor(time)
    const minutes = Math.floor((time % 1) * 60)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  const getTimeLabel = (time: number) => {
    if (time >= 5 && time < 7) return '黎明'
    if (time >= 7 && time < 12) return '上午'
    if (time >= 12 && time < 14) return '中午'
    if (time >= 14 && time < 17) return '下午'
    if (time >= 17 && time < 19) return '黃昏'
    return '夜晚'
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 100,
        left: 20,
        zIndex: 1000,
        pointerEvents: 'auto',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          backgroundColor: 'rgba(22, 33, 62, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(79, 195, 247, 0.3)',
          minWidth: 250,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SettingsIcon sx={{ color: '#4fc3f7', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ color: '#4fc3f7' }}>
              視覺設定
            </Typography>
          </div>
          <IconButton size="small" sx={{ color: '#4fc3f7' }}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>

        <Collapse in={expanded}>
          {/* Time Controls */}
          <div style={{ marginTop: 16 }}>
            <Typography variant="body2" sx={{ color: '#fff', mb: 1 }}>
              時間: {formatTime(timeOfDay)} ({getTimeLabel(timeOfDay)})
            </Typography>

            <Slider
              value={timeOfDay}
              min={0}
              max={24}
              step={0.5}
              onChange={(_, value) => setTimeOfDay(value as number)}
              sx={{
                color: '#4fc3f7',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#fff',
                },
              }}
            />

            {/* Time Presets */}
            <ButtonGroup size="small" fullWidth sx={{ mt: 1 }}>
              <Button
                onClick={setDayPreset}
                startIcon={<WbSunnyIcon />}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                白天
              </Button>
              <Button
                onClick={setSunsetPreset}
                startIcon={<WbTwilightIcon />}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                黃昏
              </Button>
              <Button
                onClick={setNightPreset}
                startIcon={<NightsStayIcon />}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                夜晚
              </Button>
            </ButtonGroup>

            <FormControlLabel
              control={
                <Switch
                  checked={autoProgressTime}
                  onChange={toggleAutoProgress}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#4fc3f7',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#4fc3f7',
                    },
                  }}
                />
              }
              label={
                <Typography variant="caption" sx={{ color: '#ccc' }}>
                  自動日夜循環
                </Typography>
              }
              sx={{ mt: 1 }}
            />
          </div>

          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

          {/* Visual Effects */}
          <Typography variant="body2" sx={{ color: '#fff', mb: 1 }}>
            視覺效果
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={enableBloom}
                onChange={toggleBloom}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#4fc3f7' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4fc3f7',
                  },
                }}
              />
            }
            label={
              <Typography variant="caption" sx={{ color: '#ccc' }}>
                發光效果 (Bloom)
              </Typography>
            }
          />

          {enableBloom && (
            <div style={{ marginLeft: 32, marginRight: 8 }}>
              <Typography variant="caption" sx={{ color: '#999' }}>
                強度: {bloomIntensity.toFixed(1)}
              </Typography>
              <Slider
                value={bloomIntensity}
                min={0}
                max={2}
                step={0.1}
                onChange={(_, value) => setBloomIntensity(value as number)}
                size="small"
                sx={{ color: '#4fc3f7' }}
              />
            </div>
          )}

          <FormControlLabel
            control={
              <Switch
                checked={enableVignette}
                onChange={toggleVignette}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#4fc3f7' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4fc3f7',
                  },
                }}
              />
            }
            label={
              <Typography variant="caption" sx={{ color: '#ccc' }}>
                暗角效果 (Vignette)
              </Typography>
            }
          />

          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

          {/* Environment */}
          <Typography variant="body2" sx={{ color: '#fff', mb: 1 }}>
            環境設定
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={showGrid}
                onChange={toggleGrid}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#4fc3f7' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4fc3f7',
                  },
                }}
              />
            }
            label={
              <Typography variant="caption" sx={{ color: '#ccc' }}>
                顯示網格
              </Typography>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={showBuildings}
                onChange={toggleBuildings}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#4fc3f7' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4fc3f7',
                  },
                }}
              />
            }
            label={
              <Typography variant="caption" sx={{ color: '#ccc' }}>
                顯示城市建築
              </Typography>
            }
          />
        </Collapse>
      </Paper>
    </div>
  )
}

export default VisualSettingsPanel
