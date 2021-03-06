import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActionArea,
  CardContent,
  Button,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const useStyles = makeStyles({
  root: {
    maxWdith: 345,
  },
  image: {
    flex: 1,
    height: 50,
    width: 150,
    objectFit: "contain",
  },
  media: {
    display: "block",
    width: "50%",
    marginLeft: "auto",
    marginRight: "auto",
  },
});

const Patient = (props) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea component={Link} to={`/patient/${props.patient.id}`}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.patient.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Id: {props.patient.id}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Gender: {props.patient.gender}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            DOB: {props.patient.birthDate}
          </Typography>
        </CardContent>

        <Button
          size="small"
          color="primary"
          component={Link}
          to={`/patient/${props.patient.id}`}
        >
          Get Quick Diagnostic
        </Button>
      </CardActionArea>
    </Card>
  );
};

Patient.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  gender: PropTypes.string,
  birthDate: PropTypes.string,
};

export default Patient;
