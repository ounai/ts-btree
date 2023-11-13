interface BinaryTree<Value, Left, Right> {
   value: Value
   left: Left
   right: Right
}

// Create a tree for testing:
type TestTree = BinaryTree<1, BinaryTree<7, 2, BinaryTree<6, 5, 11>>, BinaryTree<9, null, BinaryTree<9, 5, null>>>
// Result: {
//    value: 1;
//    left: {
//        value: 7;
//        left: 2;
//        right: { value: 6; left: 5; right: 11; };
//    };
//    right: {
//        value: 9;
//        left: null;
//        right: { value: 9; left: 5; right: null; };
//    };
// }

// Test the reverse operation:
type TestTreeReversed = BinaryTreeReverse<TestTree>
// Result: {
//    value: 1;
//    left: {
//        value: 9;
//        left: { value: 9; left: null; right: 5; };
//        right: null;
//    };
//    right: {
//        value: 7;
//        left: { value: 6; left: 11; right: 5; };
//        right: 2;
//    };
// }

// Test depth-first search by finding all values present between 0 and 15:
type TestCasesDFS = RunTestsDFS<TestTree, 15>
// -> "1" | "2" | "5" | "6" | "7" | "9" | "11"

// Test set operation by replacing a part of the tree:
type TestTreeAfterSet = BinaryTreeSet<TestTree, L<R<BinaryTree<'A', 'B', 'C'>>>>
// Result: {
//    value: 1;
//    left: {
//        value: 7;
//        left: 2;
//        right: { value: "A"; left: "B"; right: "C"; };
//    };
//    right: {
//        value: 9;
//        left: null;
//        right: { value: 9; left: 5; right: null; };
//    };
// }


///////////////////////
// Reverse operation //
///////////////////////

type BinaryTreeReverse<T> =
   T extends BinaryTree<infer Value, infer Left, infer Right>
       ? { value: Value, left: BinaryTreeReverse<Right>, right: BinaryTreeReverse<Left> }
       : T


////////////////////////
// Depth-first search //
////////////////////////

type BinaryTreeDFS<T, V> =
   T extends BinaryTree<infer Value, infer Left, infer Right>
       ? Value extends V
           ? true
           : BinaryTreeDFS<Left, V> extends true
               ? true
               : BinaryTreeDFS<Right, V>
       : T extends V
           ? true
           : false

type RecurseTestCasesDFS<T extends BinaryTree<any, any, any>, N extends number, R extends boolean[] = []> =
   R extends { length: infer Length }
       ? Length extends N
           ? R
           : RecurseTestCasesDFS<T, N, [...R, BinaryTreeDFS<T, Length>]>
       : never

type Keys<T> = keyof { [K in keyof T as Exclude<K, T[K] extends true ? never : K>]: never }
type RunTestsDFS<T extends BinaryTree<any, any, any>, N extends number> = Keys<RecurseTestCasesDFS<T, N>>


///////////////////
// Set operation //
///////////////////

type Traversal = Traverse<any> | BinaryTree<any, any, any>

interface Traverse<T extends Traversal> {
    traverse: string
    next: T
}

interface L<T extends Traversal> extends Traverse<T> { traverse: 'left' }
interface R<T extends Traversal> extends Traverse<T> { traverse: 'right' }

type BinaryTreeSet<T extends BinaryTree<any, any, any>, V extends Traversal> =
    V extends L<infer Next>
        ? BinaryTree<T['value'], BinaryTreeSet<T['left'], Next>, T['right']>
        : V extends R<infer Next>
            ? BinaryTree<T['value'], T['left'], BinaryTreeSet<T['right'], Next>>
            : V extends BinaryTree<any, any, any>
                ? V
                : never
