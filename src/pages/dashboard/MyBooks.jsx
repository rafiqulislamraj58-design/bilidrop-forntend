import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Book, Edit3, Trash2, Plus, Search, X, CheckCircle2, Layers, DollarSign, Hash, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../providers/AuthProvider';
import axiosInstance from '../../api/axiosInstance';

const CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Science & Technology',
  'History & Biography',
  'Self-Help & Mindset',
  'Fantasy & Sci-Fi',
  'Mystery & Thriller',
  'Children & Comics',
];

export default function MyBooks() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const coverImageUrl = watch('coverImage');
  const mockBooks = [
    {
      _id: '101',
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      category: 'Science & Technology',
      coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
      rentalFee: 8.5,
      copies: 5,
      description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.',
      librarianEmail: user?.email || 'librarian@example.com',
      createdAt: '2026-02-10',
    },
    {
      _id: '102',
      title: 'Atomic Habits',
      author: 'James Clear',
      category: 'Self-Help & Mindset',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
      rentalFee: 6.0,
      copies: 3,
      description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.',
      librarianEmail: user?.email || 'librarian@example.com',
      createdAt: '2026-03-01',
    },
    {
      _id: '103',
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      category: 'History & Biography',
      coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
      rentalFee: 7.2,
      copies: 2,
      description: 'How Homo sapiens conquered the earth and built the modern world.',
      librarianEmail: user?.email || 'librarian@example.com',
      createdAt: '2026-03-15',
    },
  ];
  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/books/librarian?email=${user?.email}`);
      setBooks(res.data.books || res.data || mockBooks);
    } catch (err) {
      setBooks(mockBooks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchMyBooks();
    }
  }, [user?.email]);
  const handleEditClick = (book) => {
    setSelectedBook(book);
    reset({
      title: book.title,
      author: book.author,
      category: book.category,
      coverImage: book.coverImage,
      rentalFee: book.rentalFee,
      copies: book.copies,
      description: book.description,
    });
    setIsModalOpen(true);
  const onUpdateSubmit = async (data) => {
    setUpdating(true);
    const updatedPayload = {
      ...data,
      rentalFee: parseFloat(data.rentalFee),
      copies: parseInt(data.copies, 10),
    };

    try {
      await axiosInstance.patch(`/books/${selectedBook._id}`, updatedPayload);
      setBooks((prev) =>
        prev.map((b) => (b._id === selectedBook._id ? { ...b, ...updatedPayload } : b))
      );

      Swal.fire({
        title: 'Updated Successfully!',
        text: `"${data.title}" has been updated.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });

      setIsModalOpen(false);
      setSelectedBook(null);
    } catch (err) {
      Swal.fire({
        title: 'Update Failed',
        text: err.response?.data?.message || 'Could not update book details.',
        icon: 'error',
      });
    } finally {
      setUpdating(false);
    }
  };
  const handleDeleteBook = async (bookId, title) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${title}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/books/${bookId}`);

        setBooks((prev) => prev.filter((b) => b._id !== bookId));

        Swal.fire({
          title: 'Deleted!',
          text: 'The book has been removed from the catalog.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: err.response?.data?.message || 'Failed to delete the book.',
          icon: 'error',
        });
      }
    }
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Book className="text-primary" /> My Added Books
          </h1>
          <p className="text-sm text-base-content/70 mt-1">
            Manage your published books catalog, update inventory, or remove listings.
          </p>
        </div>
        <Link to="/dashboard/add-book" className="btn btn-primary gap-2 font-bold self-start sm:self-auto">
          <Plus size={18} /> Add New Book
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-base-100 p-4 rounded-2xl border border-base-300">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" size={18} />
          <input
            type="text"
            placeholder="Search by title, author, or category..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="badge badge-secondary badge-outline font-semibold p-3 text-xs">
          Total Inventory: {filteredBooks.length} Titles
        </div>
      </div>
      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-sm text-base-content/70">Loading your books catalog...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Book className="mx-auto text-base-content/30" size={48} />
            <h3 className="font-bold text-lg">No books found</h3>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto">
              You haven't added any books yet, or no results match your search term.
            </p>
            <Link to="/dashboard/add-book" className="btn btn-primary btn-sm gap-2 mt-2">
              <Plus size={16} /> Add First Book
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200/50 text-xs text-base-content/70 uppercase">
                <tr>
                  <th>#</th>
                  <th>Book Details</th>
                  <th>Category</th>
                  <th>Rental Fee</th>
                  <th>Copies Available</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {filteredBooks.map((book, idx) => (
                  <tr key={book._id} className="hover:bg-base-200/30 transition-colors">
                    <td className="font-semibold text-xs text-base-content/50">{idx + 1}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded-lg shadow-sm border border-base-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/120x160?text=No+Cover';
                          }}
                        />
                        <div className="max-w-xs sm:max-w-md">
                          <div className="font-bold text-sm truncate">{book.title}</div>
                          <div className="text-xs text-base-content/60">{book.author}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-ghost font-semibold text-xs py-2 px-3">
                        {book.category}
                      </span>
                    </td>
                    <td className="font-bold text-sm text-primary">
                      ${parseFloat(book.rentalFee).toFixed(2)}
                    </td>
                    <td>
                      <span
                        className={`badge font-semibold text-xs py-2 px-3 ${
                          book.copies > 0 ? 'badge-success badge-outline' : 'badge-error badge-outline'
                        }`}
                      >
                        {book.copies > 0 ? `${book.copies} available` : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(book)}
                        className="btn btn-square btn-ghost btn-xs text-info hover:bg-info/10"
                        title="Edit Book"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book._id, book.title)}
                        className="btn btn-square btn-ghost btn-xs text-error hover:bg-error/10"
                        title="Delete Book"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl bg-base-100 p-6 sm:p-8 rounded-2xl relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedBook(null);
              }}
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
            >
              <X size={18} />
            </button>

            <h3 className="font-extrabold text-xl flex items-center gap-2 mb-6">
              <Edit3 className="text-primary" /> Edit Book Details
            </h3>

            <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FileText size={14} /> Book Title
                  </span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && (
                  <span className="text-error text-xs mt-1">{errors.title.message}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Author</span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered w-full ${errors.author ? 'input-error' : ''}`}
                    {...register('author', { required: 'Author is required' })}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <Layers size={14} /> Category
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    {...register('category', { required: 'Category is required' })}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Cover Image URL</span>
                </label>
                <input
                  type="url"
                  className={`input input-bordered w-full ${errors.coverImage ? 'input-error' : ''}`}
                  {...register('coverImage', { required: 'Cover image URL is required' })}
                />
                {coverImageUrl && !errors.coverImage && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-base-200 rounded-lg">
                    <img src={coverImageUrl} alt="Preview" className="w-10 h-12 object-cover rounded" />
                    <span className="text-xs text-success flex items-center gap-1 font-medium">
                      <CheckCircle2 size={12} /> Image URL valid
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <DollarSign size={14} /> Rental Fee ($)
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="input input-bordered w-full"
                    {...register('rentalFee', { required: 'Rental fee is required' })}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <Hash size={14} /> Copies Available
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input input-bordered w-full"
                    {...register('copies', { required: 'Copies count is required' })}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Description</span>
                </label>
                <textarea
                  rows={3}
                  className="textarea textarea-bordered w-full text-sm"
                  {...register('description', { required: 'Description is required' })}
                ></textarea>
              </div>

              {/* Modal Actions */}
              <div className="modal-action pt-4 border-t border-base-200">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedBook(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" disabled={updating} className="btn btn-primary gap-2 font-bold">
                  {updating ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span> Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
}