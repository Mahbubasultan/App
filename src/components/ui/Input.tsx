import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  helperText,
  className = '', 
  ...props 
}) => {
  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-text-primary mb-2">
          {label}
        </label>
      )}
      
      <input
        className={`
          w-full px-4 py-3 border rounded-2xl 
          focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none 
          transition-all duration-200 bg-white
          disabled:bg-gray-50 disabled:text-text-secondary disabled:cursor-not-allowed
          ${hasError ? 'border-danger-500' : 'border-gray-300 hover:border-gray-400'}
          ${className}
        `}
        {...props}
      />
      
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${hasError ? 'text-danger-600' : 'text-text-secondary'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ 
  label, 
  error, 
  options,
  className = '', 
  ...props 
}) => {
  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-text-primary mb-2">
          {label}
        </label>
      )}
      
      <select
        className={`
          w-full px-4 py-3 border rounded-2xl 
          focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none 
          transition-all duration-200 bg-white
          disabled:bg-gray-50 disabled:text-text-secondary disabled:cursor-not-allowed
          ${hasError ? 'border-danger-500' : 'border-gray-300 hover:border-gray-400'}
          ${className}
        `}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-2 text-sm text-danger-600">{error}</p>
      )}
    </div>
  );
};
