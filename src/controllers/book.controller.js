import Book from '../models/book.model.js';
export const getBooks = async (req, res) => {
  try {
    const {
      search = '',
      category = '',
      inStock = 'false',
      sort = 'newest',
      page = 1,
      limit = 8,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 8);
    const skip = (pageNum - 1) * limitNum;

    const matchStage = {};

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      matchStage.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { category: searchRegex },
        { isbn: searchRegex },
      ];
    }

    if (category && category !== 'All Categories') {
      matchStage.category = category;
    }

    if (inStock === 'true') {
      matchStage.copiesAvailable = { $gt: 0 };
    }

    let sortStage = { createdAt: -1 };
    switch (sort) {
      case 'price-low':
        sortStage = { rentalFee: 1 };
        break;
      case 'price-high':
        sortStage = { rentalFee: -1 };
        break;
      case 'rating':
        sortStage = { rating: -1, reviewsCount: -1 };
        break;
      case 'newest':
      default:
        sortStage = { createdAt: -1 };
        break;
    }

    const pipeline = [
      { $match: matchStage },
      {
        $facet: {
          books: [
            { $sort: sortStage },
            { $skip: skip },
            { $limit: limitNum },
            {
              $project: {
                title: 1,
                author: 1,
                category: 1,
                rentalFee: 1,
                depositFee: 1,
                rating: 1,
                reviewsCount: 1,
                copiesAvailable: 1,
                coverImage: 1,
                publisher: 1,
                createdAt: 1,
              },
            },
          ],
          totalCount: [
            { $count: 'count' },
          ],
        },
      },
    ];

    const [result] = await Book.aggregate(pipeline);

    const books = result.books || [];
    const totalCount = result.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limitNum) || 1;

    res.status(200).json({
      success: true,
      count: books.length,
      totalCount,
      totalPages,
      currentPage: pageNum,
      books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve books catalog.',
      error: error.message,
    });
  }
};


export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found with the given ID.',
      });
    }

    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch book details.',
      error: error.message,
    });
  }
};