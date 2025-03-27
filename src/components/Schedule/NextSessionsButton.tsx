interface NextSessionsButtonProps {
  count: number;
  onClick: () => void;
}

export default function NextSessionsButton({ count, onClick }: NextSessionsButtonProps) {
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button 
        onClick={onClick}
        className="flex items-center justify-center bg-nextButton-main hover:bg-nextButton-hover text-nextButton-text font-bold py-4 px-5 rounded-full shadow-lg text-lg focus:outline-none focus:ring-4 focus:ring-nextButton-light"
        aria-label="Vis neste aktiviteter"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        Neste aktiviteter ({count})
      </button>
    </div>
  );
}