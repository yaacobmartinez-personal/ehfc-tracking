interface FloatingActionButtonProps {
  isActive: boolean;
  onClick: () => void;
  title: string;
  ariaLabel: string;
}

export default function FloatingActionButton({ 
  isActive, 
  onClick, 
  title, 
  ariaLabel 
}: FloatingActionButtonProps) {
  return (
    <div className="absolute bottom-6 right-6 z-10">
      <button
        onClick={onClick}
        className={`w-14 h-14 rounded-full text-white shadow-xl flex items-center justify-center ${
          isActive ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        title={title}
        aria-label={ariaLabel}
      >
        {isActive ? (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v6m3-3H9m10-3a7 7 0 10-14 0 7 7 0 0014 0z" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v10m5-5H7m5 9s7-4.686 7-10a7 7 0 10-14 0c0 5.314 7 10 7 10z" />
          </svg>
        )}
      </button>
    </div>
  );
}
