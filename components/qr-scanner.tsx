"use client"

import { QrReader } from "react-qr-reader"

type Props = {
  onScan: (value: string) => void
}

export default function QRScanner({ onScan }: Props) {
  return (
    <QrReader
      constraints={{
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }}
      onResult={(result, error) => {
        if (result) {
          const text = result.getText()
          onScan(text)
        }
      }}
      containerStyle={{ width: "100%" }}
    />
  )
}
