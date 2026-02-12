/**
 * @fileoverview Utility function to build a hierarchical tree structure from a flat list of files.
 * Each file may have a parentId, and this function organizes them into a nested tree.
 * @module utils/buildTree
 */

/**
 * Builds a hierarchical tree from a flat array of file objects.
 *
 * @function buildTree
 * @param {Array<Object>} files - Array of file objects. Each file must contain at least `_id` and may contain `parentId`.
 * @returns {Array<Object>} Array of root nodes, each containing nested children.
 *
 * @example
 * const files = [
 *   { _id: "1", name: "root", parentId: null },
 *   { _id: "2", name: "child", parentId: "1" }
 * ];
 * const tree = buildTree(files);
 * console.log(tree);
 * // [
 * //   {
 * //     _id: "1",
 * //     name: "root",
 * //     parentId: null,
 * //     children: [
 * //       { _id: "2", name: "child", parentId: "1", children: [] }
 * //     ]
 * //   }
 * // ]
 */
export function buildTree(files) {
  const map = {};

  for (const file of files) {
    const plain = file.toObject ? file.toObject() : (file._doc || file);
    const id = String(plain._id);
    const parentId = plain.parentId ? String(plain.parentId) : null;

    map[id] = { ...plain, _id: id, parentId, children: [] };
  }

  const roots = [];
  for (const node of Object.values(map)) {
    if (node.parentId) {
      const parent = map[node.parentId];
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  return roots;
}
