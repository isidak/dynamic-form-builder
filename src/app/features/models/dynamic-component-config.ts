export interface DynamicComponentConfig {
    component: () => Promise<any>;
    importedCmp?: any;
    id: string;
    name: string;
    inputs: {
        controlName: string;
        required: boolean;
        minLength: number;
        readonly: boolean;
        autocomplete: string;
        type: string;
        label: string;
        placeholder: string;
    };
}