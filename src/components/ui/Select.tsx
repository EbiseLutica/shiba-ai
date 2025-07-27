import { Component, JSX, mergeProps, splitProps } from 'solid-js';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const selectVariants = cva(
  // base styles
  "w-full border rounded-lg transition-colors focus:ring-2 focus:ring-offset-0 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500",
        error: "border-red-300 dark:border-red-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-red-500"
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

export interface SelectProps
  extends Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, 'class' | 'size'>,
    VariantProps<typeof selectVariants> {
  class?: string;
}

const Select: Component<SelectProps> = (props) => {
  const merged = mergeProps({ variant: 'default' as const, size: 'md' as const }, props);
  const [local, others] = splitProps(merged, ['class', 'variant', 'size']);

  return (
    <select
      class={clsx(
        selectVariants({ variant: local.variant, size: local.size }),
        local.class
      )}
      {...others}
    />
  );
};

export default Select;
