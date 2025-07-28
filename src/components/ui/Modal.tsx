import { Component, JSX, Show, createSignal, createEffect } from 'solid-js';

export interface ModalProps {
  /** モーダルが開いているかどうか */
  isOpen: boolean;
  /** モーダルを閉じる関数 */
  onClose: () => void;
  /** モーダルのタイトル */
  title?: string;
  /** 背景クリックで閉じることができるか（デフォルト: true） */
  closeOnBackdropClick?: boolean;
  /** 閉じるボタンを表示するか（デフォルト: true） */
  showCloseButton?: boolean;
  /** モーダルの最大幅（デフォルト: 'max-w-md'） */
  maxWidth?: 'max-w-xs' | 'max-w-sm' | 'max-w-md' | 'max-w-lg' | 'max-w-xl' | 'max-w-2xl' | 'max-w-3xl' | 'max-w-4xl' | 'max-w-5xl' | 'max-w-6xl' | 'max-w-7xl' | 'max-w-full';
  /** モーダルの最大高さ（デフォルト: 'max-h-[90dvh]'） */
  maxHeight?: string;
  /** 子コンポーネント */
  children: JSX.Element;
  /** ヘッダーエリアのカスタムコンテンツ（titleの代わりに使用） */
  headerContent?: JSX.Element;
  /** フッターエリアのコンテンツ */
  footerContent?: JSX.Element;
  /** ESCキーで閉じることができるか（デフォルト: true） */
  closeOnEscape?: boolean;
  /** オーバーレイの背景透明度（デフォルト: 'bg-opacity-50'） */
  backdropOpacity?: 'bg-opacity-25' | 'bg-opacity-50' | 'bg-opacity-75';
  /** z-indexの値（デフォルト: 'z-50'） */
  zIndex?: 'z-40' | 'z-50' | 'z-60';
  /** カスタムクラス */
  class?: string;
  /** アニメーションを有効にするか（デフォルト: true） */
  animated?: boolean;
  /** アニメーション継続時間（ms）（デフォルト: 200） */
  animationDuration?: number;
}

const Modal: Component<ModalProps> = (props) => {
  const [isVisible, setIsVisible] = createSignal(false);
  const [shouldRender, setShouldRender] = createSignal(false);

  // アニメーション設定
  const animated = () => props.animated !== false;
  const duration = () => props.animationDuration || 200;

  // Modal表示状態の管理
  createEffect(() => {
    if (props.isOpen) {
      setShouldRender(true);
      // 次のフレームでアニメーション開始
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // アニメーション終了後に DOM から削除
      if (animated()) {
        setTimeout(() => setShouldRender(false), duration());
      } else {
        setShouldRender(false);
      }
    }
  });

  const handleOverlayClick = (e: MouseEvent) => {
    if (props.closeOnBackdropClick !== false && e.target === e.currentTarget) {
      props.onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (props.closeOnEscape !== false && e.key === 'Escape') {
      props.onClose();
    }
  };

  // モーダルが開いているときにキーボードイベントを監視
  if (props.isOpen && typeof window !== 'undefined') {
    document.addEventListener('keydown', handleKeyDown);
  } else if (typeof window !== 'undefined') {
    document.removeEventListener('keydown', handleKeyDown);
  }

  return (
    <Show when={shouldRender()}>
      <div 
        class={`fixed inset-0 bg-black ${props.backdropOpacity || 'bg-opacity-50'} flex items-center justify-center ${props.zIndex || 'z-50'} p-4`}
        onClick={handleOverlayClick}
        style={
          animated() 
            ? `transition: opacity ${duration()}ms ease-out; opacity: ${isVisible() ? '1' : '0'};`
            : undefined
        }
      >
        <div 
          class={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl ${props.maxWidth || 'max-w-md'} w-full ${props.maxHeight || 'max-h-[90dvh]'} overflow-y-auto ${props.class || ''}`}
          onClick={(e) => e.stopPropagation()}
          style={
            animated() 
              ? `transition: all ${duration()}ms ease-out; transform: scale(${isVisible() ? '1' : '0.95'}); opacity: ${isVisible() ? '1' : '0'};`
              : undefined
          }
        >
          {/* Header */}
          <Show when={props.title || props.headerContent || props.showCloseButton !== false}>
            <div class="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 backdrop-blur bg-white/40 dark:bg-gray-800/40">
              <Show 
                when={props.headerContent}
                fallback={
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {props.title || ''}
                  </h2>
                }
              >
                {props.headerContent}
              </Show>
              
              <Show when={props.showCloseButton !== false}>
                <button
                  onClick={props.onClose}
                  class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="モーダルを閉じる"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Show>
            </div>
          </Show>

          {/* Content */}
          <div class="p-6">
            {props.children}
          </div>

          {/* Footer */}
          <Show when={props.footerContent}>
            <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              {props.footerContent}
            </div>
          </Show>
        </div>
      </div>
    </Show>
  );
};

export default Modal;
