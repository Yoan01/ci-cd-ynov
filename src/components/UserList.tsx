"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { deleteUser, getUsers } from "@/lib/api";
import { useRouter } from "next/router";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  city: string;
  postalCode: string;
};

export default function UserList() {
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    isAdmin: boolean;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      setCurrentUser(storedUser);
      if (!storedUser) {
        router.push("/login");
      }
    }
  }, []);

  useEffect(() => {
    getUsers()
      .then((users) => {
        setUsers(users);
      })
      .catch((error) => {
        toast.error("Erreur lors de la récupération des utilisateurs", {
          description: error.message,
        });
      });
  }, [currentUser]);

  const [users, setUsers] = useState<User[]>([]);

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user._id !== userId));
    deleteUser(userId).then(() => {
      toast.success("Utilisateur supprimé", {
        description: "L'utilisateur a été supprimé avec succès.",
      });
    });
  };

  return (
    <div className="text-white flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-8 text-center">
        Liste des utilisateurs
      </h1>
      <div className="w-full max-w-4xl">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-zinc-900">
              <TableHead className="text-white">Nom</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Date de naissance</TableHead>
              <TableHead className="text-white">Ville</TableHead>
              <TableHead className="text-white">Code postal</TableHead>
              {currentUser?.isAdmin && (
                <TableHead className="text-white w-[70px]">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} className="hover:bg-zinc-900">
                <TableCell className="text-white">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell className="text-white">{user.email}</TableCell>
                <TableCell className="text-white">
                  {format(user.birthDate, "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="text-white">{user.city}</TableCell>
                <TableCell className="text-white">{user.postalCode}</TableCell>
                {currentUser?.isAdmin && (
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          disabled={currentUser?.id === user._id}
                          variant="ghost"
                          size="icon"
                          className="hover:bg-zinc-800"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-zinc-900 border-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">
                            Confirmer la suppression
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Êtes-vous sûr de vouloir supprimer cet utilisateur ?
                            Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-zinc-800 text-white hover:bg-zinc-700 border-gray-700">
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user._id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button
        className={"mt-10"}
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
        }}
      >
        Se déconnecter
      </Button>
    </div>
  );
}
