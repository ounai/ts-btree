// Create a tree for testing:
type TestTree = BinaryTree.New<1, BinaryTree.New<7, 2, BinaryTree.New<6, 5, 11>>, BinaryTree.New<9, null, BinaryTree.New<9, 5, null>>>
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
type TestTreeReversed = BinaryTree.Reverse<TestTree>
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
type TestCasesDFS = TestHelpers.DFS.RunTests<TestTree, 15>
// Result: "1" | "2" | "5" | "6" | "7" | "9" | "11"

// Test set operation by replacing a part of the tree:
type TestTreeAfterSet = BinaryTree.Set<TestTree, BinaryTree.L<BinaryTree.R<BinaryTree.New<'A', 'B', 'C'>>>>
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


namespace BinaryTree {
    interface BinaryTree<Value, Left, Right> {
        value: Value
        left: Left
        right: Right
    }

    export type New<V, L, R> = BinaryTree<V, L, R>
    export type Any = BinaryTree<any, any, any>

    
    ///////////////////////
    // Reverse operation //
    ///////////////////////

    export type Reverse<T> =
        T extends BinaryTree<infer Value, infer Left, infer Right>
            ? { value: Value, left: Reverse<Right>, right: Reverse<Left> }
            : T


    ////////////////////////
    // Depth-first search //
    ////////////////////////

    export type DFS<T, V> =
        T extends BinaryTree<infer Value, infer Left, infer Right>
            ? Value extends V
                ? true
                : DFS<Left, V> extends true
                    ? true
                    : DFS<Right, V>
            : T extends V
                ? true
                : false


    ///////////////////
    // Set operation //
    ///////////////////

    type Traversal = Traverse<any> | BinaryTree.Any

    interface Traverse<T extends Traversal> {
        traverse: string
        next: T
    }

    export interface L<T extends Traversal> extends Traverse<T> { traverse: 'left' }
    export interface R<T extends Traversal> extends Traverse<T> { traverse: 'right' }

    export type Set<T extends BinaryTree.Any, V extends Traversal> =
        V extends L<infer Next>
            ? BinaryTree<T['value'], Set<T['left'], Next>, T['right']>
            : V extends R<infer Next>
                ? BinaryTree<T['value'], T['left'], Set<T['right'], Next>>
                : V extends BinaryTree.Any
                    ? V
                    : never
}

namespace TestHelpers {
    export namespace DFS {
        type RecurseTestCases<T extends BinaryTree.Any, N extends number, R extends boolean[] = []> =
            R extends { length: infer Length }
                ? Length extends N
                    ? R
                    : RecurseTestCases<T, N, [...R, BinaryTree.DFS<T, Length>]>
                : never

        type Keys<T> = keyof {
            [K in keyof T as Exclude<K, T[K] extends true ? never : K>]: never
        }

        export type RunTests<T extends BinaryTree.Any, N extends number> = Keys<RecurseTestCases<T, N>>
    }
}
