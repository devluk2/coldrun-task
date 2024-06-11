<script setup lang="ts">
import { ref, inject } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, alphaNum } from "@vuelidate/validators";
import { TruckEnums } from "../types/TruckEnums";
import { useTruckService } from "../composables/truckService";

const dialogRef: any = inject("dialogRef");
const truck = ref({
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

const submitting = ref(false);
const { addTruck } = useTruckService();

const cancel = () => {
  dialogRef.value.close();
};

const addNewTruck = async () => {
  submitting.value = true;

  const isFormCorrect = await v$.value.$validate();

  if (!isFormCorrect) {
    submitting.value = false;
    return;
  }


  try {
    const data = await addTruck(truck.value);
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
    <div class="grid gap-2">
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
        <div v-for="status in TruckEnums" :key="status">
          <RadioButton
            v-model="truck.status"
            :inputId="`status${status}`"
            :name="status.replace('_', ' ')"
            :value="status"
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
          @click="addNewTruck()"
        />
      </div>
    </div>
  </div>
</template>
