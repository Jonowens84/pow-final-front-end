/* eslint-disable react-hooks/exhaustive-deps */
// React
import React, { useState, useEffect } from "react";

// Cookies
import Cookies from "universal-cookie";

// CSS
import "./UserPage.css";

// Auth0
import { useAuth0 } from "@auth0/auth0-react";

// Material UI
import Button from "@material-ui/core/Button";
import FormPropsTextFields from "../../components/TextField/Text";
import Paper from "@material-ui/core/Paper";
import SimpleAccordion from "./Acordion";
import StatsGraph from "../../components/StatsGraph/StatsGraph";

export default function UserPage(props) {
  // const {
  //   title,
  //   textParticipant,
  //   textTurn,
  //   textTimePaused,
  //   textTimeLeft,
  //   label,
  //   defaultValue,
  // } = props;
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);
  const cookies = new Cookies();

  // state for filtered date
  const [dateFilter, setDateFilter] = useState(null);
  // const [isDateFilter, setIsDateFilter] = useState(false);

  // const [isClicked, setIsClicked] = useState(false);

  // state for all previous meetings
  const [meetingHistory, setMeetingHistory] = useState([]);

  // get all meetings
  // async function getAllMeetings() {
  //   if (isAuthenticated) {
  //     const res = await fetch("http://localhost:8080/meeting/getAll");
  //     const data = await res.json();
  //     setMeetingHistory(data);
  //     console.log(data);
  //   }
  // }

  // get all meetings filtered by date

  async function getMeetingByDate() {
    let timestamp = new Date(dateFilter);
    timestamp = timestamp.getTime();

    const res = await fetch(
      `http://localhost:8080/meeting/getByDate?meetingStartTime=${timestamp}`
    );
    const { data } = await res.json();
    console.log(data);
    setMeetingHistory(data);
    // setIsDateFilter(true);
  }

  // function displayDataBtn() {
  //   setIsClicked(true);
  // }
  function input(event) {
    setDateFilter(event.target.value);
  }

  // function removeDateFilter() {
  //   setIsDateFilter(false);
  //   setDateFilter("1970-01-01");
  // }

  // Get and set user metadata, cookie
  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = "powershellrangers.eu.auth0.com";

      try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        });

        // Add token to cookie
        cookies.set(
          "powAgile_user",
          { user, accessToken, userMetadata },
          {
            expires: new Date(Date.now() + 86400000),
          }
        );

        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { user_metadata } = await metadataResponse.json();

        setUserMetadata(user_metadata);
      } catch (e) {
        console.log(e.message);
      }
    };

    if (user) {
      setTimeout(() => getUserMetadata(), 1000);
    }
  }, [getAccessTokenSilently, user]);

  return isAuthenticated ? (
    <div>
      <div id="userInfo">
        <img src={user.picture} alt={user.name} id="userImg" />
        <h4>{user.name}</h4>
        <p>{user.email}</p>
      </div>

      <div className="input-container">
        <Paper
          elevation={3}
          style={{ maxWidth: "700px", padding: "5px", margin: "10px auto" }}
        >
          <h3 style={{ textAlign: "center" }}>Filter your meeting by Date</h3>

          <input
            style={{
              width: "175px",
              align: "center",
              display: "inline-block",
            }}
            className="form-control-homepage"
            type="date"
            onChange={(event) => setDateFilter(event.target.value)}
            placeholder="filter"
            name="filter-date"
          ></input>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={getMeetingByDate}
          >
            Get all Meetings
          </Button>

          <h3>Showing all meetings from: {dateFilter} 📅</h3>

          {meetingHistory.map((obj, i) => {
            return (
              <div className="notes inner">
                <div key={i}>
                  <FormPropsTextFields
                    index={i}
                    label="Meeting Type"
                    defaultValue={obj.type}
                  />
                  <FormPropsTextFields
                    index={i}
                    label="Meeting Date"
                    defaultValue={dateFilter}
                  />
                  {/* <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    key={obj.id}
                    onClick={displayDataBtn}
                  >
                    {obj.type} on {dateFilter}
                  </Button>
                  <br></br>
                  <br></br> */}
                  {/* {isCLicked ? ( */}
                  <SimpleAccordion
                    title={obj.type}
                    textParticipant={obj.meetingParticipants.map((ojs) => {
                      return <div>Name: {ojs.name}</div>;
                    })}
                    textTurn={obj.meetingParticipants.map((ojs) => {
                      return <div>Had Turn: {ojs.hasHadTurn}</div>;
                    })}
                    textTimePaused={obj.meetingParticipants.map((ojs) => {
                      return <div>Pauses: {ojs.pauses}</div>;
                    })}
                    textTimeLeft={obj.meetingParticipants.map((ojs) => {
                      return <div>Time left: {ojs.timeLeft}</div>;
                    })}
                  ></SimpleAccordion>
                  {/* <div className="row table">
                    <div className="column" key={i}>
                      <p>
                        <b>Participants: </b>
                        {obj.meetingParticipants.map((ojs) => {
                          return <div>Name: {ojs.name}</div>;
                        })}
                      </p>
                    </div>
                    <div className="column" key={i}>
                      <p>
                        <b>Had their Turn: </b>
                        {obj.meetingParticipants.map((ojs) => {
                          return <div>Had Turn: {ojs.hasHadTurn}</div>;
                        })}
                      </p>
                    </div>
                    <div className="column" key={i}>
                      <p>
                        <b>Time Left: </b>
                        {obj.meetingParticipants.map((ojs) => {
                          return <div>Time left: {ojs.timeLeft}</div>;
                        })}
                      </p>
                    </div>
                  </div>
                  ) : null} */}
                </div>
              </div>
            );
          })}
        </Paper>
      </div>
      <StatsGraph></StatsGraph>
    </div>
  ) : (
    <h2>🤔 You don't seem to be logged in!</h2>
  );
}
