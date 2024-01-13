import { ReactNode } from 'react';
import { DRAGGABLE_DATA_PATH, DRAGGABLE_ID_PATH, DRAGGABLE_TYPE_PATH } from '.';
import { iNodeTypes } from '../Workspace/Flows';

interface DraggableProps {
  draggableId: string;
  type: iNodeTypes;
  data: any;
  children: ReactNode;
}

/**
 *  Draggable Component
 */
export const Draggable = (props: DraggableProps) => {
  /**
   *  Listener To onDragStart Event For Draggable Items
   */
  const onDragStart = <T,>(
    event: any,
    type: string,
    draggableId: string,
    data: T
  ) => {
    event.dataTransfer.setData(DRAGGABLE_ID_PATH, draggableId);
    event.dataTransfer.setData(DRAGGABLE_TYPE_PATH, type);

    event.dataTransfer.setData(DRAGGABLE_DATA_PATH, JSON.stringify(data));

    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      onDragStart={(e) =>
        onDragStart<any>(e, props.type, props.draggableId, props.data)
      }
    >
      {props.children}
    </div>
  );
};
