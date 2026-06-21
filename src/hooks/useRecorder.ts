import { useState, useRef, useCallback } from 'react'

export type RecorderState = 'idle' | 'recording' | 'processing'

export function useRecorder(onResult: (blob: Blob) => void) {
  const [state, setState] = useState<RecorderState>('idle')
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const recorder = new MediaRecorder(stream)
      recorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setState('processing')
        onResult(blob)
      }

      recorder.start()
      setState('recording')
    } catch {
      alert('マイクへのアクセスが必要です。')
    }
  }, [onResult])

  const stop = useCallback(() => {
    recorderRef.current?.stop()
  }, [])

  const reset = useCallback(() => {
    setState('idle')
  }, [])

  return { state, start, stop, reset }
}
