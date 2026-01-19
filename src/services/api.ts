/**
 * API Service Layer for Taoyuan MRT 3D Monitoring System
 * Supports custom API integration for real-time train data
 */

import { Train, Segment, RailwayNetwork } from '@/types/railway'

export interface APIConfig {
  baseUrl: string
  apiKey?: string
  refreshInterval: number // milliseconds
  endpoints: {
    trains?: string
    segments?: string
    stations?: string
    network?: string
  }
}

export interface RealTimeTrainData {
  trainId: string
  position: {
    latitude: number
    longitude: number
  }
  speed: number
  direction: 'up' | 'down'
  status: 'running' | 'stopped' | 'maintenance'
  nextStation: string
  delay: number
  occupancy: number
  lastUpdate: Date
}

export interface RealTimeSegmentData {
  segmentId: string
  status: 'normal' | 'maintenance' | 'delay' | 'closed'
  averageSpeed: number
  congestionLevel: number
}

// Default configuration (can be overridden)
const defaultConfig: APIConfig = {
  baseUrl: 'http://localhost:3001/api',
  refreshInterval: 5000,
  endpoints: {
    trains: '/trains',
    segments: '/segments',
    stations: '/stations',
    network: '/network',
  },
}

class APIService {
  private config: APIConfig
  private abortController: AbortController | null = null
  private refreshTimer: ReturnType<typeof setInterval> | null = null
  private listeners: Map<string, Set<(data: unknown) => void>> = new Map()

  constructor(config: Partial<APIConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  /**
   * Configure the API service
   */
  setConfig(config: Partial<APIConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Get current configuration
   */
  getConfig(): APIConfig {
    return { ...this.config }
  }

  /**
   * Generic fetch with error handling
   */
  private async fetch<T>(endpoint: string): Promise<T> {
    this.abortController = new AbortController()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`
    }

    try {
      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        headers,
        signal: this.abortController.signal,
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request was cancelled')
      }
      throw error
    }
  }

  /**
   * Fetch all trains data
   */
  async fetchTrains(): Promise<RealTimeTrainData[]> {
    return this.fetch<RealTimeTrainData[]>(this.config.endpoints.trains || '/trains')
  }

  /**
   * Fetch all segments data
   */
  async fetchSegments(): Promise<RealTimeSegmentData[]> {
    return this.fetch<RealTimeSegmentData[]>(this.config.endpoints.segments || '/segments')
  }

  /**
   * Fetch complete network data
   */
  async fetchNetwork(): Promise<RailwayNetwork> {
    return this.fetch<RailwayNetwork>(this.config.endpoints.network || '/network')
  }

  /**
   * Transform API train data to internal Train format
   */
  transformTrainData(apiData: RealTimeTrainData, _existingTrain?: Train): Partial<Train> {
    return {
      speed: apiData.speed,
      direction: apiData.direction,
      status: apiData.status,
      nextStation: apiData.nextStation,
      delay: apiData.delay,
      occupancy: apiData.occupancy,
    }
  }

  /**
   * Transform API segment data to internal Segment format
   */
  transformSegmentData(apiData: RealTimeSegmentData): Partial<Segment> {
    return {
      status: apiData.status,
    }
  }

  /**
   * Subscribe to real-time updates
   */
  subscribe(event: 'trains' | 'segments' | 'network', callback: (data: unknown) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)

    return () => {
      this.listeners.get(event)?.delete(callback)
    }
  }

  /**
   * Emit event to all listeners
   */
  private emit(event: string, data: unknown): void {
    this.listeners.get(event)?.forEach(callback => callback(data))
  }

  /**
   * Start polling for real-time updates
   */
  startPolling(callbacks: {
    onTrains?: (data: RealTimeTrainData[]) => void
    onSegments?: (data: RealTimeSegmentData[]) => void
    onError?: (error: Error) => void
  }): void {
    this.stopPolling()

    const poll = async () => {
      try {
        if (callbacks.onTrains) {
          const trains = await this.fetchTrains()
          callbacks.onTrains(trains)
          this.emit('trains', trains)
        }

        if (callbacks.onSegments) {
          const segments = await this.fetchSegments()
          callbacks.onSegments(segments)
          this.emit('segments', segments)
        }
      } catch (error) {
        if (callbacks.onError && error instanceof Error) {
          callbacks.onError(error)
        }
      }
    }

    // Initial poll
    poll()

    // Set up interval
    this.refreshTimer = setInterval(poll, this.config.refreshInterval)
  }

  /**
   * Stop polling
   */
  stopPolling(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = null
    }
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }

  /**
   * Check API health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/health`, {
        method: 'HEAD',
      })
      return response.ok
    } catch {
      return false
    }
  }
}

// Singleton instance
export const apiService = new APIService()

// React hook for API service
export function useAPIService() {
  return apiService
}

// WebSocket support for real-time updates (optional)
export class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private listeners: Map<string, Set<(data: unknown) => void>> = new Map()

  constructor(private url: string) {}

  connect(): void {
    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          const { type, payload } = data
          this.emit(type, payload)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        this.attemptReconnect()
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
      setTimeout(() => this.connect(), delay)
    }
  }

  private emit(event: string, data: unknown): void {
    this.listeners.get(event)?.forEach(callback => callback(data))
  }

  subscribe(event: string, callback: (data: unknown) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)

    return () => {
      this.listeners.get(event)?.delete(callback)
    }
  }

  send(type: string, payload: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}
