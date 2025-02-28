import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { loginUser } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/router";

export const loginFormSchema = z.object({
  email: z.string().email("L'email n'est pas valide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setIsSubmitting(true);
    await loginUser(values)
      .then(() => {
        toast.success("Connexion réussie !", {
          description: "Vous êtes maintenant connecté.",
        });
        form.reset();
        router.push("/users");
      })
      .catch(() =>
        toast.error("Erreur", {
          description: "Email ou mot de passe incorrect.",
        }),
      );
    setIsSubmitting(false);
  }

  return (
    <div className="text-white flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold mb-8 text-center">
        Connectez-vous
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Mot de passe"
                    {...field}
                    className="bg-black border-gray-700 text-white placeholder:text-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isSubmitting || !form.formState.isValid}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white"
          >
            Se connecter
          </Button>
        </form>
      </Form>
      <Link href={"/"} className="text-white hover:underline pt-2 text-xs">
        Vous n&#39;avez pas de compte ? Inscrivez-vous !
      </Link>
    </div>
  );
}
