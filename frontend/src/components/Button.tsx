import React, { ReactNode } from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button = ({ label, onClick }: ButtonProps): ReactNode => {
  return (
    <button onClick={onClick} className="btn">
      {label}
    </button>
  );
};

export default Button;