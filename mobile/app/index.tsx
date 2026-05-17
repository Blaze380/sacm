import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ModalScreen () {
  return (
    <SafeAreaView className='bg-primary flex-1 items-center justify-between p-4'>
      <View className='flex items-center justify-center mt-32'>
        <Text>LOGO</Text>
        <Text className='text-3xl text-white'>SEJA BEM VINDO AO SACM!</Text>
      </View>

      <View className='w-full flex-col px-16 items-center justify-center mb-5'>
        <Button className='bg-white w-full'  >
          <Link href="/(auth)/signup/step1" className=' w-full text-center text-primary'>Começar</Link>
        </Button>
        <View className='flex-row items-center justify-center gap-2 mt-4'>
          <Text className='text-white text-center '>Já tem uma conta?</Text>
          <Link href="/(auth)/login" className='text-white text-center  font-bold underline'>Faça login</Link>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
