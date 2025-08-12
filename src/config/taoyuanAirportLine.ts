import { RailwayNetwork } from '@/types/railway'

export const taoyuanAirportLineNetwork: RailwayNetwork = {
  id: 'taoyuan-airport-line',
  name: '桃園機場捷運',
  stations: [
    {
      id: 'A1',
      name: '台北車站',
      nameEn: 'Taipei Main Station',
      position: { x: 0, y: 0, z: 0 },
      type: 'terminal'
    },
    {
      id: 'A2',
      name: '三重',
      nameEn: 'Sanchong',
      position: { x: 2, y: 0, z: -1 },
      type: 'station'
    },
    {
      id: 'A3',
      name: '新北產業園區',
      nameEn: 'New Taipei Industrial Park',
      position: { x: 4, y: 0, z: -2 },
      type: 'station'
    },
    {
      id: 'A4',
      name: '新莊副都心',
      nameEn: 'Xinzhuang',
      position: { x: 6, y: 0, z: -3 },
      type: 'interchange'
    },
    {
      id: 'A5',
      name: '泰山',
      nameEn: 'Taishan',
      position: { x: 8, y: 0, z: -4 },
      type: 'station'
    },
    {
      id: 'A6',
      name: '泰山貴和',
      nameEn: 'Taishan Guihe',
      position: { x: 10, y: 0, z: -5 },
      type: 'station'
    },
    {
      id: 'A7',
      name: '體育大學',
      nameEn: 'Sports University',
      position: { x: 12, y: 0, z: -6 },
      type: 'station'
    },
    {
      id: 'A8',
      name: '長庚醫院',
      nameEn: 'Chang Gung Memorial Hospital',
      position: { x: 14, y: 0, z: -7 },
      type: 'station'
    },
    {
      id: 'A9',
      name: '林口',
      nameEn: 'Linkou',
      position: { x: 16, y: 0, z: -8 },
      type: 'station'
    },
    {
      id: 'A10',
      name: '山鼻',
      nameEn: 'Shanbi',
      position: { x: 18, y: 0, z: -9 },
      type: 'station'
    },
    {
      id: 'A11',
      name: '坑口',
      nameEn: 'Kengkou',
      position: { x: 20, y: 0, z: -10 },
      type: 'station'
    },
    {
      id: 'A12',
      name: '機場第一航廈',
      nameEn: 'Airport Terminal 1',
      position: { x: 22, y: 0, z: -11 },
      type: 'terminal'
    },
    {
      id: 'A13',
      name: '機場第二航廈',
      nameEn: 'Airport Terminal 2',
      position: { x: 24, y: 0, z: -12 },
      type: 'terminal'
    }
  ],
  segments: [
    // Upward segments (A1 to A13)
    {
      id: 'A1-A2-up',
      startStationId: 'A1',
      endStationId: 'A2',
      direction: 'up',
      points: [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: -0.5 },
        { x: 2, y: 0, z: -1 }
      ],
      color: '#4fc3f7',
      status: 'normal'
    },
    {
      id: 'A2-A3-up',
      startStationId: 'A2',
      endStationId: 'A3',
      direction: 'up',
      points: [
        { x: 2, y: 0, z: -1 },
        { x: 3, y: 0, z: -1.5 },
        { x: 4, y: 0, z: -2 }
      ],
      color: '#4fc3f7',
      status: 'normal'
    },
    {
      id: 'A3-A4-up',
      startStationId: 'A3',
      endStationId: 'A4',
      direction: 'up',
      points: [
        { x: 4, y: 0, z: -2 },
        { x: 5, y: 0, z: -2.5 },
        { x: 6, y: 0, z: -3 }
      ],
      color: '#4fc3f7',
      status: 'normal'
    },
    {
      id: 'A4-A5-up',
      startStationId: 'A4',
      endStationId: 'A5',
      direction: 'up',
      points: [
        { x: 6, y: 0, z: -3 },
        { x: 7, y: 0, z: -3.5 },
        { x: 8, y: 0, z: -4 }
      ],
      color: '#4fc3f7',
      status: 'normal'
    },
    {
      id: 'A5-A6-up',
      startStationId: 'A5',
      endStationId: 'A6',
      direction: 'up',
      points: [
        { x: 8, y: 0, z: -4 },
        { x: 9, y: 0, z: -4.5 },
        { x: 10, y: 0, z: -5 }
      ],
      color: '#4fc3f7',
      status: 'normal'
    },
    {
      id: 'A6-A7-up',
      startStationId: 'A6',
      endStationId: 'A7',
      direction: 'up',
      points: [
        { x: 10, y: 0, z: -5 },
        { x: 11, y: 0, z: -5.5 },
        { x: 12, y: 0, z: -6 }
      ],
      color: '#4fc3f7',
      status: 'normal'
    },
    {
      id: 'A7-A8-up',
      startStationId: 'A7',
      endStationId: 'A8',
      direction: 'up',
      points: [
        { x: 12, y: 0, z: -6 },
        { x: 13, y: 0, z: -6.5 },
        { x: 14, y: 0, z: -7 }
      ],
      color: '#4fc3f7',
      status: 'normal'
    },
    {
      id: 'A8-A9-up',
      startStationId: 'A8',
      endStationId: 'A9',
      direction: 'up',
      points: [
        { x: 14, y: 0, z: -7 },
        { x: 15, y: 0, z: -7.5 },
        { x: 16, y: 0, z: -8 }
      ],
      color: '#4fc3f7',
      status: 'normal'
    },
    {
      id: 'A9-A10-up',
      startStationId: 'A9',
      endStationId: 'A10',
      direction: 'up',
      points: [
        { x: 16, y: 0, z: -8 },
        { x: 17, y: 0, z: -8.5 },
        { x: 18, y: 0, z: -9 }
      ],
      color: '#4fc3f7',
      status: 'normal'
    },
    {
      id: 'A10-A11-up',
      startStationId: 'A10',
      endStationId: 'A11',
      direction: 'up',
      points: [
        { x: 18, y: 0, z: -9 },
        { x: 19, y: 0, z: -9.5 },
        { x: 20, y: 0, z: -10 }
      ],
      color: '#4fc3f7',
      status: 'normal'
    },
    {
      id: 'A11-A12-up',
      startStationId: 'A11',
      endStationId: 'A12',
      direction: 'up',
      points: [
        { x: 20, y: 0, z: -10 },
        { x: 21, y: 0, z: -10.5 },
        { x: 22, y: 0, z: -11 }
      ],
      color: '#4fc3f7',
      status: 'normal'
    },
    {
      id: 'A12-A13-up',
      startStationId: 'A12',
      endStationId: 'A13',
      direction: 'up',
      points: [
        { x: 22, y: 0, z: -11 },
        { x: 23, y: 0, z: -11.5 },
        { x: 24, y: 0, z: -12 }
      ],
      color: '#4fc3f7',
      status: 'normal'
    },
    // Downward segments (A13 to A1) - offset slightly for visibility
    {
      id: 'A13-A12-down',
      startStationId: 'A13',
      endStationId: 'A12',
      direction: 'down',
      points: [
        { x: 24, y: 0, z: -11.8 },
        { x: 23, y: 0, z: -11.3 },
        { x: 22, y: 0, z: -10.8 }
      ],
      color: '#ff4081',
      status: 'normal'
    },
    {
      id: 'A12-A11-down',
      startStationId: 'A12',
      endStationId: 'A11',
      direction: 'down',
      points: [
        { x: 22, y: 0, z: -10.8 },
        { x: 21, y: 0, z: -10.3 },
        { x: 20, y: 0, z: -9.8 }
      ],
      color: '#ff4081',
      status: 'normal'
    },
    {
      id: 'A11-A10-down',
      startStationId: 'A11',
      endStationId: 'A10',
      direction: 'down',
      points: [
        { x: 20, y: 0, z: -9.8 },
        { x: 19, y: 0, z: -9.3 },
        { x: 18, y: 0, z: -8.8 }
      ],
      color: '#ff4081',
      status: 'normal'
    },
    {
      id: 'A10-A9-down',
      startStationId: 'A10',
      endStationId: 'A9',
      direction: 'down',
      points: [
        { x: 18, y: 0, z: -8.8 },
        { x: 17, y: 0, z: -8.3 },
        { x: 16, y: 0, z: -7.8 }
      ],
      color: '#ff4081',
      status: 'normal'
    },
    {
      id: 'A9-A8-down',
      startStationId: 'A9',
      endStationId: 'A8',
      direction: 'down',
      points: [
        { x: 16, y: 0, z: -7.8 },
        { x: 15, y: 0, z: -7.3 },
        { x: 14, y: 0, z: -6.8 }
      ],
      color: '#ff4081',
      status: 'normal'
    },
    {
      id: 'A8-A7-down',
      startStationId: 'A8',
      endStationId: 'A7',
      direction: 'down',
      points: [
        { x: 14, y: 0, z: -6.8 },
        { x: 13, y: 0, z: -6.3 },
        { x: 12, y: 0, z: -5.8 }
      ],
      color: '#ff4081',
      status: 'normal'
    },
    {
      id: 'A7-A6-down',
      startStationId: 'A7',
      endStationId: 'A6',
      direction: 'down',
      points: [
        { x: 12, y: 0, z: -5.8 },
        { x: 11, y: 0, z: -5.3 },
        { x: 10, y: 0, z: -4.8 }
      ],
      color: '#ff4081',
      status: 'normal'
    },
    {
      id: 'A6-A5-down',
      startStationId: 'A6',
      endStationId: 'A5',
      direction: 'down',
      points: [
        { x: 10, y: 0, z: -4.8 },
        { x: 9, y: 0, z: -4.3 },
        { x: 8, y: 0, z: -3.8 }
      ],
      color: '#ff4081',
      status: 'normal'
    },
    {
      id: 'A5-A4-down',
      startStationId: 'A5',
      endStationId: 'A4',
      direction: 'down',
      points: [
        { x: 8, y: 0, z: -3.8 },
        { x: 7, y: 0, z: -3.3 },
        { x: 6, y: 0, z: -2.8 }
      ],
      color: '#ff4081',
      status: 'normal'
    },
    {
      id: 'A4-A3-down',
      startStationId: 'A4',
      endStationId: 'A3',
      direction: 'down',
      points: [
        { x: 6, y: 0, z: -2.8 },
        { x: 5, y: 0, z: -2.3 },
        { x: 4, y: 0, z: -1.8 }
      ],
      color: '#ff4081',
      status: 'normal'
    },
    {
      id: 'A3-A2-down',
      startStationId: 'A3',
      endStationId: 'A2',
      direction: 'down',
      points: [
        { x: 4, y: 0, z: -1.8 },
        { x: 3, y: 0, z: -1.3 },
        { x: 2, y: 0, z: -0.8 }
      ],
      color: '#ff4081',
      status: 'normal'
    },
    {
      id: 'A2-A1-down',
      startStationId: 'A2',
      endStationId: 'A1',
      direction: 'down',
      points: [
        { x: 2, y: 0, z: -0.8 },
        { x: 1, y: 0, z: -0.3 },
        { x: 0, y: 0, z: 0.2 }
      ],
      color: '#ff4081',
      status: 'normal'
    }
  ],
  trains: [
    {
      id: 'express-001',
      name: '直達車 EXP001',
      currentSegmentId: 'A1-A2-up',
      position: 0.3,
      direction: 'up',
      speed: 80,
      status: 'running',
      nextStation: 'A4',
      delay: 0,
      capacity: 400,
      occupancy: 280,
      type: 'express'
    },
    {
      id: 'express-002',
      name: '直達車 EXP002',
      currentSegmentId: 'A12-A11-down',
      position: 0.7,
      direction: 'down',
      speed: 75,
      status: 'running',
      nextStation: 'A4',
      delay: 2,
      capacity: 400,
      occupancy: 320,
      type: 'express'
    },
    {
      id: 'commuter-101',
      name: '普通車 COM101',
      currentSegmentId: 'A4-A5-up',
      position: 0.1,
      direction: 'up',
      speed: 60,
      status: 'running',
      nextStation: 'A5',
      delay: 0,
      capacity: 350,
      occupancy: 180,
      type: 'commuter'
    },
    {
      id: 'commuter-102',
      name: '普通車 COM102',
      currentSegmentId: 'A8-A7-down',
      position: 0.5,
      direction: 'down',
      speed: 55,
      status: 'running',
      nextStation: 'A7',
      delay: 1,
      capacity: 350,
      occupancy: 240,
      type: 'commuter'
    },
    {
      id: 'express-003',
      name: '直達車 EXP003',
      currentSegmentId: 'A6-A7-up',
      position: 0.8,
      direction: 'up',
      speed: 0,
      status: 'stopped',
      nextStation: 'A7',
      delay: 0,
      capacity: 400,
      occupancy: 150,
      type: 'express'
    },
    {
      id: 'commuter-103',
      name: '普通車 COM103',
      currentSegmentId: 'A10-A9-down',
      position: 0.2,
      direction: 'down',
      speed: 0,
      status: 'maintenance',
      nextStation: 'A9',
      delay: 15,
      capacity: 350,
      occupancy: 0,
      type: 'commuter'
    }
  ]
}