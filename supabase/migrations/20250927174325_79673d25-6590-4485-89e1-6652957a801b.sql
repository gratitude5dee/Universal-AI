-- Add thumbnail_url column to video_highlights table
ALTER TABLE public.video_highlights ADD COLUMN thumbnail_url TEXT;

-- Insert placeholder data into stats table
INSERT INTO public.stats (date, metric_name, value, user_id) VALUES
('2024-01-01', 'Monthly Streams', 125000, NULL),
('2024-01-01', 'Social Media Followers', 45000, NULL),
('2024-01-01', 'Revenue', 5200.50, NULL),
('2024-02-01', 'Monthly Streams', 135000, NULL),
('2024-02-01', 'Social Media Followers', 47500, NULL),
('2024-02-01', 'Revenue', 5800.75, NULL);

-- Insert placeholder data into press_quotes table
INSERT INTO public.press_quotes (quote, source, date, user_id) VALUES
('A groundbreaking artist who pushes the boundaries of modern creativity', 'Rolling Stone', '2024-01-15', NULL),
('Their latest work showcases an innovative approach to multimedia art', 'Billboard', '2024-02-20', NULL),
('An emerging talent that deserves widespread recognition', 'Pitchfork', '2024-03-10', NULL),
('Captivating performances that blend technology with raw emotion', 'The Guardian', '2024-03-25', NULL);

-- Insert placeholder data into video_highlights table
INSERT INTO public.video_highlights (title, url, description, thumbnail_url, user_id) VALUES
('Studio Session Behind the Scenes', 'https://example.com/video1.mp4', 'Exclusive look at the creative process behind our latest project', 'https://example.com/thumb1.jpg', NULL),
('Live Performance at Metro Arena', 'https://example.com/video2.mp4', 'Full performance from our sold-out show featuring new material', 'https://example.com/thumb2.jpg', NULL),
('Collaboration with Digital Artists', 'https://example.com/video3.mp4', 'Documentary showcasing our work with leading digital creators', 'https://example.com/thumb3.jpg', NULL),
('Music Video: "Neon Dreams"', 'https://example.com/video4.mp4', 'Official music video featuring cutting-edge visual effects', 'https://example.com/thumb4.jpg', NULL);