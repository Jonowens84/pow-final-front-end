import React, { useState, useEffect } from "react";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
// Icons
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

// CSS
import "./03_RandomizerAndTimer.css";

// Custom components
import RandomizerCard from "../../../components/RandomizerCard/RandomizerCard";
import TimerPartyParrot from "../../../components/TimerPartyParrot/TimerPartyParrot";

export default function RandomizerAndTimer({ props }) {
  const { meeting, setMeeting, speakerTime, timeBetweenSpeakers } = props;

  const [activeStage, setActiveStage] = useState({
    randomizerStage: true,
    randomizerTime: timeBetweenSpeakers,
    timerStage: false,
    timerActive: false,
  });

  useEffect(() => {
    function progressBarTimeBetweenParticipants() {
      setTimeout(function () {
        let newTime = Number((activeStage.randomizerTime - 0.1).toFixed(2));

        setActiveStage({
          ...activeStage,
          randomizerTime: newTime,
        });
      }, 100);
    }
    // Randomizer
    if (
      activeStage.randomizerStage === true &&
      activeStage.randomizerTime > 0
    ) {
      progressBarTimeBetweenParticipants();
    } else if (
      activeStage.randomizerStage === true &&
      activeStage.randomizerTime === 0
    ) {
      setActiveStage({
        ...activeStage,
        randomizerStage: false,
        randomizerTime: timeBetweenSpeakers,
        timerStage: true,
        timerActive: true,
      });
    }
  }, [activeStage, timeBetweenSpeakers]);

  useEffect(() => {
    function circularTimerCountDown() {
      const newState = [...meeting.meetingParticipants];
      const index = newState.findIndex(
        (participant) => !participant.hasHadTurn
      );
      try {
        newState[index].timeLeft -= 1;
      } catch {
        return;
      }
      setMeeting({ ...meeting, meetingParticipants: newState });
      return;
    }
    // Circular Timer
    if (activeStage.timerStage === true && activeStage.timerActive === true) {
      setTimeout(() => circularTimerCountDown(), 1000);
    }
  }, [meeting, setMeeting, activeStage.timerActive, activeStage.timerStage]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Paper className="participantsTracker" elevation={2}>
          <h3>Meeting tracker</h3>
          <List dense={false}>
            {meeting.meetingParticipants.map((el) => (
              <ListItem>
                <ListItemText primary={el.name} />
                <ListItemSecondaryAction>
                  {el.hasHadTurn ? (
                    <IconButton edge="end" aria-label="completed">
                      <CheckCircleIcon color="primary" />
                    </IconButton>
                  ) : null}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      <Grid item xs={8}>
        <RandomizerCard
          props={{
            meetingParticipants: meeting.meetingParticipants,
            timeBetweenSpeakers,
            activeStage,
          }}
        />

        <TimerPartyParrot
          props={{
            activeStage,
            setActiveStage,
            meeting,
            setMeeting,
            speakerTime,
          }}
        ></TimerPartyParrot>
      </Grid>
    </Grid>
  );
}
