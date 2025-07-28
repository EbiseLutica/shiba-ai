import { Component } from 'solid-js';
import { Room } from '../types';
import RoomEditForm from './RoomEditForm';

interface RoomModalProps {
  room?: Room | null;
  onSave: (roomData: Partial<Room>) => void;
  onClose: () => void;
}

const RoomModal: Component<RoomModalProps> = (props) => {
  const isEditing = () => !!props.room;

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  return (
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing() ? 'ルームを編集' : '新しいルームを作成'}
          </h2>
          <button
            onClick={props.onClose}
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div class="p-6">
          <RoomEditForm
            room={props.room}
            onSave={props.onSave}
            onCancel={props.onClose}
            showCancelButton={true}
          />
        </div>
      </div>
    </div>
  );
};

export default RoomModal;
