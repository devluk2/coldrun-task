<script setup lang="ts">
import { ref, onMounted } from "vue";

import type Truck from "../types/Truck";
import { TruckEnums } from "../types/TruckEnums";

import { useDialog } from "primevue/usedialog";
import { useToast } from "primevue/usetoast";

import TrucksAddNew from "./TrucksAddNew.vue";
import TrucksEdit from "./TrucksEdit.vue";
import TrucksRemove from "./TrucksRemove.vue";

const loading = ref(true);
const trucks = ref<Truck[]>([]);

const dialog = useDialog();
const toast = useToast();

const fetchTrucks = async () => {
  try {
    const response = await fetch(
      "http://qa-api-mock-3.eu-central-1.elasticbeanstalk.com/trucks"
    );

    trucks.value = await response.json();
    loading.value = false;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchTrucks();
});

const showTruckAdd = () => {
  dialog.open(TrucksAddNew, {
    props: {
      modal: true,
      header: "Add new truck",
      draggable: false,
    },
    onClose: (opt: any) => {
      if (opt.data) {
        updateTrucksList(opt.data);
        toast.add({
          severity: "success",
          summary: "Truck has been added successfully",
          life: 3000,
        });
      }
    },
  });
};

const showTruckEdit = (id: string) => {
  dialog.open(TrucksEdit, {
    props: {
      modal: true,
      header: `Edit truck ${id}`,
      draggable: false,
    },
    data: {
      id,
    },
    onClose: (opt: any) => {
      if (opt.data) {
        updateTrucksList(opt.data);
        toast.add({
          severity: "success",
          summary: "Truck has been updated successfully",
          life: 3000,
        });
      }
    },
  });
};

const showRemoveTruck = (id: string) => {
  dialog.open(TrucksRemove, {
    props: {
      modal: true,
      header: "Are you sure you want to proceed?",
      draggable: false,
    },
    data: {
      id,
    },
    onClose: (opt: any) => {
      if (opt.data) {
        removeTruckFromTruckList(opt.data);
        toast.add({
          severity: "error",
          summary: "Truck has been removed successfully",
          life: 3000,
        });
      }
    },
  });
};

const updateTrucksList = (data: Truck) => {
  const index = trucks.value.findIndex((item: any) => {
    return item.id === data.id;
  });

  if (index > -1) {
    trucks.value[index] = data;
  } else {
    trucks.value.push(data);
  }
};

const removeTruckFromTruckList = (id: string) => {
  trucks.value = trucks.value.filter((truck) => {
    return truck.id !== id;
  });
};

const getSeverity = (status: string): string => {
  if (status === TruckEnums.OUT_OF_SERVICE) {
    return "warning";
  }
  if (status === TruckEnums.RETURNING) {
    return "primary";
  }
  return "info";
};
</script>

<template>
  <DataTable
    :value="trucks"
    :loading="loading"
    tableStyle="min-width: 50rem"
    :virtualScrollerOptions="{ itemSize: 46 }"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-xl text-900 font-bold">Manage Trucks</span>
        <Button
          icon="pi pi-plus"
          label="Add new truck"
          @click="showTruckAdd()"
        />
      </div>
    </template>

    <Column field="id" header="ID"></Column>
    <Column field="code" header="Code"></Column>
    <Column field="name" header="Name"></Column>
    <Column field="status" header="Status">
      <template #body="slotProps">
        <Tag
          :value="slotProps.data.status"
          :severity="getSeverity(slotProps.data.status)"
        />
      </template>
    </Column>
    <Column field="description" header="Description"></Column>
    <Column header="">
      <template #body="slotProps">
        <div class="flex justify-end items-center gap-2">
          <Button
            label="Edit"
            icon="pi pi-pen-to-square"
            @click="showTruckEdit(slotProps.data.id)"
          />
          <Button
            label="Remove"
            icon="pi pi-trash"
            severity="danger"
            @click="showRemoveTruck(slotProps.data.id)"
          />
        </div>
      </template>
    </Column>

    <template #footer>
      In total there are {{ trucks ? trucks.length : 0 }} trucks
    </template>
  </DataTable>
</template>

<style scoped></style>
