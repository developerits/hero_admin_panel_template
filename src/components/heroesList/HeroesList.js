import { useHttp } from "../../hooks/http.hook";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import {
  heroDeleted,
  fetchHeroes,
  filteredHeroesSelector,
} from "./heroesSlice";
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from "../spinner/Spinner";
import "./HeroesList.scss";

const HeroesList = () => {
  const filteredHeroes = useSelector(filteredHeroesSelector);
  const heroesLoadingStatus = useSelector(
    (state) => state.heroes.heroesLoadingStatus
  );
  const dispatch = useDispatch();
  const { request } = useHttp();

  useEffect(() => {
    // dispatch(heroesFetching());
    dispatch(fetchHeroes());

    // eslint-disable-next-line
  }, []);

  const onDeleteHero = useCallback(
    (id) => {
      request(`http://localhost:3001/heroes/${id}`, "DELETE")
        .then((data) => console.log(data, "Deleted"))
        .then(dispatch(heroDeleted(id)))
        .catch((err) => console.log(err));
      // let newHeroes = heroes.map((value, index) => {});
    },
    [request]
  );

  // const filterHeroes = (items, filter) => {
  //   switch (filter) {
  //     case "all":
  //       return items;
  //     default:
  //       return items.filter((item) => item.element === filter);
  //   }
  // };

  if (heroesLoadingStatus === "loading") {
    return <Spinner />;
  } else if (heroesLoadingStatus === "error") {
    return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
  }

  // const renderHeroesList = (arr) => {
  //   // if (arr.length === 0) {
  //   //   return (
  //   //     <CSSTransition timeout={0} classNames="hero">
  //   //       <h5 className="text-center mt-5">Героев пока нет</h5>;
  //   //     </CSSTransition>
  //   //   );
  //   // }

  //   return arr.map(({ id, ...props }) => {
  //     return (
  //       <CSSTransition key={id} timeout={500} classNames="hero">
  //         <HeroesListItem
  //           key={id}
  //           id={id}
  //           onDeleteHero={() => onDeleteHero(id)}
  //           {...props}
  //         />
  //       </CSSTransition>
  //     );
  //   });
  // };

  const renderHeroesList = (arr) => {
    if (arr.length === 0) {
      return (
        <CSSTransition timeout={0} classNames="hero">
          <h5 className="text-center mt-5">Героев пока нет</h5>
        </CSSTransition>
      );
    }

    return arr.map(({ id, ...props }) => {
      return (
        <CSSTransition key={id} timeout={500} classNames="hero">
          <HeroesListItem {...props} onDeleteHero={() => onDeleteHero(id)} />
        </CSSTransition>
      );
    });
  };

  const elements = renderHeroesList(filteredHeroes);
  return <TransitionGroup component="ul">{elements}</TransitionGroup>;
};

export default HeroesList;
