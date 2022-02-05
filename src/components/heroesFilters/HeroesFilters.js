import classNames from "classnames";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilters } from "./filtersSlice";
import { activeFilterChanged, selectAll } from "./filtersSlice";
import store from "../../store";
import { useHttp } from "../../hooks/http.hook";
import Spinner from "../spinner/Spinner";

const HeroesFilters = () => {
  const { activeFilter, filtersLoadingStatus } = useSelector(
    (state) => state.filters
  );
  const filters = selectAll(store.getState());
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFilters());
  }, []);

  if (filtersLoadingStatus === "loading") {
    return <Spinner />;
  } else if (filtersLoadingStatus === "error") {
    return <h5>Ошибка загрузки</h5>;
  }

  //   const filteredHeroes = (arr) => {
  //     const result = arr.filter(({ element }) => element === activeFilter);
  //     console.log(result);
  //     // dispatch(heroesModify(result));
  //   };

  const renderFilters = (arr) => {
    if (arr.length === 0) {
      return <h5>Филитров пока нет</h5>;
    }

    const result = arr.map(({ name, label, className }) => {
      const btnClass = classNames("btn", className, {
        active: name === activeFilter,
      });
      return (
        <button
          key={name}
          onClick={() => {
            dispatch(activeFilterChanged(name));
          }}
          id={name}
          className={btnClass}
        >
          {label}
        </button>
      );
    });

    return result;
  };

  const items = renderFilters(filters);

  return (
    <div className="card shadow-lg mt-4">
      <div className="card-body">
        <p className="card-text">Отфильтруйте героев по элементам</p>
        <div className="btn-group">{items}</div>
      </div>
    </div>
  );
};

export default HeroesFilters;
