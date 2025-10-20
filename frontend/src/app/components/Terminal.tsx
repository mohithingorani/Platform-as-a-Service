export default function Terminal() {
  return (
    <div className="bg-[#262628] w-[95%] sm:w-[90%] md:w-[600px] max-w-full mx-auto backdrop-filter backdrop-blur-sm bg-opacity-70 border border-gray-700 rounded-xl shadow-2xl overflow-hidden text-white">
      
      {/* Terminal Header */}
      <div className="flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3 bg-[#3c3c3f] border-b border-gray-800">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#f7768e] hover:bg-[#f78e8e] transition-colors cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-[#e0af68] hover:bg-[#e0c168] transition-colors cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-[#9ece6a] hover:bg-[#aeee6a] transition-colors cursor-pointer"></div>
        </div>
        <div className="hidden sm:block text-xs text-gray-400 font-mono">bash — 80×24</div>
        <div className="w-6"></div>
      </div>

      {/* Terminal Body */}
      <div className="p-3 sm:p-4 font-mono text-[10px] sm:text-sm md:text-lg">
        {/* Command line */}
        <div className="flex flex-wrap items-start mb-3 sm:mb-4">
          <span className="text-[#7aa2f7] mr-2">{">"}</span>
          <span className="text-[#9ece6a] mr-2">$</span>
          <span className="text-white break-all">voltex deploy my-app</span>
        </div>

        {/* Process lines */}
        <div className="space-y-2 sm:space-y-3 ml-3 sm:ml-4">
          <div className="flex flex-wrap items-center text-[#bb9af7]">
            <span className="w-2 h-2 rounded-full bg-[#bb9af7] mr-2 animate-pulse"></span>
            upload-service: <span className="text-gray-300 ml-1">Staging repo to S3</span>
          </div>
          
          <div className="flex flex-wrap items-center text-[#7dcfff]">
            <span className="w-2 h-2 rounded-full bg-[#7dcfff] mr-2 animate-pulse" style={{animationDelay: '0.2s'}}></span>
            Redis: <span className="text-gray-300 ml-1">Queued deployment</span>
          </div>
          
          <div className="flex flex-wrap items-center text-[#e0af68]">
            <span className="w-2 h-2 rounded-full bg-[#e0af68] mr-2 animate-pulse" style={{animationDelay: '0.4s'}}></span>
            deployment-service: <span className="text-gray-300 ml-1">Building & uploading assets</span>
          </div>
          
          <div className="flex flex-wrap items-center text-[#7aa2f7]">
            <span className="w-2 h-2 rounded-full bg-[#7aa2f7] mr-2 animate-pulse" style={{animationDelay: '0.6s'}}></span>
            request-handler-service + Nginx: <span className="text-gray-300 ml-1">Routing live traffic</span>
          </div>
          
          <div className="flex flex-wrap items-center text-[#9ece6a]">
            <span className="w-2 h-2 rounded-full bg-[#9ece6a] mr-2 animate-pulse" style={{animationDelay: '0.8s'}}></span>
            Frontend: <span className="text-gray-300 ml-1">Updating status</span>
          </div>
          
          {/* Success Message */}
          <div className="flex flex-wrap items-center text-[#9ece6a] mt-4 pt-3 border-t border-gray-800">
            <span className="text-lg sm:text-xl mr-2">✅</span>
            <span className="font-semibold">Website is Live!</span>
            <span className="ml-2 text-[10px] sm:text-xs px-2 py-0.5 bg-green-900 bg-opacity-30 text-green-400 rounded">Success</span>
          </div>
        </div>

        {/* Cursor */}
        <div className="flex items-center mt-4">
          <span className="text-[#7aa2f7] mr-2">{">"}</span>
          <span className="text-[#9ece6a] mr-2">$</span>
          <div className="w-2 h-3 sm:w-3 sm:h-4 bg-white animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
