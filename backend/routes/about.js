const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { auth } = require('../middleware/auth');

const ABOUT_FILE = path.join(__dirname, '../data/about.json');

// Helper function to read about data
async function readAboutData() {
    try {
        const data = await fs.readFile(ABOUT_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading about data:', error);
        // Return default structure if file doesn't exist
        return {
            hero: {
                subtitle: "Empowering Brand Excellence",
                description: "We are a premier brand management company specializing in acquiring, developing, and scaling consumer brands across multiple industries.",
                image: "",
                storyTitle: "Our Story"
            },
            storyIntro: {
                title: "We are Ventured Brands",
                description: "A premier brand management company dedicated to acquiring, developing, and scaling consumer brands that make a meaningful impact in people's lives."
            },
            story: {
                title: "Our Journey",
                description: "Founded with a vision to transform how brands connect with consumers, we have built a portfolio of successful companies across diverse industries.",
                content: "We believe that great brands are built on authentic connections with consumers."
            },
            quote: {
                text: "We don't just invest in brands - we partner with visionaries to build the future of consumer experiences.",
                author: "Ventured Brands Leadership Team"
            },
            team: {
                title: "Meet Our Team",
                description: "Our diverse team of experts brings together decades of experience in brand management, marketing, operations, and strategic growth.",
                teamMembers: []
            },
            updatedAt: new Date().toISOString()
        };
    }
}

// Helper function to write about data
async function writeAboutData(data) {
    try {
        data.updatedAt = new Date().toISOString();
        await fs.writeFile(ABOUT_FILE, JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error('Error writing about data:', error);
        throw error;
    }
}

// Get all about data
router.get('/', async (req, res) => {
    try {
        const aboutData = await readAboutData();
        res.json(aboutData);
    } catch (error) {
        console.error('Error fetching about data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch about data' });
    }
});

// Update hero section
router.put('/hero', auth, async (req, res) => {
    try {
        const { subtitle, description, image, storyTitle } = req.body;
        const aboutData = await readAboutData();
        
        aboutData.hero = {
            subtitle: subtitle || aboutData.hero.subtitle,
            description: description || aboutData.hero.description,
            image: image || aboutData.hero.image,
            storyTitle: storyTitle || aboutData.hero.storyTitle
        };
        
        const updatedData = await writeAboutData(aboutData);
        res.json({ success: true, data: updatedData.hero, message: 'Hero section updated successfully' });
    } catch (error) {
        console.error('Error updating hero section:', error);
        res.status(500).json({ success: false, message: 'Failed to update hero section' });
    }
});

// Update story intro section
router.put('/storyIntro', auth, async (req, res) => {
    try {
        const { title, description } = req.body;
        const aboutData = await readAboutData();
        
        aboutData.storyIntro = {
            title: title || aboutData.storyIntro.title,
            description: description || aboutData.storyIntro.description
        };
        
        const updatedData = await writeAboutData(aboutData);
        res.json({ success: true, data: updatedData.storyIntro, message: 'Story intro section updated successfully' });
    } catch (error) {
        console.error('Error updating story intro section:', error);
        res.status(500).json({ success: false, message: 'Failed to update story intro section' });
    }
});

// Update story section
router.put('/story', auth, async (req, res) => {
    try {
        const { title, description, content, image1, image2 } = req.body;
        const aboutData = await readAboutData();
        
        aboutData.story = {
            title: title || aboutData.story.title,
            description: description || aboutData.story.description,
            content: content || aboutData.story.content,
            image1: image1 || aboutData.story.image1,
            image2: image2 || aboutData.story.image2
        };
        
        const updatedData = await writeAboutData(aboutData);
        res.json({ success: true, data: updatedData.story, message: 'Story section updated successfully' });
    } catch (error) {
        console.error('Error updating story section:', error);
        res.status(500).json({ success: false, message: 'Failed to update story section' });
    }
});

// Update quote section
router.put('/quote', auth, async (req, res) => {
    try {
        const { text, author } = req.body;
        const aboutData = await readAboutData();
        
        aboutData.quote = {
            text: text || aboutData.quote.text,
            author: author || aboutData.quote.author
        };
        
        const updatedData = await writeAboutData(aboutData);
        res.json({ success: true, data: updatedData.quote, message: 'Quote section updated successfully' });
    } catch (error) {
        console.error('Error updating quote section:', error);
        res.status(500).json({ success: false, message: 'Failed to update quote section' });
    }
});

// Update team section
router.put('/team', auth, async (req, res) => {
    try {
        const { title, description, teamMembers } = req.body;
        const aboutData = await readAboutData();
        
        aboutData.team = {
            title: title || aboutData.team.title,
            description: description || aboutData.team.description,
            teamMembers: teamMembers || aboutData.team.teamMembers
        };
        
        const updatedData = await writeAboutData(aboutData);
        res.json({ success: true, data: updatedData.team, message: 'Team section updated successfully' });
    } catch (error) {
        console.error('Error updating team section:', error);
        res.status(500).json({ success: false, message: 'Failed to update team section' });
    }
});

// Update gallery section
router.put('/gallery', auth, async (req, res) => {
    try {
        const { slides } = req.body;
        const aboutData = await readAboutData();
        
        aboutData.gallery = {
            slides: slides || aboutData.gallery?.slides || []
        };
        
        const updatedData = await writeAboutData(aboutData);
        res.json({ success: true, data: updatedData.gallery, message: 'Gallery section updated successfully' });
    } catch (error) {
        console.error('Error updating gallery section:', error);
        res.status(500).json({ success: false, message: 'Failed to update gallery section' });
    }
});

module.exports = router;
