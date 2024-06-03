<script setup lang="ts">
import { ref, inject, onMounted } from "vue";
import { TruckEnums } from "../types/TruckEnums";
import validateForm from "../utils/validateForm.js";

const dialogRef: any = inject("dialogRef");
const params = ref("none");
const truck = ref({
  id: "",
  code: "",
  name: "",
  status: "",
  description: "",
});
const formErrors = ref<string[]>([]);
const truckOldStatus = ref("");
const loading = ref(true);
const submitting = ref(false);

const isDisabled = (status: string): boolean => {
  const truckStatus = truckOldStatus.value;
  if (
    status === TruckEnums.OUT_OF_SERVICE ||
    truckStatus === TruckEnums.OUT_OF_SERVICE
  ) {
    return false;
  }

  if (truckStatus === TruckEnums.LOADING && status === TruckEnums.TO_JOB) {
    return false;
  }
  if (truckStatus === TruckEnums.TO_JOB && status === TruckEnums.AT_JOB) {
    return false;
  }
  if (truckStatus === TruckEnums.AT_JOB && status === TruckEnums.RETURNING) {
    return false;
  }
  if (truckStatus === TruckEnums.RETURNING && status === TruckEnums.LOADING) {
    return false;
  }

  return true;
};

onMounted(() => {
  const data = dialogRef.value.data;
  params.value = data;
  fetchTruck(data.id);
});

const fetchTruck = async (id: any) => {
  try {
    const response = await fetch(
      `http://qa-api-mock-3.eu-central-1.elasticbeanstalk.com/trucks/${id}`
    );

    truck.value = await response.json();
    truckOldStatus.value = truck.value.status;
    loading.value = false;
  } catch (error) {
    console.error(error);
  }
};

const cancel = () => {
  dialogRef.value.close();
};

const updateTruck = async () => {
  submitting.value = true;

  formErrors.value = [];
  const { isValid, errors } = validateForm(truck.value);

  if (!isValid) {
    submitting.value = false;
    formErrors.value = errors;
    return;
  }
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(truck.value),
  };

  try {
    await fetch(
      `http://qa-api-mock-3.eu-central-1.elasticbeanstalk.com/trucks/${truck.value.id}`,
      requestOptions
    );

    submitting.value = false;
    dialogRef.value.close(truck.value);
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div>
    <div v-if="loading">
      <Skeleton height="2rem" class="mb-2"></Skeleton>
      <Skeleton height="2rem" class="mb-2"></Skeleton>
      <Skeleton height="2rem" class="mb-2"></Skeleton>
      <Skeleton height="2rem" class="mb-2"></Skeleton>
    </div>
    <div v-else class="grid gap-2">
      <label for="id" class="flex flex-col gap-1"
        >ID <InputText :value="truck.id" disabled placeholder="ID" id="id"
      /></label>

      <label for="code" class="flex flex-col gap-1"
        >Code
        <InputText
          v-model="truck.code"
          placeholder="Code"
          id="code"
          :invalid="formErrors.includes('code')"
        />
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
        <div
          v-for="status in TruckEnums"
          :key="status"
          :class="{ 'opacity-50': isDisabled(status) }"
        >
          <RadioButton
            v-model="truck.status"
            :inputId="`status${status}`"
            :name="status.replace('_', ' ')"
            :value="status"
            :disabled="isDisabled(status)"
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
          @click="updateTruck()"
        />
      </div>
    </div>
  </div>
</template>
