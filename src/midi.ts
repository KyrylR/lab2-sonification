import fs from "fs";
import { Transpose } from "./transpose";

const jsmidgen = require("jsmidgen");

/**
 * Accepts an array of note objects to create a MIDI file.
 * @param {Array} notes Notes in format: {note: ['c3'], level: 127, length: 64}
 * @param {String} fileName If no file name is specified, `music.mid` is used by default.
 */
export function midi(notes: any, fileName: string = "music.mid") {
  let file = new jsmidgen.File();
  let track = new jsmidgen.Track();
  file.addTrack(track);

  notes.forEach((noteObj: any) => {
    let level = noteObj.level || 127;
    if (noteObj.note) {
      noteObj.note = Transpose.transposeNote(noteObj.note);
      if (typeof noteObj.note === "string") {
        track.noteOn(0, noteObj.note, noteObj.length, level); // channel, pitch(note), length, velocity
        track.noteOff(0, noteObj.note, noteObj.length, level);
      } else {
        track.addChord(0, noteObj.note, noteObj.length, level);
      }
    } else {
      track.noteOff(0, "", noteObj.length);
    }
  });

  fs.writeFileSync(fileName, file.toBytes(), "binary");
}
