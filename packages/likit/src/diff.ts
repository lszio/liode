export enum EditType {
  UNCHANGE,
  DELETE,
  INSERT,
  REPLACE,
}

export interface EditOperation<T, ET extends EditType> {
  type: ET;
  operand: [T, T?];
}

export function getEditOperations<T>(a: T[], b: T[], options: { test?: (a: T, b: T) => boolean } = {}): EditOperation<T, EditType>[] {
  const m = a.length;
  const n = b.length;

  const dps: number[][] = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));
  const edits: EditOperation<T, EditType>[][][] = new Array(m + 1).fill("").map(() => new Array(n + 1).fill([]));

  for (let i = 1; i <= m; i++) {
    dps[i][0] = i;
    edits[i][0] = [...edits[i - 1][0], {
      type: EditType.DELETE,
      operand: [a[i - 1]]
    }];
  }
  for (let j = 1; j <= n; j++) {
    dps[0][j] = j;
    edits[0][j] = [...edits[0][j - 1], {
      type: EditType.INSERT,
      operand: [b[j - 1]]
    }];
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if ((options.test && options.test(a[i - 1], b[j - 1]) || (!options.test && a[i - 1] === b[j - 1]))) {
        dps[i][j] = dps[i - 1][j - 1];
        edits[i][j] = [...edits[i - 1][j - 1], {
          type: EditType.UNCHANGE,
          operand: [a[i - 1]]
        }];
      } else {
        const min = Math.min(dps[i - 1][j], dps[i][j - 1], dps[i - 1][j - 1]);
        dps[i][j] = min + 1;
        switch (min) {
          case dps[i - 1][j]:
            edits[i][j] = [...edits[i - 1][j], {
              type: EditType.DELETE,
              operand: [a[i - 1]]
            }];
            break;
          case dps[i][j - 1]:
            edits[i][j] = [...edits[i][j - 1], {
              type: EditType.INSERT,
              operand: [b[j - 1]]
            }];
            break;
          case dps[i - 1][j - 1]:
            edits[i][j] = [...edits[i - 1][j - 1], {
              type: EditType.REPLACE,
              operand: [a[i - 1], b[j - 1]]
            }];
            break;
        }
      }
    }
  }

  return edits[m][n];
}

export interface DifferentOptions<T> {
  unchange?: (arg0: T) => void;
  ondelete?: (arg0: T) => void;
  oninsert?: (arg0: T) => void;
  onreplace?: (arg0: T, arg1: T) => void;
  compare?: (a: T, b: T) => number;
  test?: (a: T, b: T) => boolean;
}

export function withDifferents<T>(a: T[], b: T[], options: DifferentOptions<T> = {}): void {
  const { compare } = options;

  if (compare) {
    a = a.sort(compare);
    b = b.sort(compare);
  }

  const operations = getEditOperations(a, b);

  for (const op of operations) {
    switch (op.type) {
      case EditType.UNCHANGE:
        options.unchange && options.unchange(op.operand[0]);
        break;
      case EditType.DELETE:
        options.ondelete && options.ondelete(op.operand[0]);
        break;
      case EditType.INSERT:
        options.oninsert && options.oninsert(op.operand[0]);
        break;
      case EditType.REPLACE:
        options.onreplace && options.onreplace(...<[T, T]>op.operand);
        break;
    }
  }
}
