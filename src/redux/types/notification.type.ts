export interface NotificationType {
  _id: string;
  message: string;
  title: string;
  title2: string;
  productName: string;
  isRead: boolean;
  productImageUrl?: string;
  actionType?: 'created' | 'approved' | 'info' | 'error' | 'deleted' | 'order';
  createdAt: string;
  productId: string;
}
