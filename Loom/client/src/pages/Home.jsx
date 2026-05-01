import { useSelector } from "react-redux";

import MainSection from "../components/home/MainSection";
import Hero from "../components/home/Hero";
const Home = () => {
  const userData = useSelector((state) => state.auth?.userData);

  return (
    <>
      {!userData && <Hero />}
      <div className="main-section">
        <MainSection userData={userData} />
      </div>
    </>
  );
};

export default Home;
