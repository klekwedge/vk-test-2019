import { useState } from "react";
import {
  changeCards,
  changeCurrentCard,
  changeCurrentTask,
} from "../../slices/kanbanSlice/kanbanSlice";
import { ICard, ITask } from "../../types/types";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hook";
import "./Task.scss";

interface TaskProps {
  task: ITask;
  card: ICard;
  deleteTask: (id: any) => void;
}

function Task({ deleteTask, task, card }: TaskProps) {
  const { cards, currentTask, currentCard } = useAppSelector(
    (state) => state.kanban
  );
  const dispatch = useAppDispatch();

  // курсор мыши наведен на элемент при перетаскивани
  function dragOverHandler(e: React.DragEvent<HTMLLIElement>) {
    e.preventDefault();

    if (e.target.className.includes("card__item")) {
      e.target.style.boxShadow = "0 4px 3px gray";
    }
  }

  // курсор мыши покидает пределы перетаскиваемого элемента
  function dragLeaveHandler(e) {
    e.target.style.boxShadow = "none";
  }

  // пользователь начинает перетаскивание элемента
  function dragStartHandler() {
    dispatch(changeCurrentTask(task));
    dispatch(changeCurrentCard(card));
  }

  // пользователь отпускает курсор мыши в процессе перетаскивания.
  function dragEndHandler(e) {
    e.target.style.boxShadow = "none";
  }

  // происходит drop элемента.
  function dropHandler(e: React.DragEvent<HTMLLIElement>) {
    e.preventDefault();
    e.target.style.boxShadow = "none";

    const currentIndex = currentCard.tasks.indexOf(currentTask);
    let oldCard = JSON.parse(JSON.stringify(currentCard));

    const dropIndex = card.tasks.indexOf(task);
    let newCard = JSON.parse(JSON.stringify(card));

    if (card.id !== currentCard.id) {
      oldCard.tasks.splice(currentIndex, 1);
      newCard.tasks.splice(dropIndex + 1, 0, currentTask);

      const newCards = cards.map((cardItem: ICard) => {
        if (cardItem.id === card.id) {
          return newCard;
        }

        if (cardItem.id === currentCard.id) {
          return oldCard;
        }

        return cardItem;
      });

      dispatch(changeCards(newCards));
    } else {
      [newCard.tasks[dropIndex], newCard.tasks[currentIndex]] = [
        newCard.tasks[currentIndex],
        newCard.tasks[dropIndex],
      ];

      const newCards = cards.map((cardItem: ICard) => {
        if (cardItem.id === newCard.id) {
          return newCard;
        } else {
          return cardItem;
        }
      });

      dispatch(changeCards(newCards));
    }
  }

  return (
    <li
      draggable="true"
      className="card__item item"
      onDragOver={(e) => dragOverHandler(e)}
      onDragLeave={(e) => dragLeaveHandler(e)}
      onDragStart={(e) => dragStartHandler()}
      onDragEnd={(e) => dragEndHandler(e)}
      onDrop={(e) => dropHandler(e)}
    >
      <h3>{task.taskTitle}</h3>
      <img src="/public/svg/close.svg" onClick={() => deleteTask(task.id)} />
    </li>
  );
}

export default Task;
