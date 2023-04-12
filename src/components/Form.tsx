import * as yup from 'yup';
import { Controller, FieldErrors, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputMask from "react-input-mask";

import { differenceInYears, format, sub } from 'date-fns';
import { useEffect } from 'react';
import { TextField } from './TextField';

const validationSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório').test('test-full-name', function (value) {
    const { path, createError } = this;
    const [firstName, lastName] = String(value).split(' ');
    if (firstName && lastName) {
      return true;
    }
    return createError({
      path,
      message: 'Nome completo deve possuir nome e sobrenome'
    });
  }),
  email: yup.string().required('E-mail é obrigatório').email('E-mail invalido'),
  password: yup.string().required('Senha é obrigatória').matches(/(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/, 'Senha fraca'),
  passwordConfirmation: yup.string().oneOf([yup.ref('password')], 'As senhas devem corresponder'),
  age: yup.number().required('Idade é obrigatória').min(13, 'Cresça').typeError('Idade tem que ser um numero natural'),
  birthDate: yup.date().required('Data de nascimento é obrigatória').typeError('Data de nascimento deve ser uma data valida').max(sub(new Date(), { years: 13 }), 'Data de nascimento não pode ser maior que ' + format(sub(new Date(), { years: 13 }), 'dd/MM/yyyy')),
  pacto: yup.boolean().isTrue('Deve aceitar o pacto'),
  phone: yup.string().required('Telefone é obrigatório').transform((value) => value?.replace(/\D/g, '')).length(11, 'Telefone com formato invalido'),
  zipCode: yup.string().required('CEP obrigatório').transform((value = '') => {
    return value.replace(/\D/g, '').replace(/(\d)(\d{3})$/g, '$1-$2')
  }).length(9, 'Cep invalido'),
  projects: yup.array().of(yup.object().shape({
    name: yup.string().required('Nome é obrigatório'),
    checked: yup.boolean()
  }))
});

interface FormDTO {
  name: string;
  email: string;
  password: string;
  age: number;
  birthDate: string;
  passwordConfirmation: string,
  pacto: boolean;
  phone: string;
  zipCode: string;
  projects: {
    name: string,
    checked: boolean
  }[]
}

type FormProps = {
  user: FormDTO
}

function Form({ user }: FormProps) {

  // const getUser = async (): Promise<FormDTO> => {
  //   return new Promise((resolve) => { 
  //     const timer = setTimeout(() => {
  //       clearTimeout(timer)
  //       resolve(user)
  //     }, 500)
  //   })
  // }

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<FormDTO>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      birthDate: '',
      age: 0,
      passwordConfirmation: '',
      pacto: false,
      phone: '',
      zipCode: '',
      projects: []
    },
  });

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "projects",
  // });


  // const birthDate = useWatch({name: 'birthDate', control})

  const onSubmit = (data: FormDTO) => {
    console.log(data)
    reset()
  }

  const onError = (err: FieldErrors<FormDTO>) => {
    // reset(user, { keepDefaultValues: true })
    console.log(err)
  }

  const addProject = () => {
    // append({ name: "", checked: false })
  }

  // useEffect(() => {
  //   if (birthDate) {
  //     setValue('age', differenceInYears(new Date(), new Date(birthDate)))
  //   }
  // }, [birthDate])

  // console.log('watch', age)
  // console.log(register('email'))
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <label htmlFor="name">
          Nome
          <br />
          <input id='name' type="text" {...register('name')} placeholder="Seu nome completo" />
          <small style={{display: 'block', color: 'red'}}>{errors.name?.message}</small>
        </label>

        <Controller
          name={"email"}
          control={control}
          render={({ field: { ref, ...inputProps } }) => (
            <label htmlFor="email">
              Email
              <br />
              <input id='email' type="email" placeholder="Seu email" {...inputProps} />
              <small style={{display: 'block', color: 'red'}}>{errors.email?.message}</small>
            </label>
          )}
        />
        
        <TextField control={control} name="password" label='Password' placeholder="Sua senha" />
        
        <TextField control={control} name="passwordConfirmation" label='Password Confirmation' placeholder="Confirme sua senha" />
        
        <label htmlFor="age">
          Idade
          <br />
          <input id='age' type="number" {...register('age')} placeholder="Sua idade" />
          <small style={{display: 'block', color: 'red'}}>{errors.age?.message}</small>
        </label>

        <label htmlFor="birthDate">
          Data de nascimento
          <br />
          <input id='birthDate' type="date" {...register('birthDate')} placeholder="Data de nascimento" />
          <small style={{display: 'block', color: 'red'}}>{errors.birthDate?.message}</small>
        </label>

        <Controller
          name={"phone"}
          control={control}
          render={({ field: { ref, ...inputProps } }) => (
            <InputMask mask={'(99) 9 9999-9999'} {...inputProps}>
              <label htmlFor="phone">
                Telefone
                <br />
                <input id='phone' type="tel" placeholder="Seu Telefone" {...inputProps} />
                <small style={{display: 'block', color: 'red'}}>{errors.phone?.message}</small>
              </label>
            </InputMask>
          )}
        />

        <Controller
          name={"zipCode"}
          control={control}
          render={({ field: { ref, ...inputProps } }) => (
              <label htmlFor="zipCode">
                CEP
                <br />
                <input id='zipCode' type="text" placeholder="Seu CEP" {...inputProps} />
                <small style={{display: 'block', color: 'red'}}>{errors.zipCode?.message}</small>
              </label>
          )}
        />

        <label htmlFor="pacto">
          <input id='pacto' type="checkbox" {...register('pacto')} />
          {' '}Aceito receber emails aleatórios a cada 5 minutos
          <small style={{display: 'block', color: 'red'}}>{errors.pacto?.message}</small>
        </label>

        <br />
        {/* <p>Projetos</p>
        {fields.map((item, index) => (
          <li key={item.id}>
            <input type="checkbox" {...register(`projects.${index}.checked`)} />
            <input type="text" {...register(`projects.${index}.name`)} />
            <button type='button' onClick={() => remove(index)}> X </button>
          </li>
        ))}

        <button type='button' onClick={ addProject } style={{width: '160px'}}>adicionar projeto</button>
        <br /> */}

        <button type='submit'>Enviar</button>
      </form>
      <br />
    </>
  )
}

export default Form
