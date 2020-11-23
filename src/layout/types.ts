
export interface ILayoutBase {
  title?: string;
}

export interface ILayoutDefault extends ILayoutBase {

}

export interface ILayoutFull extends ILayoutBase {
  footer?: boolean;
}