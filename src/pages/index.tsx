import { z } from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {CalendarIcon} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {useState} from "react";
import {toast} from "sonner";
import {Toaster} from "sonner";

export const calculateAge = (birthdate: Date): number => {
    const ageDifMs = Date.now() - birthdate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const formSchema = z.object({
    firstname: z
        .string()
        .min(3, { message: "Le prénom doit comporter au moins 3 caractères." })
        .max(20, { message: "Le prénom ne doit pas dépasser 20 caractères." })
        .regex(/^[a-zA-ZÀ-ÿ-]+$/, { message: "Le prénom contient des caractères invalides." }),

    lastname: z
        .string()
        .min(3, { message: "Le nom doit comporter au moins 3 caractères." })
        .max(20, { message: "Le nom ne doit pas dépasser 20 caractères." })
        .regex(/^[a-zA-ZÀ-ÿ-]+$/, { message: "Le nom contient des caractères invalides." }),

    email: z.string().email({ message: "L'email n'est pas valide." }),

    birthdate: z
        .date()
        .refine((date) => calculateAge(date) >= 18, { message: "Vous devez avoir au moins 18 ans." }),

    city: z.string().min(1, { message: "La ville est obligatoire." }),

    postalCode: z
        .string()
        .length(5, { message: "Le code postal doit comporter exactement 5 caractères." })
        .regex(/^\d{5}$/, { message: "Le code postal doit être un nombre de 5 chiffres." }),
});

export default function Home() {
    const [registered, setRegistered] = useState(false)
    const user: { firstname: string; lastname: string } =typeof window !== "undefined" && window.localStorage &&
        JSON.parse(localStorage.getItem('user') ?? '{"firstname": "", "lastname": ""}');


    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      birthdate: new Date(),
      city: "",
      postalCode: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
        toast.success('Inscription réussie !')
      localStorage.setItem('user', JSON.stringify(values))
      setRegistered(true)
      form.reset()
  }

    function onError(errors: any) {
        const errorMessages: string[] = [];

        errorMessages.push("Veuillez corriger les erreurs suivantes :");

        if (errors.firstname) {
            errorMessages.push("Le prénom doit être entre 3 et 20 caractères.");
        }
        if (errors.lastname) {
            errorMessages.push("Le nom doit être entre 3 et 20 caractères.");
        }
        if (errors.email) {
            errorMessages.push("L'email n'est pas valide.");
        }
        if (errors.birthdate) {
            errorMessages.push("La date de naissance doit être valide et ne peut pas être dans le futur.");
        }
        if (errors.city) {
            errorMessages.push("La ville est obligatoire.");
        }
        if (errors.postalCode) {
            errorMessages.push("Le code postal doit comporter exactement 5 chiffres.");
        }

        // Affiche un toast avec tous les messages d'erreur
        if (errorMessages.length > 0) {
            toast.error(errorMessages.join(" "));
        }
    }
  
  return (
      <>
      <div className={'flex flex-col items-center justify-center h-screen gap-20'}>
        <span>Inscrivez-vous !</span>
          {registered ? (<div className={'flex flex-col gap-20'}><span>Bravo {user.firstname + ' ' +  user.lastname}, vous êtes inscrit ! 🎉</span><Button onClick={() =>setRegistered(false)}>Se réinscrire</Button></div>) : (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8 ">
            <div className={'flex gap-8'}>

          <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
              )}
          />
            <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                        <Input placeholder="Nom" {...field} />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="birthdate"
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

            <div className={'flex gap-8'}>

            <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <FormControl>
                        <Input placeholder="Ville" {...field} />
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
                        <FormLabel>Code postal</FormLabel>
                        <FormControl>
                        <Input placeholder="Code postal" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            </div>

          <Button type="submit" className={'w-full'}>S&#39;inscrire</Button>
        </form>
      </Form>)}
      </div>
    <Toaster /></>
  )
}
