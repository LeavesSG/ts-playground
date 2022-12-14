import { Ordering } from "../ord/ordering";
import { ToPartial } from "../ord/partial";
import { Split } from "../string/string";
import { Digit, DigitChar, DigitCmp } from "./digit";

/**
 * Convert a integer to a tuple of digit chars
 */
type IntTuple<T extends number> = Split<`${T}`, "">;

/**
 * Compare two integers, return {@link PartOrdering}
 */
export type UIntCmp<
  T extends number,
  U extends number
> = IntTuple<T> extends infer TupleT extends DigitChar[]
  ? IntTuple<U> extends infer TupleU extends DigitChar[]
    ? _TupleLengthCompare<TupleT, TupleU> extends infer R extends Ordering
      ? R extends Ordering.Equal
        ? ToPartial<_TupleItemCompare<TupleT, TupleU>>
        : ToPartial<R>
      : never
    : never
  : never;
type _TupleItemCompare<
  T extends DigitChar[],
  U extends DigitChar[]
> = T extends [DigitChar, ...infer R extends DigitChar[]]
  ? U extends [DigitChar, ...infer S extends DigitChar[]]
    ? DigitCmp<T[0], U[0]> extends infer X
      ? X extends Ordering.Equal
        ? _TupleItemCompare<R, S>
        : X
      : never
    : Ordering.Equal
  : Ordering.Equal;
type _TupleLengthCompare<
  T extends [...DigitChar[]],
  U extends [...DigitChar[]]
> = T["length"] extends Digit
  ? U["length"] extends Digit
    ? DigitCmp<T["length"], U["length"]>
    : Ordering.Less
  : U["length"] extends Digit
  ? Ordering.Greater
  : UIntCmp<T["length"], U["length"]>;

type Assertion = Assert<IsEqual<UIntCmp<132, 132>, Ordering.Equal>>;
