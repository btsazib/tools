import CaseConverter from "./components/CaseConverter";
import LetterCounter from "./components/LetterCounter";

export default function Home() {
  return (
    <>
      <main className="bg-gray-50">
        <CaseConverter />
        <br />
        <LetterCounter />
      </main>
    </>
  );
}
