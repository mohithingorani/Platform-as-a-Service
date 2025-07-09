export default function Card() {
  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-md transition-colors duration-300">
      <h5 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Deploy your GitHub Repository
      </h5>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Enter the URL of your GitHub repository to deploy it.
      </p>

      <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
        GitHub Repository URL
      </label>
      <input
        type="text"
        placeholder="https://github.com/username/repo"
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
      />

      <button className="mt-6 w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 dark:hover:text-black transition-colors duration-200">
        Deploy
      </button>
    </div>
  );
}
