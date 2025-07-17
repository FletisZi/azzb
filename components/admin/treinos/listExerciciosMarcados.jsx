import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./ListExerciciosMarcados.module.css";
import { SquareX } from "lucide-react";

function SortableItem({ item, onChange, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleInputChange = (field, value) => {
    onChange(item.id, field, value);
  };

  return (
    <li ref={setNodeRef} style={style} className={styles.item}>
      {/* Handle de arrastar */}
      <div className={styles.handle} {...attributes} {...listeners}>
        ☰
      </div>

      <div className={styles.titulo}>{item.name}</div>

      <div className={styles.detalhe}>
        Séries
        <input
          type="number"
          value={item.series}
          onChange={(e) => handleInputChange("series", e.target.value)}
          className={styles.inputNumber}
        />
      </div>

      <div className={styles.detalhe}>
        Repetições
        <input
          type="number"
          value={item.repeticoes}
          onChange={(e) => handleInputChange("repeticoes", e.target.value)}
          className={styles.inputNumber}
        />
      </div>

      <div className={styles.detalhe}>
        Instrução
        <input
          type="text"
          value={item.observacao || ""}
          onChange={(e) => handleInputChange("observacao", e.target.value)}
          className={styles.inputObservacao}
        />
      </div>

      {/* Botão Remover */}
      <button
        type="button"
        className={styles.botaoRemover}
        onClick={() => onRemove(item.id)}
      >
        <SquareX color={"#FF171B"} size={24} />
      </button>
    </li>
  );
}

export default function ListExerciciosMarcados({
  listaExercicios,
  setListaExercicios,
}) {
  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = listaExercicios.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = listaExercicios.findIndex((item) => item.id === over.id);

      const novaLista = arrayMove(listaExercicios, oldIndex, newIndex);
      setListaExercicios(novaLista);
    }
  }

  function handleInputChange(id, field, value) {
    setListaExercicios((prevLista) =>
      prevLista.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }
  function handleRemove(id) {
    setListaExercicios((prevLista) =>
      prevLista.filter((item) => item.id !== id)
    );
  }

  return (
    <div>
      <div className={styles.containerExerciciosMarcados}>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={listaExercicios.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className={styles.lista}>
              {/* {listaExercicios.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  onChange={handleInputChange}
                  onRemove={handleRemove}
                />
              ))} */}

              {/* feito mudanca de estado para voltar padrao numero de series e repeticoes se nao bugar */}
              {listaExercicios.map((item) => {
                const itemComPadrao = {
                  ...item,
                  series: item.series > 0 ? item.series : 3,
                  repeticoes: item.repeticoes > 0 ? item.repeticoes : 12,
                };

                return (
                  <SortableItem
                    key={item.id}
                    item={itemComPadrao}
                    onChange={handleInputChange}
                    onRemove={handleRemove}
                  />
                );
              })}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
