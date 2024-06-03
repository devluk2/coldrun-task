<script setup lang="ts">
import { ref, inject, onMounted } from "vue";
import { TruckEnums } from "../types/TruckEnums";
import validateForm from "../utils/validateForm.js";

const dialogRef: any = inject("dialogRef");
const truck = ref({
  code: "",
  name: "",
  status: "",
  description: "",
});
const formErrors = ref<string[]>([]);
const submitting = ref(false);

const cancel = () => {
  dialogRef.value.close();
};

const addTruck = async () => {
  submitting.value = true;
  formErrors.value = [];

  const { isValid, errors } = validateForm(truck.value);

  if (!isValid) {
    submitting.value = false;
    formErrors.value = errors;
    return;
  }
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(truck.value),
  };

  try {
    const response = await fetch(
      "http://qa-api-mock-3.eu-central-1.elasticbeanstalk.com/trucks",
      requestOptions
    );

    const data = await response.json();

    submitting.value = false;
    dialogRef.value.close(data);
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div class="grid gap-2">
    <label for="code" class="flex flex-col gap-1"
      >Code
      <InputText v-model="truck.code" placeholder="Code" id="code" :invalid="formErrors.includes('code')" />
    </label>
    <label for="name" class="flex flex-col gap-1"
      >Name
      <InputText
        v-model="truck.name"
        placeholder="Name"
        id="name"
        :invalid="formErrors.includes('name')"
      />
    </label>
    <label for="description" class="flex flex-col gap-1">
      Description
      <Textarea
        v-model="truck.description"
        placeholder="Description"
        id="description"
      />
    </label>

    <label>Status</label>
    <div class="grid gap-2">
      <div v-for="status in TruckEnums" :key="status">
        <RadioButton
          v-model="truck.status"
          :inputId="`status${status}`"
          :name="status.replace('_', ' ')"
          :value="status"
          :checked="status === truck.status"
          :invalid="formErrors.includes('status')"
        />
        <label :for="`status${status}`" class="ml-2 cursor-pointer">{{
          status.replace("_", " ")
        }}</label>
      </div>
    </div>

    <div class="mt-4 w-full flex justify-end items-center gap-4">
      <Button
        label="Cancel"
        severity="danger"
        :disabled="submitting"
        @click="cancel()"
      />
      <Button
        :loading="submitting"
        label="Save"
        icon="pi pi-save"
        @click="addTruck()"
      />
    </div>
  </div>
</template>
