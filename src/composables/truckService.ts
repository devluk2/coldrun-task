import { ref } from "vue";
import type Truck from "../types/Truck";

export const useTruckService = () => {
  const loading = ref(false);
  const trucks = ref(new Array());

  const fetchTrucks = async () => {
    try {
      loading.value = true;

      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/trucks`
      );
      const data = await response.json();

      trucks.value = data;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const addTruck = async (truckData: Truck) => {
    try {
      loading.value = true;

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(truckData),
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/trucks`,
        requestOptions
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateTruck = async (truckId: string, truckData: Truck) => {
    try {
      loading.value = true;
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(truckData),
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/trucks/${truckId}`,
        requestOptions
      );
      const data: Truck = await response.json();

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateTrucksList = (updatedTruck: Truck) => {
    const index = trucks.value.findIndex(({ id }) => id === updatedTruck.id);
    if (index !== -1) {
      trucks.value.splice(index, 1, updatedTruck);
    } else if ("id" in updatedTruck) {
      trucks.value.push(updatedTruck);
    }
  };

  const removeTruckFromTruckList = (truckId: string) => {
    const index = trucks.value.findIndex(({ id }) => id === truckId);
    if (index !== -1) {
      trucks.value.splice(index, 1);
    }
  };

  return {
    loading,
    trucks,
    fetchTrucks,
    addTruck,
    updateTruck,
    updateTrucksList,
    removeTruckFromTruckList,
  };
};
