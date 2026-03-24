export interface FeeItem {
  label: string;
  amount: number;
}

export interface TrackingFees {
  totalAmount: number;
  currency: string;
  items: FeeItem[];
  status: "pending" | "paid" | "refused" | "investigating" | "expired";
  deadline?: string;
  paidAt?: string;
  explanation: string;
}

export interface ProofOfDelivery {
  signatureUrl?: string;
  photoUrl?: string;
  deliveredAt: string;
  deliveredTo: string;
  location: string;
  lat: number;
  lng: number;
  notes?: string;
}

export interface Incident {
  id: string;
  trackingId: string;
  type: "delay" | "damage" | "lost" | "wrong_address" | "wrong_item" | "other";
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "investigating" | "resolved" | "closed";
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  resolution?: string;
}

export interface ReturnRequest {
  id: string;
  trackingId: string;
  reason: "defective" | "wrong_item" | "not_as_described" | "no_longer_needed" | "other";
  status: "requested" | "approved" | "in_transit" | "received" | "refunded" | "rejected";
  description: string;
  createdAt: string;
  returnTrackingNumber?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: "status_change" | "eta_update" | "delivery" | "fees" | "incident" | "return" | "message";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  trackingId?: string;
  link?: string;
}

export interface TrackingItem {
  id: string;
  trackingNumber: string;
  name: string;
  type: "colis" | "vehicule" | "objet";
  status: "created" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "delayed" | "lost" | "customs_hold" | "fees_pending" | "fees_paid" | "returned";
  origin: string;
  destination: string;
  carrier: string;
  createdAt: string;
  estimatedArrival: string;
  lastUpdate: string;
  lat: number;
  lng: number;
  speed?: number;
  battery?: number;
  temperature?: number;
  owner: string;
  statusHistory: StatusEvent[];
  positions: PositionRecord[];
  fees?: TrackingFees;
  pod?: ProofOfDelivery;
  etaConfidence?: "high" | "medium" | "low";
  etaDetails?: string;
  progressPercent?: number;
}

export interface StatusEvent {
  status: string;
  date: string;
  location: string;
  description: string;
}

export interface PositionRecord {
  lat: number;
  lng: number;
  timestamp: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "client" | "support";
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  trackingId: string;
  trackingNumber: string;
  subject: string;
  status: "open" | "pending" | "resolved";
  priority: "low" | "medium" | "high";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  clientName: string;
  messages: Message[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "client" | "operator" | "admin";
  active: boolean;
  createdAt: string;
}

export const statusLabels: Record<string, string> = {
  created: "Créé",
  picked_up: "Pris en charge",
  in_transit: "En transit",
  out_for_delivery: "En cours de livraison",
  delivered: "Livré",
  delayed: "En retard",
  lost: "Perdu",
  customs_hold: "Bloqué en douane",
  fees_pending: "Frais en attente",
  fees_paid: "Frais payés",
  returned: "Retourné",
};

export const statusColors: Record<string, string> = {
  created: "bg-info text-info-foreground",
  picked_up: "bg-info text-info-foreground",
  in_transit: "bg-accent text-accent-foreground",
  out_for_delivery: "bg-warning text-warning-foreground",
  delivered: "bg-success text-success-foreground",
  delayed: "bg-destructive text-destructive-foreground",
  lost: "bg-destructive text-destructive-foreground",
  customs_hold: "bg-warning text-warning-foreground",
  fees_pending: "bg-warning text-warning-foreground",
  fees_paid: "bg-success text-success-foreground",
  returned: "bg-destructive text-destructive-foreground",
};

export const incidentTypeLabels: Record<string, string> = {
  delay: "Retard",
  damage: "Colis endommagé",
  lost: "Colis perdu",
  wrong_address: "Adresse incorrecte",
  wrong_item: "Mauvais article",
  other: "Autre",
};

export const returnReasonLabels: Record<string, string> = {
  defective: "Produit défectueux",
  wrong_item: "Mauvais produit",
  not_as_described: "Non conforme",
  no_longer_needed: "Plus besoin",
  other: "Autre",
};

export const mockTrackings: TrackingItem[] = [
  {
    id: "1",
    trackingNumber: "TRK-2024-001847",
    name: "Colis électronique - Paris",
    type: "colis",
    status: "in_transit",
    origin: "Paris, France",
    destination: "Lyon, France",
    carrier: "TransExpress",
    createdAt: "2024-03-15T08:00:00Z",
    estimatedArrival: "2024-03-18T14:00:00Z",
    lastUpdate: "2024-03-17T10:30:00Z",
    lat: 46.2,
    lng: 3.5,
    speed: 85,
    temperature: 22,
    owner: "user1",
    progressPercent: 65,
    etaConfidence: "high",
    etaDetails: "Livraison prévue demain entre 12h et 14h",
    statusHistory: [
      { status: "created", date: "2024-03-15T08:00:00Z", location: "Paris", description: "Colis enregistré" },
      { status: "picked_up", date: "2024-03-15T10:00:00Z", location: "Paris - Centre tri", description: "Pris en charge par le transporteur" },
      { status: "in_transit", date: "2024-03-16T06:00:00Z", location: "Orléans", description: "En transit vers la destination" },
    ],
    positions: [
      { lat: 48.8566, lng: 2.3522, timestamp: "2024-03-15T10:00:00Z" },
      { lat: 47.9025, lng: 1.9090, timestamp: "2024-03-16T06:00:00Z" },
      { lat: 46.8, lng: 3.1, timestamp: "2024-03-16T18:00:00Z" },
      { lat: 46.2, lng: 3.5, timestamp: "2024-03-17T10:30:00Z" },
    ],
  },
  {
    id: "2",
    trackingNumber: "TRK-2024-002391",
    name: "Véhicule utilitaire #12",
    type: "vehicule",
    status: "in_transit",
    origin: "Marseille, France",
    destination: "Bordeaux, France",
    carrier: "FleetTrack",
    createdAt: "2024-03-16T07:00:00Z",
    estimatedArrival: "2024-03-18T18:00:00Z",
    lastUpdate: "2024-03-17T11:00:00Z",
    lat: 44.0,
    lng: 1.5,
    speed: 110,
    battery: 78,
    owner: "user1",
    progressPercent: 55,
    etaConfidence: "medium",
    etaDetails: "Arrivée estimée le 18/03 en fin de journée",
    statusHistory: [
      { status: "created", date: "2024-03-16T07:00:00Z", location: "Marseille", description: "Véhicule enregistré" },
      { status: "in_transit", date: "2024-03-16T09:00:00Z", location: "Marseille", description: "Départ effectué" },
    ],
    positions: [
      { lat: 43.2965, lng: 5.3698, timestamp: "2024-03-16T09:00:00Z" },
      { lat: 43.6, lng: 3.8, timestamp: "2024-03-16T15:00:00Z" },
      { lat: 44.0, lng: 1.5, timestamp: "2024-03-17T11:00:00Z" },
    ],
  },
  {
    id: "3",
    trackingNumber: "TRK-2024-003105",
    name: "Colis fragile - Verrerie",
    type: "colis",
    status: "delivered",
    origin: "Strasbourg, France",
    destination: "Lille, France",
    carrier: "SecurPost",
    createdAt: "2024-03-10T09:00:00Z",
    estimatedArrival: "2024-03-13T12:00:00Z",
    lastUpdate: "2024-03-13T11:30:00Z",
    lat: 50.6292,
    lng: 3.0573,
    temperature: 20,
    owner: "user1",
    progressPercent: 100,
    etaConfidence: "high",
    pod: {
      signatureUrl: "https://placehold.co/300x150/e2e8f0/475569?text=Signature",
      photoUrl: "https://placehold.co/400x300/e2e8f0/475569?text=Photo+livraison",
      deliveredAt: "2024-03-13T11:30:00Z",
      deliveredTo: "Sophie Martin",
      location: "12 Rue de la Gare, 59000 Lille",
      lat: 50.6292,
      lng: 3.0573,
      notes: "Remis en main propre au destinataire",
    },
    statusHistory: [
      { status: "created", date: "2024-03-10T09:00:00Z", location: "Strasbourg", description: "Colis enregistré" },
      { status: "picked_up", date: "2024-03-10T14:00:00Z", location: "Strasbourg", description: "Pris en charge" },
      { status: "in_transit", date: "2024-03-11T06:00:00Z", location: "Metz", description: "En transit" },
      { status: "out_for_delivery", date: "2024-03-13T08:00:00Z", location: "Lille", description: "En cours de livraison" },
      { status: "delivered", date: "2024-03-13T11:30:00Z", location: "Lille", description: "Livré avec succès" },
    ],
    positions: [
      { lat: 48.5734, lng: 7.7521, timestamp: "2024-03-10T14:00:00Z" },
      { lat: 49.1193, lng: 6.1757, timestamp: "2024-03-11T06:00:00Z" },
      { lat: 49.8, lng: 4.5, timestamp: "2024-03-12T10:00:00Z" },
      { lat: 50.6292, lng: 3.0573, timestamp: "2024-03-13T11:30:00Z" },
    ],
  },
  {
    id: "4",
    trackingNumber: "TRK-2024-004520",
    name: "Équipement médical",
    type: "objet",
    status: "delayed",
    origin: "Nantes, France",
    destination: "Toulouse, France",
    carrier: "MedTransit",
    createdAt: "2024-03-14T06:00:00Z",
    estimatedArrival: "2024-03-16T16:00:00Z",
    lastUpdate: "2024-03-17T09:00:00Z",
    lat: 45.5,
    lng: 1.2,
    temperature: 4,
    owner: "user1",
    progressPercent: 45,
    etaConfidence: "low",
    etaDetails: "Retard dû aux conditions météo – nouvelle ETA en cours de calcul",
    statusHistory: [
      { status: "created", date: "2024-03-14T06:00:00Z", location: "Nantes", description: "Enregistré" },
      { status: "picked_up", date: "2024-03-14T10:00:00Z", location: "Nantes", description: "Pris en charge" },
      { status: "in_transit", date: "2024-03-14T15:00:00Z", location: "Poitiers", description: "En transit" },
      { status: "delayed", date: "2024-03-16T18:00:00Z", location: "Limoges", description: "Retard - conditions météo" },
    ],
    positions: [
      { lat: 47.2184, lng: -1.5536, timestamp: "2024-03-14T10:00:00Z" },
      { lat: 46.5802, lng: 0.3404, timestamp: "2024-03-14T15:00:00Z" },
      { lat: 45.5, lng: 1.2, timestamp: "2024-03-17T09:00:00Z" },
    ],
  },
  {
    id: "5",
    trackingNumber: "TRK-2024-005789",
    name: "Pièces auto - Import Japon",
    type: "colis",
    status: "fees_pending",
    origin: "Tokyo, Japon",
    destination: "Paris, France",
    carrier: "GlobalFreight",
    createdAt: "2024-03-12T04:00:00Z",
    estimatedArrival: "2024-03-22T10:00:00Z",
    lastUpdate: "2024-03-18T14:00:00Z",
    lat: 48.8566,
    lng: 2.3522,
    owner: "user1",
    progressPercent: 70,
    etaConfidence: "medium",
    etaDetails: "En attente de paiement des frais de douane – la livraison reprendra après règlement",
    statusHistory: [
      { status: "created", date: "2024-03-12T04:00:00Z", location: "Tokyo", description: "Colis enregistré" },
      { status: "picked_up", date: "2024-03-12T10:00:00Z", location: "Tokyo - Narita", description: "Pris en charge" },
      { status: "in_transit", date: "2024-03-13T02:00:00Z", location: "En vol", description: "En transit aérien" },
      { status: "customs_hold", date: "2024-03-17T08:00:00Z", location: "Paris CDG - Douane", description: "Bloqué en douane" },
      { status: "fees_pending", date: "2024-03-18T14:00:00Z", location: "Paris CDG - Douane", description: "Frais de douane calculés - en attente de paiement" },
    ],
    positions: [
      { lat: 35.7720, lng: 140.3929, timestamp: "2024-03-12T10:00:00Z" },
      { lat: 48.8566, lng: 2.3522, timestamp: "2024-03-17T08:00:00Z" },
    ],
    fees: {
      totalAmount: 15000,
      currency: "FCFA",
      items: [
        { label: "Droits de douane", amount: 8500 },
        { label: "TVA import", amount: 4200 },
        { label: "Frais de dossier", amount: 1500 },
        { label: "Frais de stockage (2 jours)", amount: 800 },
      ],
      status: "pending",
      deadline: "2024-03-25T23:59:00Z",
      explanation: "La douane française exige le paiement de ces frais pour autoriser le dédouanement et poursuivre la livraison de votre colis.",
    },
  },
];

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    trackingId: "1",
    trackingNumber: "TRK-2024-001847",
    subject: "Délai de livraison",
    status: "open",
    priority: "medium",
    lastMessage: "Bonjour, quand est-ce que mon colis arrivera ?",
    lastMessageTime: "2024-03-17T10:00:00Z",
    unreadCount: 1,
    clientName: "Jean Dupont",
    messages: [
      { id: "m1", senderId: "user1", senderName: "Jean Dupont", senderRole: "client", content: "Bonjour, j'aimerais savoir quand mon colis arrivera à Lyon. Le suivi indique qu'il est en transit depuis hier.", timestamp: "2024-03-17T09:30:00Z", read: true },
      { id: "m2", senderId: "op1", senderName: "Marie Support", senderRole: "support", content: "Bonjour Jean ! Votre colis est actuellement en route et devrait arriver demain avant 14h. Je reste disponible si vous avez d'autres questions.", timestamp: "2024-03-17T09:45:00Z", read: true },
      { id: "m3", senderId: "user1", senderName: "Jean Dupont", senderRole: "client", content: "Merci ! Est-il possible de suivre en temps réel sa progression ?", timestamp: "2024-03-17T10:00:00Z", read: false },
    ],
  },
  {
    id: "conv2",
    trackingId: "4",
    trackingNumber: "TRK-2024-004520",
    subject: "Retard équipement médical",
    status: "open",
    priority: "high",
    lastMessage: "Urgent : l'équipement devait arriver hier.",
    lastMessageTime: "2024-03-17T08:30:00Z",
    unreadCount: 2,
    clientName: "Dr. Laurent",
    messages: [
      { id: "m4", senderId: "user2", senderName: "Dr. Laurent", senderRole: "client", content: "Bonjour, l'équipement médical devait arriver hier. C'est urgent, nous en avons besoin pour une opération.", timestamp: "2024-03-17T08:00:00Z", read: true },
      { id: "m5", senderId: "user2", senderName: "Dr. Laurent", senderRole: "client", content: "Pouvez-vous me donner une mise à jour immédiate ?", timestamp: "2024-03-17T08:30:00Z", read: false },
    ],
  },
  {
    id: "conv3",
    trackingId: "3",
    trackingNumber: "TRK-2024-003105",
    subject: "Confirmation réception",
    status: "resolved",
    priority: "low",
    lastMessage: "Parfait, merci beaucoup !",
    lastMessageTime: "2024-03-13T14:00:00Z",
    unreadCount: 0,
    clientName: "Sophie Martin",
    messages: [
      { id: "m6", senderId: "user3", senderName: "Sophie Martin", senderRole: "client", content: "J'ai bien reçu ma verrerie, tout est intact. Merci !", timestamp: "2024-03-13T13:00:00Z", read: true },
      { id: "m7", senderId: "op1", senderName: "Marie Support", senderRole: "support", content: "Ravie que tout soit arrivé en bon état ! N'hésitez pas si vous avez besoin de quoi que ce soit.", timestamp: "2024-03-13T13:30:00Z", read: true },
      { id: "m8", senderId: "user3", senderName: "Sophie Martin", senderRole: "client", content: "Parfait, merci beaucoup !", timestamp: "2024-03-13T14:00:00Z", read: true },
    ],
  },
  {
    id: "conv5",
    trackingId: "5",
    trackingNumber: "TRK-2024-005789",
    subject: "Frais de douane - Import Japon",
    status: "open",
    priority: "high",
    lastMessage: "Pourquoi les frais de douane sont si élevés ?",
    lastMessageTime: "2024-03-18T15:00:00Z",
    unreadCount: 1,
    clientName: "Jean Dupont",
    messages: [
      { id: "m9", senderId: "user1", senderName: "Jean Dupont", senderRole: "client", content: "Bonjour, je vois que des frais de douane de 15 000 FCFA sont demandés pour mon colis. Pourquoi le montant est-il si élevé ?", timestamp: "2024-03-18T15:00:00Z", read: false },
    ],
  },
];

export const mockUsers: User[] = [
  { id: "user1", name: "Jean Dupont", email: "jean@example.com", phone: "+33 6 12 34 56 78", role: "client", active: true, createdAt: "2024-01-15" },
  { id: "user2", name: "Dr. Laurent", email: "laurent@hospital.fr", phone: "+33 6 98 76 54 32", role: "client", active: true, createdAt: "2024-02-20" },
  { id: "user3", name: "Sophie Martin", email: "sophie@example.com", role: "client", active: true, createdAt: "2024-03-01" },
  { id: "op1", name: "Marie Support", email: "marie@trackflow.com", role: "operator", active: true, createdAt: "2023-12-01" },
  { id: "op2", name: "Pierre Duval", email: "pierre@trackflow.com", role: "operator", active: true, createdAt: "2024-01-10" },
  { id: "admin1", name: "Admin Principal", email: "admin@trackflow.com", role: "admin", active: true, createdAt: "2023-11-01" },
];

export const mockIncidents: Incident[] = [
  {
    id: "inc1",
    trackingId: "4",
    type: "delay",
    severity: "high",
    status: "investigating",
    title: "Retard majeur - Conditions météo",
    description: "Le colis est bloqué à Limoges en raison de conditions météorologiques défavorables.",
    createdAt: "2024-03-16T18:00:00Z",
    updatedAt: "2024-03-17T09:00:00Z",
  },
];

export const mockReturnRequests: ReturnRequest[] = [];

export const mockNotifications: AppNotification[] = [
  { id: "n1", userId: "user1", type: "status_change", title: "Colis en transit", message: "Votre colis TRK-2024-001847 est maintenant en transit vers Lyon.", read: true, createdAt: "2024-03-16T06:00:00Z", trackingId: "1", link: "/dashboard/tracking/1" },
  { id: "n2", userId: "user1", type: "delivery", title: "Colis livré", message: "Votre colis TRK-2024-003105 a été livré avec succès à Lille.", read: true, createdAt: "2024-03-13T11:30:00Z", trackingId: "3", link: "/dashboard/tracking/3" },
  { id: "n3", userId: "user1", type: "eta_update", title: "Retard détecté", message: "L'ETA de votre équipement médical TRK-2024-004520 a été mise à jour suite à un retard.", read: false, createdAt: "2024-03-16T18:00:00Z", trackingId: "4", link: "/dashboard/tracking/4" },
  { id: "n4", userId: "user1", type: "fees", title: "Frais de douane", message: "Des frais de douane de 15 000 FCFA sont requis pour votre colis TRK-2024-005789.", read: false, createdAt: "2024-03-18T14:00:00Z", trackingId: "5", link: "/dashboard/tracking/5" },
  { id: "n5", userId: "user1", type: "incident", title: "Incident signalé", message: "Un incident a été ouvert pour votre colis TRK-2024-004520 : retard conditions météo.", read: false, createdAt: "2024-03-17T09:00:00Z", trackingId: "4", link: "/dashboard/tracking/4" },
  { id: "n6", userId: "user1", type: "message", title: "Nouveau message", message: "Marie Support a répondu à votre question concernant le colis TRK-2024-001847.", read: true, createdAt: "2024-03-17T09:45:00Z", trackingId: "1", link: "/dashboard/tracking/1" },
];
