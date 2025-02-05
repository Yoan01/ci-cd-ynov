"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  birthDate: Date
  city: string
  postalCode: string
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@example.com",
      birthDate: new Date("1990-01-01"),
      city: "Paris",
      postalCode: "75001",
    },
    // Add more sample users as needed
  ])

  const deleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
    toast.success("Utilisateur supprimé", {
      description: "L'utilisateur a été supprimé avec succès.",
    })
  }

  return (
    <div className="text-white flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-8 text-center">Liste des utilisateurs</h1>
      <div className="w-full max-w-4xl">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-zinc-900">
              <TableHead className="text-white">Nom</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Date de naissance</TableHead>
              <TableHead className="text-white">Ville</TableHead>
              <TableHead className="text-white">Code postal</TableHead>
              <TableHead className="text-white w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-zinc-900">
                <TableCell className="text-white">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell className="text-white">{user.email}</TableCell>
                <TableCell className="text-white">{format(user.birthDate, "dd/MM/yyyy")}</TableCell>
                <TableCell className="text-white">{user.city}</TableCell>
                <TableCell className="text-white">{user.postalCode}</TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-zinc-800">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-zinc-900 border-gray-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-zinc-800 text-white hover:bg-zinc-700 border-gray-700">
                          Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteUser(user.id)} className="bg-red-500 hover:bg-red-600">
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

