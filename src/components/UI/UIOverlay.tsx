import React from 'react'
import { Box, Typography, Paper, Chip } from '@mui/material'
import { useRailwayStore } from '@/stores/RailwayStore'
import TrainDetailModal from './TrainDetailModal'
import NetworkStatus from './NetworkStatus'
import HoverInfo from './HoverInfo'

const UIOverlay: React.FC = () => {
  const { network, hoveredTrain, isTrainDetailOpen } = useRailwayStore()

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 1000,
          pointerEvents: 'auto'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 2,
            backgroundColor: 'rgba(22, 33, 62, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(79, 195, 247, 0.3)'
          }}
        >
          <Typography variant="h5" sx={{ color: '#4fc3f7', fontWeight: 'bold' }}>
            桃園機場捷運 3D 路網圖
          </Typography>
          <Typography variant="subtitle2" sx={{ color: '#cccccc' }}>
            Taoyuan Airport MRT 3D Network
          </Typography>
        </Paper>
      </Box>

      {/* Network Status Panel */}
      {network && <NetworkStatus network={network} />}

      {/* Hover Information */}
      {hoveredTrain && <HoverInfo train={hoveredTrain} />}

      {/* Control Instructions */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          zIndex: 1000,
          pointerEvents: 'auto'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 2,
            backgroundColor: 'rgba(22, 33, 62, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(79, 195, 247, 0.3)',
            maxWidth: 300
          }}
        >
          <Typography variant="h6" sx={{ color: '#4fc3f7', mb: 1 }}>
            控制說明
          </Typography>
          <Typography variant="body2" sx={{ color: '#cccccc', mb: 0.5 }}>
            • 滑鼠拖拽：旋轉視角
          </Typography>
          <Typography variant="body2" sx={{ color: '#cccccc', mb: 0.5 }}>
            • 滑鼠滾輪：縮放
          </Typography>
          <Typography variant="body2" sx={{ color: '#cccccc', mb: 0.5 }}>
            • 點擊列車：查看詳細資訊
          </Typography>
          <Typography variant="body2" sx={{ color: '#cccccc' }}>
            • 點擊路段：切換狀態
          </Typography>
        </Paper>
      </Box>

      {/* Legend */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          pointerEvents: 'auto'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 2,
            backgroundColor: 'rgba(22, 33, 62, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(79, 195, 247, 0.3)',
            minWidth: 200
          }}
        >
          <Typography variant="h6" sx={{ color: '#4fc3f7', mb: 1 }}>
            圖例
          </Typography>
          
          <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle2" sx={{ color: '#fff', mb: 0.5 }}>
              路段狀態:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              <Chip label="正常" size="small" sx={{ backgroundColor: '#4fc3f7', color: '#fff' }} />
              <Chip label="維護" size="small" sx={{ backgroundColor: '#ff9800', color: '#fff' }} />
              <Chip label="延誤" size="small" sx={{ backgroundColor: '#ffeb3b', color: '#000' }} />
              <Chip label="關閉" size="small" sx={{ backgroundColor: '#f44336', color: '#fff' }} />
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ color: '#fff', mb: 0.5 }}>
              車站類型:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              <Chip label="一般" size="small" sx={{ backgroundColor: '#2196f3', color: '#fff' }} />
              <Chip label="轉乘" size="small" sx={{ backgroundColor: '#4caf50', color: '#fff' }} />
              <Chip label="終點" size="small" sx={{ backgroundColor: '#f44336', color: '#fff' }} />
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Train Detail Modal */}
      {isTrainDetailOpen && <TrainDetailModal />}
    </>
  )
}

export default UIOverlay