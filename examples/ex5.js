const { clip, midi, mode, Utils } = require("../dist/src");

let sample = clip({
  notes: mode("c major 4"),
  pattern: Utils.pattern(8, "x_", true),
  isSinValArr: true,
  shuffle: true,
});

midi(sample, "./result/music5.mid");
