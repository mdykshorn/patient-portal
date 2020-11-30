import "date-fns";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

// get observation Mapping
var observationTypes = [];
fetch(
  "https://raw.githubusercontent.com/mdykshorn/patient-portal/main/server/config/observationMap.json"
)
  .then((d) => d.json())
  .then((d) => {
    for (var key in d) {
      if (key === "88240-7") {
        continue;
      }

      var tempObs = {
        code: key,
        value: d[key].shortName,
        low: d[key].low,
        high: d[key].high,
      };

      observationTypes.push(tempObs); // Push the key's value on the array
    }
  });

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectFormControl: {
    margin: theme.spacing(1),
    minWidth: 350,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function FormDialog(props) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetch("../api/observation", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientId: patientId,
        date: selectedDate,
        observationType: { obsType },
        value: obsVal,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
    // .then(window.location.reload());
  };

  const [patientId, setPatientId] = React.useState(
    props.match.params.pid ? props.match.params.pid : ""
  );
  const handlePatientIdChange = (event) => {
    setPatientId(event.target.value);
  };

  const [obsType, setObservation] = React.useState(observationTypes[0]);
  const handleObservationChange = (event) => {
    setObservation(event.target.value);
  };

  const [obsVal, setObsVal] = React.useState("0.0");
  const handleValueChange = (event) => {
    setObsVal(event.target.value);
  };

  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <Button variant="contained" color="default" onClick={handleClickOpen}>
        Add Patient Observation
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">New Observation</DialogTitle>
        <DialogContent>
          <DialogContentText>Please Enter Your Observation</DialogContentText>
          <FormControl className={classes.formControl}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Patient ID"
              fullWidth
              defaultValue={patientId}
              onChange={handlePatientIdChange}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Observation Date"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </FormControl>
          <FormControl variant="outlined" className={classes.selectFormControl}>
            <Select
              labelId="observation-select"
              id="observation-select"
              value={obsType}
              onChange={handleObservationChange}
              label="Observation Type"
            >
              {observationTypes.map((obs, index) => (
                <MenuItem value={obs} key={index}>
                  {obs.value} ({obs.low}/{obs.high})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              id="Enter Observation Value"
              margin="dense"
              fullwidth
              onChange={handleValueChange}
              helperText="Observation Value"
            />
          </FormControl>
          <Typography variant="body2" component="h2" color="textSecondary">
            Please refresh page after wating a few minutes for server processing
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Add Record
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
