export type OrderStatus =
  | "en attente"
  | "pickup demandé"
  | "au depot"
  | "a verifier"
  | "a relancer"
  | "en cours"
  | "livré"
  | "retour"

type StatusConfig = {
  label: string
  className: string
}

export const STATUS_CONFIG: Record<string, StatusConfig> = {
  "en attente": {
    label: "En attente",
    className: "bg-yellow-100 text-yellow-800",
  },
  "pickup demandé": {
    label: "Pickup demandé",
    className: "bg-yellow-100 text-yellow-800",
  },
  "au depot": {
    label: "Au dépôt",
    className: "bg-gray-200 text-gray-900",
  },
  "a verifier": {
    label: "À vérifier",
    className: "bg-red-100 text-red-800",
  },
  "a relancer": {
    label: "À relancer",
    className: "bg-gray-100 text-gray-800",
  },
  "en cours": {
    label: "En cours",
    className: "bg-blue-100 text-blue-800",
  },
  "livré": {
    label: "Livré",
    className: "bg-green-100 text-green-800",
  },
  "retour": {
    label: "Retour",
    className: "bg-red-100 text-red-800",
  },
}

export function getStatusConfig(status: string) {
  return (
    STATUS_CONFIG[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800",
    }
  )
}
