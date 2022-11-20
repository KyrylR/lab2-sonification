const { clip, midi, Utils } = require("../dist/src");

let sample = clip({
  notes: ["d4", "a4", "c5", "f4"],
  pattern: Utils.pattern(8, "x_x_x_--", true),
  isSinValArr: true,
  shuffle: true,
});

midi(sample, "./result/music1.mid");
