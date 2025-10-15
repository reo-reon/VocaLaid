import React from 'react'

type CardProps = React.HTMLAttributes<HTMLDivElement>

export const Card: React.FC<CardProps> = ({ className = '', children, ...rest }) => {
  return (
    <div className={`p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 ${className}`} {...rest}>
      {children}
    </div>
  )
}

export default Card
