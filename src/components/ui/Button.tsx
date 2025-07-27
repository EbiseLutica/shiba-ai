import { Component, JSX, mergeProps, splitProps } from 'solid-js';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const buttonVariants = cva(
  // base styles
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500",
        outline: "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-gray-500",
        ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-500",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export interface ButtonProps
  extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'class'>,
    VariantProps<typeof buttonVariants> {
  class?: string;
  loading?: boolean;
}

const Button: Component<ButtonProps> = (props) => {
  const merged = mergeProps({ variant: 'primary' as const, size: 'md' as const }, props);
  const [local, others] = splitProps(merged, ['class', 'variant', 'size', 'loading', 'children', 'disabled']);

  return (
    <button
      class={clsx(
        buttonVariants({ variant: local.variant, size: local.size }),
        local.class
      )}
      disabled={local.disabled || local.loading}
      {...others}
    >
      {local.loading ? (
        <div class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        local.children
      )}
    </button>
  );
};

export default Button;
