import { getSiteSettings } from "@/action/SettingAction";
import FormSetting from "@/components/Features/Dashboard/settings/FormSetting"
import { SetPageTitle } from "@/components/Layouts/Dashboard/SetPageTitle";

const Page = async () => {
  const setttingData = await getSiteSettings();

  return (
    <>
      <SetPageTitle title="Pengaturan" />
      <FormSetting data={setttingData!} />
    </>
  )
}

export default Page