import assert from "assert";

export class Transpose {
  static defaultMiddleC: number = 4;
  static transposition: number = 0;
  static startOctave: number = 0;

  static transposeNote(noteArg: any, octave: number | undefined = undefined) {
    assert(typeof noteArg === "string" || Array.isArray(noteArg));
    assert(Number.isInteger(octave) || octave === undefined, "Octave, if defined, must be an integer");
    if (typeof noteArg === "string") {
      return this._transposeSingle(noteArg, 0, octave!);
    } else {
      return noteArg.map((n, i) => this._transposeSingle(n, i, octave!));
    }
  }

  /**
   * Moves a single note to the desired octave, defined by transposition or the octave argument.
   * @ref: https://book.verovio.org/advanced-topics/transposition.html
   */
  static _transposeSingle(note: string, noteIndex: number, octave: number) {
    let root = note.replace(/\d/g, "");
    let oct = +note.replace(/\D/g, "");

    if (noteIndex === 0) {
      this.startOctave = oct;
    }

    if (octave) {
      oct = octave + (oct - this.startOctave);
    } else {
      oct += this.transposition;
    }

    return root + oct;
  }
}
