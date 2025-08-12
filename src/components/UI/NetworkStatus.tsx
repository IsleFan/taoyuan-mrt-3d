import React from 'react'
import { Box, Typography, Paper, Chip, LinearProgress } from '@mui/material'
import { RailwayNetwork } from '@/types/railway'

interface NetworkStatusProps {
  network: RailwayNetwork
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ network }) => {
  // Calculate network statistics
  const totalTrains = network.trains.length
  const runningTrains = network.trains.filter(t => t.status === 'running').length
  const totalSegments = network.segments.length
  const normalSegments = network.segments.filter(s => s.status === 'normal').length
  
  const operationalRate = totalSegments > 0 ? (normalSegments / totalSegments) * 100 : 0
  const trainServiceRate = totalTrains > 0 ? (runningTrains / totalTrains) * 100 : 0

  const getStatusChipColor = (count: number, total: number) => {
    const rate = count / total
    if (rate >= 0.9) return 'success'
    if (rate >= 0.7) return 'warning'
    return 'error'
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 20,
        right: 20,
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
          border: '1px solid rgba(79, 195, 247, 0.3)',
          minWidth: 280
        }}
      >
        <Typography variant="h6" sx={{ color: '#4fc3f7', mb: 2 }}>
          路網狀態
        </Typography>

        {/* Train Status */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#fff' }}>
              列車營運狀態
            </Typography>
            <Chip 
              label={`${runningTrains}/${totalTrains}`}
              size="small"
              color={getStatusChipColor(runningTrains, totalTrains)}
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={trainServiceRate}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: runningTrains === totalTrains ? '#4caf50' : '#ff9800',
              }
            }}
          />
          <Typography variant="caption" sx={{ color: '#ccc' }}>
            {trainServiceRate.toFixed(1)}% 服務中
          </Typography>
        </Box>

        {/* Segment Status */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#fff' }}>
              路段營運狀態
            </Typography>
            <Chip 
              label={`${normalSegments}/${totalSegments}`}
              size="small"
              color={getStatusChipColor(normalSegments, totalSegments)}
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={operationalRate}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: normalSegments === totalSegments ? '#4caf50' : '#ff9800',
              }
            }}
          />
          <Typography variant="caption" sx={{ color: '#ccc' }}>
            {operationalRate.toFixed(1)}% 正常營運
          </Typography>
        </Box>

        {/* Real-time Updates */}
        <Box>
          <Typography variant="body2" sx={{ color: '#4fc3f7', mb: 1 }}>
            即時資訊
          </Typography>
          
          {network.trains.filter(t => t.delay > 0).length > 0 && (
            <Typography variant="caption" sx={{ color: '#ffeb3b', display: 'block' }}>
              ⚠️ {network.trains.filter(t => t.delay > 0).length} 班列車延誤
            </Typography>
          )}
          
          {network.segments.filter(s => s.status === 'maintenance').length > 0 && (
            <Typography variant="caption" sx={{ color: '#ff9800', display: 'block' }}>
              🔧 {network.segments.filter(s => s.status === 'maintenance').length} 路段維護中
            </Typography>
          )}
          
          {network.segments.filter(s => s.status === 'closed').length > 0 && (
            <Typography variant="caption" sx={{ color: '#f44336', display: 'block' }}>
              ❌ {network.segments.filter(s => s.status === 'closed').length} 路段暫停服務
            </Typography>
          )}
          
          {network.trains.filter(t => t.delay > 0).length === 0 && 
           network.segments.filter(s => s.status !== 'normal').length === 0 && (
            <Typography variant="caption" sx={{ color: '#4caf50', display: 'block' }}>
              ✅ 路網運作正常
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  )
}

export default NetworkStatus