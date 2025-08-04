
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SocialMediaWzrd from "./SocialMediaWzrd";
import OnChainDistribution from "./OnChainDistribution";
import MediaChannels from "./MediaChannels";
import IndependentChannels from "./IndependentChannels";
import SyncLicensing from "./SyncLicensing";

const Distribution = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="/distribution/social-media" replace />} />
      <Route path="social-media" element={<SocialMediaWzrd />} />
      <Route path="on-chain" element={<OnChainDistribution />} />
      <Route path="media-channels" element={<MediaChannels />} />
      <Route path="independent" element={<IndependentChannels />} />
      <Route path="sync-licensing" element={<SyncLicensing />} />
    </Routes>
  );
};

export default Distribution;
