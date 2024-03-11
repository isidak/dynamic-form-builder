export interface ComponentType {
    name: string;
    component: () => Promise<any>;
}