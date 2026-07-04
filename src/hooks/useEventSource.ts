import { useEffect, useRef, useState } from 'react'

type EventSourceStatus = 'connecting' | 'open' | 'error' | 'closed'

type UseEventSourceOptions = {
  onOpen?: () => void
  onError?: (error: Event) => void
}

export type { EventSourceStatus }

export function useEventSource(
  url: string,
  onMessage: (event: MessageEvent<string>) => void,
  options: UseEventSourceOptions = {},
): EventSourceStatus {
  const [status, setStatus] = useState<EventSourceStatus>('connecting')
  const esRef = useRef<EventSource | null>(null)
  const { onOpen, onError } = options

  useEffect(() => {
    if (!window.EventSource) {
      setStatus('error')
      onError?.(new Event('unsupported'))
      return
    }
    if (!url) {
      setStatus('closed')
      return
    }

    const es = new EventSource(url)
    esRef.current = es

    es.onopen = () => {
      setStatus('open')
      onOpen?.()
    }

    es.onmessage = (event) => {
      onMessage(event)
    }

    es.onerror = (error) => {
      setStatus('error')
      onError?.(error)
    }

    return () => {
      es.close()
      esRef.current = null
      setStatus('closed')
    }
  }, [url, onMessage, onOpen, onError])

  return status
}
