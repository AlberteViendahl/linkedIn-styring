import Kalender from "./components/Kalender";
import Nav from "./components/Nav";

export default function Home() {
  return (
    <div>
      <Nav />
      <div className="flex justify-center">
        <Kalender />
      </div>
    </div>
  );
}
