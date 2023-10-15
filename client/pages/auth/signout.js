import React from "react";
import { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const signout = () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);
  // signout will remove the cookies from the requests sent through the browser.
  // So we need to send the request to signout through the browser / client.
  // So instead of using getInitialProps, we use useEffect.
  // Cause getInitialProps will be executed on the server side and it doesn't
  // have access to the cookies.

  return <div>signout</div>;
};

export default signout;
