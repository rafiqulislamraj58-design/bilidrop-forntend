import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";

import BookCard from "../components/BookCard";
import axiosInstance from "../api/axiosInstance";

const CATEGORIES = [
  "All",
  "Fiction",
  "Non-Fiction",
  "Sci-Fi",
  "Academic",
  "Mystery",
  "History",
  "Biography",
];

export default function BrowseBooks() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "";
  const pageQuery = parseInt(searchParams.get("page") || "1", 10);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const updateQueryParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);

    Object.keys(newParams).forEach((key) => {
      if (newParams[key]) {
        updated.set(key, newParams[key]);
      } else {
        updated.delete(key);
      }
    });

    setSearchParams(updated);
  };

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);

      try {
        const res = await axiosInstance.get("/books", {
          params: {
            search: searchQuery,
            category: categoryQuery === "All" ? "" : categoryQuery,
            page: pageQuery,
            limit: 8,
          },
        });

        const data = res.data;

        setBooks(data?.books || data?.data || []);

        setTotalPages(
          data?.totalPages ||
            Math.ceil((data?.total || 0) / 8) ||
            1
        );

        setTotalBooks(
          data?.totalBooks ||
            data?.total ||
            data?.books?.length ||
            0
        );
      } catch (error) {
        console.error("Failed to fetch books:", error);
        setBooks([]);
        setTotalPages(1);
        setTotalBooks(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchQuery, categoryQuery, pageQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    updateQueryParams({
      search: searchInput.trim(),
      page: 1,
    });
  };

  const handleCategorySelect = (category) => {
    const value = category === "All" ? "" : category;

    updateQueryParams({
      category: value,
      page: 1,
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateQueryParams({
        page: newPage,
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearchParams({});
  };

  const currentCategory = categoryQuery || "All";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-8 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <BookOpen size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Browse Catalog
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Explore books from nearby libraries and request
                doorstep delivery.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <form
              onSubmit={handleSearchSubmit}
              className="flex w-full gap-2 lg:max-w-2xl"
            >
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search by title, author, or genre..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Search
              </button>
            </form>

            <div className="flex w-full items-center gap-2 lg:w-auto">

              <div className="relative flex-1 lg:w-52">
                <Filter
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  value={currentCategory}
                  onChange={(e) =>
                    handleCategorySelect(e.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-9 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <ChevronRight
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400"
                />
              </div>

              {(searchQuery || categoryQuery) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  title="Reset Filters"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                >
                  <RotateCcw size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((category) => {
              const isSelected =
                currentCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    handleCategorySelect(category)
                  }
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-2 px-1 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {books.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {totalBooks}
            </span>{" "}
            books
          </p>

          <p>
            Page{" "}
            <span className="font-semibold text-gray-900">
              {pageQuery}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {totalPages}
            </span>
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="h-56 animate-pulse bg-gray-200" />

                <div className="space-y-3 p-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-9 w-full animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              No Books Found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              We couldn&apos;t find any books matching your
              current search or category.
            </p>

            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">

            <button
              type="button"
              onClick={() =>
                handlePageChange(pageQuery - 1)
              }
              disabled={pageQuery <= 1}
              className="flex items-center gap-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={17} />
              Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map(
                (_, index) => {
                  const pageNum = index + 1;

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() =>
                        handlePageChange(pageNum)
                      }
                      className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-semibold transition ${
                        pageQuery === pageNum
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                          : "border border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                handlePageChange(pageQuery + 1)
              }
              disabled={pageQuery >= totalPages}
              className="flex items-center gap-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={17} />
            </button>

          </div>
        )}
      </div>
    </div>
  );
}