import React, { useState, useEffect } from 'react'
import { Box, Typography, Paper, Chip } from '@mui/material'
import { Train } from '@/types/railway'

interface HoverInfoProps {
  train: Train
}

const HoverInfo: React.FC<HoverInfoProps> = ({ train }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'running':
        return '#4caf50'
      case 'stopped':
        return '#ff9800'
      case 'maintenance':
        return '#f44336'
      default:
        return '#9e9e9e'
    }
  }

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'running':
        return '營運中'
      case 'stopped':
        return '停駛'
      case 'maintenance':
        return '維護中'
      default:
        return '未知'
    }
  }

  const getTypeText = (type: string): string => {
    switch (type) {
      case 'express':
        return '直達車'
      case 'commuter':
        return '普通車'
      default:
        return type
    }
  }

  const occupancyRate = (train.occupancy / train.capacity) * 100

  return (
    <Box
      sx={{
        position: 'fixed',
        left: mousePos.x + 15,
        top: mousePos.y - 100,
        zIndex: 2000,
        pointerEvents: 'none'
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 2,
          backgroundColor: 'rgba(22, 33, 62, 0.95)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(79, 195, 247, 0.5)',
          borderRadius: 2,
          minWidth: 250,
          maxWidth: 300
        }}
      >
        <Typography variant="h6" sx={{ color: '#4fc3f7', mb: 1 }}>
          {train.name}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Chip 
            label={getTypeText(train.type)}
            size="small"
            sx={{ 
              backgroundColor: train.type === 'express' ? '#e91e63' : '#3f51b5',
              color: '#fff'
            }}
          />
          <Chip 
            label={getStatusText(train.status)}
            size="small"
            sx={{ 
              backgroundColor: getStatusColor(train.status),
              color: '#fff'
            }}
          />
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" sx={{ color: '#fff' }}>
            速度: <span style={{ color: '#4fc3f7' }}>{train.speed} km/h</span>
          </Typography>
          <Typography variant="body2" sx={{ color: '#fff' }}>
            下一站: <span style={{ color: '#4fc3f7' }}>{train.nextStation}</span>
          </Typography>
          
          {train.delay > 0 && (
            <Typography variant="body2" sx={{ color: '#ffeb3b' }}>
              延誤: {train.delay} 分鐘
            </Typography>
          )}
        </Box>

        <Box>
          <Typography variant="body2" sx={{ color: '#fff', mb: 0.5 }}>
            載客率: {occupancyRate.toFixed(1)}%
          </Typography>
          <Box 
            sx={{ 
              height: 6, 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                height: '100%', 
                width: `${occupancyRate}%`,
                backgroundColor: occupancyRate > 80 ? '#f44336' : 
                                occupancyRate > 60 ? '#ff9800' : '#4caf50',
                transition: 'width 0.3s ease'
              }}
            />
          </Box>
          <Typography variant="caption" sx={{ color: '#ccc' }}>
            {train.occupancy}/{train.capacity} 人
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ color: '#999', display: 'block', mt: 1 }}>
          點擊查看詳細資訊
        </Typography>
      </Paper>
    </Box>
  )
}

export default HoverInfo