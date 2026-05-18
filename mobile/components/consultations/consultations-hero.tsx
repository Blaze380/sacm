import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Plus, Search } from "lucide-react-native";
import { View } from "react-native";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
};

export function ConsultationsHero({ search, onSearchChange, onAdd }: Props) {
  return (
    <View className="gap-4">
      <Text className="text-2xl font-semibold">Consultas</Text>
      <View className="flex-row items-center gap-2">
        <View className="flex-1 flex-row items-center border border-input rounded-md bg-background px-3 h-10">
          <Search size={18} color="#687076" />
          <Input
            className="flex-1 border-0 h-9 px-2"
            placeholder="Pesquisar..."
            value={search}
            onChangeText={onSearchChange}
          />
        </View>
        <Button className="px-3 h-10" onPress={onAdd}>
          <Plus size={18} color="#fff" />
          <Text className="text-white text-sm ml-1">Adicionar</Text>
        </Button>
      </View>
    </View>
  );
}
