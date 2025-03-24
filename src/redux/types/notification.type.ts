export interface NotificationType {
  _id: string;
  message: string;
  title: string;
  isRead: boolean;
  productImageUrl?: string;
  actionType?: 'created' | 'approved' | 'rejected' | 'info';
  createdAt: string;
  productId: string;
}
