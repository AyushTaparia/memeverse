import UserProfile from "@/components/user-profile"

export const metadata = {
  title: "Your Profile - MemeVerse",
  description: "View and manage your profile on MemeVerse",
}

export default function ProfilePage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <UserProfile />
    </div>
  )
}

