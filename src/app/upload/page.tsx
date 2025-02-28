import MemeUploadForm from "@/components/meme-upload-form"

export const metadata = {
  title: "Upload Meme - MemeVerse",
  description: "Upload and create your own memes to share with the community",
}

export default function UploadPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Upload a Meme</h1>
      <MemeUploadForm />
    </div>
  )
}

