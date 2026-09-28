import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Award, Layers, ArrowRight, Truck } from 'lucide-react';
import BookCard from '../components/BookCard';
import axiosInstance from '../api/axiosInstance';

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const mockBooks = [
    { _id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', deliveryFee: 3.5, status: 'Available', coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400' },
    { _id: '2', title: 'Dune Chronicles', author: 'Frank Herbert', category: 'Sci-Fi', deliveryFee: 4.0, status: 'Available', coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400' },
    { _id: '3', title: 'Clean Code', author: 'Robert C. Martin', category: 'Academic', deliveryFee: 5.0, status: 'Checked Out', coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400' },
    { _id: '4', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', deliveryFee: 3.0, status: 'Available', coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400' },
    { _id: '5', title: 'Atomic Habits', author: 'James Clear', category: 'Non-Fiction', deliveryFee: 2.5, status: 'Available', coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400' },
    { _id: '6', title: 'The Silent Patient', author: 'Alex Michaelides', category: 'Mystery', deliveryFee: 3.8, status: 'Available', coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400' },
  ];

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const res = await axiosInstance.get('/books?limit=6');
        if (res.data && res.data.books && res.data.books.length > 0) {
          setFeaturedBooks(res.data.books.slice(0, 6));
        } else {
          setFeaturedBooks(mockBooks);
        }
      } catch (err) {
        setFeaturedBooks(mockBooks);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

 
  const topLibrarians = [
    { id: 1, name: 'Sarah Jenkins', completedDeliveries: 142, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
    { id: 2, name: 'David Chen', completedDeliveries: 118, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    { id: 3, name: 'Elena Rostova', completedDeliveries: 95, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
  ];


  const categories = [
    { name: 'Fiction', count: '120+ Books', color: 'bg-primary/10 text-primary' },
    { name: 'Sci-Fi', count: '85+ Books', color: 'bg-secondary/10 text-secondary' },
    { name: 'Academic', count: '200+ Books', color: 'bg-accent/10 text-accent' },
    { name: 'Non-Fiction', count: '90+ Books', color: 'bg-info/10 text-info' },
  ];

  return (
    <div className="space-y-16 pb-16">
      
      <section className="hero min-h-[75vh] bg-gradient-to-r from-base-200 to-base-300 relative overflow-hidden">
        <div className="hero-content text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="badge badge-primary badge-outline px-4 py-3 font-semibold text-sm">
              📚 Online Doorstep Library Delivery
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight">
              Your Local Library, <span className="text-primary">Delivered</span>
            </h1>
            <p className="text-base sm:text-lg text-base-content/80 max-w-2xl mx-auto">
              Connecting avid readers and students with local libraries and independent book owners. Browse diverse collections and request instant doorstep delivery.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <Link to="/books" className="btn btn-primary btn-lg gap-2 shadow-lg">
                Browse Books <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <BookOpen className="text-primary" /> Featured Books
            </h2>
            <p className="text-sm text-base-content/70 mt-1">Explore our latest additions available for delivery</p>
          </div>
          <Link to="/books" className="btn btn-ghost btn-sm text-primary gap-1 hidden sm:flex">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="skeleton h-56 w-full"></div>
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-4 w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </section>

    
      <section className="bg-base-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold flex justify-center items-center gap-2">
              <Award className="text-secondary" /> Top Librarians & Providers
            </h2>
            <p className="text-sm text-base-content/70 mt-1">Recognizing our providers with the highest completed deliveries</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topLibrarians.map((lib) => (
              <div key={lib.id} className="card bg-base-100 shadow-md p-6 text-center border border-base-300">
                <div className="avatar justify-center mb-4">
                  <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={lib.avatar} alt={lib.name} />
                  </div>
                </div>
                <h3 className="font-bold text-lg">{lib.name}</h3>
                <p className="text-sm text-base-content/70 flex items-center justify-center gap-1 mt-1">
                  <Truck size={16} className="text-primary" /> {lib.completedDeliveries} Completed Deliveries
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold flex justify-center items-center gap-2">
            <Layers className="text-accent" /> Popular Categories
          </h2>
          <p className="text-sm text-base-content/70 mt-1">Find books by your favorite genre</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/books?category=${cat.name}`}
              className={`p-6 rounded-2xl text-center border border-base-200 transition-transform hover:-translate-y-1 hover:shadow-lg ${cat.color}`}
            >
              <h3 className="font-bold text-lg">{cat.name}</h3>
              <p className="text-xs opacity-80 mt-1">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}