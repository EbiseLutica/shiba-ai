import { Component } from 'solid-js';
import Modal, { ModalProps } from './Modal';

export interface OnboardingModalProps extends Omit<ModalProps, 'title' | 'headerContent' | 'closeOnBackdropClick' | 'closeOnEscape' | 'showCloseButton'> {
  /** 現在のステップ番号（1から開始） */
  currentStep: number;
  /** 総ステップ数 */
  totalSteps: number;
  /** ステップのタイトル */
  stepTitle: string;
}

/**
 * オンボーディング用のモーダル
 * プログレスバーとステップ表示機能を持つ
 */
const OnboardingModal: Component<OnboardingModalProps> = (props) => {
  const progressPercentage = () => (props.currentStep / props.totalSteps) * 100;

  const headerContent = (
    <div class="w-full">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {props.stepTitle}
        </h2>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {props.currentStep}/{props.totalSteps}
        </span>
      </div>
      {/* Progress Bar */}
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage()}%` }}
        />
      </div>
    </div>
  );

  return (
    <Modal
      {...props}
      headerContent={headerContent}
      closeOnBackdropClick={false}
      closeOnEscape={false}
      showCloseButton={false}
      maxWidth={props.maxWidth || 'max-w-xl'}
      animated={true}
      animationDuration={300}
    >
      {props.children}
    </Modal>
  );
};

export default OnboardingModal;
