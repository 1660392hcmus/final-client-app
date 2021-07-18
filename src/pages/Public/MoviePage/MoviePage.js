// @ts-nocheck
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MovieBanner from '../../../components/MovieBanner/MovieBanner';
import { getMovie, onSelectMovie } from '../../../store/actions';

class MoviePage extends Component {
  componentWillMount() {
    this.props.getMovie(this.props.match.params.id, this.props.token || window.localStorage.getItem('token'));
  }
  componentWillUnmount() {
    this.props.onSelectMovie(null);
  }

  render() {
    const { movie } = this.props;
    console.log("🚀 ~ file: MoviePage.js ~ line 18 ~ MoviePage ~ render ~ movie", movie)
    return <>{movie && <MovieBanner movie={movie} fullDescription />}</>;
  }
}

MoviePage.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object.isRequired
};

const mapStateToProps = ({ movieState, authState }) => ({
  movie: movieState.selectedMovie,
  token: authState.token,
});

const mapDispatchToProps = { getMovie, onSelectMovie };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MoviePage);
