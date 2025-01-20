import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { UseFieldArrayMove } from "react-hook-form";

type Props = {
  children: React.ReactElement | React.ReactElement[];
  data: { id: string }[];
  onMove: UseFieldArrayMove;
};

export function DragAndDrop({ children, data, onMove }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.findIndex((a) => a.id === active.id);
      const newIndex = data.findIndex((a) => a.id === over.id);
      onMove(oldIndex, newIndex);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={data}
        strategy={verticalListSortingStrategy}
        disabled={data.length === 1}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
}
