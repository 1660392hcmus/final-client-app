import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination
} from '@material-ui/core';
import Portlet from "../../../../../components/Portlet/Portlet";
import PortletContent from "../../../../../components/PortletContent/PortletContent";
import styles from './styles';

class ReservationsTable extends Component {
  state = {
    rowsPerPage: 10,
    page: 0
  };

  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    onShowDetails: PropTypes.func,
    reservations: PropTypes.array.isRequired,
    movies: PropTypes.array.isRequired,
    cinemas: PropTypes.array.isRequired
  };

  static defaultProps = {
    reservations: [],
    movies: [],
    cinemas: [],
    onSelect: () => {},
    onShowDetails: () => {}
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  onFindAttr = (id, list, attr) => {
    const item = list.find(item => item._id === id);
    return item ? item[attr] : `Not ${attr} Found`;
  };

  render() {
    const { classes, className, reservations, movies, cinemas } = this.props;
    const { rowsPerPage, page } = this.state;
    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet className={rootClassName}>
        <PortletContent noPadding>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Movie</TableCell>
                <TableCell align="left">Time</TableCell>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">Start At</TableCell>
                <TableCell align="left">Ticket Price</TableCell>
                <TableCell align="left">Seat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(reservation => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={reservation._id}>
                    <TableCell className={classes.tableCell}>
                      {reservation.title}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {reservation.time}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {reservation.date}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {reservation.time_order}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {reservation.price}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {reservation.id_seat}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            backIconButtonProps={{
              'aria-label': 'Previous Page'
            }}
            component="div"
            count={reservations.length}
            nextIconButtonProps={{
              'aria-label': 'Next Page'
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </PortletContent>
      </Portlet>
    );
  }
}

export default withStyles(styles)(ReservationsTable);
