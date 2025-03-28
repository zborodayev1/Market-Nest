export interface NotificationType {
  _id: string;
  message: string;
  title: string;
  isRead: boolean;
  productImageUrl?: string;
  actionType?: 'created' | 'approved' | 'info' | 'error' | 'deleted';
  createdAt: string;
  productId: string;
}
