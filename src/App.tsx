import { useState, useCallback, useRef } from 'react'
import { useTheme } from './hooks/useTheme'
import { useRecorder } from './hooks/useRecorder'
import { reverseAudio } from './utils/audioUtils'
import Header from './components/Header'
import Recorder from './components/Recorder'
import WaveCard from './components/WaveCard'
import styles from './App.module.css'

interface AudioResult {
  forward: Blob
  reversed: Blob
}

export default function App() {
  const { theme, toggle } = useTheme()
  const [result, setResult] = useState<AudioResult | null>(null)
  const resetRef = useRef<(() => void) | null>(null)

  const handleRecordingComplete = useCallback(async (blob: Blob) => {
    const reversedBlob = await reverseAudio(blob)
    setResult({ forward: blob, reversed: reversedBlob })
    resetRef.current?.()
  }, [])

  const { state, start, stop, reset } = useRecorder(handleRecordingComplete)
  resetRef.current = reset

  const handleNewRecording = () => {
    setResult(null)
    reset()
  }

  return (
    <div className={styles.app}>
      <Header theme={theme} onToggleTheme={toggle} />
      <main className={styles.main}>
        {!result ? (
          <Recorder state={state} onStart={start} onStop={stop} />
        ) : (
          <div className={styles.results}>
            <div className={styles.cards}>
              <WaveCard
                label="Forward"
                blob={result.forward}
                filename="forward.wav"
                variant="forward"
              />
              <WaveCard
                label="Reverse"
                blob={result.reversed}
                filename="reversed.wav"
                variant="reverse"
              />
            </div>
            <button className={styles.retakeBtn} onClick={handleNewRecording}>
              もう一度録音
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
