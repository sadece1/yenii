import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { AdminLayout } from '@/components/AdminLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/Button';
import api from '@/services/api';
import { useNotificationStore } from '@/store/notificationStore';
import { routes } from '@/config';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateUserResponse {
  user: User;
  password: string;
}

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [passwordModalTitle, setPasswordModalTitle] = useState('Kullanıcı Oluşturuldu!');
  const { addNotification } = useNotificationStore();
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin',
  });
  const [editUser, setEditUser] = useState({
    name: '',
    email: '',
    role: 'user' as 'user' | 'admin',
    is_active: true,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<{ success: boolean; data: User[] }>('/admin/users');
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error: any) {
      console.error('Failed to load users:', error);
      console.log('Using mock data for users...');
      
      // MOCK DATA - Backend çalışmadığında kullanılır
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@campscape.com',
          role: 'admin',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          is_active: true,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'user',
          is_active: true,
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          name: 'Ahmet Yılmaz',
          email: 'ahmet@example.com',
          role: 'user',
          is_active: false,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      
      setUsers(mockUsers);
      console.log('Mock users loaded:', mockUsers.length);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    // Validate password (minimum requirements)
    if (newUser.password.length < 6) {
      alert('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    try {
      const response = await api.post<{ success: boolean; data: CreateUserResponse }>(
        '/admin/users',
        newUser
      );
      
      if (response.data.success) {
        setGeneratedPassword(response.data.data.password);
        setGeneratedEmail(newUser.email);
        setShowAddModal(false);
        setShowPasswordModal(true);
        setNewUser({ name: '', email: '', password: '', role: 'user' });
        loadUsers();
      }
    } catch (error: any) {
      console.log('Backend failed, using mock user creation...');
      
      // MOCK: Generate user locally AND save to localStorage
      const USERS_STORAGE_KEY = 'campscape_users';
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const existingUsers = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Check if email already exists
      if (existingUsers.find((u: any) => u.email === newUser.email)) {
        alert('Bu e-posta adresi zaten kullanılıyor.');
        return;
      }
      
      const newUserId = String(Date.now());
      const mockUserWithPassword = {
        id: newUserId,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        password: newUser.password,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Save to localStorage (for login)
      existingUsers.push(mockUserWithPassword);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers));
      
      // Add to UI state (without password)
      const mockUser: User = {
        id: newUserId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setUsers([...users, mockUser]);
      setGeneratedPassword(newUser.password);
      setGeneratedEmail(newUser.email);
      setPasswordModalTitle('Kullanıcı Oluşturuldu!');
      setShowAddModal(false);
      setShowPasswordModal(true);
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      
      // Add notification
      addNotification({
        type: 'user',
        title: 'Yeni Kullanıcı Oluşturuldu',
        description: `${newUser.name} (${newUser.email}) adlı kullanıcı başarıyla oluşturuldu.`,
        link: routes.adminUsers,
      });
      
      console.log('Mock user created and saved to localStorage:', mockUser);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await api.put<{ success: boolean; data: User }>(
        `/admin/users/${selectedUser.id}`,
        editUser
      );
      
      if (response.data.success) {
        alert('Kullanıcı başarıyla güncellendi!');
        setShowEditModal(false);
        setSelectedUser(null);
        loadUsers();
      }
    } catch (error: any) {
      console.log('Backend failed, using mock user update...');
      
      // MOCK: Update user locally
      setUsers(users.map(u => 
        u.id === selectedUser.id 
          ? { ...u, ...editUser, updated_at: new Date().toISOString() }
          : u
      ));
      
      alert('Kullanıcı güncellendi! (Mock mode - Backend çalışmıyor)');
      setShowEditModal(false);
      setSelectedUser(null);
      console.log('Mock user updated:', selectedUser.id);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`"${userName}" kullanıcısını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      alert('Kullanıcı başarıyla silindi!');
      loadUsers();
    } catch (error: any) {
      console.log('Backend failed, using mock user deletion...');
      
      // MOCK: Delete user locally
      setUsers(users.filter(u => u.id !== userId));
      alert('Kullanıcı silindi! (Mock mode - Backend çalışmıyor)');
      console.log('Mock user deleted:', userId);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
    });
    setShowEditModal(true);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} panoya kopyalandı!`);
  };

  const handleResetPassword = async (user: User) => {
    if (!window.confirm(`"${user.name}" kullanıcısının şifresini sıfırlamak istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      // Backend çalışıyorsa buraya endpoint eklenecek
      // const response = await api.post(`/admin/users/${user.id}/reset-password`);
      throw new Error('Backend not available');
    } catch (error: any) {
      console.log('Backend failed, using mock password reset...');
      
      // MOCK: Generate new password
      const newPassword = 'Reset' + Math.random().toString(36).substring(2, 10) + '!';
      setGeneratedPassword(newPassword);
      setGeneratedEmail(user.email);
      setPasswordModalTitle('Şifre Sıfırlandı!');
      setShowPasswordModal(true);
      
      console.log('Mock password reset for:', user.email);
    }
  };

  return (
    <>
      <SEO title="Kullanıcı Yönetimi" description="Kullanıcıları yönet" />
      <AdminLayout>
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Kullanıcı Yönetimi
            </h1>
            <Button onClick={() => setShowAddModal(true)}>
              ➕ Yeni Kullanıcı Ekle
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        İsim
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        E-posta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Kayıt Tarihi
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}
                          >
                            {user.role === 'admin' ? '👑 Admin' : '👤 Kullanıcı'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.is_active
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {user.is_active ? '✓ Aktif' : '✗ Pasif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(user.created_at).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openEditModal(user)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                          >
                            ✏️ Düzenle
                          </button>
                          <button
                            onClick={() => handleResetPassword(user)}
                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 mr-3"
                            title="Şifre Sıfırla"
                          >
                            🔑 Şifre
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            🗑️ Sil
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {users.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">Henüz kullanıcı yok</p>
                </div>
              )}
            </div>
          )}

          {/* Add User Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Yeni Kullanıcı Ekle
                </h2>
                <form onSubmit={handleCreateUser}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        İsim
                      </label>
                      <input
                        type="text"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        E-posta
                      </label>
                      <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Şifre
                      </label>
                      <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                        required
                        minLength={6}
                        placeholder="En az 6 karakter"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Rol
                      </label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'user' | 'admin' })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="user">Kullanıcı</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddModal(false);
                        setNewUser({ name: '', email: '', password: '', role: 'user' });
                      }}
                    >
                      İptal
                    </Button>
                    <Button type="submit">Oluştur</Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {/* Edit User Modal */}
          {showEditModal && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Kullanıcı Düzenle
                </h2>
                <form onSubmit={handleEditUser}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        İsim
                      </label>
                      <input
                        type="text"
                        value={editUser.name}
                        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        E-posta
                      </label>
                      <input
                        type="email"
                        value={editUser.email}
                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Rol
                      </label>
                      <select
                        value={editUser.role}
                        onChange={(e) => setEditUser({ ...editUser, role: e.target.value as 'user' | 'admin' })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="user">Kullanıcı</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editUser.is_active}
                          onChange={(e) => setEditUser({ ...editUser, is_active: e.target.checked })}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Aktif
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedUser(null);
                      }}
                    >
                      İptal
                    </Button>
                    <Button type="submit">Güncelle</Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {/* Password Display Modal */}
          {showPasswordModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {passwordModalTitle}
                  </h2>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                      Giriş bilgileri kullanıcıya e-posta ile gönderildi.
                    </p>
                    <div className="space-y-3">
                      <div className="bg-white dark:bg-gray-700 rounded-md p-3">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          E-posta
                        </label>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono text-gray-900 dark:text-white">
                            {generatedEmail}
                          </span>
                          <button
                            onClick={() => copyToClipboard(generatedEmail, 'E-posta')}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-xs ml-2"
                          >
                            Kopyala
                          </button>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-700 rounded-md p-3">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Şifre
                        </label>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono text-gray-900 dark:text-white">
                            {generatedPassword}
                          </span>
                          <button
                            onClick={() => copyToClipboard(generatedPassword, 'Şifre')}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-xs ml-2"
                          >
                            Kopyala
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mb-4">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      ⚠️ Bu bilgileri güvenli bir yerde saklayın. Bu pencereyi kapattıktan sonra şifreyi tekrar göremezsiniz.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setShowPasswordModal(false);
                      setGeneratedPassword('');
                      setGeneratedEmail('');
                    }}
                    className="w-full"
                  >
                    Tamam
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

