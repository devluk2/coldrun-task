<script setup lang="ts">
import { ref, inject, onMounted } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, alphaNum } from "@vuelidate/validators";
import { TruckEnums } from "../types/TruckEnums";
import { useTruckService } from "../composables/truckService";

const dialogRef: any = inject("dialogRef");
const params = ref("none");
const truck = ref({
  id: "",
  code: "",
  name: "",
  status: "",
  description: "",
});
const rules = {
  code: { required, alphaNum },
  name: { required },
  status: { required },
};
const v$ = useVuelidate(rules, truck);

const currentTruckStatus = ref("");
const loading = ref(true);
const submitting = ref(false);

const truckStatusTransitions: any = {
  [TruckEnums.OUT_OF_SERVICE]: [
    TruckEnums.OUT_OF_SERVICE,
    TruckEnums.TO_JOB,
    TruckEnums.AT_JOB,
    TruckEnums.RETURNING,
    TruckEnums.LOADING,
  ],
  [TruckEnums.LOADING]: [TruckEnums.OUT_OF_SERVICE, TruckEnums.TO_JOB],
  [TruckEnums.TO_JOB]: [TruckEnums.OUT_OF_SERVICE, TruckEnums.AT_JOB],
  [TruckEnums.AT_JOB]: [TruckEnums.OUT_OF_SERVICE, TruckEnums.RETURNING],
  [TruckEnums.RETURNING]: [TruckEnums.OUT_OF_SERVICE, TruckEnums.LOADING],
};

const isDisabled = (status: string): boolean => {
  const truckStatus = currentTruckStatus.value;
  const validTransitions = truckStatusTransitions[truckStatus] || [];
  return !validTransitions.includes(status);
};

onMounted(() => {
  const data = dialogRef.value.data;
  params.value = data;
  fetchTruck(data.id);
});

const { updateTruck } = useTruckService();

const fetchTruck = async (id: any) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/trucks/${id}`
    );

    truck.value = await response.json();
    currentTruckStatus.value = truck.value.status;
    loading.value = false;
  } catch (error) {
    console.error(error);
  }
};

const cancel = () => {
  dialogRef.value.close();
};

const updateTruckData = async () => {
  submitting.value = true;

  const isFormCorrect = await v$.value.$validate();

  if (!isFormCorrect) {
    submitting.value = false;
    return;
  }

  try {
    const data = await updateTruck(truck.value.id, truck.value);
    submitting.value = false;
    dialogRef.value.close(data);
  } catch (error) {
    console.error(error);
    submitting.value = false;
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
          :invalid="!!v$.code.$errors.length"
        />
        <p
          class="error text-sm"
          v-for="error of v$.code.$errors"
          :key="error.$uid"
        >
          {{ error.$message }}
        </p>
      </label>
      <label for="name" class="flex flex-col gap-1"
        >Name
        <InputText
          v-model="truck.name"
          placeholder="Name"
          id="name"
          :invalid="!!v$.name.$errors.length"
        />
        <p
          class="error text-sm"
          v-for="error of v$.name.$errors"
          :key="error.$uid"
        >
          {{ error.$message }}
        </p>
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
            :invalid="!!v$.status.$errors.length"
          />
          <label :for="`status${status}`" class="ml-2 cursor-pointer">{{
            status.replace("_", " ")
          }}</label>
          <p
            class="error text-sm"
            v-for="error of v$.status.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>
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
          @click="updateTruckData()"
        />
      </div>
    </div>
  </div>
</template>
