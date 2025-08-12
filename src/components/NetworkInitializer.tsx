import React, { useEffect } from 'react'
import { useRailwayStore } from '@/stores/RailwayStore'
import { taoyuanAirportLineNetwork } from '@/config/taoyuanAirportLine'

const NetworkInitializer: React.FC = () => {
  const { setNetwork } = useRailwayStore()

  useEffect(() => {
    // Initialize the network data
    setNetwork(taoyuanAirportLineNetwork)
  }, [setNetwork])

  return null
}

export default NetworkInitializer