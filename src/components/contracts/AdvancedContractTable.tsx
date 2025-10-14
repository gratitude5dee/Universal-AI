import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Copy,
  Archive,
  MoreVertical,
  ChevronDown,
  FileText,
  Users,
  DollarSign,
  Calendar,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Contract {
  id: string;
  name: string;
  type: string;
  status: 'Draft' | 'Signed' | 'Negotiating' | 'Under Review' | 'Expired';
  parties: number;
  value: string;
  date: string;
  lastModified: string;
}

const mockContracts: Contract[] = [
  {
    id: '1',
    name: 'Performance at The Fillmore',
    type: 'Performance',
    status: 'Signed',
    parties: 2,
    value: '$2,500',
    date: 'Nov 1, 2024',
    lastModified: '2 days ago',
  },
  {
    id: '2',
    name: 'Collaboration with PixelDreamer',
    type: 'Collaboration',
    status: 'Draft',
    parties: 3,
    value: '50/50 Split',
    date: 'Oct 28, 2024',
    lastModified: '5 hours ago',
  },
  {
    id: '3',
    name: 'Sync License for Indie Spirit',
    type: 'Licensing',
    status: 'Negotiating',
    parties: 2,
    value: '$1,200',
    date: 'Oct 25, 2024',
    lastModified: '1 day ago',
  },
  {
    id: '4',
    name: 'Management Agreement - Q4',
    type: 'Management',
    status: 'Under Review',
    parties: 2,
    value: '15% Commission',
    date: 'Oct 20, 2024',
    lastModified: '3 days ago',
  },
  {
    id: '5',
    name: 'Recording Studio Contract',
    type: 'Recording',
    status: 'Signed',
    parties: 2,
    value: '$800/day',
    date: 'Oct 15, 2024',
    lastModified: '1 week ago',
  },
];

const getStatusColor = (status: Contract['status']) => {
  switch (status) {
    case 'Signed':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Draft':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Negotiating':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Under Review':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'Expired':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
  }
};

export const AdvancedContractTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Contract>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredContracts = mockContracts
    .filter((contract) => {
      const matchesSearch = contract.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || contract.status === selectedStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      return aValue > bValue ? direction : -direction;
    });

  return (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="text-studio-accent" size={20} />
            Contract Management
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Download size={16} className="mr-2" />
              Export
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Filter size={16} className="mr-2" />
                  Filter
                  <ChevronDown size={16} className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-white/20">
                <DropdownMenuItem onClick={() => setSelectedStatus('all')} className="text-white">All Status</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('Signed')} className="text-white">Signed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('Draft')} className="text-white">Draft</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('Negotiating')} className="text-white">Negotiating</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
          <Input
            placeholder="Search contracts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Contract Name</th>
                <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Type</th>
                <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Status</th>
                <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Parties</th>
                <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Value</th>
                <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Date</th>
                <th className="text-right py-3 px-4 text-white/70 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract, index) => (
                <motion.tr
                  key={contract.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-studio-accent/20 flex items-center justify-center">
                        <FileText size={16} className="text-studio-accent" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{contract.name}</p>
                        <p className="text-white/50 text-xs">Modified {contract.lastModified}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="outline" className="border-white/20 text-white/70">
                      {contract.type}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={`border ${getStatusColor(contract.status)}`}>{contract.status}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-white/70">
                      <Users size={14} />
                      <span className="text-sm">{contract.parties}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-white/70">
                      <DollarSign size={14} />
                      <span className="text-sm">{contract.value}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-white/70">
                      <Calendar size={14} />
                      <span className="text-sm">{contract.date}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                        <Eye size={14} />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                        <Edit size={14} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                            <MoreVertical size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-slate-800 border-white/20">
                          <DropdownMenuItem className="text-white">
                            <Copy size={14} className="mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white">
                            <Download size={14} className="mr-2" />
                            Export PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white">
                            <Archive size={14} className="mr-2" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
