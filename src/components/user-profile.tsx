"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Pencil, Save, X, ThumbsUp, Upload, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const UserProfile = () => {
  const { user, updateProfile } = useUser();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");

  // Update state when user data is available
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setBio(user.bio || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleSave = () => {
    if (!username.trim()) {
      setError("Username cannot be empty");
      return;
    }
    updateProfile({ username, bio, avatar });
    setEditing(false);
    setError("");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading user profile...</p>
        </div>
      </div>
    );
  }

  // Determine which tab to show by default
  const defaultTab = user.uploadedMemes?.length > 0 ? "uploaded" : "liked";

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="mb-8 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-primary/10">
                <AvatarImage src={avatar} alt={username} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User size={48} />
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              {editing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Username
                    </label>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      className="max-w-md"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Bio
                    </label>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself"
                      rows={3}
                      className="max-w-md resize-none"
                    />
                  </div>

                  {error && <p className="text-destructive text-sm">{error}</p>}

                  <div className="flex gap-2 justify-center md:justify-start">
                    <Button onClick={handleSave} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditing(false);
                        setUsername(user.username || "");
                        setBio(user.bio || "");
                        setError("");
                      }}
                      size="sm"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <h2 className="text-2xl font-bold">{username}</h2>
                    <Badge variant="outline" className="self-center">
                      ID: {user.id}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground max-w-md">
                    {bio || "No bio provided yet."}
                  </p>

                  <Button onClick={() => setEditing(true)} size="sm">
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="liked">
            <ThumbsUp className="w-4 h-4 mr-2" />
            Liked Memes{" "}
            {user.likedMemes?.length > 0 && (
              <span className="ml-1 text-xs bg-primary/20 rounded-full w-5 h-5 inline-flex items-center justify-center">
                {user.likedMemes.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="uploaded">
            <Upload className="w-4 h-4 mr-2" />
            Uploaded Memes{" "}
            {user.uploadedMemes?.length > 0 && (
              <span className="ml-1 text-xs bg-primary/20 rounded-full w-5 h-5 inline-flex items-center justify-center">
                {user.uploadedMemes.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="liked" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Memes You've Liked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <ThumbsUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground">
                  You've liked{" "}
                  <span className="font-bold">
                    {user.likedMemes?.length || 0}
                  </span>{" "}
                  memes.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="uploaded" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Memes You've Uploaded</CardTitle>
              <Button size="sm" variant="outline" asChild>
                <Link href="/upload">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground">
                  You've uploaded{" "}
                  <span className="font-bold">
                    {user.uploadedMemes?.length || 0}
                  </span>{" "}
                  memes.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
