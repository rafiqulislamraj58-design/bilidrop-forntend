import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  BookOpen, 
  Heart, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Tag,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../hooks/useAuth';

const CATEGORIES = [
  'All Categories',
  'Software Engineering',
  'Fiction & Literature',
  'Business & Economics',
  'Science & Technology',
  'Self-Help & Mindset',
  'History & Politics'
];

export default function BrowseBooks() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // State Management
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [wishlistIds, setWishlistIds] = useState([]);

  // Query States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Categories');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooksCount, setTotalBooksCount] = useState(0);

  const itemsPerPage = 8;

  // Mock Fallback Data for Development
  const mockBooks = [
    {
      _id: 'b_101',
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      category: 'Software Engineering',
      rentalFee: 8.50,
      depositFee: 15.00,
      rating: 4.8,
      reviewsCount: 124,
      copiesAvailable: 4,
      coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600'
    },
    {
      _id: 'b_102',
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      category: 'Software Engineering',
      rentalFee: 12.00,
      depositFee: 22.00,
      rating: 4.9,
      reviewsCount: 210,
      copiesAvailable: 2,
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'
    },
    {
      _id: 'b_103',
      title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
      author: 'James Clear',
      category: 'Self-Help & Mindset',
      rentalFee: 6.00,
      depositFee: 10.00,
      rating: 4.9,
      reviewsCount: 450,
      copiesAvailable: 0,
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'
    },
    {
      _id: 'b_104',
      title: 'Zero to One: Notes on Startups, or How to Build the Future',
      author: 'Peter Thiel',
      category: 'Business & Economics',
      rentalFee: 7.50,
      depositFee: 12.00,
      rating: 4.6,
      reviewsCount: 88,
      copiesAvailable: 5,
      coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600'
    },
    {
      _id: 'b_105',
      title: 'The Pragmatic Programmer: Your Journey to Mastery',
      author: 'Andrew Hunt & David Thomas',
      category: 'Software Engineering',
      rentalFee: 9.00,
      depositFee: 18.00,
      rating: 4.8,
      reviewsCount: 175,
      copiesAvailable: 3,
      coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600'
    },
    {
      _id: 'b_106',
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      category: 'History & Politics',
      rentalFee: 7.00,
      depositFee: 14.00,
      rating: 4.7,
      reviewsCount: 320,
      copiesAvailable: 6,
      coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600'
    }
  ];

  // Fetch Books with API integration & Fallback
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: itemsPerPage,
          sort: sortBy,
        });

        if (searchTerm.trim()) queryParams.append('search', searchTerm.trim());
        if (selectedCategory !== 'All Categories') queryParams.append('category', selectedCategory);
        if (inStockOnly) queryParams.append('inStock', 'true');

        // URL Params Sync
        setSearchParams(queryParams);

        const res = await axiosInstance.get(`/books?${queryParams.toString()}`);
        const fetchedData = res.data.books || res.data;
        
        setBooks(fetchedData);
        setTotalPages(res.data.totalPages || 1);
        setTotalBooksCount(res.data.totalCount || fetchedData.length);
      } catch (err) {
        // Fallback Filter Logic
        let filtered = [...mockBooks];

        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          filtered = filtered.filter(b => 
            b.title.toLowerCase().includes(q) || 
            b.author.toLowerCase().includes(q) ||
            b.category.toLowerCase().includes(q)
          );
        }

        if (selectedCategory !== 'All Categories') {
          filtered = filtered.filter(b => b.category === selectedCategory);
        }

        if (inStockOnly) {
          filtered = filtered.filter(b => b.copiesAvailable > 0);
        }

        if (sortBy === 'price-low') filtered.sort((a, b) => a.rentalFee - b.rentalFee);
        if (sortBy === 'price-high') filtered.sort((a, b) => b.rentalFee - a.rentalFee);
        if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

        setBooks(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage) || 1);
        setTotalBooksCount(filtered.length);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchBooks();
    }, 300); // 300ms Debounce

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, sortBy, inStockOnly, currentPage]);

  // Wishlist Toggle Handler
  const handleWishlistToggle = async (bookId) => {
    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please log in to manage your wishlist.',
        icon: 'info',
        confirmButtonText: 'Login'
      });
      return;
    }

    const isAlreadyWishlisted = wishlistIds.includes(bookId);

    try {
      if (isAlreadyWishlisted) {
        await axiosInstance.delete(`/wishlist/book/${bookId}`);
        setWishlistIds(prev => prev.filter(id => id !== bookId));
      } else {
        await axiosInstance.post('/wishlist', { bookId });
        setWishlistIds(prev => [...prev, bookId]);
      }
    } catch (err) {
      // Optimistic Toggle Fallback
      if (isAlreadyWishlisted) {
        setWishlistIds(prev => prev.filter(id => id !== bookId));
      } else {
        setWishlistIds(prev => [...prev, bookId]);
      }
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSortBy('newest');
    setInStockOnly(false);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-base-200 to-base-100 p-6 md:p-8 rounded-3xl border border-base-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-base-content tracking-tight">
            Explore Book Catalog
          </h1>
          <p className="text-xs md:text-sm text-base-content/70 mt-1">
            Browse through hundreds of tech, business, and literature books available for instant delivery.
          </p>
        </div>
        <div className="badge badge-neutral text-xs font-mono py-3 px-4">
          Total Books: {totalBooksCount}
        </div>
      </div>

      {/* Control Bar: Search & Quick Controls */}
      <div className="bg-base-100 p-4 rounded-2xl border border-base-300 shadow-xs space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
            <input
              type="text"
              placeholder="Search by title, author, or keyword..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="input input-bordered w-full pl-10 pr-4 input-sm md:input-md text-xs md:text-sm"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-base-content/50 hover:text-base-content"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-base-content/60 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select select-bordered select-sm md:select-md w-full text-xs md:text-sm"
              >
                <option value="newest">Sort by: Newest Arrival</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle & In-Stock Check */}
          <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-3">
            <label className="label cursor-pointer gap-2 py-0">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="checkbox checkbox-primary checkbox-xs"
              />
              <span className="label-text text-xs font-medium">In Stock Only</span>
            </label>

            <div className="join border border-base-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`btn btn-xs md:btn-sm join-item ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
                title="Grid View"
              >
                <Grid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`btn btn-xs md:btn-sm join-item ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
                title="List View"
              >
                <List size={15} />
              </button>
            </div>
          </div>

        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-base-200">
          <Filter size={14} className="text-base-content/50 shrink-0 mr-1" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`btn btn-xs rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'btn-primary shadow-xs'
                  : 'btn-ghost border border-base-300 text-base-content/70 hover:bg-base-200'
              }`}
            >
              {cat}
            </button>
          ))}

          {(selectedCategory !== 'All Categories' || searchTerm || inStockOnly || sortBy !== 'newest') && (
            <button
              onClick={handleResetFilters}
              className="btn btn-xs btn-error btn-outline rounded-full gap-1 ml-auto shrink-0"
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
        </div>

      </div>

      {/* Main Content Grid / List Area */}
      {loading ? (
        /* Loading Skeletons */
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-base-100 p-4 rounded-2xl border border-base-300 animate-pulse space-y-3">
              <div className="bg-base-300 h-48 w-full rounded-xl"></div>
              <div className="bg-base-300 h-4 w-3/4 rounded"></div>
              <div className="bg-base-300 h-3 w-1/2 rounded"></div>
              <div className="bg-base-300 h-8 w-full rounded-lg pt-2"></div>
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        /* Empty State */
        <div className="bg-base-100 rounded-3xl border border-base-300 p-12 text-center space-y-4 max-w-md mx-auto my-8">
          <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto text-base-content/40">
            <BookOpen size={32} />
          </div>
          <h3 className="text-xl font-bold">No books found</h3>
          <p className="text-xs text-base-content/60 leading-relaxed">
            We couldn't find any books matching your criteria. Try adjusting your search query or reset active filters.
          </p>
          <button onClick={handleResetFilters} className="btn btn-primary btn-sm gap-2">
            <RotateCcw size={14} /> Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Display */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-base-100 rounded-2xl border border-base-300 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group relative"
            >
              {/* Cover Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-base-200">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/400x600?text=No+Cover';
                  }}
                />
                
                {/* Wishlist Button Overlay */}
                <button
                  onClick={() => handleWishlistToggle(book._id)}
                  className="absolute top-3 right-3 btn btn-circle btn-sm btn-neutral/80 backdrop-blur-md shadow-xs border-0 hover:bg-neutral"
                  title="Toggle Wishlist"
                >
                  <Heart
                    size={16}
                    className={wishlistIds.includes(book._id) ? 'fill-error text-error' : 'text-base-100'}
                  />
                </button>

                {/* Availability Badge */}
                <div className="absolute bottom-3 left-3">
                  {book.copiesAvailable > 0 ? (
                    <span className="badge badge-success badge-sm gap-1 font-semibold shadow-xs">
                      <CheckCircle2 size={11} /> {book.copiesAvailable} Left
                    </span>
                  ) : (
                    <span className="badge badge-error badge-sm gap-1 font-semibold shadow-xs">
                      <XCircle size={11} /> Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-base-content/60 font-medium">
                    <span className="truncate max-w-[140px] flex items-center gap-1">
                      <Tag size={11} /> {book.category}
                    </span>
                    <span className="flex items-center gap-1 text-warning font-bold">
                      <Star size={12} className="fill-warning" /> {book.rating}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-base-content line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {book.title}
                  </h3>

                  <p className="text-xs text-base-content/60 truncate">
                    by {book.author}
                  </p>
                </div>

                <div className="pt-2 border-t border-base-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-base-content/50 block font-semibold uppercase">7 Days Fee</span>
                    <span className="text-base font-extrabold text-primary">${book.rentalFee?.toFixed(2)}</span>
                  </div>

                  <Link
                    to={`/books/${book._id}`}
                    className="btn btn-primary btn-sm rounded-xl text-xs font-bold"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List Display */
        <div className="space-y-3">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-base-100 rounded-2xl border border-base-300 p-4 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-4 justify-between"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-16 h-22 object-cover rounded-xl border border-base-200 shrink-0"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/100x150?text=No+Cover';
                  }}
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-xs badge-neutral">{book.category}</span>
                    <span className="flex items-center gap-1 text-xs text-warning font-bold">
                      <Star size={12} className="fill-warning" /> {book.rating} ({book.reviewsCount || 0})
                    </span>
                  </div>
                  <h3 className="font-bold text-sm md:text-base text-base-content line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-base-content/60">
                    Author: <strong className="text-base-content/80">{book.author}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-base-200">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-base-content/50 block font-semibold uppercase">7 Days Rental</span>
                  <span className="text-lg font-black text-primary">${book.rentalFee?.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleWishlistToggle(book._id)}
                    className="btn btn-circle btn-ghost btn-sm border border-base-300"
                    title="Toggle Wishlist"
                  >
                    <Heart
                      size={16}
                      className={wishlistIds.includes(book._id) ? 'fill-error text-error' : 'text-base-content/60'}
                    />
                  </button>

                  <Link
                    to={`/books/${book._id}`}
                    className="btn btn-primary btn-sm rounded-xl text-xs font-bold"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-base-200">
          <p className="text-xs text-base-content/60">
            Showing Page <strong className="text-base-content">{currentPage}</strong> of <strong className="text-base-content">{totalPages}</strong>
          </p>

          <div className="join border border-base-300 rounded-xl overflow-hidden bg-base-100">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="btn btn-sm join-item btn-ghost gap-1"
            >
              <ChevronLeft size={16} /> Prev
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`btn btn-sm join-item ${
                    currentPage === pageNum ? 'btn-primary font-extrabold' : 'btn-ghost text-xs'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-sm join-item btn-ghost gap-1"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}