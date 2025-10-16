import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useBrandKits, BrandKit } from '@/hooks/useBrandKits';
import { Plus, Palette, Type, Image, FileText, Trash2, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export const BrandKitManager: React.FC = () => {
  const { brandKits, defaultBrandKit, createBrandKit, updateBrandKit, deleteBrandKit } = useBrandKits();
  const [isCreating, setIsCreating] = useState(false);
  const [editingKit, setEditingKit] = useState<Partial<BrandKit>>({
    name: '',
    color_palette: [],
    typography: {},
    usage_rules: [],
    auto_apply_to_designs: true,
  });

  const handleCreate = async () => {
    await createBrandKit.mutateAsync(editingKit);
    setIsCreating(false);
    setEditingKit({
      name: '',
      color_palette: [],
      typography: {},
      usage_rules: [],
      auto_apply_to_designs: true,
    });
  };

  const addColor = () => {
    setEditingKit({
      ...editingKit,
      color_palette: [
        ...(editingKit.color_palette || []),
        { name: 'New Color', color: '#000000', usage: 'General' },
      ],
    });
  };

  const updateColor = (index: number, field: string, value: string) => {
    const newPalette = [...(editingKit.color_palette || [])];
    newPalette[index] = { ...newPalette[index], [field]: value };
    setEditingKit({ ...editingKit, color_palette: newPalette });
  };

  const removeColor = (index: number) => {
    const newPalette = (editingKit.color_palette || []).filter((_, i) => i !== index);
    setEditingKit({ ...editingKit, color_palette: newPalette });
  };

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Brand Kit Manager
            </CardTitle>
            <CardDescription className="text-white/70">
              Create and manage your brand identity across all designs
            </CardDescription>
          </div>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="bg-studio-accent hover:bg-studio-accent/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Brand Kit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">Create Brand Kit</DialogTitle>
                <DialogDescription className="text-white/70">
                  Define your brand identity for consistent designs
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Basic Info */}
                <div className="space-y-2">
                  <Label className="text-white">Brand Kit Name</Label>
                  <Input
                    value={editingKit.name}
                    onChange={(e) => setEditingKit({ ...editingKit, name: e.target.value })}
                    placeholder="My Brand Kit"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                {/* Color Palette */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Color Palette</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={addColor}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Color
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {editingKit.color_palette?.map((color, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Input
                          type="color"
                          value={color.color}
                          onChange={(e) => updateColor(index, 'color', e.target.value)}
                          className="w-16 h-10 cursor-pointer"
                        />
                        <Input
                          value={color.name}
                          onChange={(e) => updateColor(index, 'name', e.target.value)}
                          placeholder="Color name"
                          className="bg-white/10 border-white/20 text-white"
                        />
                        <Input
                          value={color.usage}
                          onChange={(e) => updateColor(index, 'usage', e.target.value)}
                          placeholder="Usage (e.g., Headlines)"
                          className="bg-white/10 border-white/20 text-white"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeColor(index)}
                          className="text-white hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography */}
                <div className="space-y-4">
                  <Label className="text-white flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Typography
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm">Heading Font</Label>
                      <Input
                        value={editingKit.typography?.heading || ''}
                        onChange={(e) => setEditingKit({
                          ...editingKit,
                          typography: { ...editingKit.typography, heading: e.target.value }
                        })}
                        placeholder="Montserrat Bold"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm">Body Font</Label>
                      <Input
                        value={editingKit.typography?.body || ''}
                        onChange={(e) => setEditingKit({
                          ...editingKit,
                          typography: { ...editingKit.typography, body: e.target.value }
                        })}
                        placeholder="Open Sans"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm">Accent Font</Label>
                      <Input
                        value={editingKit.typography?.accent || ''}
                        onChange={(e) => setEditingKit({
                          ...editingKit,
                          typography: { ...editingKit.typography, accent: e.target.value }
                        })}
                        placeholder="Bebas Neue"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Auto-apply */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div className="space-y-1">
                    <Label className="text-white">Auto-apply to designs</Label>
                    <p className="text-sm text-white/70">
                      Automatically use this brand kit in new designs
                    </p>
                  </div>
                  <Switch
                    checked={editingKit.auto_apply_to_designs}
                    onCheckedChange={(checked) => setEditingKit({ ...editingKit, auto_apply_to_designs: checked })}
                  />
                </div>

                <Button
                  onClick={handleCreate}
                  disabled={!editingKit.name || createBrandKit.isPending}
                  className="w-full bg-studio-accent hover:bg-studio-accent/90 text-white"
                >
                  Create Brand Kit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {brandKits && brandKits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brandKits.map((kit) => (
              <Card key={kit.id} className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        {kit.name}
                        {kit.is_default && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <Check className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </CardTitle>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteBrandKit.mutate(kit.id)}
                      className="text-white/70 hover:text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Color Palette Preview */}
                  {kit.color_palette && kit.color_palette.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-white/70">Colors</p>
                      <div className="flex gap-2">
                        {kit.color_palette.map((color, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full border-2 border-white/20"
                            style={{ backgroundColor: color.color }}
                            title={`${color.name} - ${color.usage}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Typography Preview */}
                  {kit.typography && Object.keys(kit.typography).length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-white/70">Typography</p>
                      <div className="space-y-1 text-xs text-white/60">
                        {kit.typography.heading && <p>Heading: {kit.typography.heading}</p>}
                        {kit.typography.body && <p>Body: {kit.typography.body}</p>}
                        {kit.typography.accent && <p>Accent: {kit.typography.accent}</p>}
                      </div>
                    </div>
                  )}

                  {!kit.is_default && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateBrandKit.mutate({ id: kit.id, updates: { is_default: true } })}
                      className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Set as Default
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Palette className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <p className="text-white/70 mb-4">No brand kits yet</p>
            <p className="text-white/50 text-sm mb-6">
              Create your first brand kit to maintain consistency across designs
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};