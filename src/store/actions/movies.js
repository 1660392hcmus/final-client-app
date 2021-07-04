import { GET_MOVIES, SELECT_MOVIE,GET_SUGGESTIONS } from '../types';
import { setAlert } from './alert';

export const uploadMovieImage = (id, image) => async dispatch => {
  try {
    const data = new FormData();
    data.append('file', image);
    const url = '/movies/photo/' + id;
    const response = await fetch(url, {
      method: 'POST',
      body: data
    });
    const responseData = await response.json();
    if (response.ok) {
      dispatch(setAlert('Image Uploaded', 'success', 5000));
    }
    if (responseData.error) {
      dispatch(setAlert(responseData.error.message, 'error', 5000));
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const getMovies = () => async dispatch => {
  try {
    fetch(`http://3.21.232.6:8080/user/get/all/movie`)
    //fetch(`https://us-central1-liuliu-d7864.cloudfunctions.net/app/movies`)
    .then(data => data.json())
    .then(result => {
      console.log(result);
      dispatch({ type: GET_MOVIES, payload: result.movies });
    });
    // const url = 'http://3.21.232.6:8080/user/get/all/movie';
    // const response = await fetch(url, {
    //   method: 'GET',
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // console.log("🚀 ~ file: movies.js ~ line 32 ~ response", response)
    // const movies = await response.json();
    // if (response.ok) {
    //   dispatch({ type: GET_MOVIES, payload: movies });
    // }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const onSelectMovie = movie => ({
  type: SELECT_MOVIE,
  payload: movie
});

export const getMovie = (id, token) => async dispatch => {
  try {
    const url = 'http://3.21.232.6:8080/admin/get/movie/' + id;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'x-auth': token, },
    });
    const movie = await response.json();
    if (response) {
      dispatch({ type: SELECT_MOVIE, payload: movie });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const getMovieSuggestion = id => async dispatch => {
  try {
    const url = '/movies/usermodeling/' + id;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const movies = await response.json();
    if (response.ok) {
      dispatch({ type: GET_SUGGESTIONS, payload: movies });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const addMovie = (newMovie) => async dispatch => {
  try {
    const token = localStorage.getItem('token');
    // let formData = new FormData();
    // formData.append('title', newMovie.title);
    // formData.append('director', newMovie.director);
    // formData.append('description', newMovie.description);
    // formData.append('length', parseInt(newMovie.length));
    // formData.append('released', parseInt(newMovie.released));
    // formData.append('avatar', newMovie.avatar);
    // formData.append('price',parseInt(newMovie.price));
    const url = 'http://3.21.232.6:8080/admin/add/movie';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth': token, },
      body: JSON.stringify({
        director: newMovie.director,
        data: newMovie.data || [{date: null, time: [null]}],
        title: newMovie.title,
        length: parseInt(newMovie.length),
        released: parseInt(newMovie.released),
        discription: newMovie.description,
        price: parseInt(newMovie.price),
        imageUrl: newMovie.avatar
      })
    });
    const movie = await response.json();
    if (response) {
      dispatch(setAlert('Movie have been saved!', 'success', 5000));
      // if (image) dispatch(uploadMovieImage(movie._id, image));
      dispatch(getMovies());
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const updateMovie = (movieId, movie, image) => async dispatch => {
  try {
    const token = localStorage.getItem('token');
    const url = '/movies/' + movieId;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movie)
    });
    if (response.ok) {
      dispatch(onSelectMovie(null));
      dispatch(setAlert('Movie have been saved!', 'success', 5000));
      if (image) dispatch(uploadMovieImage(movieId, image));
      dispatch(getMovies());
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const removeMovie = movieId => async dispatch => {
  const token = localStorage.getItem('token');
  try {
    const token = localStorage.getItem('token');
    const url = 'http://3.21.232.6:8080/admin/delete/movie/' + movieId;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        // Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-auth': token,
      }
    });
    if (response.ok) {
      dispatch(getMovies());
      dispatch(onSelectMovie(null));
      dispatch(setAlert('Movie have been Deleted!', 'success', 5000));
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};
