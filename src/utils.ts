export class Utils {
  /**
   * Just shaffle elements in array.
   */
  static shuffle(arr: any) {
    let lastIndex = arr.length - 1;
    arr.forEach((el: any, idx: any) => {
      let rnd = Math.round(Math.random() * lastIndex);
      arr[idx] = arr[rnd];
      arr[rnd] = el;
    });

    return arr;
  }

  /**
   * Returns an array of numbers corresponding to the sinusoidal wave function * maxLevel.
   */
  static sineLevel(maxLevel: number = 127): number[] {
    let pi = Math.PI;
    let piArr = [pi / 6, pi / 4, pi / 3, pi / 2, (2 * pi) / 3, (3 * pi) / 4, (5 * pi) / 6, pi];
    let piArrRev = [0, pi / 6, pi / 4, pi / 3, pi / 2, (2 * pi) / 3, (3 * pi) / 4, (5 * pi) / 6];
    piArrRev.reverse();
    let arr = piArr.concat(piArrRev);
    return arr.map((element) => Math.round(Math.sin(element) * maxLevel));
  }

  /**
   * Generating a pattern based on the specified parameters.
   */
  static pattern(len: number = 4, chars: string = "x_x_", shuffle: boolean = false) {
    if (shuffle) {
      chars = Utils.shuffle(chars.split("")).join("");
    }
    return chars.repeat(len);
  }
}
