export const LoadingMessage = () => {
  return (
    <div className="flex items-end space-x-2 animate-pulse">
      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      <div className="max-w-[70%] p-3 bg-gray-300 rounded-2xl"></div>
    </div>
  );
};