import React from 'react';

const CardHeader: React.FC<{ 
    children: React.ReactNode, 
    className?: string, 
    variant?: 'default' | 'flex' 
  }> = ({ children, className = '', variant = 'default' }) => {
    const baseClasses = 'mb-4';
    const flexClasses = 'flex items-center justify-between';
    
    return (
      <div className={`
        ${baseClasses} 
        ${variant === 'flex' ? flexClasses : ''} 
        ${className}
      `}>
        {children}
      </div>
    );
  };

export default CardHeader 