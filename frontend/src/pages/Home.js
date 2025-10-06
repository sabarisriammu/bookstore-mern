import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { booksAPI } from '../services/api';
import BookCard from '../components/BookCard';
import { FaArrowRight } from 'react-icons/fa';

const Home = () => {
  console.log('HOME COMPONENT LOADING...');

  // Fetch featured books
  const { data: featuredBooks, isLoading: featuredLoading, error: featuredError } = useQuery(
    ['featuredBooks', 'v2'], // Add version to force cache refresh
    booksAPI.getFeatured,
    {
      staleTime: 0, // Force fresh data for debugging
      cacheTime: 0, // Don't cache for debugging
      retry: 3,
      onError: (error) => {
        console.error('Featured books query error:', error);
      },
      onSuccess: (data) => {
        console.log('✅ Featured books query success:', data);
        console.log('✅ Data structure:', JSON.stringify(data, null, 2));
      }
    }
  );

  // Fetch bestseller books
  const { data: bestsellerBooks, isLoading: bestsellerLoading } = useQuery(
    'bestsellerBooks',
    booksAPI.getBestsellers,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000 // 10 minutes
    }
  );

  // Fetch new releases
  const { data: newReleases, isLoading: newReleasesLoading } = useQuery(
    'newReleases',
    booksAPI.getNewReleases,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000 // 10 minutes
    }
  );



  // Debug: Log what we're getting
  console.log('=== HOME PAGE DEBUG ===');
  console.log('Featured Books Response:', featuredBooks);
  console.log('Featured Books Data:', featuredBooks?.data);
  console.log('Featured Books Array:', featuredBooks?.data?.books);
  console.log('Featured Books Length:', featuredBooks?.data?.books?.length);
  console.log('Featured Loading:', featuredLoading);
  console.log('Featured Error:', featuredError);
  console.log('Type of featuredBooks:', typeof featuredBooks);
  console.log('Keys of featuredBooks:', featuredBooks ? Object.keys(featuredBooks) : 'null');

  // Extract data safely - React Query wraps the response in an additional data layer
  const featuredBooksArray = featuredBooks?.data?.data?.books || [];
  const bestsellerBooksArray = bestsellerBooks?.data?.data?.books || [];
  const newReleasesArray = newReleases?.data?.data?.books || [];

  console.log('Extracted Arrays:');
  console.log('- Featured:', featuredBooksArray.length, 'books');
  console.log('- Bestsellers:', bestsellerBooksArray.length, 'books');
  console.log('- New Releases:', newReleasesArray.length, 'books');

  // Force alert for critical debugging
  if (featuredBooks && !featuredLoading) {
    console.log('🚨 CRITICAL DEBUG: Featured books response received!');
    console.log('🚨 Response structure:', JSON.stringify(featuredBooks, null, 2));
  }

  return (
    <div className="min-h-screen">
      {/* Debug Info */}
      <div style={{position: 'fixed', top: 0, right: 0, background: 'red', color: 'white', padding: '10px', zIndex: 9999}}>
        Featured: {featuredBooks?.data?.books?.length || 0} books
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Next Favorite Book
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Explore thousands of titles across all genres. From bestsellers to hidden gems, 
              find the perfect book for every mood and moment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/books"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Browse Books
                <FaArrowRight className="ml-2" />
              </Link>
              <Link
                to="/books?category=Fiction"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Fiction Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Books</h2>
            <Link
              to="/books?featured=true"
              className="text-primary-600 hover:text-primary-700 font-semibold flex items-center"
            >
              View All
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
          
          {featuredLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : featuredError ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-2">Error loading featured books</p>
              <p className="text-sm text-gray-400">{featuredError.message}</p>
            </div>
          ) : featuredBooksArray.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredBooksArray.slice(0, 4).map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">No featured books available</p>
              <p className="text-sm text-gray-400">
                Response: {featuredBooks ? 'Data received but no books found' : 'No response from server'}
              </p>
              <div className="text-xs text-gray-300 mt-2">
                Debug: featuredBooksArray.length = {featuredBooksArray.length}
              </div>
              <div className="text-xs text-gray-300 mt-1">
                Raw response: {JSON.stringify(featuredBooks)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Bestsellers</h2>
            <Link
              to="/books?bestseller=true"
              className="text-primary-600 hover:text-primary-700 font-semibold flex items-center"
            >
              View All
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
          
          {bestsellerLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : bestsellerBooksArray.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {bestsellerBooksArray.slice(0, 4).map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No bestseller books available</p>
              <div className="text-xs text-gray-300 mt-2">
                Debug: bestsellerBooksArray.length = {bestsellerBooksArray.length}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* New Releases */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">New Releases</h2>
            <Link
              to="/books?newRelease=true"
              className="text-primary-600 hover:text-primary-700 font-semibold flex items-center"
            >
              View All
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
          
          {newReleasesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : newReleasesArray.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {newReleasesArray.slice(0, 4).map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No new releases available</p>
              <div className="text-xs text-gray-300 mt-2">
                Debug: newReleasesArray.length = {newReleasesArray.length}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Explore by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 
              'Romance', 'Biography', 'Self-Help', 'Business',
              'Children', 'Young Adult', 'Poetry', 'Technology'
            ].map((category) => (
              <Link
                key={category}
                to={`/books?category=${encodeURIComponent(category)}`}
                className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-primary-300 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Reading?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of readers and discover amazing books today.
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 