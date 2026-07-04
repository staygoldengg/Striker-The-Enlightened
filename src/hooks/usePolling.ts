import { useEffect, useRef } from 'react'

type PollingOptions = {
  intervalMs: number
  enabled?: boolean
  onError?: (error: unknown) => void
}

export function usePolling(
  task: () => Promise<void>,
  options: PollingOptions,
) {
  const { intervalMs, enabled = true, onError } = options
  const taskRef = useRef(task)

  useEffect(() => {
    taskRef.current = task
  }, [task])

  useEffect(() => {
    if (!enabled) {
      return
    }

    let active = true

    const run = async () => {
      try {
        if (!active) return
        await taskRef.current()
      } catch (error) {
        onError?.(error)
      }
    }

    run()
    const id = window.setInterval(run, intervalMs)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [intervalMs, enabled, onError])
}
