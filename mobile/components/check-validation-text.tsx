import { CheckCircle } from "lucide-react-native";
import { View } from "react-native";
import { Text } from "./ui/text";

type Props={
    text:string;
    status:"valid" | "invalid" | "error"
}
export function CheckValidationText ({text, status="invalid"}:Props) {
    return (
        <View className="flex-row gap-3 items-center justify-start">
            {
                status === "valid" ? <CheckCircle  color={"green"} size={20} /> :
                status === "error" ? <CheckCircle  color={"red"} size={20} /> :
                <CheckCircle color={"gray"}  size={20} />
            }
            {
                status === "valid" ? <Text className="text-green-600">{text}</Text> :
                status === "error" ? <Text className="text-red-500">{text}</Text> :
                <Text className="text-gray-400">{text}</Text>
            }
        </View>
    )
}