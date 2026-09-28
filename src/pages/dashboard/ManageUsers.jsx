import { useState, useEffect } from 'react';
import { Users, Shield, UserCheck, BookOpen, Search, Filter } from 'lucide-react';
import Swal from 'sweetalert2';
import axiosInstance from '../../api/axiosInstance';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

 
  const mockUsers = [
    {
      _id: '1',
      name: 'Tanvir Hossain',
      email: 'tanvir@example.com',
      role: 'admin',
      photo: 'https://i.pravatar.cc/150?img=33',
      createdAt: '2026-01-15',
    },
    {
      _id: '2',
      name: 'Rahim Chowdhury',
      email: 'rahim@example.com',
      role: 'librarian',
      photo: 'https://i.pravatar.cc/150?img=12',
      createdAt: '2026-02-10',
    },
    {
      _id: '3',
      name: 'Karim Ahmed',
      email: 'karim@example.com',
      role: 'user',
      photo: 'https://i.pravatar.cc/150?img=60',
      createdAt: '2026-03-01',
    },
    {
      _id: '4',
      name: 'Sumaiya Akter',
      email: 'sumaiya@example.com',
      role: 'user',
      photo: 'https://i.pravatar.cc/150?img=47',
      createdAt: '2026-03-12',
    },
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/users');
      setUsers(res.data.users || res.data || mockUsers);
    } catch (err) {
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, currentRole, newRole) => {
    if (currentRole === newRole) return;

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Change role from "${currentRole}" to "${newRole}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update role!',
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.patch(`/users/role/${userId}`, { role: newRole });
   
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );

        Swal.fire({
          title: 'Updated!',
          text: `User role changed to ${newRole}.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: err.response?.data?.message || 'Failed to update user role.',
          icon: 'error',
        });
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Users className="text-primary" /> Manage Users
          </h1>
          <p className="text-sm text-base-content/70 mt-1">
            View all registered users and assign user, librarian, or admin roles.
          </p>
        </div>
        <div className="badge badge-primary badge-outline text-sm font-semibold p-3">
          Total Users: {filteredUsers.length}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-base-100 p-4 rounded-2xl border border-base-300">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter size={16} className="text-base-content/60 hidden sm:block" />
          <div className="join">
            {['all', 'user', 'librarian', 'admin'].map((role) => (
              <button
                key={role}
                className={`btn btn-sm capitalize join-item ${
                  roleFilter === role ? 'btn-primary' : 'btn-ghost'
                }`}
                onClick={() => setRoleFilter(role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center space-y-3">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-sm text-base-content/70">Loading user list...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="mx-auto text-base-content/30" size={48} />
            <h3 className="font-bold text-lg">No users found</h3>
            <p className="text-xs text-base-content/60">
              Try adjusting your search query or filter selection.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              {/* Table Head */}
              <thead className="bg-base-200/50 text-xs text-base-content/70 uppercase">
                <tr>
                  <th>#</th>
                  <th>User Details</th>
                  <th>Current Role</th>
                  <th>Joined Date</th>
                  <th className="text-right">Change Role</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-base-200">
                {filteredUsers.map((u, idx) => (
                  <tr key={u._id} className="hover:bg-base-200/30 transition-colors">
                    <td className="font-semibold text-xs text-base-content/50">{idx + 1}</td>
               
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-10 h-10 bg-base-300">
                            <img
                              src={u.photo || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'}
                              alt={u.name}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-sm">{u.name}</div>
                          <div className="text-xs text-base-content/60">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      {u.role === 'admin' && (
                        <span className="badge badge-primary gap-1 font-semibold text-xs py-2 px-3">
                          <Shield size={12} /> Admin
                        </span>
                      )}
                      {u.role === 'librarian' && (
                        <span className="badge badge-secondary gap-1 font-semibold text-xs py-2 px-3">
                          <BookOpen size={12} /> Librarian
                        </span>
                      )}
                      {u.role === 'user' && (
                        <span className="badge badge-ghost gap-1 font-semibold text-xs py-2 px-3">
                          <UserCheck size={12} /> Reader
                        </span>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td className="text-xs text-base-content/70 font-medium">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>

                    <td className="text-right">
                      <select
                        className="select select-bordered select-xs font-semibold max-w-xs focus:select-primary"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, u.role, e.target.value)}
                      >
                        <option value="user">User (Reader)</option>
                        <option value="librarian">Librarian</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}