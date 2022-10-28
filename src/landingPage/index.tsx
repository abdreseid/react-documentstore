import { useState, useEffect } from "react";
//import SmoothScroll from "smooth-scroll";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Testimonials } from "./components/testimonials";
import { Contact } from "./components/contact";
import JsonData from "./data/data.json";
import "./index.css";

/* export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
}); */

export default function 
Home() {
  const [landingPageData, setLandingPageData] = useState(JsonData);
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);
  return <div>
    <Header data={landingPageData.Header} />
      <Features data={landingPageData.Features} />
      <About data={landingPageData.About} />
      <Services data={landingPageData.Services} />
      <Testimonials data={landingPageData.Testimonials} />
      <Contact data={landingPageData.Contact} />
  </div>;
}