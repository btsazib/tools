import CaseConverter from "./components/CaseConverter";
import ImageCaptionGenerator from "./components/ImageCaptionGenerator";
import ImageCropper from "./components/ImageCropper";
import LetterCounter from "./components/LetterCounter";
import LoremIpsumGenerator from "./components/LoremIpsumGenerator";
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
        <LoremIpsumGenerator />
        <br />
        <ImageCropper />
        <br />
        <ImageCaptionGenerator />
        <br />
      </main>
    </>
  );
}
