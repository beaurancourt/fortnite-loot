import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import rankedLocations from '../rankedLocations';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

function SimpleTable(props) {
  const { classes } = props;

  return (
    <Paper className={classes.root}>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Typography variant="title" color="inherit">
            Drop Locations
          </Typography>
        </Toolbar>
      </AppBar>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {Object.keys(rankedLocations[0]).map((key, keyIndex) => {
              return (<TableCell key={keyIndex}>{key}</TableCell>)
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rankedLocations.map((location, locationIndex) => {
            return (
              <TableRow key={locationIndex}>
                {Object.keys(location).map((key, keyIndex) => {
                  return (
                    <TableCell key={keyIndex} component="th" scope="row">
                      {location[key]}
                    </TableCell>
                  )
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
