const { clip, midi, Utils } = require("../dist/src");

let sample = clip({
  notes: "c4",
  pattern: Utils.pattern(4, "x---", true),
  isSinValArr: true,
  shuffle: true,
});

midi(sample, "./result/music3.mid");
