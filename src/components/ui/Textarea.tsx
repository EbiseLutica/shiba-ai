import { Component, JSX, mergeProps, splitProps } from 'solid-js';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const textareaVariants = cva(
  // base styles
  "w-full border rounded-lg transition-colors focus:ring-2 focus:ring-offset-0 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none",
  {
    variants: {
      variant: {
        default: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500",
        error: "border-red-300 dark:border-red-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-red-500"
      },
      size: {
        sm: "p-2 text-sm",
        md: "p-3 text-sm", 
        lg: "p-4 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

export interface TextareaProps
  extends Omit<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>, 'class'>,
    VariantProps<typeof textareaVariants> {
  class?: string;
}

const Textarea: Component<TextareaProps> = (props) => {
  const merged = mergeProps({ variant: 'default' as const, size: 'md' as const }, props);
  const [local, others] = splitProps(merged, ['class', 'variant', 'size', 'ref']);

  return (
    <textarea
      ref={local.ref}
      class={clsx(
        textareaVariants({ variant: local.variant, size: local.size }),
        local.class
      )}
      {...others}
    />
  );
};

export default Textarea;
