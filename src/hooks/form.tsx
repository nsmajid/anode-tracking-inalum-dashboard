import { yupResolver } from '@hookform/resolvers/yup'
import { UseFormProps, useForm } from 'react-hook-form'
import { AnyObjectSchema, Lazy } from 'yup'

export const useHookForm = <T extends object>(
  defaultValues: T,
  validationSchema: AnyObjectSchema | Lazy<never, unknown>,
  useFormConfig?: UseFormProps
) => {
  const form = useForm({
    ...useFormConfig,
    defaultValues,
    resolver: yupResolver(validationSchema as AnyObjectSchema)
  })

  const {
    formState: { errors, ...formState },
    ...rhf
  } = form

  return {
    errors,
    rhf: { ...formState, ...rhf },
    form
  }
}
