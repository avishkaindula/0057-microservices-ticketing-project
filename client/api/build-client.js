import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // we are on the server!
    // requests should be made to http://ingress-nginx.ingress-nginx...
    try {
      return axios.create({
        baseURL:
          "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
        withCredentials: true,
        headers: req.headers,
        // req is the request object that is coming from the browser.
        // It contains the headers that are coming from the browser.
        // We can forward these headers to the ingress-nginx service like this.
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    // we are on the browser!
    // requests can be made with a base url of ''
    try {
      return axios.create({
        baseURL: "/",
      });
    } catch (error) {
      console.log(error);
    }
  }
  // sometimes, getServerSideProps is not executed on the server side.
  // This happens when we navigate from one page to another using next Router.
  // In this case, we need to make sure that we are on the server side.
  // This is because we need to make a request to the ingress-nginx service
  // from the server side.
  // getServerSideProps will be executed on the server side when we first load
  // the page or when we refresh the page.
  // window is a global variable that is only available on the browser.
  // So, if window is defined, we are on the browser. Otherwise, we are on the server.
};

export default buildClient;
// buildClient is a function that returns an axios client.
// We can use this instead of using axios directly.
// As we've defined the decider logic inside buildClient,
// we can use this function to create an axios client
// for both server side and client side requests.
// We also don't need to pass the base url to the axios client
// as we've already defined it inside buildClient.
