import LoginAftermathDashboard from "./pages/loginAftermath/Dashboard";
import LoginAftermathDashboardWithNoData from "./pages/loginAftermath/DashBoradWithNoData";
import OperationHealthDashboard from "./pages/operationHealth/Dashboard";
import ListingScoreDashBoard from "./pages/listingScore/Dashboard";
import AdsAndAnalytics from "./pages/adsAndAnalytics/AdsAndAnalytics";
import CustomerReviews from "./pages/customerReview/CustomerReview";
import AllReviews from "./pages/customerReview/AllReviews";
import TimeSeriesPages from "./pages/operationHealth/TimeSeriesPage";
import ListingScoreTimeSeriesPage from "./pages/listingScore/TimeSeriesPage";
import Login from "./pages/login/Login";
import { Route, Routes, useLocation } from "react-router-dom";
import RequiredAuth from "./routes/RequiredAuth";
import RedirectRoute from "./routes/RedirectRoute";
import React from "react";
import "./styles/styles.scss";
import axios from "axios";
import { useSelector } from "react-redux";
import LayoutWrapper from "./components/LayoutWrapper";
import Error from "./components/Error";
import FinancialDashBoard from "./pages/revenue/FinancialDashBoard";
// ! For testing purpose A and B
import FinancialDashBoard_A from "./pages/revenue/FinancialDashBoard_A";
import FinancialDashBoard_B from "./pages/revenue/FinancialDashBoard_B";
import Settings from "./pages/Settings";
import Notification from "./pages/Notification";
import Signup from "./pages/signup/Signup";
import SignupA from "./pages/signup/SignupA";
import SignupB from "./pages/signup/SignupB";
import Greeting from "./pages/Greeting";
import PreSignUp from "./pages/PreSignUp";
import OnboardingDashboard from "./pages/onboardingDashboard/Dashboard";
// import ReactGA from "react-ga";
import ReactGA from "react-ga4";
import ReactPixel from "react-facebook-pixel";
import MetaTags from "react-meta-tags";
import NewSignup from "./pages/signup/NewSignup"; // ! For testing purpose A and B
import NewSignupA from "./pages/signup/NewSignupA";
import AmplitudePage from "./pages/amplitudeCopy/Amplitude";


function App() {
  const location = useLocation();

  React.useEffect(() => {
    ReactPixel.init("326312254783097");

    ReactGA.initialize([
      {
        trackingId: "G-BNX0KV0H7M",
      },
    ]);

    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.search,
    });
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // ?Component that alerts if you click outside of it

  return (
    <div className="main-container">
      <Routes>
        {/* <Route
          path="/"
          element={
            <RedirectRoute>
              <MetaTags>
                <title>Voosh | Login</title>
                <meta
                  name="voosh web app, login page"
                  content="voosh login page"
                />
                <meta property="og:title" content="web app" />
              </MetaTags>
              <Login />
            </RedirectRoute>
          }
        /> */}
        {/* //Todo: New Onboarding dashboard */}
        {/* <Route
          path="/"
          element={
            <RedirectRoute>
              <MetaTags>
                <title>Voosh | Login</title>
                <meta
                  name="voosh web app, Signup page"
                  content="voosh signup page"
                />
                <meta property="og:title" content="web-app" />
              </MetaTags>
              <NewSignup />
            </RedirectRoute>
          }
        /> */}

        {/* //Todo new signup part -2 :> */}
        <Route
          path="/"
          element={
            <RedirectRoute>
              <MetaTags>
                <title>Voosh | Login</title>
                <meta
                  name="voosh web app, Signup page"
                  content="voosh signup page"
                />
                <meta property="og:title" content="web-app" />
              </MetaTags>
              <NewSignupA />
            </RedirectRoute>
          }
        />

        {/* //Todo: ne swiggy signup */}
        {/* <Route path="/swiggy-path" /> */}

        {/* //? New Onboarding dashboard */}
        <Route path="/onboarding-dashboard" element={<OnboardingDashboard />} />
        <Route path="/amplitude" element={<AmplitudePage />} />
        {/* <Route path="/test" element={<OnboardingDashboard />} /> */}
        {/* <Route
          path="/signup"
          element={
            <RedirectRoute>
              <MetaTags>
                <title>Voosh | Signup</title>
                <meta
                  name="voosh web app, Signup page"
                  content="voosh signup page"
                />
                <meta property="og:title" content="web-app" />
              </MetaTags>
              <Signup />
              <SignupA />
              <SignupB />
            </RedirectRoute>
          }
        /> */}
        {/* <Route
          path="/greeting"
          element={
            <RedirectRoute>
              <MetaTags>
                <title>Voosh | Greeting</title>
                <meta
                  name="voosh web app, Signup page"
                  content="voosh signup page"
                />
                <meta property="og:title" content="web-app" />
              </MetaTags>
              <Greeting />
            </RedirectRoute>
          }
        /> */}
        <Route
          path="/settings"
          element={
            <>
              <RequiredAuth>
                <MetaTags>
                  <title>Voosh | Settings</title>
                  <meta
                    name="voosh web app, Settings page"
                    content="voosh Settings page"
                  />
                  <meta property="og:title" content="web-app" />
                </MetaTags>
                <Settings />
              </RequiredAuth>
            </>
          }
        />
        <Route
          path="/notification"
          element={
            <>
              <RequiredAuth>
                <MetaTags>
                  <title>Voosh | Notification</title>
                  <meta
                    name="voosh web app, Notification page"
                    content="voosh Notification page"
                  />
                  <meta property="og:title" content="web-app" />
                </MetaTags>
                <Notification />
              </RequiredAuth>
            </>
          }
        />
        {/* <Route path="/pre-signup" element={<PreSignUp />} /> */}
        <Route
          path="/dashboard"
          element={
            <RequiredAuth>
              <MetaTags>
                <title>Voosh | Home-Dashboard</title>
                <meta
                  name="voosh web app, Home-Dashboard page"
                  content="voosh Home-Dashboard page"
                />
                <meta property="og:title" content="web-app" />
              </MetaTags>
              <LayoutWrapper
                heading={"Voosh VGN"}
                isHomePage={true}
                headerSize={"big"}
                isDropdownNeeded={true}
              >
                <LoginAftermathDashboard />
              </LayoutWrapper>
            </RequiredAuth>
          }
        />
        <Route
          path="/dashboard-sample"
          element={
            <>
              <MetaTags>
                <title>Voosh | Sample-Dashboard</title>
                <meta
                  name="voosh web app, Sample-Dashboard page"
                  content="voosh Sample-Dashboard page"
                />
                <meta property="og:title" content="web-app" />
              </MetaTags>
              <LoginAftermathDashboardWithNoData />
            </>
          }
        />
        <Route
          path="revenue"
          element={
            <RequiredAuth>
              <MetaTags>
                <title>Voosh | Revenue-Dashboard</title>
                <meta
                  name="voosh web app, Revenue Dashboard page"
                  content="voosh Revenue Dashboard page"
                />
                <meta property="og:title" content="web-app" />
              </MetaTags>
              <LayoutWrapper
                heading={"Revenue Dashboard"}
                isHomePage={false}
                isClientBtnNeeded={false}
                headerSize={"large"}
                isDropdownNeeded={true}
              >
                <FinancialDashBoard_A />
                {/* <FinancialDashBoard_B /> */}
                {/* <FinancialDashBoard /> */}
              </LayoutWrapper>
            </RequiredAuth>
          }
        />
        {/* // Todo Component ka name rename pending!*/}
        <Route
          path="/operationHealth"
          element={
            <RequiredAuth>
              <MetaTags>
                <title>Voosh | Operation-Health</title>
                <meta
                  name="voosh web app, Operation Health page"
                  content="voosh Operation Health page"
                />
                <meta property="og:title" content="web-app" />
              </MetaTags>
              <LayoutWrapper
                heading={"Operation Health"}
                isClientBtnNeeded={true}
                isDropdownNeeded={true}
              >
                <OperationHealthDashboard />
              </LayoutWrapper>
            </RequiredAuth>
          }
        />

        {/* //! no LayoutWrapper cuz dynamic routes will have diffrent heading */}
        <Route
          path="/operationHealth/:id"
          element={
            // ? add meta tags in TimeSeries component
            <RequiredAuth>
              <TimeSeriesPages />
            </RequiredAuth>
          }
        />

        <Route
          path="/listingScore"
          element={
            <RequiredAuth>
              <MetaTags>
                <title>Voosh | Listing-Score</title>
                <meta
                  name="voosh web app, Listing Score page"
                  content="voosh Listing Score page"
                />
                <meta property="og:title" content="web-app" />
              </MetaTags>
              <LayoutWrapper
                heading={"Listing Score"}
                isHomePage={false}
                isClientBtnNeeded={true}
                isDropdownNeeded={false}
                onlyShowDate={true}
              >
                <ListingScoreDashBoard />
              </LayoutWrapper>
            </RequiredAuth>
          }
        />

        <Route
          path="/listingScore/:id"
          element={
            <RequiredAuth>
              <ListingScoreTimeSeriesPage />
            </RequiredAuth>
          }
        />
        {/* <Route
          path="/ads&Analytics"
          element={
            <RequiredAuth>
              <LayoutWrapper heading={"Ads&Analytics"} isHomePage={false}>
                <AdsAndAnalytics />
              </LayoutWrapper>
            </RequiredAuth>
          }
        /> */}
        <Route
          path="/customerReviews"
          element={
            <RequiredAuth>
              <MetaTags>
                <title>Voosh | Customer-Reviews</title>
                <meta
                  name="voosh web app, customerReviews page"
                  content="voosh customerReviews page"
                />
                <meta property="og:title" content="web-app" />
              </MetaTags>
              <LayoutWrapper
                heading={"Customer Reviews"}
                isHomePage={false}
                isClientBtnNeeded={true}
                isDropdownNeeded={true}
              >
                <CustomerReviews />
              </LayoutWrapper>
            </RequiredAuth>
          }
        />
        <Route
          path="/allReviews"
          element={
            <RequiredAuth>
              <MetaTags>
                <title>Voosh | All-Reviews</title>
                <meta
                  name="voosh web app, All-Reviews page"
                  content="voosh All-Reviews page"
                />
                <meta property="og:title" content="web-app" />
              </MetaTags>
              <LayoutWrapper
                heading={"All Reviews"}
                isHomePage={false}
                isClientBtnNeeded={true}
                isDropdownNeeded={true}
              >
                <AllReviews />
              </LayoutWrapper>
            </RequiredAuth>
          }
        />
        <Route
          path="*"
          element={
            <>
              <MetaTags>
                <title>Voosh | Error-404</title>
                <meta
                  name="voosh web app, Error page"
                  content="voosh error, page not found"
                />
                <meta property="og:title" content="web-app" />
              </MetaTags>
              <Error />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
