import { AccountPasswordSection } from "@/components/account/account-password-section";
import { AccountSubScreen } from "@/components/account/account-sub-screen";

export default function AccountSecurityScreen() {
  return (
    <AccountSubScreen title="Segurança">
      <AccountPasswordSection />
    </AccountSubScreen>
  );
}
