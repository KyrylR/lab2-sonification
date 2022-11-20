import assert from "assert";
import { Utils } from "./utils";
import { isChord, getChord } from "./chord";

const DefaultParams = {
  // https://cecm.indiana.edu/361/rsn-timing.html
  ticks: 480,
  // https://en.wikipedia.org/wiki/Musical_note#Note_designation_in_accordance_with_octave_name
  notes: ["c3"],
  // See README
  pattern: "x_______________",
  // https://en.wikipedia.org/wiki/Note_value
  noteValue: 1 / 16,
  shuffle: false,
  // https://www.ams.jhu.edu/dan-mathofmusic/sound-waves/
  isSinValArr: false,
};

/**
 * A clip is a container of a musical concept based on the parameters passed to it
 * @param {Object} params Extend the basic parameters of the object derived from DefaultParams
 * @return {Object} The return object is used with the `midi` method to generate a MIDI file
 */
export function clip(params: any) {
  params = Object.assign(DefaultParams, params || {});
  let sinValArr: any;
  if (params.isSinValArr) {
    sinValArr = Utils.sineLevel();
  }

  // Check if the note length is a fraction
  // If so convert it to decimal without using eval
  if (typeof params.noteValue === "string" && params.noteValue.indexOf("/") > 0) {
    let a = params.noteValue.split("/");
    params.noteValue = a[0] / a[1];
  }

  // If notes is a string, split it into an array
  if (typeof params.notes === "string") {
    params.notes = params.notes.replace(/\s{2,}/g, " ");
    params.notes = params.notes.split(" ");
  }

  // Convert chords if any to notes
  params.notes = params.notes.map((el: any[]) => {
    if (Array.isArray(el)) {
      return el.join();
    } else if (isChord(el)) {
      return getChord(el).join();
    } else {
      return el;
    }
  });

  // Validate provided notes
  params.notes.forEach((el: string) => {
    assert(el.match(/[a-gA-G]#?\d/g) !== null, el + " is not a valid note!");
  });

  // Validate provided pattern does not include anything other than x, - OR _
  assert(params.pattern.match(/[^x\-_]+/) === null, params.pattern + " is not a valid pattern!");

  // Ensure notes array has at least as many elements as pattern
  if (params.notes.length < params.pattern.length) {
    while (params.notes.length < params.pattern.length) {
      params.notes = params.notes.concat(params.notes);
    }
    // Clip off extra notes
    params.notes = params.notes.slice(0, params.pattern.length);
  }

  // Ensure pattern is as long as number of notes
  if (params.pattern.length < params.notes.length) {
    let originalPattern = params.pattern;
    while (params.pattern.length < params.notes.length) {
      params.pattern = params.pattern + originalPattern;
    }
    // Clip off extra chars
    params.pattern = params.pattern.slice(0, params.notes.length);
  }

  // Ensure isSinValArr array is as long as the pattern
  if (params.isSinValArr && sinValArr) {
    while (sinValArr.length < params.pattern.length) {
      sinValArr = sinValArr.concat(sinValArr);
    }
  }

  // Check if we need to shuffle the notes
  if (params.shuffle) {
    params.notes = Utils.shuffle(params.notes);
  }

  // Use string.replace on pattern to derive an array of note objects
  let midiArr: { note: any; length: number; level?: any }[] = [],
    step = 0;

  /**
   * Look for a note followed by an interval or sustain
   * @param  match The pattern to match (-, x, x-, x_, x__, x____ etc)
   * @param  noteOn   Note on (denoted by x) with or without sustain (denoted by underscore)
   * @param  noteOff   Interval (denoted by hyphen)
   */
  params.pattern.replace(/(x_*)|(-)/g, (_match: any, noteOn: string | any[], noteOff: any) => {
    let sinVal;
    if (params.isSinValArr) {
      sinVal = sinValArr[step];
    }

    // For x || x- || x__
    if (noteOn) {
      midiArr.push({
        // A note can be a single note like c3 or comma separated string to denote chords c3,e3,g3
        note: params.notes[step].split(","),
        length: params.noteValue * noteOn.length * params.ticks,
        level: params.isSinValArr ? sinVal : 127,
      });

      step++;
    }

    // For - (hyphen)
    if (noteOff) {
      midiArr.push({
        note: null,
        length: params.noteValue * params.ticks,
      });
    }
  });

  return midiArr;
}
