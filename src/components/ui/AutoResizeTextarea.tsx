import { Component, JSX, mergeProps, splitProps, createEffect, onMount } from 'solid-js';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const autoResizeTextareaVariants = cva(
  // base styles
  "w-full border rounded-lg transition-colors focus:ring-2 focus:ring-offset-0 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none overflow-hidden",
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

export interface AutoResizeTextareaProps
  extends Omit<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>, 'class'>,
    VariantProps<typeof autoResizeTextareaVariants> {
  class?: string;
  minRows?: number;
  maxRows?: number;
}

const AutoResizeTextarea: Component<AutoResizeTextareaProps> = (props) => {
  const merged = mergeProps({ 
    variant: 'default' as const, 
    size: 'md' as const,
    minRows: 1,
    maxRows: 10
  }, props);
  const [local, others] = splitProps(merged, ['class', 'variant', 'size', 'ref', 'minRows', 'maxRows', 'value', 'onInput']);
  
  let textareaRef: HTMLTextAreaElement | undefined;

  // 行の高さを計算する関数
  const getLineHeight = (element: HTMLTextAreaElement): number => {
    const computedStyle = window.getComputedStyle(element);
    return parseFloat(computedStyle.lineHeight) || parseFloat(computedStyle.fontSize) * 1.2;
  };

  // パディングを計算する関数
  const getPadding = (element: HTMLTextAreaElement): { top: number; bottom: number } => {
    const computedStyle = window.getComputedStyle(element);
    return {
      top: parseFloat(computedStyle.paddingTop) || 0,
      bottom: parseFloat(computedStyle.paddingBottom) || 0
    };
  };

  // 高さを自動調整する関数
  const adjustHeight = () => {
    if (!textareaRef) return;

    // 一時的に高さをautoにして実際のscrollHeightを取得
    textareaRef.style.height = 'auto';
    
    const lineHeight = getLineHeight(textareaRef);
    const padding = getPadding(textareaRef);
    const minHeight = lineHeight * local.minRows! + padding.top + padding.bottom;
    const maxHeight = lineHeight * local.maxRows! + padding.top + padding.bottom;
    
    // scrollHeightを基に新しい高さを計算
    let newHeight = Math.max(minHeight, textareaRef.scrollHeight);
    newHeight = Math.min(newHeight, maxHeight);
    
    textareaRef.style.height = `${newHeight}px`;
    
    // maxHeightに達した場合はスクロールを表示
    if (textareaRef.scrollHeight > maxHeight) {
      textareaRef.style.overflowY = 'auto';
    } else {
      textareaRef.style.overflowY = 'hidden';
    }
  };

  // 入力イベントハンドラー
  const handleInput: JSX.EventHandler<HTMLTextAreaElement, InputEvent> = (e) => {
    adjustHeight();
    if (typeof local.onInput === 'function') {
      local.onInput(e as any);
    }
  };

  // コンポーネントマウント時に初期化
  onMount(() => {
    if (textareaRef) {
      adjustHeight();
    }
  });

  // valueが外部から変更された時に高さを調整
  createEffect(() => {
    if (local.value !== undefined) {
      // 次のフレームで実行（DOMの更新を待つ）
      requestAnimationFrame(() => {
        adjustHeight();
      });
    }
  });

  return (
    <textarea
      ref={(el) => {
        textareaRef = el;
        if (typeof local.ref === 'function') {
          local.ref(el);
        }
      }}
      class={clsx(
        autoResizeTextareaVariants({ variant: local.variant, size: local.size }),
        local.class
      )}
      value={local.value}
      onInput={handleInput}
      rows={local.minRows}
      {...others}
    />
  );
};

export default AutoResizeTextarea;
