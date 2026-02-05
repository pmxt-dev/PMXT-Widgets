'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MarketItem } from '@/lib/market-data'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

interface EditMarketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: MarketItem | null
  onSave: (item: MarketItem) => void
  onDelete?: () => void
}

export function EditMarketDialog({ open, onOpenChange, item, onSave, onDelete }: EditMarketDialogProps) {
  const [editedItem, setEditedItem] = useState<MarketItem | null>(item)

  const handleSave = () => {
    if (editedItem) {
      onSave(editedItem)
      onOpenChange(false)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
      onOpenChange(false)
    }
  }

  const updateChild = (index: number, field: 'name' | 'value', value: string | number) => {
    if (!editedItem?.children) return

    const newChildren = [...editedItem.children]
    if (field === 'name') {
      newChildren[index] = { ...newChildren[index], name: value as string }
    } else {
      newChildren[index] = { ...newChildren[index], value: Number(value) }
    }

    setEditedItem({ ...editedItem, children: newChildren })
  }

  const addChild = () => {
    if (!editedItem) return

    const newChild: MarketItem = {
      name: 'New Market',
      value: 1000000,
    }

    setEditedItem({
      ...editedItem,
      children: [...(editedItem.children || []), newChild],
    })
  }

  const deleteChild = (index: number) => {
    if (!editedItem?.children) return

    const newChildren = editedItem.children.filter((_, i) => i !== index)
    setEditedItem({ ...editedItem, children: newChildren })
  }

  if (!item || !editedItem) return null

  const hasChildren = editedItem.children && editedItem.children.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Edit Market: {item.name}</DialogTitle>
          <DialogDescription>
            Modify the market name, value, and its sub-markets. Values are in USD.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Market Name</Label>
              <Input
                id="name"
                value={editedItem.name}
                onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
              />
            </div>

            {!hasChildren && (
              <div className="space-y-2">
                <Label htmlFor="value">Value (USD)</Label>
                <Input
                  id="value"
                  type="number"
                  value={editedItem.value}
                  onChange={(e) => setEditedItem({ ...editedItem, value: Number(e.target.value) })}
                />
              </div>
            )}

            {hasChildren && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Sub-Markets</Label>
                  <Button onClick={addChild} size="sm" variant="outline">
                    Add Sub-Market
                  </Button>
                </div>

                <div className="space-y-3">
                  {editedItem.children?.map((child, index) => (
                    <div key={index} className="flex gap-2 items-start p-3 border rounded-md">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Name"
                          value={child.name}
                          onChange={(e) => updateChild(index, 'name', e.target.value)}
                        />
                        <Input
                          placeholder="Value"
                          type="number"
                          value={child.value}
                          onChange={(e) => updateChild(index, 'value', e.target.value)}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteChild(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex justify-between">
          <div>
            {onDelete && (
              <Button variant="destructive" onClick={handleDelete}>
                Delete Category
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
