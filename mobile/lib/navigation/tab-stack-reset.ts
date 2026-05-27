import type { Href } from "expo-router";
import { router } from "expo-router";
import {
  StackActions,
  type EventArg,
  type NavigationProp,
  type ParamListBase,
  type RouteProp,
} from "@react-navigation/native";

type TabListenerProps = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase, string>;
};

function nestedStackIndex({ navigation, route }: TabListenerProps): number {
  const state = navigation.getState();
  const tabRoute = state.routes.find((r) => r.key === route.key);
  return tabRoute?.state?.index ?? 0;
}

function popNestedStackToRoot(
  { navigation, route }: TabListenerProps,
  rootHref: Href,
) {
  const state = navigation.getState();
  const tabRoute = state.routes.find((r) => r.key === route.key);
  const stackState = tabRoute?.state;

  if (!stackState || (stackState.index ?? 0) === 0) return;

  if (stackState.key) {
    navigation.dispatch({
      ...StackActions.popToTop(),
      target: stackState.key,
    });
    return;
  }

  router.replace(rootHref);
}

/** Resets a tab's nested stack on blur (leave tab) and on tabPress (re-tap tab). */
export function createNestedStackTabListeners(rootHref: Href) {
  return (props: TabListenerProps) => ({
    tabPress: (e: EventArg<"tabPress", true>) => {
      if (nestedStackIndex(props) > 0) {
        e.preventDefault();
        popNestedStackToRoot(props, rootHref);
      }
    },
    blur: () => {
      popNestedStackToRoot(props, rootHref);
    },
  });
}
