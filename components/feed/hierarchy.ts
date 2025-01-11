export interface TreeNode {
    id: string;
    type: 'parent' | 'child' | 'leaf';
    label: string;
    children?: TreeNode[];
    expanded?: boolean;
  }
  
  