import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import SectionButtons from "./SectionButtons";

// Header, check the type of the props
// SectionButtons, are the navgation buttons
// Loading, if data is not loaded
// Footer

const Loading = () => {
  return (
    <div className="container">
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    </div>
  );
};

const LayoutWrapper = (props) => {
  const {
    children,
    heading,
    isHomePage,
    isErrorPage = false,
    isClientBtnNeeded,
    headerSize = "small",
  } = props;

  const { data } = useSelector((state) => state.data);
  const res_name = useSelector((state) => state.data.res_name);
  const isLoading = useSelector((state) => state.data.isLoading);

  if (data.length === 0 || isLoading) {
    return (
      <>
        <Header isErrorPage={true} />
        <Loading />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header
        heading={heading}
        isErrorPage={isErrorPage}
        isHomePage={isHomePage}
        restaurantName={res_name}
        headerSize={headerSize}
      />
      <div className="container">
        <div className="layout_warraper-container">
          {!isClientBtnNeeded ? null : <SectionButtons />}
          {children}
        </div>
      </div>
      {!isErrorPage && <Footer />}
    </>
  );
};

export default LayoutWrapper;
