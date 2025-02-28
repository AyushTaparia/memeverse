import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MemeUploadForm from "@/components/meme-upload-form";
import MemeCreator from "@/components/meme-creator";

export const metadata = {
  title: "Create & Upload Memes - MemeVerse",
  description:
    "Create new memes or upload your own to share with the community",
};

export default function UploadPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Create & Upload Memes</h1>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="create">Create a Meme</TabsTrigger>
          <TabsTrigger value="upload">Upload Your Own</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Create a Meme</h2>
            <p className="text-muted-foreground mb-6">
              Select a template and add your own text to create a custom meme.
            </p>
            <MemeCreator />
          </div>
        </TabsContent>
        <TabsContent value="upload">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Upload Your Own Meme</h2>
            <p className="text-muted-foreground mb-6">
              Upload your own meme image to share with the community.
            </p>
            <MemeUploadForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
