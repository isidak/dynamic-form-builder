export interface ComponentsMap {
  name: string;
  component: () => Promise<any>;
}
