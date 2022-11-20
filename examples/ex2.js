const { clip, midi, Utils } = require("../dist/src");

let sample = clip({
  notes: ["c4"],
  pattern: Utils.pattern(25, "x"),
  isSinValArr: true,
  shuffle: true,
});

midi(sample, "./result/music2.mid");
