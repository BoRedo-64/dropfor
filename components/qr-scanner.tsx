"use client"

import { QrReader } from "react-qr-reader"

export default function QRScanner({ onScan }) {
  return (
    <QrReader
      constraints={{ facingMode: "environment" }}
      onResult={(result, error) => {
        if (!!result) {
          onScan(result?.text)
        }
      }}
      style={{ width: "100%" }}
    />
  )
}