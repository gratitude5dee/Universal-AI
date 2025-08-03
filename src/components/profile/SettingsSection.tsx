import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Save, Shield, Bell, Globe, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsSection = () => (
    <Card id="settings" className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-6 text-white text-shadow-sm">Settings</h3>
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
            >
                <h4 className="font-medium flex items-center gap-2 text-white text-shadow-sm">
                    <Globe size={16} className="text-cyan-400" />
                    Language & Region
                </h4>
                <div>
                    <Label className="text-white/80">Language Preference</Label>
                    <Select defaultValue="en-us">
                        <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en-us">English (US)</SelectItem>
                            <SelectItem value="en-uk">English (UK)</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
            >
                <h4 className="font-medium flex items-center gap-2 text-white text-shadow-sm">
                    <Shield size={16} className="text-cyan-400" />
                    Privacy
                </h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                        <div>
                            <Label className="text-white/80">Make Profile Public</Label>
                            <p className="text-xs text-white/60">Allow others to discover your profile</p>
                        </div>
                        <Switch defaultChecked/>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                        <div>
                            <Label className="text-white/80">Show Activity Status</Label>
                            <p className="text-xs text-white/60">Display when you're online</p>
                        </div>
                        <Switch defaultChecked/>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
            >
                <h4 className="font-medium flex items-center gap-2 text-white text-shadow-sm">
                    <Bell size={16} className="text-cyan-400" />
                    Notifications
                </h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                        <div>
                            <Label className="text-white/80">Email Notifications</Label>
                            <p className="text-xs text-white/60">Receive updates via email</p>
                        </div>
                        <Switch defaultChecked/>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                        <div>
                            <Label className="text-white/80">Booking Alerts</Label>
                            <p className="text-xs text-white/60">Get notified of new opportunities</p>
                        </div>
                        <Switch defaultChecked/>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
            >
                <h4 className="font-medium flex items-center gap-2 text-white text-shadow-sm">
                    <Palette size={16} className="text-cyan-400" />
                    Theme
                </h4>
                <div>
                    <Label className="text-white/80">Color Theme</Label>
                    <Select defaultValue="cosmic">
                        <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cosmic">Cosmic (Default)</SelectItem>
                            <SelectItem value="neon">Neon Dreams</SelectItem>
                            <SelectItem value="minimal">Minimal Dark</SelectItem>
                            <SelectItem value="retro">Retro Wave</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-4 border-t border-white/20"
            >
                <Button className="w-full bg-studio-accent hover:bg-studio-accent/90 text-white">
                    <Save size={16} className="mr-2" />
                    Save Settings
                </Button>
            </motion.div>
        </div>
    </Card>
);

export default SettingsSection;