import React, { FC, useCallback, useRef } from 'react';

interface DroppableProps {
  droppableId: string;
  /**
   *  Listener To onDrop Event For Draggable Items
   */
  onDrop: (
    draggableId: string,
    droppableRef: HTMLDivElement,
    draggable: {
      type: string;
    }
  ) => void;
  children: React.ReactNode;
}

/**
 *  Droppable Component
 */
const Droppable: FC<DroppableProps> = (props) => {
  const container = useRef<HTMLDivElement>(null);

  const onDrop = useCallback(
    (e: any) => {
      e.preventDefault();

      //const reactFlowBounds = container.current?.getBoundingClientRect();
      const draggableId = e.dataTransfer?.getData(
        'application/apiflow/draggableId'
      );
      const type = e.dataTransfer?.getData('application/apiflow/type');

      if (!draggableId || !type || !container.current) {
        throw Error('Invalid Drop Operation');
      }

      props.onDrop(draggableId, container.current, { type });
    },
    [props]
  );

  return (
    <div onDrop={onDrop} className="h-full w-[100vw]" ref={container}>
      {props.children}
    </div>
  );
};

export default Droppable;
