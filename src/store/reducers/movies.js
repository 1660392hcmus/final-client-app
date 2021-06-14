import { GET_MOVIES, SELECT_MOVIE,GET_SUGGESTIONS } from '../types';

const initialState = {
  movies: [],
  randomMovie: null,
  latestMovies: [],
  nowShowing: [],
  comingSoon: [],
  selectedMovie: null,
  suggested:[]
};

const getMovies = (state, payload) => {
  const nowShowing = payload;
  const comingSoon = payload.sort(() => Math.random());
  const latestMovies = payload.sort(() => Math.random() - 2);
  const suggested = payload.sort(() => Math.random() - 3);
  // const latestMovies = payload
  //   .sort((a, b) => Date.parse(b.releaseDate) - Date.parse(a.releaseDate))
  //   .slice(0, 5);

  // const nowShowing = payload.filter(
  //   movie =>
  //     new Date(movie.endDate) >= new Date() &&
  //     new Date(movie.releaseDate) < new Date()
  // );

  // const comingSoon = payload.filter(
  //   movie => new Date(movie.releaseDate) > new Date()
  // );

  return {
    ...state,
    movies: payload,
    randomMovie: payload[Math.floor(Math.random() * payload.length)],
    latestMovies,
    nowShowing,
    comingSoon,
    suggested
  };
};

const onSelectMovie = (state, payload) => ({
  ...state,
  selectedMovie: payload ? {
    _id : payload.movie.id_movie,
    title : payload.movie.title,
    image :payload.movie.image,
    genre :"fantasy",
    language :"english",
    duration : payload.movie.length,
    discription : payload.movie.discription,
    director : payload.movie.director,
    cast : "asher angel, mark strong, zachary levi",
    __v :0,
    endDate :"2022-03-27T16:38:00.000Z",
    releaseDate :"2021-07-31T16:38:00.000Z",
  } : null,
});

const getMovieSuggestions = (state, payload) =>({
  ...state,
  suggested: payload
})

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_MOVIES:
      return getMovies(state, payload);
    case SELECT_MOVIE:
      return onSelectMovie(state, payload);
    case GET_SUGGESTIONS:
      return getMovieSuggestions(state, payload);
    default:
      return state;
  }
};
