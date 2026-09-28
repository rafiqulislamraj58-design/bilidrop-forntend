import { useState, useEffect } from 'react';
import { Truck, Search, Filter, MapPin, Phone, User, Calendar, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import axiosInstance from '../../api/axiosInstance';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', badgeClass: 'badge-warning' },
  { value: 'approved', label: 'Approved', badgeClass: 'badge-info' },
  { value: 'out_for_delivery', label: 'Out for Delivery', badgeClass: 'badge-secondary' },
  { value: 'delivered', label: 'Delivered', badgeClass: 'badge-success' },
  { value: 'cancelled', label: 'Cancelled', badgeClass: 'badge-error' },
];

export default function ManageDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const mockDeliveries = [
    {
      _id: 'del_101',
      bookTitle: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      bookCover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
      userName: 'Karim Ahmed',
      userEmail: 'karim@example.com',
      phone: '+880 1711-223344',
      address: 'House 42, Road 11, Block D, Dhanmondi, Dhaka',
      rentalFee: 8.5,
      status: 'pending',
      createdAt: '2026-09-25T10:30:00Z',
    },
    {
      _id: 'del_102',
      bookTitle: 'Atomic Habits',
      bookCover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
      userName: 'Sumaiya Akter',
      userEmail: 'sumaiya@example.com',
      phone: '+880 1811-334455',
      address: 'Sector 7, Road 4, House 12, Uttara, Dhaka',
      rentalFee: 6.0,
      status: 'out_for_delivery',
      createdAt: '2026-09-24T14:15:00Z',
    },
    {
      _id: 'del_103',
      bookTitle: 'Sapiens: A Brief History of Humankind',
      bookCover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
      userName: 'Tanvir Hossain',
      userEmail: 'tanvir@example.com',
      phone: '+880 1911-445566',
      address: 'Block B, Section 10, Mirpur, Dhaka',
      rentalFee: 7.2,
      status: 'delivered',
      createdAt: '2026-09-20T09:00:00Z',
    },
  ];

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/deliveries');
      setDeliveries(res.data.deliveries || res.data || mockDeliveries);
    } catch (err) {
      setDeliveries(mockDeliveries);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleStatusUpdate = async (deliveryId, currentStatus, newStatus) => {
    if (currentStatus === newStatus) return;

    const result = await Swal.fire({
      title: 'Update Delivery Status?',
      text: `Change order status from "${currentStatus.replace('_', ' ')}" to "${newStatus.replace('_', ' ')}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, update status',
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.patch(`/deliveries/status/${deliveryId}`, { status: newStatus });

        setDeliveries((prev) =>
          prev.map((item) => (item._id === deliveryId ? { ...item, status: newStatus } : item))
        );

        Swal.fire({
          title: 'Status Updated!',
          text: `Order status changed to ${newStatus.replace('_', ' ')}.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          title: 'Update Failed',
          text: err.response?.data?.message || 'Failed to update order status.',
          icon: 'error',
        });
      }
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-warning gap-1 text-xs py-2 px-3 font-semibold"><Clock size={12} /> Pending</span>;
      case 'approved':
        return <span className="badge badge-info gap-1 text-xs py-2 px-3 font-semibold"><AlertCircle size={12} /> Approved</span>;
      case 'out_for_delivery':
        return <span className="badge badge-secondary gap-1 text-xs py-2 px-3 font-semibold"><Truck size={12} /> Out for Delivery</span>;
      case 'delivered':
        return <span className="badge badge-success gap-1 text-xs py-2 px-3 font-semibold"><CheckCircle2 size={12} /> Delivered</span>;
      case 'cancelled':
        return <span className="badge badge-error gap-1 text-xs py-2 px-3 font-semibold"><XCircle size={12} /> Cancelled</span>;
      default:
        return <span className="badge badge-ghost text-xs capitalize">{status}</span>;
    }
  };

  const filteredDeliveries = deliveries.filter((item) => {
    const matchesSearch =
      item.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Truck className="text-primary" /> Delivery Requests Management
          </h1>
          <p className="text-sm text-base-content/70 mt-1">
            Track book delivery requests, view recipient addresses, and update dispatch statuses.
          </p>
        </div>
        <div className="badge badge-primary badge-outline font-semibold p-3 text-xs">
          Total Orders: {filteredDeliveries.length}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-base-100 p-4 rounded-2xl border border-base-300">

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" size={18} />
          <input
            type="text"
            placeholder="Search book, customer, or address..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter size={16} className="text-base-content/60 hidden sm:block" />
          <div className="join">
            <button
              className={`btn btn-sm join-item capitalize ${statusFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`btn btn-sm join-item capitalize ${statusFilter === opt.value ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setStatusFilter(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-sm text-base-content/70">Loading delivery orders...</p>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Truck className="mx-auto text-base-content/30" size={48} />
            <h3 className="font-bold text-lg">No delivery requests found</h3>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto">
              No orders match your selected status filter or search parameters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200/50 text-xs text-base-content/70 uppercase">
                <tr>
                  <th>Order Details</th>
                  <th>Customer Info</th>
                  <th>Delivery Address</th>
                  <th>Fee</th>
                  <th>Current Status</th>
                  <th className="text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {filteredDeliveries.map((item) => (
                  <tr key={item._id} className="hover:bg-base-200/30 transition-colors">

                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={item.bookCover}
                          alt={item.bookTitle}
                          className="w-10 h-14 object-cover rounded-lg shadow-sm border border-base-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/100x140?text=No+Cover';
                          }}
                        />
                        <div className="max-w-xs">
                          <div className="font-bold text-sm truncate">{item.bookTitle}</div>
                          <div className="text-[11px] text-base-content/60 flex items-center gap-1 mt-0.5">
                            <Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs flex items-center gap-1">
                          <User size={12} className="text-primary" /> {item.userName}
                        </div>
                        <div className="text-[11px] text-base-content/60">{item.userEmail}</div>
                        <div className="text-[11px] text-base-content/70 flex items-center gap-1 font-mono">
                          <Phone size={10} /> {item.phone}
                        </div>
                      </div>
                    </td>
                    <td className="max-w-xs">
                      <div className="text-xs text-base-content/80 flex items-start gap-1">
                        <MapPin size={14} className="text-error shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{item.address}</span>
                      </div>
                    </td>
                    <td className="font-bold text-sm text-primary">
                      ${parseFloat(item.rentalFee).toFixed(2)}
                    </td>

                    <td>{renderStatusBadge(item.status)}</td>

                    <td className="text-right">
                      <select
                        className="select select-bordered select-xs font-semibold focus:select-primary"
                        value={item.status}
                        onChange={(e) => handleStatusUpdate(item._id, item.status, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
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