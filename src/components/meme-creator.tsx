"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchMemeTemplates, createMeme, uploadMeme } from "@/lib/api";
import { useMeme } from "@/context/meme-context";
import { useUser } from "@/context/user-context";
import { MemeTemplate } from "@/lib/api-client";

export default function MemeCreator() {
  const router = useRouter();
  const { addMeme } = useMeme();
  const { user, addUploadedMeme } = useUser();

  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getTemplates = async () => {
      setLoading(true);
      try {
        const templates = await fetchMemeTemplates();
        if (templates) {
          // Add a null check here
          setTemplates((prevTemplates) => [...prevTemplates, ...templates]);
          if (templates.length > 0) {
            setSelectedTemplate(templates[0].id);
            setPreviewUrl(templates[0].url);
          }
        } else {
          setError("No templates found.");
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
        setError("Failed to load meme templates. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getTemplates();
  }, []);

  // Update preview when template changes
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setPreviewUrl(template.url);
    }
  };

  // Create and upload the meme
  const handleCreateMeme = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTemplate) {
      setError("Please select a meme template");
      return;
    }

    if (!topText && !bottomText) {
      setError("Please add at least one text caption");
      return;
    }

    if (!user) {
      setError("You need to be logged in to create memes");
      return;
    }

    setCreating(true);
    setError("");

    try {
      // In a real app, this would call the Imgflip API to create the meme
      const result = await createMeme({
        template_id: selectedTemplate,
        text0: topText,
        text1: bottomText,
      });
      const template = templates.find((t) => t.id === selectedTemplate);

      // Upload the created meme to our system
      const newMeme = await uploadMeme({
        name: template ? template.name : "Custom Meme",
        url: result.url,
        width: template ? template.width : 500,
        height: template ? template.height : 500,
        caption: caption || `${topText} ${bottomText}`.trim(),
        creator: user.username,
      });

      addMeme(newMeme);
      addUploadedMeme(newMeme.id);

      // Navigate to the new meme
      router.push(`/meme/${newMeme.id}`);
    } catch (error) {
      console.error("Error creating meme:", error);
      setError("Failed to create meme. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleCreateMeme} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template">Meme Template</Label>
              <Select
                value={selectedTemplate}
                onValueChange={handleTemplateChange}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a meme template" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topText">Top Text</Label>
              <Input
                id="topText"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="Enter top text"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bottomText">Bottom Text</Label>
              <Input
                id="bottomText"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="Enter bottom text"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="caption">Caption (Optional)</Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption for your meme"
                rows={2}
                className="resize-none"
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive border border-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={creating || loading || !selectedTemplate}
              className="w-full flex items-center gap-2"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Create Meme
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="text-center mb-2">
            <h3 className="font-medium">Preview</h3>
          </div>

          <div className="relative w-full aspect-square max-h-[300px] rounded-md overflow-hidden bg-muted">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : previewUrl ? (
              <div className="relative w-full h-full">
                <Image
                  src={previewUrl || "/placeholder.svg"}
                  alt="Meme template"
                  fill
                  className="object-contain"
                />

                {/* Simulated text overlay for preview */}
                {topText && (
                  <div className="absolute top-2 left-0 right-0 text-center px-4">
                    <p className="text-white text-xl font-bold uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                      {topText}
                    </p>
                  </div>
                )}

                {bottomText && (
                  <div className="absolute bottom-2 left-0 right-0 text-center px-4">
                    <p className="text-white text-xl font-bold uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                      {bottomText}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">No template selected</p>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Note: This is just a preview. The actual meme will be generated when
            you click Create.
          </p>
        </div>
      </div>
    </div>
  );
}
