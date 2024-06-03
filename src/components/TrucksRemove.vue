<script setup lang="ts">
import { ref, inject, onMounted } from "vue";

const dialogRef: any = inject("dialogRef");
const id = ref(null);
const submitting = ref(false);

const cancel = () => {
  dialogRef.value.close();
};

const removeTruck = async () => {
  submitting.value = true;

  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  };

  try {
    await fetch(
      `http://qa-api-mock-3.eu-central-1.elasticbeanstalk.com/trucks/${id.value}`,
      requestOptions
    );

    submitting.value = false;
    dialogRef.value.close(id.value);
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  const data = dialogRef.value.data;
  id.value = data.id;
});
</script>

<template>
  <div class="w-full flex justify-end items-center gap-4">
    <Button
      label="No"
      :disabled="submitting"
      @click="cancel()"
    />
    <Button
      :loading="submitting"
      label="Yes"
      @click="removeTruck()"
    />
  </div>
</template>
