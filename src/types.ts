export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  bio?: string;
  rating?: number;
  createdAt: any;
}

export interface Trip {
  id?: string;
  travelerId: string;
  travelerName: string;
  origin: string;
  destination: string;
  travelDate: any;
  capacity: string;
  itemTypes: string[];
  status: 'active' | 'completed' | 'cancelled';
  createdAt: any;
}

export interface Item {
  name: string;
  description: string;
  imageUrl?: string;
  quantity: number;
}

export interface DeliveryRequest {
  id?: string;
  requesterId: string;
  requesterName: string;
  items: Item[];
  origin: string;
  destination: string;
  deadline: any;
  commission: number;
  status: 'pending' | 'matched' | 'in-transit' | 'delivered' | 'cancelled';
  createdAt: any;
}

export interface Message {
  id?: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: any;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}
