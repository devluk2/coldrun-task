import type Truck from "../types/Truck";
import { TruckEnums } from "../types/TruckEnums";

export default function (data: Truck) {
  const errors = [];
  let isValid: boolean = true;
  const { code, name, status } = data;

  if (!code.length) {
    errors.push("code");
    isValid = false;
  }
  if (!name.length) {
    errors.push("name");
    isValid = false;
  }

  if (!Object.values(TruckEnums).includes(status as unknown as TruckEnums)) {
    errors.push("status");
    isValid = false;
  }

  return { isValid, errors };
}
