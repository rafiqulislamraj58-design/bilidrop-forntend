import { useState, useEffect } from 'react';
import { Heart, Search, Trash2, ShoppingBag, BookOpen, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosInstance from '../../api/axiosInstance';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');


  const mockWishlist = [
    {
      _id: 'wish_01',
      bookId: 'b_101',
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      category: 'Software Engineering',
      coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
      rentalFee: 8.5,
      rating: 4.8,
      inStock: true,
    },
    {
      _id: 'wish_02',
      bookId: 'b_102',
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      author: 'Erich Gamma et al.',
      category: 'Computer Science',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
      rentalFee: 10.0,
      rating: 4.9,
      inStock: false,
    },
    {
      _id: 'wish_03',
      bookId: 'b_103',
      title: 'JavaScript: The Good Parts',
      author: 'Douglas Crockford',
      category: 'Web Development',
      coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
      rentalFee: 5.5,
      rating: 4.6,
      inStock: true,
    },
  ];


  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/wishlist');
      setWishlist(res.data.wishlist || res.data || mockWishlist);
    } catch (err) {
      setWishlist(mockWishlist);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);


  const handleRemoveFromWishlist = async (wishlistId, title) => {
    const result = await Swal.fire({
      title: 'Remove from Wishlist?',
      text: `Are you sure you want to remove "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove it',
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/wishlist/${wishlistId}`);
        setWishlist((prev) => prev.filter((item) => item._id !== wishlistId));
        Swal.fire({
          title: 'Removed!',
          text: 'Item removed from your wishlist.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to remove item from wishlist.',
          icon: 'error',
        });
      }
    }
  };

  const filteredWishlist = wishlist.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Heart className="text-error fill-error/20" /> My Saved Wishlist
          </h1>
          <p className="text-sm text-base-content/70 mt-1">
            Keep track of books you plan to rent in the future or check availability for.
          </p>
        </div>
        <div className="badge badge-neutral font-semibold p-3 text-xs">
          Saved Items: {filteredWishlist.length}
        </div>
      </div>

      <div className="bg-base-100 p-4 rounded-2xl border border-base-300 flex justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" size={18} />
          <input
            type="text"
            placeholder="Search wishlist by title, author, category..."
            className="input input-bordered w-full pl-10 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-base-100 rounded-2xl border border-base-300">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm text-base-content/70 mt-2">Loading saved wishlist...</p>
        </div>
      ) : filteredWishlist.length === 0 ? (
        <div className="p-12 text-center bg-base-100 rounded-2xl border border-base-300 space-y-4">
          <Heart className="mx-auto text-base-content/20" size={56} />
          <h3 className="font-bold text-lg">Your Wishlist is Empty</h3>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto">
            You haven't added any books to your wishlist yet. Explore our catalog and bookmark your favorite titles!
          </p>
          <Link to="/books" className="btn btn-primary btn-sm gap-2">
            <BookOpen size={16} /> Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWishlist.map((item) => (
            <div
              key={item._id}
              className="bg-base-100 border border-base-300 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>

                <div className="flex gap-4">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-20 h-28 object-cover rounded-xl border border-base-300 shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/100x140?text=No+Cover';
                    }}
                  />
                  <div className="space-y-1">
                    <span className="badge badge-ghost text-[10px] font-semibold">{item.category}</span>
                    <h3 className="font-bold text-sm line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-base-content/60">{item.author}</p>
                    
                    <div className="flex items-center gap-1 text-xs text-warning font-semibold pt-1">
                      <Star size={12} className="fill-warning" /> {item.rating}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-base-200 mt-4 pt-3 text-xs">
                  <div>
                    <span className="text-base-content/60">Rental Fee: </span>
                    <strong className="text-primary font-extrabold text-sm">${item.rentalFee.toFixed(2)}</strong>
                  </div>
                  <div>
                    {item.inStock ? (
                      <span className="badge badge-success badge-soft text-[10px] font-semibold">In Stock</span>
                    ) : (
                      <span className="badge badge-error badge-soft text-[10px] font-semibold">Out of Stock</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-base-200">
                <button
                  onClick={() => handleRemoveFromWishlist(item._id, item.title)}
                  className="btn btn-ghost btn-sm text-error p-2 hover:bg-error/10"
                  title="Remove from Wishlist"
                >
                  <Trash2 size={16} />
                </button>

                <Link
                  to={`/books/${item.bookId}`}
                  className={`btn btn-sm flex-1 gap-2 ${
                    item.inStock ? 'btn-primary' : 'btn-disabled'
                  }`}
                >
                  <ShoppingBag size={14} /> {item.inStock ? 'Rent Now' : 'Unavailable'}
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}