const CardTitle: React.FC<{ 
    children: React.ReactNode, 
    className?: string 
  }> = ({ children, className = '' }) => (
    <h3 className={`text-lg font-semibold text-gray-800 ${className}`}>
      {children}
    </h3>
);

export default CardTitle;