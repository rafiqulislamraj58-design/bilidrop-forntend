import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { 
  BookOpen, 
  Star, 
  Heart, 
  ShieldCheck, 
  Truck, 
  ArrowLeft, 
  Tag, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShoppingBag 
} from 'lucide-react';
import Swal from 'sweetalert2';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../hooks/useAuth';
import CheckoutModal from '../components/CheckoutModal';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_sample_key_123');

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock Fallback Data
  const mockBook = {
    _id: id || 'b_101',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    category: 'Software Engineering',
    publisher: 'Prentice Hall',
    language: 'English',
    pages: 464,
    isbn: '978-0132350884',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600',
    rentalFee: 8.50,
    depositFee: 15.00,
    rating: 4.8,
    reviewsCount: 124,
    copiesAvailable: 4,
    description: `Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn't have to be that way. 

Noted software expert Robert C. Martin presents a revolutionary paradigm with Clean Code: A Handbook of Agile Software Craftsmanship. Martin has teamed up with his colleagues from Object Mentor to distill their best agile practice of cleaning code "on the fly" into a book that will instill within you the values of a software craftsman.`,
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/books/${id}`);
        setBook(res.data.book || res.data || mockBook);
      } catch (err) {
        setBook(mockBook);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  // Wishlist Toggle
  const handleWishlistToggle = async () => {
    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please log in to add books to your wishlist.',
        icon: 'info',
        confirmButtonText: 'Go to Login',
      }).then(() => navigate('/login'));
      return;
    }

    try {
      if (isWishlisted) {
        await axiosInstance.delete(`/wishlist/book/${id}`);
        setIsWishlisted(false);
        Swal.fire({ title: 'Removed', text: 'Removed from Wishlist', icon: 'success', timer: 1200, showConfirmButton: false });
      } else {
        await axiosInstance.post('/wishlist', { bookId: id });
        setIsWishlisted(true);
        Swal.fire({ title: 'Saved!', text: 'Added to your Wishlist', icon: 'success', timer: 1200, showConfirmButton: false });
      }
    } catch (err) {
      setIsWishlisted(!isWishlisted);
    }
  };

  const handleRentNowClick = () => {
    if (!user) {
      Swal.fire({
        title: 'Please Sign In',
        text: 'You need an account to request book delivery.',
        icon: 'warning',
        confirmButtonText: 'Sign In',
      }).then(() => navigate('/login'));
      return;
    }
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-3">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-xs text-base-content/70">Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-20 space-y-4">
        <BookOpen className="mx-auto text-base-content/30" size={56} />
        <h2 className="text-2xl font-bold">Book Not Found</h2>
        <Link to="/books" className="btn btn-primary btn-sm">
          Back to Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
   
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-base-content"
      >
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
    
        <div className="md:col-span-5 lg:col-span-4 space-y-4">
          <div className="relative group rounded-3xl overflow-hidden border border-base-300 shadow-lg bg-base-100">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/400x600?text=No+Cover';
              }}
            />

            <button
              onClick={handleWishlistToggle}
              className="absolute top-4 right-4 btn btn-circle btn-neutral/80 backdrop-blur-md shadow-md border-0 hover:bg-neutral"
              title="Toggle Wishlist"
            >
              <Heart
                size={20}
                className={isWishlisted ? 'fill-error text-error' : 'text-base-100'}
              />
            </button>
          </div>

          <div className="bg-base-100 p-4 rounded-2xl border border-base-300 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-base-200">
              <span className="text-base-content/60">Publisher:</span>
              <span className="font-semibold">{book.publisher}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-base-200">
              <span className="text-base-content/60">Pages:</span>
              <span className="font-semibold">{book.pages}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-base-200">
              <span className="text-base-content/60">Language:</span>
              <span className="font-semibold">{book.language}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-base-content/60">ISBN:</span>
              <span className="font-mono font-semibold">{book.isbn}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 lg:col-span-8 space-y-6">
          
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-primary gap-1 font-semibold text-xs py-2 px-3">
                <Tag size={12} /> {book.category}
              </span>
              {book.copiesAvailable > 0 ? (
                <span className="badge badge-success badge-soft gap-1 text-xs py-2 px-3">
                  <CheckCircle2 size={12} /> {book.copiesAvailable} Available in Library
                </span>
              ) : (
                <span className="badge badge-error badge-soft gap-1 text-xs py-2 px-3">
                  <XCircle size={12} /> Out of Stock
                </span>
              )}
            </div>

            <h1 className="text-3xl font-black text-base-content leading-tight">{book.title}</h1>
            <p className="text-sm text-base-content/70 font-medium flex items-center gap-2">
              <UserCheck size={16} className="text-primary" /> Author: <strong className="text-base-content">{book.author}</strong>
            </p>

            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center text-warning">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(book.rating) ? 'fill-warning' : 'text-base-300'}
                  />
                ))}
              </div>
              <span className="font-extrabold text-sm">{book.rating}</span>
              <span className="text-xs text-base-content/50">({book.reviewsCount} borrower reviews)</span>
            </div>
          </div>

          <div className="bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-base-200 pb-4">
              <div>
                <span className="text-xs text-base-content/60 font-semibold block uppercase tracking-wider">7 Days Rental Fee</span>
                <span className="text-3xl font-black text-primary">${book.rentalFee?.toFixed(2)}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-base-content/60 font-semibold block uppercase tracking-wider">Refundable Security Deposit</span>
                <span className="text-xl font-bold text-base-content">${book.depositFee?.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-base-content/70 pt-1">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-primary shrink-0" />
                <span>Doorstep delivery & pickup included</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-success shrink-0" />
                <span>Full deposit refunded upon book return</span>
              </div>
            </div>

            <button
              onClick={handleRentNowClick}
              disabled={book.copiesAvailable === 0}
              className="btn btn-primary btn-lg w-full gap-2 shadow-lg mt-2 text-base font-bold"
            >
              <ShoppingBag size={20} />
              {book.copiesAvailable > 0 ? 'Rent This Book Now' : 'Currently Unavailable'}
            </button>
          </div>

   
          <div className="space-y-3 pt-2">
            <h3 className="text-lg font-bold border-b border-base-200 pb-2">Synopsis & Overview</h3>
            <p className="text-sm text-base-content/80 leading-relaxed whitespace-pre-line">
              {book.description}
            </p>
          </div>

        </div>

      </div>


      <Elements stripe={stripePromise}>
        <CheckoutModal
          book={book}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setBook((prev) => ({ ...prev, copiesAvailable: Math.max(0, prev.copiesAvailable - 1) }));
          }}
        />
      </Elements>

    </div>
  );
}