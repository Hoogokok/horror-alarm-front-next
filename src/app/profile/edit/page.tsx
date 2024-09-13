import { useSearchParams } from "next/navigation";
import ProfileEdit from "./component/page";
import { getProfile } from "@/app/auth/lib/actions";

export default async function EditProfilePage() {
    const profile = await getProfile()
  return (
    <div>
        <ProfileEdit
        initialImageUrl={profile?.image_url}
        initialNickname={profile?.name}
        initialId={profile?.id}
        />
      </div>
    );
  }