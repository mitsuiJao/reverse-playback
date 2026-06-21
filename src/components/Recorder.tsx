import { RecorderState } from '../hooks/useRecorder'
import styles from './Recorder.module.css'

interface RecorderProps {
  state: RecorderState
  onStart: () => void
  onStop: () => void
}

export default function Recorder({ state, onStart, onStop }: RecorderProps) {
  const isRecording = state === 'recording'
  const isProcessing = state === 'processing'

  return (
    <div className={styles.wrapper}>
      <p className={styles.sub}>マイクで録音して、すぐに逆再生</p>
      <button
        className={`${styles.btn} ${isRecording ? styles.recording : ''}`}
        onClick={isRecording ? onStop : onStart}
        disabled={isProcessing}
        aria-label={isRecording ? '録音停止' : '録音開始'}
      >
        <span className={styles.dot} />
        {isProcessing ? '処理中...' : isRecording ? 'STOP' : 'REC'}
      </button>
      {isRecording && (
        <p className={styles.hint}>話しかけて — もう一度押して停止</p>
      )}
    </div>
  )
}
