import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      {/* This currentUser is coming from the data we fetch on _app.js */}
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  // console.log(Object.keys(appContext));
  // appContext is an object that contains the context object. (ctx)
  // The context object contains the request and response objects.
  // That's the difference between getInitialProps in _app.js and getServerSideProps in pages/index.js.

  const client = buildClient(appContext.ctx);

  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  // appContext.Component is the component that is about to be rendered.
  // appContext.Component.getInitialProps is the getInitialProps function of the
  // component that is about to be rendered.
  // So this will trigger the getInitialProps of the pages with getInitialProps defined.

  return {
    pageProps,
    // This is the pageProps that we pass to component like this in above: <Component {...pageProps} />
    // It contains currentUser fetched from the index.js. That's the currentUser we use
    // inside the index.js.
    ...data,
    // data also contains currentUser inside it but that currentUser is fetched from the _app.js.
    // That's the currentUser we pass to the Header component.
  };
};
// Adding getInitialProps to _app.js will disable getInitialProps in pages/index.js.

export default AppComponent;
