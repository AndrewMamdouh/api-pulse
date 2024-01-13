import React from 'react';

interface TitleProps {
  text: string;
  extraClass?: string;
}

/**
 *  Title Component
 */
const Title: React.FC<TitleProps> = ({ text, extraClass }) => {
  return (
    <span
      className={extraClass ? `${extraClass} sub-menu-title` : `sub-menu-title`}
      style={{ textTransform: 'lowercase' }}
    >
      {text}
    </span>
  );
};

export default Title;
