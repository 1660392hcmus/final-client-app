import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Typography, Select } from '@material-ui/core';
import { Button, TextField, MenuItem } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import styles from './styles';
import { genreData, languageData } from '../../../../../data/MovieDataService';
import {
  addMovie,
  updateMovie,
  removeMovie
} from '../../../../../store/actions';

class AddMovie extends Component {
  state = {
    title: '',
    avatar: null,
    length: '',
    description: '',
    director: '',
    released: '',
    price: '',
  };

  componentDidMount() {
    if (this.props.edit) {
      const {
        title,
        director,
        description,
        duration,
        releaseDate,
        avatar,
        price,
      } = this.props.edit;
      this.setState({
        title,
        director,
        description,
        length: duration,
        released: releaseDate.slice(0,4),
        avatar,
        price,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.movie !== this.props.movie) {
      const { title } = this.props.movie;
      this.setState({ title });
    }
  }

  handleChange = e => {
    this.setState({
      state: e.target.value
    });
  };

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };
    newState[field] = value;
    this.setState(newState);
  };

  onAddMovie = () => {
    const { ...rest } = this.state;
    const movie = { ...rest };
    this.props.addMovie(movie);
  };

  onUpdateMovie = () => {
    const { ...rest } = this.state;
    // const movie = { ...rest };
    this.props.updateMovie(this.props.edit._id, rest);
  };

  onRemoveMovie = () => this.props.removeMovie(this.props.edit._id);

  render() {
    const { classes, className } = this.props;
    const {
      title,
      director,
      avatar,
      description,
      length,
      released,
      price
    } = this.state;

    const rootClassName = classNames(classes.root, className);
    const subtitle = this.props.edit ? 'Edit Movie' : 'Add Movie';
    const submitButton = this.props.edit ? 'Update Movie' : 'Save Details';
    const submitAction = this.props.edit
      ? () => this.onUpdateMovie()
      : () => this.onAddMovie();

    return (
      <div className={rootClassName}>
        <Typography variant="h4" className={classes.title}>
          {subtitle}
        </Typography>
        <form autoComplete="off" noValidate>
          <div className={classes.field}>
            <TextField
              className={classes.textField}
              helperText="Please specify the title"
              label="Title"
              margin="dense"
              required
              value={title}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('title', event.target.value)
              }
            />
          </div>
          <div className={classes.field}>
            <TextField
              className={classes.textField}
              helperText="Please specify director"
              label="Director"
              margin="dense"
              required
              value={director}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('director', event.target.value)
              }
            />
          </div>
          <div className={classes.field}>
            <TextField
              fullWidth
              multiline
              className={classes.textField}
              label="Description"
              margin="dense"
              required
              variant="outlined"
              value={description}
              onChange={event =>
                this.handleFieldChange('description', event.target.value)
              }
            />
          </div>
          <div className={classes.field}>
            <TextField
              className={classes.textField}
              label="Released"
              margin="dense"
              type="number"
              required
              value={released}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('released', event.target.value)
              }>
            </TextField>

            <TextField
              className={classes.textField}
              label="Length"
              margin="dense"
              type="number"
              required
              value={length}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('length', event.target.value)
              }
            />
          </div>
          <div className={classes.field}>
            <TextField
              className={classes.textField}
              label="Price"
              margin="dense"
              type="number"
              required
              value={price}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('price', event.target.value)
              }
            />
            <TextField
              className={classes.textField}
              label="Avatar"
              margin="dense"
              required
              value={avatar}
              variant="outlined"
              onChange={event =>
                this.handleFieldChange('avatar', event.target.value)
              }
            />
          </div>
        </form>

        <Button
          className={classes.buttonFooter}
          color="primary"
          variant="contained"
          onClick={submitAction}>
          {submitButton}
        </Button>
        {this.props.edit && (
          <Button
            color="secondary"
            className={classes.buttonFooter}
            variant="contained"
            onClick={this.onRemoveMovie}>
            Delete Movie
          </Button>
        )}
      </div>
    );
  }
}

AddMovie.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object,
  movie: PropTypes.object
};

const mapStateToProps = ({ movieState }) => ({
  movies: movieState.movies
});

const mapDispatchToProps = { addMovie, updateMovie, removeMovie };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddMovie));
