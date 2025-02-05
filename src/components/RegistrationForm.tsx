import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {calculateAge, cn} from "@/lib/utils"
import {toast} from "sonner";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {format} from "date-fns";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {registerUser} from "@/lib/api";
import Link from "next/link";

export const registerFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "Le prénom est requis")
    .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, "Le prénom ne doit contenir que des lettres, espaces, et tirets"),
  lastName: z
    .string()
    .min(1, "Le nom est requis")
    .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, "Le nom ne doit contenir que des lettres, espaces, et tirets"),
  email: z.string().email("L'email n'est pas valide"),
  birthDate: z
    .date()
    .refine((date) => calculateAge(date) >= 18, { message: "Vous devez avoir au moins 18 ans." }),
  city: z
    .string()
    .min(1, "La ville est requise")
    .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, "La ville ne doit contenir que des lettres, espaces, et tirets"),
  postalCode: z.string().regex(/^\d{5}$/, "Le code postal doit être au format français (5 chiffres)"),
})

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      birthDate: undefined,
      city: "",
      postalCode: "",
    },
  })

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    setIsSubmitting(true)
    await registerUser(values)
      .then(() => {
        toast.success('Inscription réussie !', {description: 'Vos informations ont été enregistrées avec succès.'})
        form.reset()
      })
      .catch(() => toast.error('Erreur', {description: 'Une erreur est survenue lors de l\'inscription.'}))
    setIsSubmitting(false)
  }

  return (
    <div className="text-white flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold mb-8 text-center">Inscrivez-vous !</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Prénom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Prénom"
                      {...field}
                      className="bg-black border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Nom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nom"
                      {...field}
                      className="bg-black border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    {...field}
                    className="bg-black border-gray-700 text-white placeholder:text-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de naissance</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        className={cn(
                          "w-full pl-3",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Choisissez une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={1960}
                      toYear={2030}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Ville</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ville"
                      {...field}
                      className="bg-black border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Code postal</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Code postal"
                      {...field}
                      className="bg-black border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !form.formState.isValid}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white"
          >
            S&#39;inscrire
          </Button>
        </form>
      </Form>
      <Link href={"/login"} className="text-white hover:underline pt-2 text-xs">
        Vous avez déjà un compte ? Connectez-vous
      </Link>
    </div>
  )
}

