import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentItem } from "@/hooks/useContentManager";
import { Music, Image, Video, File, Download, Trash2, ExternalLink, QrCode } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ContentGridProps {
  items: ContentItem[];
  onDelete: (id: string) => void;
}

export const ContentGrid: React.FC<ContentGridProps> = ({ items, onDelete }) => {
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'audio':
        return <Music className="h-6 w-6 text-green-400" />;
      case 'video':
        return <Video className="h-6 w-6 text-blue-400" />;
      case 'image':
        return <Image className="h-6 w-6 text-purple-400" />;
      default:
        return <File className="h-6 w-6 text-orange-400" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = (item: ContentItem) => {
    if (item.signed_url) {
      window.open(item.signed_url, '_blank');
    }
  };

  const handleExternalLink = (item: ContentItem) => {
    if (item.qr_code_data) {
      window.open(item.qr_code_data, '_blank');
    } else if (item.signed_url) {
      window.open(item.signed_url, '_blank');
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
          <File className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No content found</h3>
        <p className="text-white/60 max-w-md">
          Upload your first file or scan a QR code to start building your content library.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="p-4 bg-white/10 backdrop-blur-md border-white/10 hover:bg-white/15 transition-colors">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getFileIcon(item.file_type)}
                <div className="flex flex-col">
                  <span className="text-xs text-white/60 uppercase tracking-wider">
                    {item.file_type}
                  </span>
                  {item.qr_code_data && (
                    <Badge variant="secondary" className="text-xs bg-orange-500/20 text-orange-400 border-orange-500/30">
                      <QrCode className="h-3 w-3 mr-1" />
                      QR
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExternalLink(item)}
                  className="text-white/60 hover:text-white p-1 h-8 w-8"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                {item.signed_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(item)}
                    className="text-white/60 hover:text-white p-1 h-8 w-8"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                  className="text-red-400 hover:text-red-300 p-1 h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Thumbnail or Preview */}
            {item.thumbnail_url ? (
              <img 
                src={item.thumbnail_url} 
                alt={item.title}
                className="w-full h-32 object-cover rounded-lg bg-white/5"
              />
            ) : item.file_type === 'image' && item.signed_url ? (
              <img
                src={item.signed_url}
                alt={item.title}
                className="w-full h-32 object-cover rounded-lg bg-white/5"
              />
            ) : (
              <div className="w-full h-32 bg-white/5 rounded-lg flex items-center justify-center">
                {getFileIcon(item.file_type)}
              </div>
            )}

            {/* Content Info */}
            <div className="space-y-2">
              <h3 className="font-semibold text-white line-clamp-2" title={item.title}>
                {item.title}
              </h3>
              {item.description && (
                <p className="text-white/60 text-sm line-clamp-2" title={item.description}>
                  {item.description}
                </p>
              )}
            </div>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-white/10 border-white/20 text-white/70">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-white/50">
                    +{item.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center text-xs text-white/50">
              <span>{formatFileSize(item.file_size)}</span>
              <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};