/**
 * Binary Search Tree with step-by-step traversals
 */

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.x = 0;
    this.y = 0;
  }
}

export class BST {
  constructor() {
    this.root = null;
    this.nodeList = []; // flat list of all nodes for positioning
  }

  insert(value) {
    const node = new TreeNode(value);
    if (!this.root) {
      this.root = node;
    } else {
      this._insertNode(this.root, node);
    }
    this.nodeList = [];
    this._collectNodes(this.root, this.nodeList);
    this._calculatePositions();
    return this;
  }

  _insertNode(current, node) {
    if (node.value < current.value) {
      if (!current.left) current.left = node;
      else this._insertNode(current.left, node);
    } else {
      if (!current.right) current.right = node;
      else this._insertNode(current.right, node);
    }
  }

  _collectNodes(node, list) {
    if (!node) return;
    list.push(node);
    this._collectNodes(node.left, list);
    this._collectNodes(node.right, list);
  }

  _calculatePositions() {
    if (!this.root) return;
    const startX = 350;
    const startY = 50;
    const yGap = 65;
    this._positionNode(this.root, startX, startY, 160, yGap);
  }

  _positionNode(node, x, y, xOffset, yGap) {
    if (!node) return;
    node.x = x;
    node.y = y;
    this._positionNode(node.left, x - xOffset, y + yGap, xOffset * 0.55, yGap);
    this._positionNode(node.right, x + xOffset, y + yGap, xOffset * 0.55, yGap);
  }

  getNodes() { return this.nodeList; }
  getRoot() { return this.root; }

  /**
   * Generate a balanced-ish BST from random values
   */
  static generateRandom(count = 15) {
    const bst = new BST();
    // Create a sorted array and insert in balanced order
    const values = new Set();
    while (values.size < count) {
      values.add(Math.floor(Math.random() * 99) + 1);
    }
    const sorted = [...values].sort((a, b) => a - b);
    
    // Insert in balanced order
    function insertBalanced(arr) {
      if (arr.length === 0) return;
      const mid = Math.floor(arr.length / 2);
      bst.insert(arr[mid]);
      insertBalanced(arr.slice(0, mid));
      insertBalanced(arr.slice(mid + 1));
    }
    insertBalanced(sorted);
    return bst;
  }
}

/**
 * Tree Traversal — step-by-step execution
 */
export class TreeTraversal {
  constructor(bst, type = 'inorder') {
    this.bst = bst;
    this.type = type;
    this.visitOrder = [];
    this.fullOrder = [];
    this.currentIndex = -1;
    this.done = false;
    this.steps = 0;
    this.currentNode = null;

    // Pre-compute full traversal order
    this._computeOrder(bst.getRoot());
  }

  _computeOrder(node) {
    if (!node) return;
    switch (this.type) {
      case 'inorder':
        this._computeOrder(node.left);
        this.fullOrder.push(node);
        this._computeOrder(node.right);
        break;
      case 'preorder':
        this.fullOrder.push(node);
        this._computeOrder(node.left);
        this._computeOrder(node.right);
        break;
      case 'postorder':
        this._computeOrder(node.left);
        this._computeOrder(node.right);
        this.fullOrder.push(node);
        break;
      case 'levelorder':
        this._computeLevelOrder(node);
        break;
    }
  }

  _computeLevelOrder(root) {
    if (!root) return;
    const queue = [root];
    while (queue.length > 0) {
      const node = queue.shift();
      this.fullOrder.push(node);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  step() {
    if (this.done) return;
    this.steps++;
    this.currentIndex++;

    if (this.currentIndex >= this.fullOrder.length) {
      this.done = true;
      this.currentNode = null;
      return;
    }

    this.currentNode = this.fullOrder[this.currentIndex];
    this.visitOrder.push(this.currentNode);

    if (this.currentIndex >= this.fullOrder.length - 1) {
      this.done = true;
    }
  }

  isDone() { return this.done; }
  
  getCurrentNode() { return this.currentNode; }
  
  getVisitOrder() { return this.visitOrder; }
  
  getVisitValues() { return this.visitOrder.map(n => n.value); }

  getMetrics() {
    return {
      steps: this.steps,
      visited: this.visitOrder.length,
      total: this.fullOrder.length,
    };
  }
}
