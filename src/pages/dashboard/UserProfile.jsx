import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, ShieldCheck, Calendar, Edit3, Save, BookOpen, Truck, Heart } from 'lucide-react';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import axiosInstance from '../../api/axiosInstance';

export default function UserProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);


  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || 'Karim Ahmed',
    email: user?.email || 'karim@example.com',
    photoURL: user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    phone: '+880 1711-223344',
    address: 'House 42, Road 11, Block D, Dhanmondi, Dhaka',
    role: 'Member',
    joinedDate: '2026-01-15',
  });

  const stats = [
    { label: 'Books Rented', value: '12', icon: BookOpen, color: 'text-primary' },
    { label: 'Active Deliveries', value: '2', icon: Truck, color: 'text-secondary' },
    { label: 'Wishlist Saved', value: '5', icon: Heart, color: 'text-error' },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get('/users/me');
        if (res.data) {
          setProfileData((prev) => ({ ...prev, ...res.data }));
        }
      } catch (err) {
  console.log('error',err)
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.patch('/users/update-profile', profileData);
      setIsEditing(false);
      Swal.fire({
        title: 'Profile Updated!',
        text: 'Your profile details have been saved successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        title: 'Update Failed',
        text: err.response?.data?.message || 'Failed to update profile.',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <User className="text-primary" /> My Profile
          </h1>
          <p className="text-sm text-base-content/70 mt-1">
            Manage your personal account details, shipping contact information, and membership status.
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`btn btn-sm ${isEditing ? 'btn-ghost border-base-300' : 'btn-primary'} gap-2`}
        >
          {isEditing ? 'Cancel Edit' : <><Edit3 size={15} /> Edit Profile</>}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-base-100 p-5 rounded-2xl border border-base-300 flex items-center gap-4 shadow-sm">
              <div className={`p-3 bg-base-200 rounded-xl ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <div className="text-2xl font-black">{stat.value}</div>
                <div className="text-xs text-base-content/70 font-medium">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm">
        {!isEditing ? (
     
          <div className="flex flex-col md:flex-row gap-8 items-start">

            <div className="flex flex-col items-center text-center space-y-3 w-full md:w-1/3 border-b md:border-b-0 md:border-r border-base-200 pb-6 md:pb-0 md:pr-6">
              <div className="avatar">
                <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow-md">
                  <img src={profileData.photoURL} alt={profileData.displayName} />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold">{profileData.displayName}</h2>
                <span className="badge badge-primary badge-outline text-xs capitalize mt-1">
                  <ShieldCheck size={12} className="mr-1" /> {profileData.role}
                </span>
              </div>
              <div className="text-xs text-base-content/60 flex items-center gap-1 font-mono">
                <Calendar size={13} /> Member since {profileData.joinedDate}
              </div>
            </div>

            <div className="flex-1 space-y-5 w-full">
              <h3 className="text-base font-bold border-b border-base-200 pb-2">Contact & Shipping Info</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                
                <div className="space-y-1">
                  <span className="text-xs text-base-content/60 flex items-center gap-1">
                    <Mail size={13} /> Email Address
                  </span>
                  <p className="font-semibold text-base-content">{profileData.email}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-base-content/60 flex items-center gap-1">
                    <Phone size={13} /> Phone Number
                  </span>
                  <p className="font-semibold text-base-content font-mono">{profileData.phone}</p>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <span className="text-xs text-base-content/60 flex items-center gap-1">
                    <MapPin size={13} /> Default Delivery Address
                  </span>
                  <p className="font-semibold text-base-content">{profileData.address}</p>
                </div>

              </div>
            </div>

          </div>
        ) : (
      
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <h3 className="text-base font-bold border-b border-base-200 pb-2">Update Account Profile</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              
              <div className="form-control">
                <label className="label label-text font-semibold">Full Name</label>
                <input
                  type="text"
                  name="displayName"
                  className="input input-bordered w-full text-sm"
                  value={profileData.displayName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label label-text font-semibold">Email (Read Only)</label>
                <input
                  type="email"
                  className="input input-bordered w-full text-sm bg-base-200"
                  value={profileData.email}
                  disabled
                />
              </div>

              <div className="form-control">
                <label className="label label-text font-semibold">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className="input input-bordered w-full text-sm font-mono"
                  value={profileData.phone}
                  onChange={handleChange}
                  placeholder="+880 1XXXXXXXXX"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label label-text font-semibold">Profile Photo URL</label>
                <input
                  type="url"
                  name="photoURL"
                  className="input input-bordered w-full text-sm"
                  value={profileData.photoURL}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-control sm:col-span-2">
                <label className="label label-text font-semibold">Default Delivery Address</label>
                <textarea
                  name="address"
                  className="textarea textarea-bordered w-full text-sm"
                  rows="3"
                  value={profileData.address}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-base-200">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-sm gap-2"
              >
                {loading ? <span className="loading loading-spinner loading-xs"></span> : <Save size={15} />}
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}