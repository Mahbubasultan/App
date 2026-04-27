export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  bio?: string;
  address?: string;
  createdAt: string;
  status: string;
}

export interface UserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface DeleteConfirmProps {
  isOpen: boolean;
  userName: string;
  onConfirm: () => void;
  onCancel: () => void;
}
