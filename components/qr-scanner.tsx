"use client"

import { Scanner } from "@yudiel/react-qr-scanner"

type Props = {
  onScan: (value: string) => void
}

export default function QRScanner({ onScan }: Props) {
  return (
    <div className="w-full max-w-md mx-auto overflow-hidden rounded-lg border">

      <Scanner
        onScan={(result) => {
          if (result?.[0]?.rawValue) {
            onScan(result[0].rawValue)
          }
        }}
        onError={(err) => console.log(err)}
        constraints={{
          facingMode: "environment",
        }}
        styles={{
          container: {
            width: "100%",
          },
          video: {
            width: "100%",
            height: "300px",
            objectFit: "cover",
          },
        }}
      />

    </div>
  )
}