// React
import React, { useState, useEffect } from "react";

// Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Collapse from "@material-ui/core/Collapse";

// Customer Components
import ProductTitle from "../../components/ProductTitle/ProductTitle";
import InstructionsRetro from "./01_Instructions/01_InstructionsRetro";
import PickRole from "./02_PickRole/02_PickRole";
import SetupFacilitator from "./03_Setup/03_SetupFacilitator";
import SetupParticipant from "./03_Setup/03_SetupParticipant";
import MeetingInProgress from "./04_MeetingInProgress/04_MeetingInProgress";
import FinishedMeeting from "./05_FinishedMeeting/05_FinishedMeeting";

// nanoid
import { nanoid } from "nanoid";

// CSS
import "./RetroPage.css";

function Retro() {
  // Steps
  const [retroStep, setRetroStep] = useState(1);
  const steps = [
    "Review instructions",
    "Select your role",
    "Create / Join a Retrospective",
    "Run your Retrospective",
    "Finish!",
  ];

  // Navigate through steps
  function previousStep() {
    setRetroStep(retroStep - 1);
  }
  function nextStep(role) {
    setRetroStep(retroStep + 1);
    if (role === "facilitator") {
      setParticipant({ ...participant, isFacilitator: true });
    }
  }

  // Store participant information - name, role, meta
  const [participant, setParticipant] = useState({
    name: null,
    isFacilitator: null,
    details: null,
  });

  const [meeting, setMeeting] = useState({
    type: "retro",
    subtype: undefined,
    columns: ["Start", "Stop", "Continue"],
    cards: [],
    meetingStarted: false,
    meetingStartTime: null,
    meetingEndTime: null,
  });

  function setRetroType({ name, columns }) {
    setMeeting({ ...meeting, subtype: name, columns: columns });
  }

  function addCard(colIndex) {
    const newState = { ...meeting };
    newState.cards.push({
      id: nanoid(),
      columnIndex: colIndex,
      content: "",
      thumbsUp: 0,
      thumbsDown: 0,
    });
    setMeeting(newState);
  }

  function deleteCard(id) {
    setMeeting({
      ...meeting,
      cards: meeting.cards.filter((el) => (el.id !== id ? true : false)),
    });
  }

  function updateCardText({ id, content }) {
    const index = meeting.cards.findIndex((card) => card.id === id);
    const newCard = meeting.cards[index];
    // Move the card
    newCard.content = content;
    const newCards = [...meeting.cards];
    newCards[index] = newCard;
    // Set state
    setMeeting({
      ...meeting,
      cards: newCards,
    });
  }

  function updateCardVotes({ id, thumb }) {
    // Find Card
    const index = meeting.cards.findIndex((card) => card.id === id);
    const newCard = meeting.cards[index];
    // Move the card
    newCard[thumb] += 1;
    const newCards = [...meeting.cards];
    newCards[index] = newCard;
    // Set state
    setMeeting({
      ...meeting,
      cards: newCards,
    });
  }

  function moveCard(id, direction) {
    // Find the card
    const index = meeting.cards.findIndex((card) => card.id === id);
    const newCard = meeting.cards[index];
    // Move the card
    switch (direction) {
      case "left":
        newCard.columnIndex -= 1;
        break;
      case "right":
        newCard.columnIndex += 1;
        break;
      default:
        break;
    }
    const newCards = [...meeting.cards];
    newCards[index] = newCard;
    setMeeting({
      ...meeting,
      cards: newCards,
    });
  }

  return (
    <div>
      <Collapse in={retroStep === 1} timeout={800}>
        <ProductTitle title="Retrospective">
          <p className="stepsTitleText">
            Real time, collaborative, and engaging retros that make a positive
            impact on your team.
          </p>
        </ProductTitle>
      </Collapse>

      <Stepper activeStep={retroStep - 1} style={{ background: "none" }}>
        {steps.map((label, index) => {
          return (
            <Step key={`RetroStep_${index}`}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {retroStep === 1 ? (
        <InstructionsRetro props={{ nextButton: nextStep }} />
      ) : null}

      {retroStep === 2 ? (
        <PickRole props={{ backButton: previousStep, nextButton: nextStep }} />
      ) : null}

      {retroStep === 3 && participant.isFacilitator ? (
        <SetupFacilitator props={{ prop: "prop" }} />
      ) : retroStep === 3 && !participant.isFacilitator ? (
        <SetupParticipant props={{ prop: "prop" }} />
      ) : null}
    </div>
  );
}

export default Retro;
