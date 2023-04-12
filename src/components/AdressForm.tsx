import { useFormContext } from "react-hook-form";
import { TextField } from "./TextField";
import { UserAndAddressDTO } from "./UserAndAddress";

export function AddressForm() {
  const { control } = useFormContext<UserAndAddressDTO>()

  return (
    <>
      <TextField control={control} name={"address.street"} label="Rua"/>
      <TextField control={control} name={"address.number"} label="Numero"/>
      <TextField control={control} name={"address.zipCode"} label="CEP"/>
    </>
  )
}