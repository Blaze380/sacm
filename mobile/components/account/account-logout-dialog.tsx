import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Text } from "@/components/ui/text";
import { logoutSession } from "@/lib/auth/logout";
import { useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AccountLogoutDialog({ open, onOpenChange }: Props) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logoutSession();
    } finally {
      setIsLoggingOut(false);
      onOpenChange(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Terminar sessão?</AlertDialogTitle>
          <AlertDialogDescription>
            Vai precisar de iniciar sessão novamente para aceder à sua conta.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoggingOut}>
            <Text>Cancelar</Text>
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive"
            disabled={isLoggingOut}
            onPress={() => void handleLogout()}
          >
            <Text className="text-white">Terminar sessão</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
