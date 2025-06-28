// tools/page.js

import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

import CaseConverter from "../components/CaseConverter";
import ImageCaptionGenerator from "../components/ImageCaptionGenerator";
import ImageCropper from "../components/ImageCropper";
import LetterCounter from "../components/LetterCounter";
import LoremIpsumGenerator from "../components/LoremIpsumGenerator";
import MultipleWhitespaceRemover from "../components/MultipleWhitespaceRemover";

export default async function Tools() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="text-center mt-10">Please login first.</p>;
  }

  return (
    <div className="bg-gray-50 p-6 rounded-md shadow-md">
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
    </div>
  );
}
