import React from "react";
import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Hello, {currentUser?.email ?? "user"}</h1>;
};

export const getServerSideProps = async (context) => {
  const client = buildClient(context);
  // context is an object that contains the request and response objects.

  const { data } = await client.get("/api/users/currentuser");

  return { props: data };
};
// getServerSideProps is like useEffect but it runs on the server side.
// It gets executed when the component is about to be rendered.

export default LandingPage;
