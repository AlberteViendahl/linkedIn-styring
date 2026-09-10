import Ideer from "../components/Ideer";
import Nav from "../components/Nav";
import Question from "../components/Question";

export default function DashboardPage() {
  return (
    <div>
      <Nav />
      <div className="grid gap-8 xl:grid-cols-2 m-2 lg:m-10">
        <Ideer />
        <Question />
      </div>
    </div>
  );
}
