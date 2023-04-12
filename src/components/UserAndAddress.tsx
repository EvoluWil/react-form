import { FormProvider, useForm } from "react-hook-form";
import * as yup from 'yup';
import { TextField } from "./TextField";
import { AddressForm } from "./AdressForm";
import { yupResolver } from "@hookform/resolvers/yup";

const validationSchema = yup.object().shape({
  user: yup.object().shape({
    firstName: yup.string().required('Nome é obrigatório'),
    lastName: yup.string().required('Sobrenome é obrigatório'),
    email: yup.string().required('E-mail é obrigatório').email('E-mail invalido'),
  }),
  address: yup.object().shape({
    street: yup.string().required('Nome da rua é obrigatório'),
    number: yup.string().required('Numero é obrigatório'),
    zipCode: yup.string().required('CEP obrigatório').transform((value = '') => {
      return value.replace(/\D/g, '').replace(/(\d)(\d{3})$/g, '$1-$2')
    }).length(9, 'Cep invalido'),
  })
});

type User = {
  firstName: string
  lastName: string
  email: string
}

type Address = {
  zipCode: string
  street: string
  number: string
}

export type UserAndAddressDTO = {
  address: Address;
  user: User
}

export function UserAndAddress() {
  const form = useForm<UserAndAddressDTO>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      address: {
        number: '',
        street: '',
        zipCode: '',
      },
      user: {
        firstName: '',
        lastName: '',
        email: ''
      }
    }
  });

  const onSubmit = (data: UserAndAddressDTO) => {
    console.log(data);
  }

  return (
    <section>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <TextField control={form.control} name={"user.firstName"} label="Nome"/>
          <TextField control={form.control} name={"user.lastName"} label="Sobrenome"/>
          <TextField control={form.control} name={"user.email"} label="Email"/>
          <AddressForm />
          <button type="submit">Salvar</button>
        </form>
      </FormProvider>
      <br />
    </section>
  )
}