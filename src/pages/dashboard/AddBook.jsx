import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BookPlus, Image as ImageIcon, DollarSign, Layers, Hash, User, FileText, CheckCircle2 } from 'lucide-react';
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

export default function AddBook() {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: '',
      copies: 1,
      rentalFee: 5.0,
    },
  });

  const coverImageUrl = watch('coverImage');

  const onSubmit = async (data) => {
    setSubmitting(true);
    const bookPayload = {
      ...data,
      rentalFee: parseFloat(data.rentalFee),
      copies: parseInt(data.copies, 10),
      librarianEmail: user?.email,
      librarianName: user?.name,
      status: 'available',
      createdAt: new Date().toISOString(),
    };

    try {
      await axiosInstance.post('/books', bookPayload);
      
      Swal.fire({
        title: 'Book Added Successfully!',
        text: `"${data.title}" has been added to the BiblioDrop catalog.`,
        icon: 'success',
        confirmButtonColor: '#4f46e5',
      });

      reset();
    } catch (err) {
      Swal.fire({
        title: 'Failed to Add Book',
        text: err.response?.data?.message || 'Something went wrong while publishing the book.',
        icon: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <BookPlus className="text-primary" /> Add New Book
        </h1>
        <p className="text-sm text-base-content/70 mt-1">
          Fill in the details below to add a new book to the library inventory.
        </p>
      </div>

      {/* Main Form Container */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-base-100 border border-base-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Title */}
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <FileText size={16} className="text-primary" /> Book Title <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. Clean Code: A Handbook of Agile Software Craftsmanship"
              className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
              {...register('title', {
                required: 'Book title is required',
                minLength: { value: 3, message: 'Title must be at least 3 characters' },
              })}
            />
            {errors.title && (
              <span className="text-error text-xs mt-1 font-medium">{errors.title.message}</span>
            )}
          </div>

          {/* Author */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <User size={16} className="text-primary" /> Author Name <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. Robert C. Martin"
              className={`input input-bordered w-full ${errors.author ? 'input-error' : ''}`}
              {...register('author', {
                required: 'Author name is required',
              })}
            />
            {errors.author && (
              <span className="text-error text-xs mt-1 font-medium">{errors.author.message}</span>
            )}
          </div>

          {/* Category Selector */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <Layers size={16} className="text-primary" /> Genre / Category <span className="text-error">*</span>
              </span>
            </label>
            <select
              className={`select select-bordered w-full ${errors.category ? 'select-error' : ''}`}
              {...register('category', {
                required: 'Please select a genre category',
              })}
            >
              <option value="" disabled>
                Select Category...
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-error text-xs mt-1 font-medium">{errors.category.message}</span>
            )}
          </div>

          {/* Cover Image URL */}
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <ImageIcon size={16} className="text-primary" /> Cover Image URL <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              className={`input input-bordered w-full ${errors.coverImage ? 'input-error' : ''}`}
              {...register('coverImage', {
                required: 'Cover image URL is required',
                pattern: {
                  value: /^https?:\/\/.+/i,
                  message: 'Enter a valid image URL starting with http:// or https://',
                },
              })}
            />
            {errors.coverImage && (
              <span className="text-error text-xs mt-1 font-medium">{errors.coverImage.message}</span>
            )}

            {/* Live Image Preview Card */}
            {coverImageUrl && !errors.coverImage && (
              <div className="mt-3 flex items-center gap-4 p-3 bg-base-200/60 rounded-xl border border-base-300">
                <img
                  src={coverImageUrl}
                  alt="Book Cover Preview"
                  className="w-16 h-20 object-cover rounded-lg shadow-sm border border-base-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/150x200?text=Invalid+Image';
                  }}
                />
                <div>
                  <span className="badge badge-success gap-1 text-[11px] font-semibold">
                    <CheckCircle2 size={12} /> Image Preview Ready
                  </span>
                  <p className="text-xs text-base-content/70 mt-1">
                    Verified cover preview for library catalog rendering.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Rental Fee */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <DollarSign size={16} className="text-primary" /> Rental Fee ($) <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="5.00"
              className={`input input-bordered w-full ${errors.rentalFee ? 'input-error' : ''}`}
              {...register('rentalFee', {
                required: 'Rental fee is required',
                min: { value: 0, message: 'Fee cannot be negative' },
              })}
            />
            {errors.rentalFee && (
              <span className="text-error text-xs mt-1 font-medium">{errors.rentalFee.message}</span>
            )}
          </div>

          {/* Available Copies */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <Hash size={16} className="text-primary" /> Copies Available <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="number"
              min="1"
              placeholder="1"
              className={`input input-bordered w-full ${errors.copies ? 'input-error' : ''}`}
              {...register('copies', {
                required: 'Number of copies is required',
                min: { value: 1, message: 'At least 1 copy is required' },
              })}
            />
            {errors.copies && (
              <span className="text-error text-xs mt-1 font-medium">{errors.copies.message}</span>
            )}
          </div>

          {/* Description */}
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-semibold">Book Synopsis / Summary <span className="text-error">*</span></span>
            </label>
            <textarea
              rows={4}
              placeholder="Write a compelling description of the book content, key topics covered, or author highlights..."
              className={`textarea textarea-bordered w-full text-sm leading-relaxed ${
                errors.description ? 'textarea-error' : ''
              }`}
              {...register('description', {
                required: 'Book synopsis is required',
                minLength: { value: 20, message: 'Description must be at least 20 characters long' },
              })}
            ></textarea>
            {errors.description && (
              <span className="text-error text-xs mt-1 font-medium">{errors.description.message}</span>
            )}
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-base-200 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary px-8 gap-2 font-bold"
          >
            {submitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Publishing Book...
              </>
            ) : (
              <>
                <BookPlus size={18} /> Publish to Catalog
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}