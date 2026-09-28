import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Award,
  Layers,
  ArrowRight,
  Truck,
} from "lucide-react";

import BookCard from "../components/BookCard";

export default function Home() {
  // ==============================
  // MOCK BOOKS
  // ==============================
  const mockBooks = [
    {
      _id: "1",
      title: "The Alchemist",
      author: "Paulo Coelho",
      category: "Fiction",
      deliveryFee: 50,
      status: "available",
      coverImage:
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600",
    },
    {
      _id: "2",
      title: "Atomic Habits",
      author: "James Clear",
      category: "Non-Fiction",
      deliveryFee: 40,
      status: "available",
      coverImage:
        "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=600",
    },
    {
      _id: "3",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      category: "Fiction",
      deliveryFee: 45,
      status: "available",
      coverImage:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
    },
    {
      _id: "4",
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      category: "Academic",
      deliveryFee: 60,
      status: "available",
      coverImage:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600",
    },
    {
      _id: "5",
      title: "Dune",
      author: "Frank Herbert",
      category: "Sci-Fi",
      deliveryFee: 55,
      status: "available",
      coverImage:
        "https://images.unsplash.com/photo-1531072901881-d644216d4bf9?auto=format&fit=crop&q=80&w=600",
    },
    {
      _id: "6",
      title: "Rich Dad Poor Dad",
      author: "Robert Kiyosaki",
      category: "Non-Fiction",
      deliveryFee: 40,
      status: "available",
      coverImage:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
    },
  ];

  // ==============================
  // TOP LIBRARIANS
  // ==============================
  const topLibrarians = [
    {
      id: 1,
      name: "Sarah Jenkins",
      completedDeliveries: 142,
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 2,
      name: "David Chen",
      completedDeliveries: 118,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 3,
      name: "Elena Rostova",
      completedDeliveries: 95,
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    },
  ];

  // ==============================
  // CATEGORIES
  // ==============================
  const categories = [
    {
      name: "Fiction",
      count: "120+ Books",
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      name: "Sci-Fi",
      count: "85+ Books",
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      name: "Academic",
      count: "200+ Books",
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      name: "Non-Fiction",
      count: "90+ Books",
      color: "bg-cyan-50 text-cyan-600 border-cyan-200",
    },
  ];

  return (
    <div className="space-y-16 pb-16">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative min-h-[75vh] overflow-hidden bg-gradient-to-r from-slate-50 to-blue-50">

        {/* Background decoration */}
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="relative flex min-h-[75vh] items-center justify-center px-4">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl space-y-6 text-center"
          >

            {/* Badge */}
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm">
              📚 Online Doorstep Library Delivery
            </span>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-6xl">
              Your Local Library,{" "}
              <span className="text-blue-600">
                Delivered
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Connecting avid readers and students with local libraries and
              independent book owners. Browse diverse collections and request
              instant doorstep delivery.
            </p>

            {/* CTA */}
            <div className="flex justify-center pt-2">
              <Link
                to="/books"
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl"
              >
                Browse Books

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

          </motion.div>
        </div>
      </section>


      {/* =====================================================
          FEATURED BOOKS
      ====================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8">

        {/* Header */}
        <div className="mb-8 flex items-end justify-between">

          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              <BookOpen className="text-blue-600" />
              Featured Books
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Explore our latest additions available for delivery
            </p>
          </div>

          <Link
            to="/books"
            className="hidden items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 sm:flex"
          >
            View All
            <ArrowRight size={16} />
          </Link>

        </div>


        {/* Mock Books */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {mockBooks.map((book) => (
            <BookCard
              key={book._id}
              book={book}
            />
          ))}

        </div>

      </section>


      {/* =====================================================
          TOP LIBRARIANS
      ====================================================== */}
      <section className="bg-gray-50 py-12">

        <div className="mx-auto max-w-7xl px-4 sm:px-8">

          {/* Section Header */}
          <div className="mx-auto mb-10 max-w-2xl text-center">

            <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              <Award className="text-yellow-500" />
              Top Librarians & Providers
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Recognizing our providers with the highest completed deliveries
            </p>

          </div>


          {/* Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

            {topLibrarians.map((lib) => (
              <div
                key={lib.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* Avatar */}
                <div className="mb-4 flex justify-center">
                  <img
                    src={lib.avatar}
                    alt={lib.name}
                    className="h-20 w-20 rounded-full object-cover ring-4 ring-blue-100"
                  />
                </div>

                {/* Name */}
                <h3 className="text-lg font-bold text-gray-900">
                  {lib.name}
                </h3>

                {/* Delivery */}
                <p className="mt-1 flex items-center justify-center gap-1 text-sm text-gray-500">
                  <Truck
                    size={16}
                    className="text-blue-600"
                  />

                  {lib.completedDeliveries} Completed Deliveries
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>


      {/* =====================================================
          POPULAR CATEGORIES
      ====================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8">

        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">

          <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            <Layers className="text-purple-600" />
            Popular Categories
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Find books by your favorite genre
          </p>

        </div>


        {/* Categories */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/books?category=${encodeURIComponent(cat.name)}`}
              className={`rounded-2xl border p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${cat.color}`}
            >

              <h3 className="text-lg font-bold">
                {cat.name}
              </h3>

              <p className="mt-1 text-xs opacity-80">
                {cat.count}
              </p>

            </Link>
          ))}

        </div>

      </section>

    </div>
  );
}