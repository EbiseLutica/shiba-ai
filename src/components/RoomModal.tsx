import { Component } from 'solid-js';
import { Room } from '../types';
import { Modal } from './ui';
import RoomEditForm from './RoomEditForm';

interface RoomModalProps {
  room?: Room | null;
  onSave: (roomData: Partial<Room>) => void;
  onClose: () => void;
  isOpen: boolean;
}

const RoomModal: Component<RoomModalProps> = (props) => {
  const isEditing = () => !!props.room;

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={isEditing() ? 'ルームを編集' : '新しいルームを作成'}
      maxWidth="max-w-2xl"
      closeOnBackdropClick={false}
      showCloseButton={true}
    >
      <RoomEditForm
        room={props.room}
        onSave={props.onSave}
        onCancel={props.onClose}
        showCancelButton={true}
      />
    </Modal>
  );
};

export default RoomModal;
