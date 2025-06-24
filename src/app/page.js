import CaseConverter from "./components/CaseConverter";
import LetterCounter from "./components/LetterCounter";
import MultipleWhitespaceRemover from "./components/MultipleWhitespaceRemover";

export default function Home() {
  return (
    <>
      <main className="bg-gray-50">
        <CaseConverter />
        <br />
        <LetterCounter />
        <br />
        <MultipleWhitespaceRemover />
        <br />
      </main>
    </>
  );
}
