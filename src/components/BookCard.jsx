import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';

export default function BookCard({ book }) {
  const isUnavailable = book.status === 'Checked Out';

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 border border-base-200 flex flex-col justify-between">
      <figure className="relative h-56 overflow-hidden bg-base-200">
        <img 
          src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400'} 
          alt={book.title} 
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
        {isUnavailable && (
          <span className="badge badge-error absolute top-3 right-3 font-semibold text-xs py-2 px-3 shadow">
            Unavailable
          </span>
        )}
      </figure>

      <div className="card-body p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="badge badge-outline badge-primary text-xs">{book.category}</span>
          <span className="text-xs font-semibold text-secondary flex items-center gap-1">
            <Truck size={14} /> ${book.deliveryFee} Fee
          </span>
        </div>

        <h3 className="card-title text-base font-bold line-clamp-1 mt-1" title={book.title}>
          {book.title}
        </h3>
        <p className="text-xs text-base-content/70">Author: {book.author}</p>

        <div className="card-actions justify-end mt-4">
          <Link to={`/books/${book._id}`} className="btn btn-primary btn-sm w-full">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}