import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Plus, Music, Image, Video, HardDrive, File, FolderOpen, Search, Filter, QrCode } from "lucide-react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { StatsCard } from "@/components/event-toolkit/StatsCard";
import { useContentManager } from "@/hooks/useContentManager";
import { FileUploadModal } from "@/components/content/FileUploadModal";
import { QRScannerModal } from "@/components/content/QRScannerModal";
import { CreateFolderModal } from "@/components/content/CreateFolderModal";
import { ContentGrid } from "@/components/content/ContentGrid";

const ContentManager = () => {
  const {
    contentItems,
    folders,
    loading,
    uploading,
    uploadFile,
    createFolder,
    deleteContentItem,
    searchContent,
    addQRContent
  } = useContentManager();

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [qrModalOpen, setQRModalOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("all");

  // Calculate stats
  const totalFiles = contentItems.length;
  const musicFiles = contentItems.filter(item => item.file_type === 'audio').length;
  const photoFiles = contentItems.filter(item => item.file_type === 'image').length;
  const videoFiles = contentItems.filter(item => item.file_type === 'video').length;
  const totalSize = contentItems.reduce((acc, item) => acc + (item.file_size || 0), 0);
  const totalSizeGB = (totalSize / (1024 * 1024 * 1024)).toFixed(1);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchContent(query, selectedFileType);
  };

  const handleFileTypeChange = (fileType: string) => {
    setSelectedFileType(fileType);
    searchContent(searchQuery, fileType);
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-8 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Music className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Content Manager</h1>
              <p className="text-white/70">Ready to organize your creative assets and build your content library</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Upload className="h-5 w-5 text-white" />
            <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card 
              className="p-6 bg-background/10 backdrop-blur-md border-white/10 hover:bg-background/20 transition-all duration-300 group cursor-pointer"
              onClick={() => setUploadModalOpen(true)}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                  <Upload className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Upload Files</h3>
                  <p className="text-sm text-white/60">Add new content</p>
                </div>
              </div>
            </Card>
            
            <Card 
              className="p-6 bg-background/10 backdrop-blur-md border-white/10 hover:bg-background/20 transition-all duration-300 group cursor-pointer"
              onClick={() => setFolderModalOpen(true)}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
                  <FolderOpen className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">New Folder</h3>
                  <p className="text-sm text-white/60">Organize content</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10 hover:bg-background/20 transition-all duration-300 group cursor-pointer">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                  <Search className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Search Library</h3>
                  <p className="text-sm text-white/60">Find files fast</p>
                </div>
              </div>
            </Card>
            
            <Card 
              className="p-6 bg-background/10 backdrop-blur-md border-white/10 hover:bg-background/20 transition-all duration-300 group cursor-pointer"
              onClick={() => setQRModalOpen(true)}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-orange-500/20 rounded-xl group-hover:bg-orange-500/30 transition-colors">
                  <QrCode className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">QR Content</h3>
                  <p className="text-sm text-white/60">Scan & import</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <HardDrive className="h-5 w-5 text-white" />
            <h2 className="text-xl font-semibold text-white">Performance Metrics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 font-medium">Total Files</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold text-white">{totalFiles}</p>
                  </div>
                  <p className="text-xs text-white/40 mt-1">Ready to share</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <File className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 font-medium">Music Files</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold text-white">{musicFiles}</p>
                  </div>
                  <p className="text-xs text-white/40 mt-1">Audio content</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <Music className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 font-medium">Photos</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold text-white">{photoFiles}</p>
                  </div>
                  <p className="text-xs text-white/40 mt-1">Images</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Image className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 font-medium">Storage Used</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold text-white">{totalSizeGB} GB</p>
                  </div>
                  <p className="text-xs text-white/40 mt-1">Total storage</p>
                </div>
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <HardDrive className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search your content..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div className="md:w-48">
              <Select value={selectedFileType} onValueChange={handleFileTypeChange}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="audio">Music</SelectItem>
                  <SelectItem value="image">Photos</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Content Grid */}
        <Card className="p-6 bg-background/10 backdrop-blur-md border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Content Library</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setUploadModalOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button variant="outline" size="sm" onClick={() => setQRModalOpen(true)}>
                <QrCode className="h-4 w-4 mr-2" />
                QR Scan
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <ContentGrid items={contentItems} onDelete={deleteContentItem} />
          )}
        </Card>

        {/* Modals */}
        <FileUploadModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUpload={uploadFile}
          folders={folders}
          uploading={uploading}
        />

        <QRScannerModal
          isOpen={qrModalOpen}
          onClose={() => setQRModalOpen(false)}
          onAddContent={addQRContent}
        />

        <CreateFolderModal
          isOpen={folderModalOpen}
          onClose={() => setFolderModalOpen(false)}
          onCreateFolder={createFolder}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default ContentManager;