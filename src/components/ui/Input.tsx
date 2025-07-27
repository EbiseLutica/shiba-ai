import { Component, JSX, mergeProps, splitProps } from 'solid-js';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const inputVariants = cva(
  // base styles
  "w-full border rounded-lg transition-colors focus:ring-2 focus:ring-offset-0 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500",
        error: "border-red-300 dark:border-red-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-red-500"
      },
      size: {
        sm: "h-8 px-2 text-sm",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

export interface InputProps
  extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'class' | 'size'>,
    VariantProps<typeof inputVariants> {
  class?: string;
}

const Input: Component<InputProps> = (props) => {
  const merged = mergeProps({ variant: 'default' as const, size: 'md' as const }, props);
  const [local, others] = splitProps(merged, ['class', 'variant', 'size']);

  return (
    <input
      class={clsx(
        inputVariants({ variant: local.variant, size: local.size }),
        local.class
      )}
      {...others}
    />
  );
};

export default Input;
