// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться

// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { heroCreated } from "../heroesList/heroesSlice";
import { useHttp } from "../../hooks/http.hook";
import store from "../../store";
import { selectAll } from "../heroesFilters/filtersSlice";

const HeroesAddForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [element, setElement] = useState("");

  // const { heroes } = useSelector((state) => state);
  const { filtersLoadingStatus } = useSelector((state) => state.filters);
  const filters = selectAll(store.getState());

  const dispatch = useDispatch();
  const { request } = useHttp();

  //   console.log(heroes);

  const onSubmitForm = (e) => {
    e.preventDefault();
    const id = uuidv4();
    const hero = {
      id,
      name,
      description,
      element,
    };
    // dispatch(
    //   heroesModify([
    //     ...heroes,
    //     {
    //       id,
    //       name,
    //       description,
    //       element,
    //     },
    //   ])
    // );

    request(`http://localhost:3001/heroes/`, "POST", JSON.stringify(hero))
      .then((response) => {
        console.log(response, "success");
      })
      .then(() => dispatch(heroCreated(hero)))
      .catch((e) => {
        console.log(e);
      });

    setName("");
    setDescription("");
    setElement("");
  };

  const renderFilters = (filters, status) => {
    if (status === "loading") {
      return <option>Загрузка элементов</option>;
    } else if (status === "error") {
      return <option>Ошибка загрузки</option>;
    }

    if (filters && filters.length > 0) {
      return filters.map(({ name, label }) => {
        if (name === "all") return;
        return (
          <option key={name} value={name}>
            {label}
          </option>
        );
      });
    }
  };

  return (
    <form className="border p-4 shadow-lg rounded" onSubmit={onSubmitForm}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label fs-4">
          Имя нового героя
        </label>
        <input
          required
          type="text"
          name="name"
          className="form-control"
          id="name"
          placeholder="Как меня зовут?"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="text" className="form-label fs-4">
          Описание
        </label>
        <textarea
          required
          name="text"
          className="form-control"
          id="text"
          placeholder="Что я умею?"
          style={{ height: "130px" }}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="element" className="form-label">
          Выбрать элемент героя
        </label>
        <select
          required
          value={element}
          onChange={(e) => {
            setElement(e.target.value);
          }}
          className="form-select"
          id="element"
          name="element"
        >
          <option>Я владею элементом...</option>
          {renderFilters(filters, filtersLoadingStatus)}
        </select>
      </div>

      <button type="submit" className="btn btn-primary">
        Создать
      </button>
    </form>
  );
};

export default HeroesAddForm;
