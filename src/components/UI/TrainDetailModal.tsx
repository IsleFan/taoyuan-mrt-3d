import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Paper,
  Grid
} from '@mui/material'
import {
  Close,
  Train,
  Speed,
  People,
  Schedule,
  LocationOn,
  Warning
} from '@mui/icons-material'
import { useRailwayStore } from '@/stores/RailwayStore'

const TrainDetailModal: React.FC = () => {
  const { trainDetails, isTrainDetailOpen, closeTrainDetail } = useRailwayStore()

  if (!trainDetails) return null

  const occupancyRate = (trainDetails.occupancy / trainDetails.capacity) * 100

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

  const getOccupancyLevel = (rate: number): { text: string; color: string } => {
    if (rate >= 90) return { text: '非常擁擠', color: '#f44336' }
    if (rate >= 70) return { text: '擁擠', color: '#ff9800' }
    if (rate >= 50) return { text: '適中', color: '#4caf50' }
    if (rate >= 30) return { text: '舒適', color: '#2196f3' }
    return { text: '空閒', color: '#9e9e9e' }
  }

  const occupancyLevel = getOccupancyLevel(occupancyRate)

  return (
    <Dialog
      open={isTrainDetailOpen}
      onClose={closeTrainDetail}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(22, 33, 62, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(79, 195, 247, 0.3)',
          borderRadius: 3
        }
      }}
    >
      <DialogTitle sx={{ color: '#4fc3f7', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Train sx={{ color: '#4fc3f7', marginRight: 2 }} />
            <Box>
              <Typography variant="h5" sx={{ color: '#4fc3f7' }}>
                {trainDetails.name}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: '#ccc' }}>
                列車詳細資訊
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={closeTrainDetail} sx={{ color: '#ccc' }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Status and Type */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Chip
                label={getTypeText(trainDetails.type)}
                size="medium"
                sx={{
                  backgroundColor: trainDetails.type === 'express' ? '#e91e63' : '#3f51b5',
                  color: '#fff'
                }}
              />
              <Chip
                label={getStatusText(trainDetails.status)}
                size="medium"
                sx={{
                  backgroundColor: getStatusColor(trainDetails.status),
                  color: '#fff'
                }}
              />
              {trainDetails.delay > 0 && (
                <Chip
                  icon={<Warning />}
                  label={`延誤 ${trainDetails.delay} 分鐘`}
                  size="medium"
                  sx={{
                    backgroundColor: '#ff9800',
                    color: '#fff'
                  }}
                />
              )}
            </Box>
          </Grid>

          {/* Current Status */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: 'rgba(79, 195, 247, 0.1)',
                border: '1px solid rgba(79, 195, 247, 0.3)'
              }}
            >
              <Typography variant="h6" sx={{ color: '#4fc3f7', mb: 2 }}>
                當前狀態
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Speed sx={{ color: '#fff', mr: 1 }} />
                <Typography variant="body1" sx={{ color: '#fff' }}>
                  速度: <span style={{ color: '#4fc3f7' }}>{trainDetails.speed} km/h</span>
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ color: '#fff', mr: 1 }} />
                <Typography variant="body1" sx={{ color: '#fff' }}>
                  下一站: <span style={{ color: '#4fc3f7' }}>{trainDetails.nextStation}</span>
                </Typography>
              </Box>

              {trainDetails.estimatedArrival && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Schedule sx={{ color: '#fff', mr: 1 }} />
                  <Typography variant="body1" sx={{ color: '#fff' }}>
                    預計抵達: <span style={{ color: '#4fc3f7' }}>
                      {trainDetails.estimatedArrival.toLocaleTimeString()}
                    </span>
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Passenger Information */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: 'rgba(79, 195, 247, 0.1)',
                border: '1px solid rgba(79, 195, 247, 0.3)'
              }}
            >
              <Typography variant="h6" sx={{ color: '#4fc3f7', mb: 2 }}>
                乘客資訊
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <People sx={{ color: '#fff', mr: 1 }} />
                <Typography variant="body1" sx={{ color: '#fff' }}>
                  載客率: <span style={{ color: occupancyLevel.color }}>
                    {occupancyRate.toFixed(1)}% ({occupancyLevel.text})
                  </span>
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={occupancyRate}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  mb: 1,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: occupancyLevel.color,
                    borderRadius: 6
                  }
                }}
              />

              <Typography variant="body2" sx={{ color: '#ccc' }}>
                {trainDetails.occupancy} / {trainDetails.capacity} 人
              </Typography>

              <Typography variant="body2" sx={{ color: '#ccc', mt: 1 }}>
                車廂容量: {trainDetails.capacity} 人
              </Typography>
            </Paper>
          </Grid>

          {/* Route Information */}
          {trainDetails.route && trainDetails.route.length > 0 && (
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(79, 195, 247, 0.1)',
                  border: '1px solid rgba(79, 195, 247, 0.3)'
                }}
              >
                <Typography variant="h6" sx={{ color: '#4fc3f7', mb: 2 }}>
                  行駛路線
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {trainDetails.route.map((station, index) => (
                    <React.Fragment key={station}>
                      <Chip
                        label={station}
                        size="small"
                        variant={station === trainDetails.nextStation ? 'filled' : 'outlined'}
                        sx={{
                          color: station === trainDetails.nextStation ? '#000' : '#fff',
                          backgroundColor: station === trainDetails.nextStation ? '#4fc3f7' : 'transparent',
                          borderColor: '#4fc3f7'
                        }}
                      />
                      {index < trainDetails.route.length - 1 && (
                        <Typography sx={{ color: '#ccc', alignSelf: 'center' }}>→</Typography>
                      )}
                    </React.Fragment>
                  ))}
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={closeTrainDetail}
          variant="contained"
          sx={{
            backgroundColor: '#4fc3f7',
            '&:hover': {
              backgroundColor: '#29b6f6'
            }
          }}
        >
          關閉
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TrainDetailModal