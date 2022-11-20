import assert from "assert";
import { modes } from "./modes";
import { Transpose } from "./transpose";

const chromaticNotes: any = ["c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b"];
const accidentals: any = {
  "c#": "db",
  "d#": "eb",
  "f#": "gb",
  "g#": "ab",
  "a#": "bb",
};

/**
 * Get mode or scale for a given root note and octave.
 */
export function mode(root: string, _mode: string, octave: number, addRootFromNextOctave: boolean = false) {
  if (root.match(/\s/) && !_mode && !octave && !addRootFromNextOctave) {
    let args = root.split(/\s/);
    root = args.shift()!;
    let lastItem = args.pop()!;

    // Check if the last element is true/false for addRootFromNextOctave
    if (lastItem === "true" || lastItem === "false") {
      addRootFromNextOctave = lastItem !== "false";
      lastItem = args.pop()!; // lastItem should now be the octave
    }

    // Check if the last element is the number specified for the octave
    if (Number.isInteger(+lastItem)) {
      octave = +lastItem;
      // Since it was an octave, zero the last time
      // so that if it wasn't a number, we can assume it was _mode/mode
      lastItem = "undef";
    }

    // Since we extracted the root, octave and addRootFromNextOctave,
    // what's left must be part (or all) of the _mode name, so push it back into args
    if (lastItem !== "undef") {
      args.push(lastItem);
    }

    // Об'єднати все, що залишилося
    _mode = args.join(" ");
  }

  // Check the validity of the root [abcdefg], optionally followed by #
  assert(root.match(/[abcdefg]#?/i), "Invalid root note: " + root);

  // Checking if the provided _mode is valid
  assert(modes.hasOwnProperty(_mode), "Invalid _mode: " + _mode);

  root = root || "c";
  if (root.indexOf("#") > 0) {
    root = accidentals[root];
  }
  _mode = _mode || "ionian";
  octave = +octave || Transpose.defaultMiddleC;

  // Add an octave to the chromatic notes
  let chromatic = chromaticNotes
    .map((note: number) => note + octave)
    .concat(chromaticNotes.map((note: number) => note + (octave + 1)));

  /**
   * Slice chromatic notes, starting from the root note and on &
   * filter them by _mode pattern to return the desired notes
   */
  let modeArr = chromatic
    .slice(chromatic.indexOf(root + octave))
    .filter((_note: any, idx: string | number) => modes[_mode][idx] === 1);

  // Add the root of the next octave before returning
  if (addRootFromNextOctave) {
    modeArr.push(root + (octave + 1));
  }
  return modeArr;
}
