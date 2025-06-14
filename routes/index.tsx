// routes/sort-bib.tsx

import { Head } from "$fresh/runtime.ts";
import BibSorter from "../islands/BibSorter.tsx";

export default function SortBibPage() {
  return (
    <>
      <Head>
        <title>BibTeX Sorter</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <h1 class="text-4xl font-bold">BibTeX Reference Sorter</h1>
        <p class="my-4 text-gray-600">
          Paste the contents of your `.bib` file below and click "Sort" to arrange the entries alphabetically by their citation ID.
        </p>
        <BibSorter />
      </div>
    </>
  );
}