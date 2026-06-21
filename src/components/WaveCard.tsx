import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import styles from './WaveCard.module.css'

interface WaveCardProps {
  label: string
  blob: Blob
  filename: string
  variant: 'forward' | 'reverse'
}

export default function WaveCard({ label, blob, filename, variant }: WaveCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WaveSurfer | null>(null)
  const [blobUrl, setBlobUrl] = useState('')
  const [playing, setPlaying] = useState(false)
  const [finished, setFinished] = useState(false)
  const [ready, setReady] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    const url = URL.createObjectURL(blob)
    setBlobUrl(url)

    const styles = getComputedStyle(document.documentElement)
    const waveColor = variant === 'forward'
      ? styles.getPropertyValue('--wave-fwd').trim()
      : styles.getPropertyValue('--wave-rev').trim()
    const progressColor = variant === 'forward'
      ? styles.getPropertyValue('--wave-fwd-dim').trim()
      : styles.getPropertyValue('--wave-rev-dim').trim()

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor,
      progressColor,
      url,
      height: 120,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      normalize: true,
      interact: true,
    })

    ws.on('ready', () => {
      setReady(true)
      setDuration(ws.getDuration())
    })
    ws.on('play', () => { setPlaying(true); setFinished(false) })
    ws.on('pause', () => setPlaying(false))
    ws.on('finish', () => { setPlaying(false); setFinished(true) })
    ws.on('timeupdate', (t) => setCurrentTime(t))

    wsRef.current = ws

    return () => {
      ws.destroy()
      URL.revokeObjectURL(url)
    }
  }, [blob, variant])

  const handlePlayPause = () => {
    const ws = wsRef.current
    if (!ws) return
    if (finished) {
      ws.seekTo(0)
      ws.play()
    } else {
      ws.playPause()
    }
  }

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.labelRow}>
        <span className={styles.label}>{label}</span>
        {blobUrl && (
          <a
            className={styles.dlBtn}
            href={blobUrl}
            download={filename}
            aria-label={`${label}をダウンロード`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            DL
          </a>
        )}
      </div>

      <div className={styles.waveContainer} ref={containerRef} />

      <div className={styles.controls}>
        <button
          className={styles.playBtn}
          onClick={handlePlayPause}
          disabled={!ready}
          aria-label={playing ? '一時停止' : '再生'}
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>
        <span className={styles.time}>
          {ready ? `${fmt(currentTime)} / ${fmt(duration)}` : '読み込み中...'}
        </span>
      </div>
    </div>
  )
}
