import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Grid, Container } from '@material-ui/core';
import {
  getMovie,
  getCinemasUserModeling,
  getCinema,
  getCinemas,
  getShowtimes,
  getReservations,
  getSuggestedReservationSeats,
  setSelectedSeats,
  setSelectedCinema,
  setSelectedDate,
  setSelectedTime,
  setInvitation,
  toggleLoginPopup,
  showInvitationForm,
  resetCheckout,
  setAlert,
  addReservation,
  setSuggestedSeats,
  setQRCode
} from '../../../store/actions';
import styles from './styles';
import MovieInfo from './components/MovieInfo/MovieInfo';
import { navigate } from "@reach/router";
import BookingInvitation from './components/BookingInvitation/BookingInvitation';

class BookingPage extends Component {
  didSetSuggestion = false;
  state = {
    showDay: null,
    id_day: null,
    times: null,
    id_time: null,
    seated: null,
    seatWanted: [],
    movie: null
  };


  componentDidMount() {
    const {
      match,
      getMovie,
      token,
    } = this.props;
    getMovie(match.params.id, token);
    fetch(
        `http://3.21.232.6:8080/admin/get/movie/${
            match.params.id
        }`,
        {
          method: "get",
  
          headers: {
            Accept: "application/json",
            "x-auth": localStorage.getItem("token")
          }
        }
      )
        .then(res => res.json())
        .then(data => this.setState({ movie: data.movie }));
  
      fetch(
        `http://3.21.232.6:8080/user/get/date/${
            match.params.id
        }`,
        {
          method: "get",
  
          headers: {
            Accept: "application/json",
            "x-auth": localStorage.getItem("token")
          }
        }
      )
        .then(res => res.json())
        .then(data => this.setState({ showDay: data.dates }));
  }

  componentDidUpdate(prevProps) {
    const { selectedCinema, selectedDate, getCinema } = this.props;
    if (
      (selectedCinema && prevProps.selectedCinema !== selectedCinema) ||
      (selectedCinema && prevProps.selectedDate !== selectedDate)
    ) {
      getCinema(selectedCinema);
    }
  }

  initPaymentRequest = () => {
    let networks = ["mastercard", "visa"];
    let types = ["debit", "credit", "prepaid"];
    let supportedInstruments = [
      {
        supportedMethods: "basic-card",
        data: { supportedNetworks: networks, supportedTypes: types }
      }
    ];

    let details = {
      total: {
        label: "Venom Ticket",
        amount: { currency: "USD", value: "10.00" }
      },
      displayItems: [
        {
          label: "#1 Ticket",
          amount: { currency: "USD", value: "10.00" }
        }
      ]
    };
    return new window.PaymentRequest(supportedInstruments, details);
  };

  handleSelectDay = e => {
    this.setState({ id_day: e.target.value });
    fetch(
      `http://3.21.232.6:8080/user/get/time/${
        this.props.match.params.id
      }/${e.target.value}`,
      {
        method: "get",
        headers: {
          Accept: "application/json",
          "x-auth": localStorage.getItem("token")
        }
      }
    )
      .then(res => res.json())
      .then(data => this.setState({ times: data.times }));
  };

  hadleSelectTime = e => {
    this.setState({ id_time: e.target.value });
    const { id_day } = this.state;
    fetch(
      `http://3.21.232.6:8080/user/get/seated/${
        this.props.match.params.id
      }/${id_day}/${e.target.value}`,
      {
        method: "get",
        headers: {
          Accept: "application/json",
          "x-auth": localStorage.getItem("token")
        }
      }
    )
      .then(res => res.json())
      .then(data => {
        this.setState({ seated: data.seated });
        console.log(data);
      });
  };

  getCheck = e => {
  console.log("🚀 ~ file: BookingPage2.js ~ line 159 ~ BookingPage ~ e", e.target.name)
    this.setState({ seatWanted: [...this.state.seatWanted, [e.target.name]] });
  };

  sendOrder = () => {
    const { seatWanted } = this.state;
    const seats = seatWanted
      .flat()
      .map(v => parseInt(v) + 1); /* Really powerful features */
    console.log("🚀 ~ file: BookingPage2.js ~ line 168 ~ BookingPage ~ seats", seats)
    console.log("🚀 ~ file: BookingPage2.js ~ line 178 ~ BookingPage ~ this.props.id_movie,", this.props.match.params.id)

    fetch(`http://3.21.232.6:8080/user/booking`, {
      method: "post",
      body: JSON.stringify({
        id_movie: this.props.match.params.id,
        id_date: this.state.id_day,
        id_time: this.state.id_time,
        id_seat: seats
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth": localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => {
        this.props.showInvitationForm();
        const id_order = data.order.map(value => value.id_order).join("-");
        navigate(`/order/success/${id_order}`);
      })
      .catch(err => console.log(err));
  };

  handleOrder = e => {
    this.sendOrder();
    // if (window.PaymentRequest) {
    //   let request = this.initPaymentRequest();
    //   request
    //     .show()
    //     .then(result => {
    //       this.sendOrder();
    //       return result.complete("success");
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // } else {
    //   console.log("This browser does not support web payments");
    // }
  };

  render() {
    const seats = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const { showDay, times, seated, seatWanted } = this.state;
    console.log("🚀 ~ file: BookingPage2.js ~ line 211 ~ BookingPage ~ render ~ times", times)
    const {
      classes,
      movie,
      showInvitation,
      invitations
    } = this.props;
    return (
      <Container maxWidth="xl" className={classes.container}>
        <Grid container spacing={2} style={{ height: '100%' }}>
            {!showInvitation ? 
            <>
            <MovieInfo movie={movie} />
            {/* Booking Ticket */}
            <Container className="container" style={{ marginTop: 0, background: 'black' }}>
  
            <div className="row">
              <div className="col-md-6 offset-md-3">
                  <div className="card-play" style={{ background: 'transparent' }}>
                    <div className="form-group">
                      <h4>Select date play</h4>
                      <div className="selectgroup w-100">
                        {showDay &&
                          showDay.map((day, i) => (
                            <label key={i} className="selectgroup-item">
                              <input
                                type="radio"
                                name="id_date"
                                value={day.id_date}
                                className="selectgroup-input"
                                onChange={this.handleSelectDay}
                              />
                              <span className="selectgroup-button">
                                {day.date}/11
                              </span>
                            </label>
                          ))}
                      </div>
                    </div>
                    {times && (
                      <>
                        <h4>Selected scheduleee</h4>
                        <div className="selectgroup selectgroup-pills">
                          {times.map((time, i) => (
                            <label key={i} className="selectgroup-item">
                              <input
                                type="radio"
                                name="id_time"
                                value={time.id_time}
                                className="selectgroup-input"
                                onChange={this.hadleSelectTime}
                              />
                              <span className="selectgroup-button selectgroup-button-icon p-10">
                                <i className="fe fe-sun icon-r" />
                                {time.time}h
                              </span>
                            </label>
                          ))}
                        </div>
                      </>
                    )}
                    <div className="form-group">
                      {seated && (
                        <>
                          <h4>Select seat</h4>
                          <div className="row">
                            <div className="col-8 col-md-8">
                              <div className="row gutters-xs">
                                {seats.map((seat, i) => {
                                  const arraySeated = seated.map(
                                    item => item.id_seat
                                  );
                                  return arraySeated.indexOf(seat) !== -1 ? (
                                    <div key={i} className="col-auto">
                                      <label className="colorinput">
                                        <input
                                          name={i}
                                          type="checkbox"
                                          onChange={this.getCheck}
                                          value={seat}
                                          className="colorinput-input"
                                          disabled
                                        />
                                        <span className="colorinput-color bg-orange" />
                                      </label>
                                    </div>
                                  ) : (
                                    <div key={i} className="col-auto">
                                      <label className="colorinput">
                                        <input
                                          name={i}
                                          type="checkbox"
                                          className="colorinput-input"
                                          onChange={this.getCheck}
                                          value={seat}
                                        />
                                        <span className="colorinput-color bg-azure" />
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="col-12 col-md-4">
                              <div className="row gutters-xs">
                                <div className="col-auto">
                                  <label className="colorinput ">
                                    <span className="colorinput-color bg-orange" />
                                    <span className="mr-seat-info">Reserved</span>
                                  </label>
                                </div>
                              </div>
                              <div className="row gutters-xs">
                                <div className="col-auto">
                                  <label className="colorinput ">
                                    <span className="colorinput-color bg-azure" />
                                    <span className="mr-seat-info">Free</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
  
                  <button
                    onClick={this.handleOrder}
                    type="button"
                    className="btn btn-indigo btn-block mb"
                  >
                    Order Now
                  </button>
                </div>
              </div>
              </Container>
              </>
            : (
              <BookingInvitation
                selectedSeats={[]}
                sendInvitations={this.sendInvitations}
                ignore={resetCheckout}
                invitations={invitations}
                onSetInvitation={setInvitation}
                onDownloadPDF={this.jsPdfGenerator}
              />
            )}

        </Grid>
      </Container>
    );
  }
}

BookingPage.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = (
  {
    authState,
    movieState,
    cinemaState,
    showtimeState,
    reservationState,
    checkoutState
  },
  ownProps
) => ({
  // isAuth: authState.isAuthenticated,
  isAuth: window.localStorage.token ? true : false,
  token: authState.token,
  user: authState.user,
  movie: movieState.selectedMovie,
  cinema: cinemaState.selectedCinema,
  cinemas: cinemaState.cinemas,
  showtimes: showtimeState.showtimes.filter(
    showtime => showtime.movieId === ownProps.match.params.id
  ),
  reservations: reservationState.reservations,
  selectedSeats: checkoutState.selectedSeats,
  suggestedSeat: checkoutState.suggestedSeat,
  selectedCinema: checkoutState.selectedCinema,
  selectedDate: checkoutState.selectedDate,
  selectedTime: checkoutState.selectedTime,
  showLoginPopup: checkoutState.showLoginPopup,
  showInvitation: checkoutState.showInvitation,
  invitations: checkoutState.invitations,
  QRCode: checkoutState.QRCode,
  suggestedSeats: reservationState.suggestedSeats
});

const mapDispatchToProps = {
  getMovie,
  getCinema,
  getCinemasUserModeling,
  getCinemas,
  getShowtimes,
  getReservations,
  getSuggestedReservationSeats,
  addReservation,
  setSelectedSeats,
  setSuggestedSeats,
  setSelectedCinema,
  setSelectedDate,
  setSelectedTime,
  setInvitation,
  toggleLoginPopup,
  showInvitationForm,
  resetCheckout,
  setAlert,
  setQRCode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(BookingPage));
