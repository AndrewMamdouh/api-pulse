import { ComponentPropsWithoutRef, Ref, forwardRef } from 'react';

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  iconOnly?: boolean;
};

const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'lg',
      iconOnly = false,
      children,
      className = '',
      ...rest
    }: ButtonProps,
    ref?: Ref<HTMLButtonElement>
  ) => {
    /**
     * Generate ClassNames Based On Variants
     */
    const getButtonVariantClassName = () => {
      switch (variant) {
        case 'primary':
          return 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';
        case 'secondary':
          return 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50';
        case 'tertiary':
          return 'bg-transparent text-gray-900 hover:bg-gray-50';
      }
    };

    /**
     * Generate ClassNames Based On Size
     */
    const getButtonSizeClassName = () => {
      switch (size) {
        case 'sm':
          return iconOnly ? 'p-2' : 'px-2.5 py-1';
        case 'md':
          return iconOnly ? 'p-3' : 'px-4 py-1.5';
        case 'lg':
          return iconOnly ? 'p-4' : 'px-5 py-2';
        case 'xl':
          return iconOnly ? 'p-5' : 'px-7 py-2.5';
        case '2xl':
          return iconOnly ? 'p-6' : 'px-8 py-3';
      }
    };

    const classNames = `${getButtonVariantClassName()} ${getButtonSizeClassName()} ${className}`;

    return (
      <button
        ref={ref}
        type="button"
        className={`inline-flex rounded-md text-sm font-semibold shadow-sm transition-colors duration-150 ease-in ${classNames}`}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

export default Button;
