const { clip, midi, Utils } = require("../dist/src");

let sample = clip({
  notes: ["F#m", "C#m", "Dmaj", "Bm", "Emaj", "Amaj", "Dmaj", "C#m", "Amaj"],
  pattern: Utils.pattern(8, "x_x_x_--", true),
  isSinValArr: true,
  shuffle: true,
});

midi(sample, "./result/music4.mid");
