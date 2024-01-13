import React from 'react';

interface ToggleArrowProps {
  isSubMenuOpen: boolean;
}

/**
 * ToggleArrow Component
 */
const ToggleArrow: React.FC<ToggleArrowProps> = ({ isSubMenuOpen }) => {
  return (
    <i
      style={{
        transform: isSubMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
        transition: 'all 0.3s ease-in-out', // Corrected the transition duration
        overflow: 'hidden',
      }}
      className={`fa fa-angle-right`}
    ></i>
  );
};

export default ToggleArrow;
