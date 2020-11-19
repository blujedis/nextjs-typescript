
export interface ILayoutBase {
  name?: string;
  title?: string;
  subtitle?: string;
}

export interface ILayout extends Omit<ILayoutBase, 'name'> {}