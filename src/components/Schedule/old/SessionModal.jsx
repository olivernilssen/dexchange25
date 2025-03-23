// Add this inside your Home component
const SessionModal = () => {
  if (!selectedSession) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSession(null)}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-sm font-medium text-[#6c7cbc]">
                {formatTime(selectedSession.start)} - {formatTime(selectedSession.end)}
              </span>
              {selectedSession.room && (
                <span className="ml-2 text-sm font-medium text-[#8991cd]">
                  • {selectedSession.room}
                </span>
              )}
            </div>
            
            <button 
              onClick={() => setSelectedSession(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <h2 className="text-2xl font-bold text-[#081079] mt-2">{selectedSession.title}</h2>
          
          <div className="flex flex-wrap gap-1.5 mt-3">
            {selectedSession.kind && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                selectedSession.kind === 'workshop' 
                  ? 'bg-[#edadac] text-[#081079]' 
                  : 'bg-[#8da9e4] text-[#081079]'
              }`}>
                {selectedSession.kind}
              </span>
            )}
            {selectedSession.tag && selectedSession.tag.split(',').map((tag, i) => (
              <span key={i} className="text-xs bg-[#b4bce3] px-2 py-0.5 rounded-full text-[#081079]">
                {tag.trim()}
              </span>
            ))}
          </div>
          
          {selectedSession.speaker && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-500">Speaker</h3>
              <p className="text-[#081079]">{selectedSession.speaker}</p>
            </div>
          )}
          
          {selectedSession.ingress && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-500">Overview</h3>
              <p className="text-[#081079] italic">{selectedSession.ingress}</p>
            </div>
          )}
          
          {selectedSession.description && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-500">Description</h3>
              <div className="text-[#081079]">
                {selectedSession.description.split('\n').map((paragraph, i) => (
                  <p key={i} className="mt-2">{paragraph.trim()}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};