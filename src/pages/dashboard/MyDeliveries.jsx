import { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle, 
  XCircle, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  FileText 
} from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

const ORDER_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'approved', label: 'Approved', icon: AlertCircle },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

export default function MyDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Mock Fallback Data for Testing
  const mockUserDeliveries = [
    {
      _id: 'del_101',
      bookTitle: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      bookAuthor: 'Robert C. Martin',
      bookCover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
      rentalFee: 8.50,
      depositFee: 15.00,
      deliveryAddress: 'House 42, Road 11, Block D, Dhanmondi, Dhaka',
      phone: '+880 1711-223344',
      status: 'out_for_delivery',
      estimatedDelivery: '2026-09-30',
      createdAt: '2026-09-25T10:30:00Z',
      trackingHistory: [
        { status: 'pending', time: '2026-09-25 10:30 AM', note: 'Order submitted and pending confirmation.' },
        { status: 'approved', time: '2026-09-26 11:15 AM', note: 'Book prepared and order approved by librarian.' },
        { status: 'out_for_delivery', time: '2026-09-28 09:00 AM', note: 'Handed over to delivery agent.' },
      ]
    },
    {
      _id: 'del_102',
      bookTitle: 'Atomic Habits',
      bookAuthor: 'James Clear',
      bookCover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
      rentalFee: 6.00,
      depositFee: 10.00,
      deliveryAddress: 'House 42, Road 11, Block D, Dhanmondi, Dhaka',
      phone: '+880 1711-223344',
      status: 'pending',
      estimatedDelivery: '2026-10-02',
      createdAt: '2026-09-28T08:00:00Z',
      trackingHistory: [
        { status: 'pending', time: '2026-09-28 08:00 AM', note: 'Order submitted successfully.' }
      ]
    },
    {
      _id: 'del_103',
      bookTitle: 'Sapiens: A Brief History of Humankind',
      bookAuthor: 'Yuval Noah Harari',
      bookCover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
      rentalFee: 7.20,
      depositFee: 12.00,
      deliveryAddress: 'House 42, Road 11, Block D, Dhanmondi, Dhaka',
      phone: '+880 1711-223344',
      status: 'delivered',
      estimatedDelivery: '2026-09-22',
      createdAt: '2026-09-18T14:20:00Z',
      trackingHistory: [
        { status: 'pending', time: '2026-09-18 02:20 PM', note: 'Order placed.' },
        { status: 'approved', time: '2026-09-19 10:00 AM', note: 'Approved by librarian.' },
        { status: 'out_for_delivery', time: '2026-09-21 08:30 AM', note: 'Dispatched for delivery.' },
        { status: 'delivered', time: '2026-09-22 03:45 PM', note: 'Delivered to recipient.' },
      ]
    }
  ];

  // Fetch My Deliveries
  useEffect(() => {
    const fetchMyDeliveries = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/deliveries/my-deliveries');
        setDeliveries(res.data.deliveries || res.data || mockUserDeliveries);
      } catch (err) {
        setDeliveries(mockUserDeliveries);
      } finally {
        setLoading(false);
      }
    };
    fetchMyDeliveries();
  }, []);

  // Get active step index for status
  const getStepIndex = (status) => {
    switch (status) {
      case 'pending': return 0;
      case 'approved': return 1;
      case 'out_for_delivery': return 2;
      case 'delivered': return 3;
      default: return -1;
    }
  };

  // Status Badge Helper
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

  // Filtering
  const filteredDeliveries = deliveries.filter((order) => {
    const matchesSearch =
      order.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Package className="text-primary" /> My Deliveries & Order Tracking
          </h1>
          <p className="text-sm text-base-content/70 mt-1">
            Track real-time status updates and delivery timelines for your requested rental books.
          </p>
        </div>
        <div className="badge badge-primary badge-outline font-semibold p-3 text-xs">
          Total Orders: {filteredDeliveries.length}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-base-100 p-4 rounded-2xl border border-base-300">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" size={18} />
          <input
            type="text"
            placeholder="Search by book title or order ID..."
            className="input input-bordered w-full pl-10 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'pending', 'approved', 'out_for_delivery', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`btn btn-sm capitalize ${
                filterStatus === status ? 'btn-primary' : 'btn-ghost'
              }`}
            >
              {status === 'out_for_delivery' ? 'On The Way' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="p-12 text-center bg-base-100 rounded-2xl border border-base-300">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm text-base-content/70 mt-2">Loading your orders...</p>
        </div>
      ) : filteredDeliveries.length === 0 ? (
        <div className="p-12 text-center bg-base-100 rounded-2xl border border-base-300 space-y-3">
          <Package className="mx-auto text-base-content/30" size={48} />
          <h3 className="font-bold text-lg">No delivery orders found</h3>
          <p className="text-xs text-base-content/60">
            You haven't placed any delivery requests matching this filter yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDeliveries.map((order) => {
            const currentStepIdx = getStepIndex(order.status);
            const isCancelled = order.status === 'cancelled';
            const isExpanded = expandedOrder === order._id;

            return (
              <div
                key={order._id}
                className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm space-y-5 transition-all"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-base-200 pb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={order.bookCover}
                      alt={order.bookTitle}
                      className="w-12 h-16 object-cover rounded-lg border border-base-300 shadow-xs"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/100x140?text=No+Cover';
                      }}
                    />
                    <div>
                      <h3 className="font-bold text-base line-clamp-1">{order.bookTitle}</h3>
                      <p className="text-xs text-base-content/60">by {order.bookAuthor}</p>
                      <div className="flex items-center gap-3 text-[11px] text-base-content/70 mt-1 font-mono">
                        <span>ID: <strong className="text-base-content">{order._id}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className="text-right">
                      <div className="text-xs text-base-content/60">Rental Fee</div>
                      <div className="text-base font-extrabold text-primary">
                        ${order.rentalFee.toFixed(2)}
                      </div>
                    </div>
                    <div>{renderStatusBadge(order.status)}</div>
                  </div>
                </div>

                {/* Status Timeline */}
                {!isCancelled ? (
                  <div className="py-2">
                    <div className="text-xs font-semibold text-base-content/70 mb-3 flex items-center gap-1">
                      <Truck size={14} className="text-primary" /> Live Delivery Progress
                    </div>
                    
                    {/* DaisyUI Stepper */}
                    <ul className="steps steps-vertical sm:steps-horizontal w-full text-xs">
                      {ORDER_STEPS.map((step, idx) => {
                        const isCompleted = currentStepIdx >= idx;
                        const StepIcon = step.icon;
                        return (
                          <li
                            key={step.key}
                            data-content={isCompleted ? '✓' : idx + 1}
                            className={`step ${isCompleted ? 'step-primary font-semibold' : 'text-base-content/50'}`}
                          >
                            <span className="flex items-center gap-1 mt-1">
                              <StepIcon size={13} className="hidden sm:inline" /> {step.label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <div className="alert alert-error/10 border border-error/30 rounded-xl py-3 px-4 flex items-center gap-2 text-xs text-error font-medium">
                    <XCircle size={16} /> Order was cancelled. Please contact support if you need assistance.
                  </div>
                )}

                {/* Delivery Details Toggle & Accordion */}
                <div className="border-t border-base-200 pt-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div className="text-xs text-base-content/70 flex items-center gap-1">
                    <MapPin size={13} className="text-error shrink-0" />
                    <span className="truncate max-w-md"><strong>Address:</strong> {order.deliveryAddress}</span>
                  </div>

                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                    className="btn btn-ghost btn-xs text-primary gap-1 self-end sm:self-auto"
                  >
                    <FileText size={12} />
                    {isExpanded ? 'Hide Details' : 'View Tracking History'}
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                </div>

                {/* Expanded Activity Logs */}
                {isExpanded && (
                  <div className="bg-base-200/50 p-4 rounded-xl text-xs space-y-3 mt-2 border border-base-200">
                    <div className="font-bold text-base-content/80">Tracking History & Activity Log</div>
                    <div className="space-y-2 border-l-2 border-primary/30 pl-3 ml-1">
                      {order.trackingHistory?.map((log, index) => (
                        <div key={index} className="relative space-y-0.5">
                          <div className="font-semibold text-base-content capitalize flex items-center justify-between">
                            <span>{log.status.replace('_', ' ')}</span>
                            <span className="text-[10px] text-base-content/50 font-mono">{log.time}</span>
                          </div>
                          <p className="text-base-content/70 text-[11px]">{log.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}