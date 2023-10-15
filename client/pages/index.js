import React from "react";
import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  // context is an object that contains the request and response objects.

  const { data } = await client.get("/api/users/currentuser");

  return data;
};
// getInitialProps is like useEffect but it runs on the server side.
// It gets executed when the component is about to be rendered.

export default LandingPage;
