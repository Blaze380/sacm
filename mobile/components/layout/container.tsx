import { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export function Container({ children }:PropsWithChildren){
    return(
        <SafeAreaView className="flex-1 p-4">
            {children}
        </SafeAreaView>
    )
}