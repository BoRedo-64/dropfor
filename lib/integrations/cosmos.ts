// /lib/integrations/cosmos.ts

type CosmosCreateOrderPayload = {
  name: string
  phone: string
  phone2?: string
  address: string
  city: string
  quantity: number
  packageCount?: number
  totalAmount: number
  content: string
  note?: string
  externalBarcode?: string
  exchange?: boolean
  source?: string

  options?: {
    allowToOpen?: boolean
    isFragile?: boolean
  }
}

type CosmosOrderResponse = {
  success: boolean
  message?: string

  data?: {
    id: string
    barcode: string
    integrationBarcode?: string

    name: string
    phone: string
    address: string
    city: string

    status: string
    paymentStatus: string

    totalAmount: number

    createdAt: string

    labelUrl?: string
    labelPdfUrl?: string
  }
}

const COSMOS_BASE_URL =
  process.env.COSMOS_BASE_URL ||
  "https://api.cosmos.tn/api/v1"

const COSMOS_API_TOKEN =
  process.env.COSMOS_API_TOKEN || ""

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${COSMOS_API_TOKEN}`,
  }
}

/* =========================================================
   CREATE ORDER
========================================================= */

export async function createOrder(
  payload: CosmosCreateOrderPayload
) {
  try {
    const response = await fetch(
      `${COSMOS_BASE_URL}/orders`,
      {
        method: "POST",

        headers: getHeaders(),

        body: JSON.stringify({
          name: payload.name,
          phone: payload.phone,
          phone2: payload.phone2,

          address: payload.address,
          city: payload.city,

          quantity: payload.quantity,

          packageCount:
            payload.packageCount || 1,

          totalAmount: payload.totalAmount,

          content: payload.content,

          note: payload.note,

          externalBarcode:
            payload.externalBarcode,

          exchange:
            payload.exchange || false,

          source:
            payload.source || "dropfor",

          options: {
            allowToOpen:
              payload.options?.allowToOpen ??
              true,

            isFragile:
              payload.options?.isFragile ??
              false,
          },
        }),
      }
    )

    const data = await response.json()
    console.log("COSMOS RESPONSE:", data)
    console.log("COSMOS PAYLOAD:", {
    name: payload.name,
    phone: payload.phone,
    address: payload.address,
    city: payload.city,
    quantity: payload.quantity,
    packageCount: payload.packageCount,
    totalAmount: payload.totalAmount,
    content: payload.content,
    })
    
    if (!response.ok) {
      return {
        success: false,
        error:
          data.message ||
          "Failed to create order",
      }
    }

    return {
      success: true,
      data: data.data,
    }

  } catch (error) {
    console.error(
      "COSMOS CREATE ORDER ERROR:",
      error
    )

    return {
      success: false,
      error: "Server error",
    }
  }
}

/* =========================================================
   GET ORDER
========================================================= */

export async function getOrder(
  barcode: string
) {
  try {
    const response = await fetch(
      `${COSMOS_BASE_URL}/orders?barcode=${barcode}`,
      {
        method: "GET",

        headers: getHeaders(),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error:
          data.message ||
          "Failed to fetch order",
      }
    }

    return {
      success: true,
      data:
        data?.data?.[0] || null,
    }

  } catch (error) {
    console.error(
      "COSMOS GET ORDER ERROR:",
      error
    )

    return {
      success: false,
      error: "Server error",
    }
  }
}

/* =========================================================
   DELETE ORDER
========================================================= */

export async function deleteOrder(
  barcode: string
) {
  try {
    const response = await fetch(
      `${COSMOS_BASE_URL}/orders?barcode=${barcode}`,
      {
        method: "DELETE",

        headers: getHeaders(),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error:
          data.message ||
          "Failed to delete order",
      }
    }

    return {
      success: true,
      message:
        data.message ||
        "Order deleted",
    }

  } catch (error) {
    console.error(
      "COSMOS DELETE ORDER ERROR:",
      error
    )

    return {
      success: false,
      error: "Server error",
    }
  }
}

/* =========================================================
   STATUS MAPPING
========================================================= */

export const cosmosStatusMap: Record<
  string,
  string
> = {
  pending: "en attente",

  "to-be-picked":
    "pickup demandé",

  "in-depot":
    "au depot",

  "in-delivery":
    "en cours",

  "to-be-verified":
    "a verifier",

  delivered:
    "livré",

  "return-stock":
    "retour depot",

  "final-return":
    "retour final",

  returned:
    "retour",

  "in-transfer":
    "inter-depot",

  "return-in-transfer":
    "inter-retour",
}