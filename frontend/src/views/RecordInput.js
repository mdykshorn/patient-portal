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

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

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

const observationTypes = [
  {
    code: "2160-0",
    value: "Creatinine [Mass/Vol]",
  },
  {
    code: "48642-3",
    value: "GFR/BSA pr.non blk SerPlBld MDRD-ArV",
  },
  {
    value: "Systolic blood pressure",
    code: "8480-6",
  },
  {
    code: "8462-4",
    value: "Diastolic blood pressure",
  },
  {
    code: "21482-5",
    value: "Protein (24H U) [Mass/Vol]",
  },
];

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
      .then((data) => console.log(data))
      .then(window.location.reload());
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
                  {obs.value}
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
