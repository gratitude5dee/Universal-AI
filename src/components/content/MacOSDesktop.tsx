import React, { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ContentItem, ContentFolder } from "@/hooks/useContentManager";
import { Music, Image, Video, File, Download, Trash2, ExternalLink, QrCode, FolderOpen, Edit3, Copy, Share } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DesktopItem {
  id: string;
  type: 'file' | 'folder';
  data: ContentItem | ContentFolder;
  position: { x: number; y: number };
  selected: boolean;
}

interface MacOSDesktopProps {
  items: ContentItem[];
  folders: ContentFolder[];
  onDelete: (id: string) => void;
  onCreateFolder: (name: string) => void;
}

export const MacOSDesktop: React.FC<MacOSDesktopProps> = ({ 
  items, 
  folders, 
  onDelete, 
  onCreateFolder 
}) => {
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>(() => {
    const gridSize = 120;
    const startX = 40;
    const startY = 40;
    
    const allItems: DesktopItem[] = [];
    let row = 0;
    let col = 0;
    
    // Add folders first
    folders.forEach((folder) => {
      allItems.push({
        id: `folder-${folder.id}`,
        type: 'folder',
        data: folder,
        position: { x: startX + col * gridSize, y: startY + row * gridSize },
        selected: false
      });
      col++;
      if (col >= 6) { col = 0; row++; }
    });
    
    // Add files
    items.forEach((item) => {
      allItems.push({
        id: `file-${item.id}`,
        type: 'file',
        data: item,
        position: { x: startX + col * gridSize, y: startY + row * gridSize },
        selected: false
      });
      col++;
      if (col >= 6) { col = 0; row++; }
    });
    
    return allItems;
  });

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    itemId?: string;
  }>({ visible: false, x: 0, y: 0 });
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const desktopRef = useRef<HTMLDivElement>(null);

  const getFileIcon = (fileType: string, size = 6) => {
    const className = `h-${size} w-${size}`;
    switch (fileType) {
      case 'audio':
        return <Music className={`${className} text-green-400`} />;
      case 'video':
        return <Video className={`${className} text-blue-400`} />;
      case 'image':
        return <Image className={`${className} text-purple-400`} />;
      default:
        return <File className={`${className} text-orange-400`} />;
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, itemId: string) => {
    if (e.button !== 0) return; // Only handle left mouse button
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggedItem(itemId);
    
    // Select the item
    setDesktopItems(prev => prev.map(item => ({
      ...item,
      selected: item.id === itemId
    })));
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggedItem || !desktopRef.current) return;
    
    const rect = desktopRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;
    
    setDesktopItems(prev => prev.map(item => 
      item.id === draggedItem 
        ? { ...item, position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
        : item
    ));
  }, [draggedItem, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setDraggedItem(null);
  }, []);

  const handleRightClick = useCallback((e: React.MouseEvent, itemId?: string) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      itemId
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu({ visible: false, x: 0, y: 0 });
  }, []);

  const handleCreateNewFolder = () => {
    const newId = `new-folder-${Date.now()}`;
    const gridSize = 120;
    const newPosition = { x: 40, y: 40 + Math.floor(desktopItems.length / 6) * gridSize };
    
    setDesktopItems(prev => [...prev, {
      id: newId,
      type: 'folder',
      data: { 
        id: newId,
        name: 'New Folder',
        user_id: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as ContentFolder,
      position: newPosition,
      selected: false
    }]);
    
    setEditingFolder(newId);
    setNewFolderName('New Folder');
    closeContextMenu();
  };

  const handleFolderNameSubmit = () => {
    if (editingFolder && newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setEditingFolder(null);
      setNewFolderName("");
    }
  };

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Clear all selections
      setDesktopItems(prev => prev.map(item => ({ ...item, selected: false })));
      closeContextMenu();
    }
  };

  return (
    <div className="relative w-full h-full min-h-[600px] bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 rounded-lg overflow-hidden">
      {/* Desktop Background */}
      <div 
        ref={desktopRef}
        className="absolute inset-0 p-4"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleDesktopClick}
        onContextMenu={(e) => handleRightClick(e)}
      >
        {/* Desktop Items */}
        {desktopItems.map((item) => (
          <div
            key={item.id}
            className={`absolute select-none cursor-pointer group transition-all duration-200 ${
              item.selected ? 'scale-105' : 'hover:scale-105'
            } ${draggedItem === item.id ? 'z-50' : 'z-10'}`}
            style={{
              left: item.position.x,
              top: item.position.y,
              width: '80px',
              height: '90px'
            }}
            onMouseDown={(e) => handleMouseDown(e, item.id)}
            onContextMenu={(e) => handleRightClick(e, item.id)}
            title={item.type === 'folder' 
              ? (item.data as ContentFolder).name 
              : (item.data as ContentItem).title
            }
          >
            {/* Selection Background */}
            {item.selected && (
              <div className="absolute inset-0 bg-blue-500/30 rounded-lg border-2 border-blue-400 -m-1" />
            )}
            
            {/* Icon */}
            <div className="flex flex-col items-center text-center p-2">
              <div className={`relative mb-2 ${
                item.type === 'folder' ? 'text-blue-400' : ''
              }`}>
                {item.type === 'folder' ? (
                  <div className="relative">
                    <FolderOpen className="h-12 w-12 text-blue-400 drop-shadow-lg" />
                    {(item.data as ContentFolder).name === 'New Folder' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    {item.data && 'file_type' in item.data ? (
                      getFileIcon(item.data.file_type, 12)
                    ) : (
                      <File className="h-12 w-12 text-gray-400" />
                    )}
                    {item.data && 'qr_code_data' in item.data && item.data.qr_code_data && (
                      <QrCode className="absolute -top-1 -right-1 h-4 w-4 text-orange-400" />
                    )}
                  </div>
                )}
              </div>
              
              {/* Label */}
              {editingFolder === item.id ? (
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onBlur={handleFolderNameSubmit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleFolderNameSubmit();
                    if (e.key === 'Escape') setEditingFolder(null);
                  }}
                  className="h-6 text-xs bg-white/90 text-black border-blue-400"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="text-xs text-white font-medium drop-shadow-lg text-center leading-tight max-w-full break-words">
                  {item.type === 'folder' 
                    ? (item.data as ContentFolder).name 
                    : (item.data as ContentItem).title
                  }
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={closeContextMenu}
          />
          <div
            className="fixed z-50 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-white/20 py-2 min-w-[180px]"
            style={{
              left: contextMenu.x,
              top: contextMenu.y
            }}
          >
            {contextMenu.itemId ? (
              // Item context menu
              <>
                <button className="w-full text-left px-4 py-2 hover:bg-blue-500/20 flex items-center gap-2 text-sm">
                  <ExternalLink className="h-4 w-4" />
                  Open
                </button>
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-blue-500/20 flex items-center gap-2 text-sm"
                  onClick={() => {
                    const item = desktopItems.find(i => i.id === contextMenu.itemId);
                    if (item?.type === 'folder') {
                      setEditingFolder(item.id);
                      setNewFolderName((item.data as ContentFolder).name);
                    }
                    closeContextMenu();
                  }}
                >
                  <Edit3 className="h-4 w-4" />
                  Rename
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-blue-500/20 flex items-center gap-2 text-sm">
                  <Copy className="h-4 w-4" />
                  Duplicate
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-blue-500/20 flex items-center gap-2 text-sm">
                  <Share className="h-4 w-4" />
                  Share
                </button>
                <hr className="my-1 border-gray-300" />
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-red-500/20 flex items-center gap-2 text-sm text-red-600"
                  onClick={() => {
                    const item = desktopItems.find(i => i.id === contextMenu.itemId);
                    if (item?.type === 'file') {
                      onDelete((item.data as ContentItem).id);
                    }
                    closeContextMenu();
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Move to Trash
                </button>
              </>
            ) : (
              // Desktop context menu
              <>
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-blue-500/20 flex items-center gap-2 text-sm"
                  onClick={handleCreateNewFolder}
                >
                  <FolderOpen className="h-4 w-4" />
                  New Folder
                </button>
                <hr className="my-1 border-gray-300" />
                <button className="w-full text-left px-4 py-2 hover:bg-blue-500/20 flex items-center gap-2 text-sm">
                  View Options
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-blue-500/20 flex items-center gap-2 text-sm">
                  Sort By
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* Empty State */}
      {desktopItems.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/60">
            <FolderOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Your desktop is empty</p>
            <p className="text-sm">Right-click to create a new folder or upload files</p>
          </div>
        </div>
      )}
    </div>
  );
};