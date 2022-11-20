import { mode } from "./mode";

let chordPtn: RegExp;
chordPtn = /^([a-g][#|b]?)(d[io]m7?|[67]th|maj7?|min7?|m7?|sus[24]|aug|sixth)\-?([0-8])?/;

/**
 * Scales and integer notation to derive chords
 * Used chords and chordPtn from here:
 * https://github.com/scribbletune/scribbletune
 */
const modeMap: any = {
  // c e g
  maj: {
    mode: "ionian",
    int: [0, 2, 4],
  },

  // c e♭ g
  min: {
    mode: "aeolian",
    int: [0, 2, 4],
  },

  // c d g
  sus2: {
    mode: "major",
    int: [0, 1, 4],
  },

  // c f g
  sus4: {
    mode: "major",
    int: [0, 3, 4],
  },

  // c e g b
  maj7: {
    mode: "major",
    int: [0, 2, 4, 6],
  },

  // c e♭ g b♭
  min7: {
    mode: "minor",
    int: [0, 2, 4, 6],
  },

  // c e g b♭
  dom7: {
    mode: "mixolydian",
    int: [0, 2, 4, 6],
  },

  // c e♭ g♭
  dim: {
    mode: "diminished whole half",
    int: [0, 2, 4],
  },

  // c e♭ g♭ b𝄫
  dim7: {
    mode: "diminished whole half",
    int: [0, 2, 4, 6],
  },

  // c e g♯
  aug: {
    mode: "fifth mode",
    int: [0, 2, 5],
  },

  // c e g a
  sixth: {
    mode: "major",
    int: [0, 2, 4, 5],
  },
};

// Alternate names for chords
modeMap.m = modeMap.min;
modeMap.m7 = modeMap.min7;
modeMap["7th"] = modeMap.dom7;
modeMap["6th"] = modeMap.sixth;

export function isChord(str: string): RegExpMatchArray | null {
  return str.toLowerCase().match(chordPtn);
}

// Cmaj => 'c4', 'e4', 'g4'
// Cmin => 'c4' 'e3' 'g4'
export function getChord(str: string) {
  let arr: any[] = [];
  str.toLowerCase().replace(chordPtn, replacedValueFunc);

  function replacedValueFunc(_match: string, root: any, scale: number, octave: number = 4): string {
    let m = mode(root.toLowerCase(), modeMap[scale].mode, octave);
    modeMap[scale].int.forEach((i: number) => {
      arr.push(m[i]);
    });
    return m;
  }

  return arr;
}
