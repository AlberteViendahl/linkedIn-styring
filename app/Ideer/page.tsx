import Ideer from "../components/Ideer";
import Nav from "../components/Nav";
import Question from "../components/Question";

export default function DashboardPage() {
  return (
    <div>
      <Nav />
      <div className="flex justify-center items-start">
        <Ideer />
        <Question />
      </div>
    </div>
  );
}
