import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";

import ToastService from "primevue/toastservice";
import DialogService from 'primevue/dialogservice';

import RadioButton from 'primevue/radiobutton';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from "primevue/button";
import Dialog from 'primevue/dialog';
import DynamicDialog from 'primevue/dynamicdialog';
import Toast from "primevue/toast";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Skeleton from 'primevue/skeleton';

import "./assets/main.css";
import Lara from "@/presets/lara";
import "primeicons/primeicons.css";

const app = createApp(App);

app.use(PrimeVue, {
  unstyled: true,
  pt: Lara,
  ripple: true,
});
app.use(ToastService);
app.use(DialogService);

app.component("InputText", InputText);
app.component("Textarea", Textarea);
app.component("RadioButton", RadioButton);
app.component("Button", Button);
app.component("Dialog", Dialog);
app.component("DynamicDialog", DynamicDialog);
app.component("Toast", Toast);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("Tag", Tag);
app.component("Skeleton", Skeleton);

app.mount("#app");
