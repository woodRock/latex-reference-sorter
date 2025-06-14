// islands/BibSorter.tsx

import { useState } from "preact/hooks";
import { JSX } from "preact";

// Define the structure of a parsed BibTeX entry
interface BibEntry {
  id: string;
  content: string;
}

/**
 * A simple BibTeX parser. It splits the text into entries and extracts the ID.
 * This is a basic implementation and might not cover all edge cases of the BibTeX format.
 */
function parseBibtex(text: string): BibEntry[] {
  const entries: BibEntry[] = [];
  // Regex to find the start of a new BibTeX entry and capture its ID.
  const entryRegex = /@\w+\s*\{\s*([^,]+),/g;

  // Split the text into potential entries.
  // We use a positive lookahead to split without consuming the delimiter.
  const bibs = text.split(/(?=@\w+\s*\{)/);

  for (const bib of bibs) {
    if (bib.trim() === "") continue;

    const match = entryRegex.exec(bib);
    if (match && match[1]) {
      entries.push({
        id: match[1].trim(),
        content: bib.trim(),
      });
    }
    // Reset regex state for the next iteration
    entryRegex.lastIndex = 0;
  }

  return entries;
}

export default function BibSorter() {
  const [inputText, setInputText] = useState("");
  const [sortedText, setSortedText] = useState("");
  const [error, setError] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copy");

  const handleSort = () => {
    setError("");
    setCopyButtonText("Copy"); // Reset copy button on new sort
    if (!inputText.trim()) {
      setSortedText("");
      return;
    }

    try {
      const parsedEntries = parseBibtex(inputText);

      if (parsedEntries.length === 0) {
        setError("No valid BibTeX entries found. Ensure your format is correct (e.g., @article{someId, ...}).");
        setSortedText("");
        return;
      }

      // Sort entries alphabetically by ID, case-insensitively
      const sortedEntries = parsedEntries.sort((a, b) =>
        a.id.localeCompare(b.id, undefined, { sensitivity: 'base' })
      );

      // Join the sorted entries back into a string
      const result = sortedEntries.map(entry => entry.content).join("\n\n");
      setSortedText(result);
    } catch (e) {
      setError(`An error occurred during parsing: ${e.message}`);
      setSortedText("");
    }
  };

  const handleCopy = () => {
    if (navigator.clipboard && sortedText) {
      navigator.clipboard.writeText(sortedText).then(() => {
        setCopyButtonText("Copied!");
        setTimeout(() => setCopyButtonText("Copy"), 2000); // Reset after 2 seconds
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  };

  const handleInput = (e: JSX.TargetedEvent<HTMLTextAreaElement>) => {
    setInputText(e.currentTarget.value);
  };

  return (
    <div class="space-y-4">
      <div>
        <textarea
          class="w-full h-64 p-2 border border-gray-300 rounded-md font-mono"
          placeholder="Paste your BibTeX entries here..."
          value={inputText}
          onInput={handleInput}
        />
      </div>
      <button
        class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={handleSort}
      >
        Sort References
      </button>

      {error && (
        <div class="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <strong>Error:</strong> {error}
        </div>
      )}

      {sortedText && (
        <div>
          <div class="flex justify-between items-center mt-6 mb-2">
            <h2 class="text-2xl font-bold">Sorted References</h2>
            <button
              onClick={handleCopy}
              class="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              {copyButtonText}
            </button>
          </div>
          <pre class="w-full p-4 bg-gray-100 border border-gray-200 rounded-md overflow-x-auto font-mono">
            <code>{sortedText}</code>
          </pre>
        </div>
      )}
    </div>
  );
}