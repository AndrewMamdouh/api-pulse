import { ComponentPropsWithoutRef, forwardRef, useId, Ref } from 'react';

type InputGroupProps = ComponentPropsWithoutRef<'input'> & {
  children?: string;
};

const InputGroup = forwardRef(
  ({ id, children, ...rest }: InputGroupProps, ref?: Ref<HTMLInputElement>) => {
    const uniqueId = useId();
    const inputId = id || uniqueId;
    return (
      <div>
        {children ? (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {children}
          </label>
        ) : null}
        <div className="mt-1.5">
          <input
            ref={ref}
            id={inputId}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
            type="text"
            {...rest}
          />
        </div>
      </div>
    );
  }
);

export default InputGroup;
