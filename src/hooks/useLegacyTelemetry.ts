import { useCallback, useState } from 'react'
import { useEventSource, type EventSourceStatus } from './useEventSource'
import { usePolling } from './usePolling'
import { LEGACY_SPATIAL_TELEMETRY, LEGACY_SPATIAL_TELEMETRY_STREAM } from '../config'

type Telemetry = {
  x?: number
  y?: number
  frame?: number
  lookahead?: number
  weapon?: number
  error?: string
}

export type { Telemetry }

export function useSpatialTelemetry(pollMs = 2000) {
  const [telemetry, setTelemetry] = useState<Telemetry>({})
  const [streamStatus, setStreamStatus] = useState<EventSourceStatus>('connecting')
  const [streamFailed, setStreamFailed] = useState(false)

  const handleMessage = useCallback((event: MessageEvent<string>) => {
    try {
      setTelemetry(JSON.parse(event.data))
    } catch (error) {
      setTelemetry({ error: 'Malformed telemetry payload' })
      console.warn('[useSpatialTelemetry] failed to parse stream message', error)
    }
  }, [])

  useEventSource(LEGACY_SPATIAL_TELEMETRY_STREAM, handleMessage, {
    onOpen: () => {
      setStreamStatus('open')
      setStreamFailed(false)
    },
    onError: () => {
      setStreamStatus('error')
      setStreamFailed(true)
    },
  })

  const fetchTelemetry = useCallback(async () => {
    const response = await fetch(LEGACY_SPATIAL_TELEMETRY)
    if (!response.ok) {
      throw new Error(`Telemetry endpoint returned ${response.status}`)
    }
    setTelemetry(await response.json())
  }, [])

  usePolling(fetchTelemetry, {
    intervalMs: pollMs,
    enabled: streamStatus !== 'open' || streamFailed,
    onError: (error) => setTelemetry({ error: String(error) }),
  })

  return {
    telemetry,
    streamStatus,
    streamFallback: streamStatus !== 'open' || streamFailed,
  }
}
