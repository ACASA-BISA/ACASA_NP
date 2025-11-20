import "./App.css";
import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation, Routes, Route, useNavigate } from "react-router-dom";
import ReactGA from "react-ga4";
import ResponsiveAppBar from "./Appbar";
import "./ScrollBar.css";
import { ThemeProviderWrapper } from "./ThemeContext";
import BrowserCheck from "./BrowserCheck";
import Home from "./Home";
import Test from "./Test/Test";
import TestHome from "./Test/TestHome";
import UseCases from "./Test/UseCases";
import AnalyticsPage from "./Test/AnalyticsPage";
import DrawerMapShow from "./DrawerMapShow";
import Feedback1 from "./Feedback";
import ScrollToTop from "./scrolltop";
import DataGlance from "./Test/DataGlance";
import AdaptationDataGlance from "./Test/AdaptationDataGlance";
// Initialize Google Analytics
ReactGA.initialize("G-KE0VBWC68L");
function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [validCountries, setValidCountries] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  // Redirect if not in the subdirectory
  // useEffect(() => {
  //   if (!window.location.pathname.startsWith('/srilanka')) {
  //     window.location.href = '/srilanka' + window.location.hash;
  //   }
  // }, []);
  // Fetch valid countries from API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${apiUrl}/lkp/locations/countries`);
        const data = await response.json();
        if (data.success) {
          const activeCountries = data.data
            .filter((country) => country.status)
            .map((country) => country.country.toLowerCase().replace(/\s+/g, ""));
          setValidCountries(activeCountries);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, [apiUrl]);
  // Track page views and validate country in URL
  useEffect(() => {
    const path = location.hash ? location.hash.replace(/^#\/?/, "") : location.pathname.replace(/^\//, "");
    const pathSegments = path.split("/");
    const urlCountry = pathSegments[0] && !["home", "dashboard", "dataglance", "access", "usecases", "resources", "about", "feedback", "analytics", "hazardglance", "adaptationglance", "future", "comparison", "summary", "timeline", "adaptation", "adaptation2", "adaptationataglance", "hazardataglance"].includes(pathSegments[0]) ? pathSegments[0] : null;
    const activePageSegment = pathSegments[1] || pathSegments[0] || "home";
    // Skip redirection for dashboard routes to allow Test.jsx to handle country param
    if (urlCountry && !validCountries.includes(urlCountry.toLowerCase().replace(/\s+/g, "")) && activePageSegment !== "dashboard") {
      const newPath = pathSegments.slice(1).join("/") || "home";
      navigate(`/${newPath}`, { replace: true });
    }
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search + location.hash });
  }, [location, validCountries, navigate]);
  return (
    <div className="App">
      {/* <BrowserCheck /> */}
      <ThemeProviderWrapper>
        <ResponsiveAppBar validCountries={validCountries} />
        <Routes>
          <Route path="/" element={<TestHome />} />
          <Route path="/home" element={<TestHome />} />
          <Route path="/:country/home" element={<TestHome />} />
          <Route path="/about" element={<DrawerMapShow activeBar="about" />} />
          <Route path="/:country/about" element={<DrawerMapShow activeBar="about" />} />
          <Route path="/dashboard" element={<Test />} />
          <Route path="/:country/dashboard" element={<Test />} />
          <Route path="/adaptationataglance" element={<DrawerMapShow activeBar="analytics" />} />
          <Route path="/:country/adaptationataglance" element={<DrawerMapShow activeBar="analytics" />} />
          <Route path="/access" element={<DrawerMapShow activeBar="access" />} />
          <Route path="/:country/access" element={<DrawerMapShow activeBar="access" />} />
          <Route path="/resources" element={<DrawerMapShow activeBar="resources" />} />
          <Route path="/:country/resources" element={<DrawerMapShow activeBar="resources" />} />
          <Route path="/usecases" element={<UseCases />} />
          <Route path="/:country/usecases" element={<UseCases />} />
          <Route path="/guide" element={<DrawerMapShow activeBar="guide" />} />
          <Route path="/:country/guide" element={<DrawerMapShow activeBar="guide" />} />
          <Route path="/hazardataglance" element={<DrawerMapShow activeBar="hazards" />} />
          <Route path="/:country/hazardataglance" element={<DrawerMapShow activeBar="hazards" />} />
          <Route path="/future" element={<DrawerMapShow activeBar="future2" />} />
          <Route path="/:country/future" element={<DrawerMapShow activeBar="future2" />} />
          <Route path="/comparison" element={<DrawerMapShow activeBar="comparison" />} />
          <Route path="/:country/comparison" element={<DrawerMapShow activeBar="comparison" />} />
          <Route path="/summary" element={<DrawerMapShow activeBar="summary" />} />
          <Route path="/:country/summary" element={<DrawerMapShow activeBar="summary" />} />
          <Route path="/timeline" element={<DrawerMapShow activeBar="timeline" />} />
          <Route path="/:country/timeline" element={<DrawerMapShow activeBar="timeline" />} />
          <Route path="/adaptation" element={<DrawerMapShow activeBar="adaptation" />} />
          <Route path="/:country/adaptation" element={<DrawerMapShow activeBar="adaptation" />} />
          <Route path="/adaptation2" element={<DrawerMapShow activeBar="adaptation2" />} />
          <Route path="/:country/adaptation2" element={<DrawerMapShow activeBar="adaptation2" />} />
          <Route path="/feedback" element={<Feedback1 />} />
          <Route path="/:country/feedback" element={<Feedback1 />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/:country/analytics" element={<AnalyticsPage />} />
          <Route path="/hazardglance" element={<DataGlance />} />
          <Route path="/:country/hazardglance" element={<DataGlance />} />
          <Route path="/adaptationglance" element={<AdaptationDataGlance />} />
          <Route path="/:country/adaptationglance" element={<AdaptationDataGlance />} />
          <Route path="*" element={<TestHome />} />
        </Routes>
        <ScrollToTop />
      </ThemeProviderWrapper>
    </div>
  );
}
export default App;