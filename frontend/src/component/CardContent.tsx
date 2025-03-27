const CardContent: React.FC<{ 
    children: React.ReactNode, 
    className?: string 
  }> = ({ children, className = '' }) => (
    <div className={`${className}`}>
      {children}
    </div>
);

export default CardContent;