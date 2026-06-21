# Reverse Playback

マイクで録音して、その場ですぐに逆再生できるブラウザアプリ。

## 機能

- マイクからリアルタイム録音
- 録音した音声の即時逆再生
- wavesurfer.js による波形表示・シークバー操作
- 順再生・逆再生それぞれ WAV でダウンロード
- ダーク / ライトモード切り替え
- **録音データは外部サーバーへ一切送信されず、すべてブラウザ内で処理される**

## 技術スタック

- Vite + React + TypeScript
- [wavesurfer.js](https://wavesurfer.xyz/) v7
- Web Audio API（音声デコード・逆再生処理）
- MediaRecorder API（マイク録音）

## 開発

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
# dist/ に静的ファイルが生成される
```
