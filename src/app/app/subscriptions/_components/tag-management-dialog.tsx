"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TagManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: UserSubscriptionWithNewsletter | null;
  onUpdateTags: (subscriptionId: string, newTags: string[]) => void;
  userTags: string[];
  setUserTags: (tags: string[]) => void;
}

export function TagManagementDialog({ 
  open, 
  onOpenChange, 
  subscription, 
  onUpdateTags, 
  userTags, 
  setUserTags 
}: TagManagementDialogProps) {
  const [newTag, setNewTag] = useState("")

  const handleAddTag = () => {
    if (newTag.trim() && !userTags.includes(newTag.trim())) {
      const updatedTags = [...userTags, newTag.trim()]
      setUserTags(updatedTags)
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setUserTags(userTags.filter((t) => t !== tag))
  }

  const handleSave = () => {
    if (subscription) {
      onUpdateTags(subscription.id, userTags)
      onOpenChange(false)
    }
  }

  if (!subscription) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
          <DialogDescription>
            Add or remove tags for {subscription.customNameForUser || subscription.newsletter.name}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="user-tags" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user-tags">Your Tags</TabsTrigger>
            <TabsTrigger value="category-tags">Category Tags</TabsTrigger>
          </TabsList>

          <TabsContent value="user-tags" className="space-y-4">
            <div className="flex items-center gap-2 mt-4">
              <Input
                placeholder="Add a new tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {userTags.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tags added yet. Add your first tag above.</p>
              ) : (
                userTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1 bg-primary/5 border-primary/30">
                    <span className="text-primary">#</span>
                    {tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tag} tag</span>
                    </Button>
                  </Badge>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="category-tags">
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Category tags are provided by the newsletter publisher and cannot be modified.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {subscription.newsletter.categoryTags && subscription.newsletter.categoryTags.length > 0 ? (
                  subscription.newsletter.categoryTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No category tags available for this newsletter.</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}